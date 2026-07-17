import { PageHeader } from "@/components/ui/PageHeader";
import { PlaygroundDemo } from "@playground/PlaygroundDemo";

export default function PlaygroundPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="FE-05 Accessibility Playground"
        description="Custom accessible React components compared with shadcn/ui Dialog and Tabs."
      />
      <PlaygroundDemo />
    </div>
  );
}
