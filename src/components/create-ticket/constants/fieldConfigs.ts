import type { CreateTicketFormValues } from "../schemas/createTicketSchema";

export type FieldInputType = "text" | "date" | "time" | "number";

export interface FieldDefinition {
  name: keyof CreateTicketFormValues;
  label: string;
  type?: FieldInputType;
  step?: string;
}

export interface TypeFieldConfig {
  title: string;
  fields: FieldDefinition[];
}

export const TYPE_FIELD_CONFIGS: Record<string, TypeFieldConfig> = {
  "Locker Removal": {
    title: "ticketsCreate.sections.lockerRemoval.title",
    fields: [
      {
        name: "date_of_locker_removal",
        label: "ticketsCreate.sections.lockerRemoval.dateOfLockerRemoval",
        type: "date",
      },
      {
        name: "amount_of_money",
        label: "ticketsCreate.sections.lockerRemoval.amountOfMoney",
        type: "number",
        step: "0.01",
      },
    ],
  },
  "Balance Adjustment": {
    title: "ticketsCreate.sections.balanceAdjustment.title",
    fields: [
      {
        name: "amount_to_be_added",
        label: "ticketsCreate.sections.balanceAdjustment.amountToBeAdded",
        type: "number",
        step: "0.01",
      },
      { name: "reason_of_money", label: "ticketsCreate.sections.balanceAdjustment.reasonOfMoney" },
    ],
  },
  Installation: {
    title: "ticketsCreate.sections.installation.title",
    fields: [
      { name: "geo_location", label: "ticketsCreate.sections.installation.geoLocation" },
      {
        name: "subscription_starting_date",
        label: "ticketsCreate.sections.installation.subscriptionStartingDate",
        type: "date",
      },
      {
        name: "installation_starting_date",
        label: "ticketsCreate.sections.installation.installationStartingDate",
        type: "date",
      },
      {
        name: "installation_starting_time",
        label: "ticketsCreate.sections.installation.installationStartingTime",
        type: "time",
      },
      { name: "bundle_name", label: "ticketsCreate.sections.installation.bundleName" },
    ],
  },
};
