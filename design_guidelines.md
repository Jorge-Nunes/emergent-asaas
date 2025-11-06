# Design Guidelines: Sistema de Gestão de Cobranças com Notificações WhatsApp

## Design Approach

**Selected Approach:** Design System with SaaS Dashboard References

**Justification:** This is a utility-focused, information-dense business application requiring efficiency and clarity. Drawing inspiration from Asaas, Stripe Dashboard, and modern fintech platforms that prioritize data readability and workflow efficiency.

**Key Design Principles:**
- Clarity over decoration
- Efficient data scanning and action completion
- Consistent patterns for predictability
- Performance-first with minimal visual overhead

---

## Core Design Elements

### A. Typography

**Font Stack:**
- Primary: Inter or DM Sans via Google Fonts
- Monospace: JetBrains Mono for numerical data, IDs, and codes

**Hierarchy:**
- Page Headers: text-3xl font-semibold (32px)
- Section Headers: text-xl font-semibold (20px)
- Card Titles: text-lg font-medium (18px)
- Body Text: text-base font-normal (16px)
- Labels/Metadata: text-sm font-medium (14px)
- Captions: text-xs (12px)

**Numerical Data:** Always use tabular-nums for proper alignment in tables and dashboards

---

### B. Layout System

**Spacing Primitives:** Use Tailwind units of 4, 6, 8, 12, and 16 exclusively
- Component padding: p-6
- Section spacing: space-y-8
- Card gaps: gap-6
- Tight spacing: space-y-4

**Container Structure:**
- Dashboard layout: Sidebar (w-64) + Main content (flex-1)
- Content max-width: Full width with px-8 py-6
- Card grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 for metrics

---

### C. Component Library

#### Navigation
- **Sidebar Navigation:** Fixed left sidebar with logo, main nav items, and settings footer
- **Top Bar:** Breadcrumbs, user profile, and quick actions
- Navigation items with icons (from Heroicons) + labels
- Active state: Subtle background highlight, no heavy indicators

#### Core UI Elements
- **Metric Cards:** Clean stat cards with large numbers, labels, and trend indicators (↑↓)
- **Data Tables:** Sortable headers, row hover states, action menus, pagination
- **Status Badges:** Pill-shaped with subtle backgrounds (rounded-full px-3 py-1 text-xs)
- **Action Buttons:** Primary (solid), Secondary (outline), Tertiary (ghost)

#### Forms & Inputs
- **Input Fields:** Border-only style with focus ring, labels above inputs
- **Dropdowns/Selects:** Clean native-like selects with chevron icons
- **Toggles:** Modern switches for boolean settings
- **Date Pickers:** Integrated calendar widgets

#### Data Displays
- **Charts:** Line charts for temporal trends, bar charts for comparisons (use Chart.js or Recharts)
- **List Views:** Alternating subtle row backgrounds for scannability
- **Empty States:** Centered with icon, message, and action button

#### Overlays
- **Modals:** Centered, max-w-2xl, with backdrop blur
- **Toasts:** Top-right notifications for success/error feedback
- **Dropdowns:** Clean menus aligned to trigger elements

---

## Dashboard-Specific Layouts

### Main Dashboard
- Top row: 4-column metric cards (Cobranças Pendentes, Vencidas Hoje, Mensagens Enviadas, Taxa de Conversão)
- Middle section: 2-column layout (Gráfico de Execuções + Cobranças por Status)
- Bottom: Full-width execution log table

### Cobranças (Billing List)
- Filter bar: Search + status filters + date range
- Data table: Cliente, Valor, Vencimento, Status, Ações columns
- Compact rows with quick actions (Ver, Enviar Mensagem)

### Relatórios (Reports)
- Tab navigation: Visão Geral, Mensagens, Cobranças, Execuções
- Each tab: Relevant charts + summary metrics + exportable data tables

### Configurações (Settings)
- 2-column form layout for desktop (Labels left, inputs right)
- Sections: Integração Asaas, Evolution API, Preferências de Envio, Templates de Mensagens
- Save button sticky at bottom-right

---

## Images

**No hero images required.** This is a dashboard application, not a marketing site.

**Icon Usage:** Heroicons throughout for consistent iconography (outline style for nav, solid for actions)

**Logo:** Simple text or minimal icon logo in sidebar header

---

## Performance Considerations

- Table virtualization for 100+ rows
- Lazy load chart libraries only on pages that need them
- Debounced search inputs (300ms)
- Pagination over infinite scroll for data tables
- Optimistic UI updates for quick feedback

---

## Accessibility & Interaction

- Keyboard navigation for all interactive elements
- Focus indicators on all form controls
- Loading skeletons for async data
- Error states with clear messaging and recovery actions
- Tooltips on icon-only buttons