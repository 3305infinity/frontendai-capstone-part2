"use client";

import { useRef, useState } from "react";
import { Disclosure } from "@playground/Disclosure";
import { ModalDialog } from "@playground/ModalDialog";
import { Tabs as CustomTabs } from "@playground/Tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs as ShadcnTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const customTabItems = [
  {
    id: "overview",
    label: "Overview",
    panel: (
      <p>
        Custom tabs built from scratch with <code>role="tablist"</code>, arrow-key
        navigation, and <code>aria-selected</code>.
      </p>
    ),
  },
  {
    id: "details",
    label: "Details",
    panel: (
      <p>
        Each tab controls a <code>role="tabpanel"</code> region linked through{" "}
        <code>aria-controls</code> and <code>aria-labelledby</code>.
      </p>
    ),
  },
  {
    id: "notes",
    label: "Notes",
    panel: (
      <p>
        Enter and Space activate tabs. Only the selected panel stays visible to
        assistive technology.
      </p>
    ),
  },
];

export function PlaygroundDemo() {
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const customModalTriggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[var(--color-text)]">
          Custom Accessible Components
        </h2>
        <p className="text-sm text-[var(--color-muted)]">
          Built from scratch following WAI-ARIA Authoring Practices — no component
          library used.
        </p>

        <div className="grid gap-8 lg:grid-cols-3">
          <article className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h3 className="text-lg font-medium text-[var(--color-text)]">Modal Dialog</h3>
            <button
              ref={customModalTriggerRef}
              type="button"
              className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white"
              onClick={() => setIsCustomModalOpen(true)}
            >
              Open custom modal
            </button>
            <ModalDialog
              isOpen={isCustomModalOpen}
              onClose={() => setIsCustomModalOpen(false)}
              title="Custom accessible modal"
              triggerRef={customModalTriggerRef}
            >
              <p>
                This dialog traps focus, closes on Escape, and returns focus to the
                trigger button when dismissed.
              </p>
            </ModalDialog>
          </article>

          <article className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 lg:col-span-1">
            <h3 className="text-lg font-medium text-[var(--color-text)]">Tabs</h3>
            <CustomTabs items={customTabItems} defaultTabId="overview" />
          </article>

          <article className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h3 className="text-lg font-medium text-[var(--color-text)]">Disclosure</h3>
            <div className="space-y-3">
              <Disclosure title="What is a disclosure?" defaultOpen>
                A disclosure shows or hides a single section of content. The button
                exposes <code>aria-expanded</code> and <code>aria-controls</code>.
              </Disclosure>
              <Disclosure title="Keyboard support">
                Press Enter or Space on the heading button to toggle the panel open
                or closed.
              </Disclosure>
            </div>
          </article>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[var(--color-text)]">
          shadcn/ui Comparison
        </h2>
        <p className="text-sm text-[var(--color-muted)]">
          shadcn/ui Dialog and Tabs are built on Base UI primitives with production-ready
          accessibility patterns.
        </p>

        <div className="grid gap-8 lg:grid-cols-2">
          <article className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h3 className="text-lg font-medium text-[var(--color-text)]">shadcn Dialog</h3>
            <Dialog>
              <DialogTrigger render={<Button variant="outline" />}>
                Open shadcn dialog
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>shadcn dialog</DialogTitle>
                  <DialogDescription>
                    Base UI handles focus restoration, scroll locking, and layered
                    dialog semantics automatically.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </article>

          <article className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h3 className="text-lg font-medium text-[var(--color-text)]">shadcn Tabs</h3>
            <ShadcnTabs defaultValue="account">
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                shadcn tabs manage roving tabindex, keyboard navigation, and ARIA
                wiring through reusable primitives.
              </TabsContent>
              <TabsContent value="password">
                Styling and animation are layered on top without breaking accessibility.
              </TabsContent>
            </ShadcnTabs>
          </article>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h3 className="text-lg font-medium text-[var(--color-text)]">Quick comparison</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--color-muted)]">
            <li>
              <strong className="text-[var(--color-text)]">Custom modal:</strong> manual
              focus trap, Escape handling, and focus return implemented by hand.
            </li>
            <li>
              <strong className="text-[var(--color-text)]">shadcn dialog:</strong> nested
              dialogs, scroll locking, and screen-reader announcements handled by Base UI.
            </li>
            <li>
              <strong className="text-[var(--color-text)]">Custom tabs:</strong> arrow-key
              navigation and ARIA attributes implemented directly.
            </li>
            <li>
              <strong className="text-[var(--color-text)]">shadcn tabs:</strong> roving
              tabindex, activation modes, and orientation support built in.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
