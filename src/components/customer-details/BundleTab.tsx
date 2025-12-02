import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import {
  useUsersShowCustomer,
  useUsersChangeCustomerBundle,
} from "@/services/api/generated/users/users";
import { useBundlesBundlesList } from "@/services/api/generated/bundles/bundles";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { BundleAuditTable } from "./BundleAuditTable";
import { BundleDetachDialog } from "./BundleDetachDialog";
import { BundleFreezeDialog } from "./BundleFreezeDialog";

interface BundleTabProps {
  customerId: number;
}

export function BundleTab({ customerId }: BundleTabProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: customerData } = useUsersShowCustomer(customerId);

  // Fetch all bundles for the dropdown
  // We might want to search or paginate, but for now let's fetch a reasonable amount
  const { data: allBundlesData } = useBundlesBundlesList({ per_page: 100 });

  const changeBundleMutation = useUsersChangeCustomerBundle();

  const customer = customerData?.data;
  const allBundles = (allBundlesData?.data ?? []) as any[];

  const [selectedBundleId, setSelectedBundleId] = useState<string | undefined>(undefined);
  const [isChangingBundle, setIsChangingBundle] = useState(false);

  const handleChangeBundle = async () => {
    if (!selectedBundleId) return;
    try {
      await changeBundleMutation.mutateAsync({
        user: customerId,
        data: { bundle_id: Number(selectedBundleId) },
      });
      toast.success(t("customer.bundle.changed", { defaultValue: "Bundle changed successfully" }));
      queryClient.invalidateQueries({ queryKey: [`/customers/${customerId}`] });
      setIsChangingBundle(false);
      setSelectedBundleId(undefined);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to change bundle");
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Bundle Section */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t("customer.bundle.current.title", { defaultValue: "Current Bundle Details" })}
          </CardTitle>
          {customer?.bundle_name && customer.activation_date && (
            <CardDescription>
              {t("customer.bundle.next", {
                defaultValue: "Next bundle is {{name}} starting from {{date}}",
                name: customer.bundle_name,
                date: customer.activation_date,
              })}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="space-y-1">
                <span className="text-muted-foreground text-sm font-medium">
                  {t("customer.fields.name", { defaultValue: "Name" })}
                </span>
                <div className="font-medium">{customer?.bundle_name || "-"}</div>
              </div>
              {/* Note: Pricing and other details might not be in customer object directly, 
                    depending on API. Assuming simplistic display for now or need to fetch bundle details. 
                    The prompt says customer profile endpoint returns `bundle_id`, `bundle_name`.
                    If we need price, we might need to find it from allBundles or fetch specific bundle.
                */}
              <div className="space-y-1">
                <span className="text-muted-foreground text-sm font-medium">
                  {t("customer.bundle.bundleId", { defaultValue: "Bundle ID" })}
                </span>
                <div className="font-medium">{customer?.bundle_id || "-"}</div>
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-2">
              {isChangingBundle ? (
                <div className="flex w-full max-w-md items-end gap-2">
                  <div className="flex-1">
                    <Select value={selectedBundleId} onValueChange={setSelectedBundleId}>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("customer.bundle.select", {
                            defaultValue: "Select Bundle",
                          })}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {allBundles.map((bundle: any) => (
                          <SelectItem key={bundle.id} value={String(bundle.id)}>
                            {bundle.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleChangeBundle}
                    disabled={changeBundleMutation.isPending || !selectedBundleId}
                  >
                    {changeBundleMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {t("common.save", { defaultValue: "Save" })}
                  </Button>
                  <Button variant="outline" onClick={() => setIsChangingBundle(false)}>
                    {t("common.cancel", { defaultValue: "Cancel" })}
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsChangingBundle(true)}>
                  {t("customer.bundle.change", { defaultValue: "Change" })}
                </Button>
              )}

              <BundleDetachDialog
                customerId={customerId}
                hasBundle={Boolean(customer?.bundle_id)}
              />
              <BundleFreezeDialog
                customerId={customerId}
                isSuspended={Boolean((customer as any)?.suspension)}
                disabled={!customer}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bundle Audit Table */}
      <BundleAuditTable customerId={customerId} />
    </div>
  );
}
