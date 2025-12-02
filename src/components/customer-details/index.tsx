import { useParams, useSearch } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { GeneralTab } from "./GeneralTab";
import { BundleTab } from "./BundleTab";
import { SMSHistoryTab } from "./SMSHistoryTab";
import { CreditTab } from "./CreditTab";
import { InvoiceTab } from "./InvoiceTab";
import { useState } from "react";

export function CustomerDetailsPage() {
  const { customerId } = useParams({ from: "/_authenticated/customers/$customerId" });
  const search = useSearch({ from: "/_authenticated/customers/$customerId" });
  const id = Number(customerId);
  const { t } = useTranslation();

  // @ts-ignore
  const initialEditMode = search.edit === true || search.edit === "true";
  const [isEditMode, setIsEditMode] = useState(initialEditMode);

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <Tabs defaultValue="general" className="flex h-full flex-col">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="general">
            {t("customer.details.tabs.general", { defaultValue: "General" })}
          </TabsTrigger>
          <TabsTrigger value="bundle">
            {t("customer.details.tabs.bundle", { defaultValue: "Bundle" })}
          </TabsTrigger>
          <TabsTrigger value="sms">
            {t("customer.details.tabs.sms", { defaultValue: "SMS History" })}
          </TabsTrigger>
          <TabsTrigger value="credit">
            {t("customer.details.tabs.credit", { defaultValue: "Credit" })}
          </TabsTrigger>
          <TabsTrigger value="invoice">
            {t("customer.details.tabs.invoice", { defaultValue: "Invoice" })}
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="general">
            <GeneralTab customerId={id} isEditMode={isEditMode} onEditModeChange={setIsEditMode} />
          </TabsContent>
          <TabsContent value="bundle">
            <BundleTab customerId={id} />
          </TabsContent>
          <TabsContent value="sms">
            <SMSHistoryTab customerId={id} />
          </TabsContent>
          <TabsContent value="credit">
            <CreditTab customerId={id} />
          </TabsContent>
          <TabsContent value="invoice">
            <InvoiceTab customerId={id} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
