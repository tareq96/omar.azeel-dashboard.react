import { cn, extractApiErrorMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/providers/auth-provider";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

const createSignInSchema = (t: (key: string, opts?: any) => string) =>
  z.object({
    username: z.email(t("common.validations.email")),
    password: z.string().trim().min(1, t("auth.login.passwordRequired")),
  });

type FormType = z.infer<ReturnType<typeof createSignInSchema>>;

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const { signIn, isSigneInLoading } = useAuth();
  const { t } = useTranslation();

  const form = useForm<FormType>({
    resolver: zodResolver(createSignInSchema(t)),
    defaultValues: { username: "", password: "" },
    reValidateMode: "onChange",
  });

  async function onSubmit(values: FormType) {
    if (isSigneInLoading) return;
    form.clearErrors();
    try {
      await signIn({ identifier: values.username, password: values.password });
      navigate({ to: "/" });
    } catch (err: any) {
      // Prefer translated API validation messages; handle invalid credentials specially
      const apiMessage = extractApiErrorMessage(err, t);
      const isUnauthorized = err?.status === 401 || err?.response?.status === 401;
      const message = isUnauthorized
        ? t("api.errors.invalid_credentials")
        : apiMessage || t("auth.login.failed");
      form.setError("root", { type: "server", message });
    }
  }

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        <div className="grid gap-4">
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">{t("auth.login.title")}</h1>
          </div>

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.login.email")}</FormLabel>
                <FormControl>
                  <Input
                    id="username"
                    type="text"
                    placeholder={t("auth.login.emailPlaceholder")}
                    autoComplete="username"
                    disabled={form.formState.isSubmitting || isSigneInLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="flex-1">{t("auth.login.password")}</FormLabel>
                  <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                    {t("auth.login.forgotPassword")}
                  </a>
                </div>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    disabled={form.formState.isSubmitting || isSigneInLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                {form.formState.errors.root ? (
                  <p className="text-destructive mt-2 text-sm font-medium">
                    {form.formState.errors.root.message}
                  </p>
                ) : null}
              </FormItem>
            )}
          />

          <div className="mt-4">
            <Button type="submit" disabled={form.formState.isSubmitting || isSigneInLoading}>
              {form.formState.isSubmitting || isSigneInLoading
                ? t("auth.login.loggingIn")
                : t("auth.login.signIn")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
