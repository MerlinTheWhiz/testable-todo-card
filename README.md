## How to run locally

1. Clone the repo:
   git clone https://github.com/MerlinTheWhiz/testable-todo-card/

2. Open the folder:
   cd todo-card

3. Open index.html in your browser:
   - double click index.html
   OR
   - use Live Server in VS Code



## Decisions made

- Used vanilla HTML, CSS, and JavaScript to meet assignment constraints
- Used flexbox for layout alignment of card header and actions
- Used CSS variables for theme consistency
- Used custom checkbox styling with appearance: none for full design control
- Used data-testid attributes strictly to ensure test automation compatibility



## Trade-offs

- Used custom checkbox instead of native styling for design control, which required manual accessibility handling

## Stage 1 Updates

### What changed from Stage 0
- Upgraded the card into an interactive, stateful component using Vanilla JS.
- Introduced an **Edit Mode** allowing users to update the title, description, priority, and due dates.
- Built synchronized **Status Controls** (Pending, In Progress, Done) functioning seamlessly alongside the native checkbox.
- Implemented **Expand/Collapse** truncation rules.
- Engineered a **Live Overdue Timer** updating dynamically every 30 seconds.

### New design decisions
- Built a custom-styled, floating dropdown UI substituting native OS designs for the Status menu.
- Utilized CSS `-webkit-line-clamp` instead of arbitrary JavaScript string chopping to natively display elegant ellipsis ("...") for truncated descriptions.
- Enhanced priority typography with custom colors designating "High" priority items.
- Leveraged adjacent sibling selectors (`+`) in CSS to handle complex, gapless space management dynamically rendering strictly when standard buttons vanish.

### Any known limitations
- Time tracking relies on the native browser's `setInterval` instance, which may be throttled slightly in inactive background tabs by default.

### Accessibility notes
- The entire Edit Form now strongly ties elements using explicitly matched `<label for="[id]">` tags.
- Programmed strict focus-trapping routines when smoothly entering and exiting Edit Mode to support screen readers.
- `aria-expanded` attributes are bound accurately with `aria-controls` to natively assist screen readers toggling the newly complex collapsible description boundaries.
- Deployed dynamic `aria-live="polite"` tags to ensure sudden timer-related text changes cleanly announce to readers gracefully.
