import * as React from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ResponsiveDialog } from "@/components/common/responsive/dialog";
import { useUsersShow } from "@/services/api/generated/users/users";
import UserInfoSection from "./user-info-section";
import UserTripsSection from "./user-trips-section";

type Props = {
  userId: number | undefined;
};

export default function UserDialog({ userId }: Props) {
  const { t } = useTranslation();
  const [resolvedId, setResolvedId] = React.useState<number | undefined>(userId);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setResolvedId(userId);
    if (typeof userId === "number") setOpen(true);
  }, [userId]);

  const { data: userData, isFetching: userLoading } = useUsersShow<any>(Number(resolvedId || 0), {
    query: { enabled: open && !!resolvedId },
  });

  const user = React.useMemo(() => {
    const root = userData as any;
    return root || {};
  }, [userData]);

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          try {
            window.dispatchEvent(new CustomEvent("userDialog.closed"));
          } catch {}
        }
      }}
    >
      <ResponsiveDialog.Content>
        <ResponsiveDialog.Header>
          <ResponsiveDialog.Title>
            {t("common.user", { defaultValue: "User" })}
          </ResponsiveDialog.Title>
        </ResponsiveDialog.Header>
        <ResponsiveDialog.Body>
          <Tabs defaultValue="general" className="flex h-full flex-col">
            <TabsList>
              <TabsTrigger value="general">
                {t("sidebar.general.title", { defaultValue: "General" })}
              </TabsTrigger>
              <TabsTrigger value="trips">
                {t("header.trips", { defaultValue: "Trips" })}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="mt-2">
              <UserInfoSection user={user} />
            </TabsContent>
            <TabsContent value="trips" className="mt-2">
              <UserTripsSection userId={resolvedId} open={open} />
            </TabsContent>
          </Tabs>
        </ResponsiveDialog.Body>
        <ResponsiveDialog.Footer>
          <div />
        </ResponsiveDialog.Footer>
      </ResponsiveDialog.Content>
    </ResponsiveDialog>
  );
}
