# NOTES

## What I implemented

- Accessible modal dialog with `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`.
- Focus trap inside the modal using Tab key cycling.
- Focus returns to the trigger button after closing.
- Escape key closes the modal.
- Body scroll locking while the modal is open.
- Tabs with `role="tablist"`, `role="tab"`, and `role="tabpanel"`.
- Tabs support Left, Right, Home, and End arrow navigation.
- Enter and Space activate tab controls.
- `aria-selected`, `aria-controls`, and `aria-labelledby` wired between tabs and panels.
- Disclosure component with `aria-expanded`, `aria-controls`, and `role="region"`.
- Disclosure supports Enter and Space activation on the heading button.
- Demo page at `/playground` rendering all three custom components plus shadcn/ui comparisons.

## What shadcn/ui handles better

1. **Better focus management for nested dialogs and complex interactions** — Base UI restores focus, handles stacked modals, and manages pointer-event isolation without manual portal logic.

2. **More robust accessibility across browsers and screen readers** — Radix/Base UI primitives are battle-tested with consistent announcements, roving tabindex, and edge-case handling.

3. **Better animation and transition handling without breaking accessibility** — shadcn layers enter/exit animations while preserving focus order and `aria-hidden` behavior on background content.

4. **Cleaner abstraction and reusable primitives** — Composable `DialogTrigger`, `DialogContent`, `TabsList`, and `TabsTrigger` reduce boilerplate compared to hand-rolled state and refs.

## What I learned

Building accessible components manually helped me understand ARIA roles, keyboard interaction, focus management, and why component libraries like shadcn/ui provide production-ready accessibility out of the box. Writing a focus trap and tab roving logic by hand made the underlying browser accessibility APIs much clearer, even though a library is the better default for real products.
