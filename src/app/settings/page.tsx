import { PageHeader } from "@/components/ui/PageHeader";
import { SettingsPage } from "@/components/SettingsPage";

export default function SettingsRoutePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your account preferences and security using the existing validated settings form."
      />
      <SettingsPage />
    </div>
  );
}
