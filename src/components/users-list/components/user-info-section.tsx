import * as React from "react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { translateUserRole } from "@/lib/format";

export default function UserInfoSection({ user }: { user: any }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-14 w-14">
          {user?.image ? (
            <AvatarImage src={String(user?.image)} alt={String(user?.name ?? "")} />
          ) : (
            <AvatarFallback>{String(user?.name ?? "").slice(0, 1)}</AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col">
          <span className="text-base font-semibold">{String(user?.name ?? "")}</span>
          <span className="text-muted-foreground text-sm">{translateUserRole(user?.type)}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field
          label={t("usersTable.columns.name.label", { defaultValue: "Name" })}
          value={user?.name ? String(user.name) : "-"}
        />
        <Field
          label={t("usersTable.columns.mobile.label", { defaultValue: "Mobile" })}
          value={user?.mobile ? String(user.mobile) : "-"}
          valueClassName="rtl:text-right ltr:text-left"
        />
        <Field
          label={t("usersTable.columns.email.label", { defaultValue: "Email" })}
          value={user?.email ? String(user.email) : "-"}
        />
        <Field label={t("common.password", { defaultValue: "Password" })} value="••••••••" />
        <Field
          label={t("usersTable.columns.type.label", { defaultValue: "Role" })}
          value={user?.type ? translateUserRole(user?.type) : "-"}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-medium">{t("users.fields.zones", { defaultValue: "Zones" })}</span>
        <div className="flex flex-wrap gap-1.5">
          {(Array.isArray(user?.zones) ? (user?.zones as any[]) : [])?.length === 0 ? (
            <span className="text-muted-foreground text-sm">-</span>
          ) : (
            (user?.zones as any[]).map((z, i) => (
              <span key={i} className="bg-muted text-muted-foreground rounded-md px-2 py-1 text-xs">
                {String(z)}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-medium">{label}</span>
      <span className={valueClassName}>{value}</span>
    </div>
  );
}
