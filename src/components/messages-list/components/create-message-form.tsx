import { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Tags,
  TagsTrigger,
  TagsValue,
  TagsContent,
  TagsInput,
  TagsList,
  TagsEmpty,
  TagsGroup,
  TagsItem,
} from "@/components/ui/shadcn-io/tags";
import { CheckIcon } from "lucide-react";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

import {
  useMessagesCustomersOptions,
  useMessagesStore,
  getMessagesMessagesListQueryKey,
} from "@/services/api/generated/messages/messages";

type CustomerOption = { id: number; name: string; mobile: string | null };

const CreateMessageForm = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const MessageSchema = useMemo(
    () =>
      z.object({
        title: z.string().trim().min(1, t("messagesForm.validations.titleRequired")).max(100),
        body: z.string().trim().min(1, t("messagesForm.validations.messageRequired")),
        type: z.enum(["sms", "push_notification"] as const, {
          message: t("messagesForm.validations.typeRequired"),
        }),
        customers: z.array(z.number()).min(1, t("messagesForm.validations.customersRequired")),
      }),
    [t],
  );

  type MessageFormValues = z.infer<typeof MessageSchema>;

  const messageForm = useForm<MessageFormValues>({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      title: "",
      body: "",
      type: "sms",
      customers: [],
    },
    reValidateMode: "onChange",
  });

  const [customerSearch, setCustomerSearch] = useState<string>("");
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<number[]>([]);

  const { data: customersOptionsData, isPending: isCustomersLoading } = useMessagesCustomersOptions(
    { q: customerSearch || undefined, limit: 50 } as any,
    { query: { enabled: true } },
  );

  const customersOptions = (customersOptionsData?.data ?? []) as CustomerOption[];

  const handleSelectCustomer = useCallback(
    (id: number) => {
      setSelectedCustomerIds((prev) => {
        const exists = prev.includes(id);
        const next = exists ? prev.filter((v) => v !== id) : [...prev, id];
        messageForm.setValue("customers", next, { shouldValidate: true });
        return next;
      });
    },
    [messageForm],
  );

  const handleRemoveCustomer = useCallback(
    (id: number) => {
      setSelectedCustomerIds((prev) => {
        const next = prev.filter((v) => v !== id);
        messageForm.setValue("customers", next, { shouldValidate: true });
        return next;
      });
    },
    [messageForm],
  );

  const debouncedCustomerSearchUpdate = useDebouncedCallback((value: string) => {
    setCustomerSearch(value);
  }, 300);

  const handleCustomerSearchChange = useCallback(
    (value: string) => {
      debouncedCustomerSearchUpdate(value);
    },
    [debouncedCustomerSearchUpdate],
  );

  const sendMutation = useMessagesStore();

  const onSubmitMessage = useCallback(
    async (values: MessageFormValues) => {
      try {
        const payload = {
          title: values.title,
          body: values.body,
          type: values.type,
          customers: values.customers,
        };
        const res: any = await sendMutation.mutateAsync({ data: payload } as any);

        messageForm.reset({ title: "", body: "", type: "sms", customers: [] });
        setSelectedCustomerIds([]);

        queryClient.invalidateQueries({ queryKey: getMessagesMessagesListQueryKey(undefined) });

        const successMessage = t("messagesForm.toast.success");
        toast.success(successMessage);
      } catch (err: any) {
        const message = err?.message || t("messagesForm.toast.error");
        messageForm.setError("root", { type: "server", message });
        toast.error(message);
      }
    },
    [sendMutation, messageForm, queryClient, t],
  );

  const onClearForm = useCallback(() => {
    messageForm.reset({ title: "", body: "", type: "sms", customers: [] });
    setSelectedCustomerIds([]);
    messageForm.clearErrors();
  }, [messageForm]);

  return (
    <div className="bg-card mb-6 rounded-lg border p-4">
      <Form {...messageForm}>
        <form className="flex flex-col gap-4" onSubmit={messageForm.handleSubmit(onSubmitMessage)}>
          <FormField
            control={messageForm.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("messagesForm.type")}</FormLabel>
                <FormControl>
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        className="h-4 w-4"
                        name="type"
                        value="sms"
                        checked={field.value === "sms"}
                        onChange={() => field.onChange("sms")}
                      />
                      <span>{t("messagesForm.typeOptions.sms")}</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        className="h-4 w-4"
                        name="type"
                        value="push_notification"
                        checked={field.value === "push_notification"}
                        onChange={() => field.onChange("push_notification")}
                      />
                      <span>{t("messagesForm.typeOptions.push")}</span>
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <FormField
              control={messageForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("messagesForm.title")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      maxLength={100}
                      placeholder={t("messagesForm.titlePlaceholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={messageForm.control}
              name="customers"
              render={() => (
                <FormItem>
                  <FormLabel>{t("messagesForm.customers")}</FormLabel>
                  <FormControl>
                    <Tags className="w-full">
                      <TagsTrigger placeholder={t("messagesForm.selectCustomer")}>
                        {selectedCustomerIds.map((id) => {
                          const tag = customersOptions.find((c) => c.id === id);
                          const label = tag ? tag.name : String(id);
                          return (
                            <TagsValue key={id} onRemove={() => handleRemoveCustomer(id)}>
                              {label}
                            </TagsValue>
                          );
                        })}
                      </TagsTrigger>
                      <TagsContent>
                        <TagsInput
                          placeholder={t("messagesForm.searchCustomers")}
                          onValueChange={(val) => handleCustomerSearchChange(val)}
                        />
                        <TagsList>
                          {isCustomersLoading ? (
                            <TagsEmpty>{t("messagesForm.loadingCustomers")}</TagsEmpty>
                          ) : customersOptions.length === 0 ? (
                            <TagsEmpty>{t("messagesForm.noCustomers")}</TagsEmpty>
                          ) : (
                            <TagsGroup>
                              {customersOptions.map((tag) => {
                                const label = tag.name;
                                const isSelected = selectedCustomerIds.includes(tag.id);
                                return (
                                  <TagsItem
                                    key={tag.id}
                                    onSelect={() => handleSelectCustomer(tag.id)}
                                    value={String(tag.id)}
                                  >
                                    {label}
                                    {isSelected && (
                                      <CheckIcon className="text-muted-foreground" size={14} />
                                    )}
                                  </TagsItem>
                                );
                              })}
                            </TagsGroup>
                          )}
                        </TagsList>
                      </TagsContent>
                    </Tags>
                  </FormControl>
                  <FormMessage />
                  {messageForm.formState.errors.root ? (
                    <p className="text-destructive mt-2 text-sm font-medium">
                      {messageForm.formState.errors.root.message}
                    </p>
                  ) : null}
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={messageForm.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("messagesForm.message")}</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    {...field}
                    placeholder={t("messagesForm.messagePlaceholder")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={sendMutation.isPending}>
              {sendMutation.isPending ? t("messagesForm.sending") : t("messagesForm.send")}
            </Button>
            <Button type="button" variant="secondary" onClick={onClearForm}>
              {t("messagesForm.clear")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateMessageForm;
