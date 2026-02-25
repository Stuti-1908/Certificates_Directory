# Empty State vs. Certificates Dashboard - Visual Comparison

## Side-by-Side Comparison

### 🟢 EMPTY STATE DASHBOARD
**When:** No certificates created yet  
**File:** `components/empty-state/EmptyStateDashboard.tsx`  
**Styling:** `components/empty-state/EmptyStateDashboard.module.css`

#### Left Content
```
┌────────────────────────────────────┐
│  No Past Events                    │
│  ─────────────────────────────────  │
│  Once an event gets over,          │
│  it will reflect here              │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│  No Ongoing Events                 │
│  ─────────────────────────────────  │
│  Once any event becomes live,      │
│  it will reflect here              │
└────────────────────────────────────┘
```

#### Right Panel
```
┌──────────────────────────────────┐
│ Certificates Created       [BLUE] │
│                         0         │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ Certificates left      [PURPLE]   │
│                    20,000         │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ Generate New Certificate          │
│ Click here to generate cert...    │
│        [+ Create]                 │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ Renew Pack                        │
│ Renew your pack to create more... │
│  [Renew]        🎨 Colorful Art  │
└──────────────────────────────────┘
```

---

### 🔵 CERTIFICATES DASHBOARD
**When:** Certificates exist, events available  
**File:** `components/certificates/CertificateDashboard.tsx`  
**Styling:** `components/certificates/CertificateDashboard.module.css`

#### Left Content
```
┌──────────────────────────────────────────┐
│ Past Certificates Created      View All ▶ │
│ ─────────────────────────────────────────  │
│ 🎭 Event Name    | Sport | Date | Details │
│ 🎭 Event Name    | Sport | Date | Details │
│ 🎭 Event Name    | Sport | Date | Details │
│ 🎭 Event Name    | Sport | Date | Details │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ Upcoming Tournaments      🔴 Live updates │
│ ─────────────────────────────────────────  │
│ Karnataka Badminton State Tournament      │
│ Bengaluru, Karnataka                      │
│ 230 participants, 12 coaches, ...         │
│ Tournament ID, Name, Organizer, ...       │
│                        View All Events ▶  │
│ [First▼] [Second] [Third] [Fourth]        │
└──────────────────────────────────────────┘
```

#### Right Panel
```
┌──────────────────────────────────┐
│ Certificates Created       [BLUE] │
│                       5289        │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ Certificates left      [PURPLE]   │
│                    16,211         │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ Generate New Certificate          │
│ Click here to generate cert...    │
│        [+ Create]                 │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ Renew Pack                        │
│ Renew your pack to create more... │
│  [Renew]        🎨 Colorful Art  │
└──────────────────────────────────┘
```

---

## Key Differences

| Aspect | Empty State | Certificates |
|--------|-------------|--------------|
| **Left Content** | Two empty state messages | Event history + upcoming tournaments |
| **Certificates Created** | 0 | 5289 |
| **Certificates Left** | 20,000 | 16,211 |
| **Visual Status** | Clean, minimal | Rich with data |
| **Data Display** | No tables/lists | Event avatars, details |
| **User Journey** | "Get Started" feeling | "Active User" feeling |
| **Main CTA** | "+ Create" to start | "+ Create" to add more |

---

## Transitions Between Views

### User Flow
```
1. User visits dashboard
   ↓
2. App checks if certificates exist
   ├─ Yes → Show CERTIFICATES view
   └─ No → Show EMPTY STATE view
   
3. User clicks "+ Create" button
   ↓
4. App switches to CERTIFICATES view
   (In real app: after certificate creation)
   ↓
5. Dashboard shows created certificates
```

### Implementation
```typescript
// In pages/index.tsx
const [view, setView] = useState<DashboardView>('empty');

const handleCreateClick = useCallback(() => {
  setView('certificates');  // Switch view
}, []);

// Render appropriate component
if (view === 'empty') {
  return <EmptyStateDashboard onCreateClick={handleCreateClick} />;
}
return <CertificateDashboard onCreateClick={handleCreateClick} />;
```

---

## Layout Structure (Both Views)

```
┌─────────────────────────────────────────────────────────┐
│ HEADER                                                  │
│ Logo | Search Bar | Settings | Language                │
├─────────────────────────────────────────────────────────┤
│ ║                                                       │
│ ║ SIDEBAR    PAGE TITLE: "Create Certificates"        │
│ ║                                                       │
│ ║ ┌───────────────┐    ┌──────────────┐               │
│ ║ │ LEFT CONTENT  │    │  RIGHT PANEL │               │
│ ║ │               │    │              │               │
│ ║ │ Empty/Events  │    │ Stats & Info │               │
│ ║ │               │    │              │               │
│ ║ └───────────────┘    └──────────────┘               │
│ ║                                                       │
│ ║ FOOTER                                               │
│ ║ © 2026 SportsKeyz. All rights reserved.              │
│ ║                                                       │
└─────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
Main Page (pages/index.tsx)
├── View State: useState('empty' | 'certificates')
│
├─ IF view === 'empty'
│  └── EmptyStateDashboard
│      ├── Header (Logo, Search, Settings)
│      ├── Sidebar (Navigation)
│      ├── Left Content
│      │   ├── No Past Events
│      │   └── No Ongoing Events
│      ├── Right Panel
│      │   ├── Stats Cards
│      │   ├── Generate Section
│      │   └── Renew Pack
│      ├── Footer
│      └── Language Selector
│
└─ ELSE
   └── CertificateDashboard
       ├── Header (Logo, Search, Settings)
       ├── Sidebar (Navigation)
       ├── Left Content
       │   ├── Past Certificates List
       │   └── Upcoming Tournaments
       ├── Right Panel
       │   ├── Stats Cards
       │   ├── Generate Section
       │   └── Renew Pack
       ├── Footer
       └── Language Selector
```

---

## CSS Classes Used

### Both Components (Shared)
- `.dashboard` - Main container
- `.searchBar`, `.searchInput` - Search functionality
- `.settingsButton`, `.settingsIcon` - Settings
- `.logo` - SportsKeyz logo
- `.sidebar`, `.sidebarIcon`, `.sidebarDivider` - Navigation
- `.footer` - Copyright text
- `.pageTitle` - "Create Certificates" heading
- `.languageSelector` - Language switcher

### Right Panel (Both)
- `.rightPanel` - Container for stats and actions
- `.statsCards` - Stats card container
- `.statCardCreated`, `.statCardLeft` - Individual stat cards
- `.statCardHeaderBlue`, `.statCardHeaderPurple` - Colored headers
- `.statLabel`, `.statNumber` - Stat text
- `.generateSection` - New certificate section
- `.createButton` - Green Create button
- `.renewPackSection` - Renewal section
- `.renewButton` - Renew button
- `.renewArtwork` - Decorative image

### Empty State Only
- `.leftContent` - Left content container
- `.emptySection` - Empty state message box
- `.emptySectionTitle`, `.emptySectionDescription` - Text styling

### Certificates Only
- `.pastCertificatesSection` - Past events container
- `.sectionBackground` - Section styling
- `.sectionHeader`, `.sectionTitle` - Header text
- `.certificateList`, `.certificateRow` - List styling
- `.eventAvatar`, `.eventName`, `.sportName`, `.eventDate` - Row cells
- `.upcomingSection` - Tournaments container
- `.liveUpdatesBadge` - "Live updates" badge
- `.upcomingTitle` - Section title
- `.tournamentDetails` - Tournament info
- `.tabsContainer`, `.tabFirst`, `.tabSecond`, etc. - Tab navigation

---

## Responsive Considerations

Both dashboards include responsive breakpoints:

```css
@media (max-width: 1400px) {
  /* Adjust layout for smaller screens */
  .searchBar { left: 850px; }
  .settingsButton { left: 1250px; }
}

@media (max-width: 1200px) {
  /* Adjust for tablets/small laptops */
  .dashboard { min-height: 900px; }
  .leftContent { width: 400px; }
  .rightPanel { width: 280px; }
}
```

---

## Color Palette

| Element | Color | Usage |
|---------|-------|-------|
| Background | #19191a | Main dashboard |
| Cards/Panels | #23282e | Sidebar, search, cards |
| Section BG | #1d1e20 | Content sections |
| Text | #ffffff | Primary text |
| Text Muted | rgba(255,255,255,0.6) | Secondary text |
| Accent Green | #30dfa0 | Buttons, links |
| Blue Header | #0ea0fb | Stat card header |
| Purple Header | #9a73f0 | Stat card header |
| Live Badge Border | #30dfa0 | "Live updates" border |
| Event Row | #19191a | Alternating rows |

---

## Animation & Interactions

### Buttons
```css
.createButton:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 255, 136, 0.3);
}

.createButton:active {
  transform: translateY(0);
}
```

### Links
```css
.viewAllLink:hover {
  opacity: 1;
}
```

### Sidebar Icons
```css
.sidebarIcon:hover {
  transform: scale(1.1);
}
```

---

## Testing Checklist

- [ ] Empty state displays correctly on load
- [ ] Clicking "+ Create" switches to certificates view
- [ ] Certificate view shows event data
- [ ] All buttons are interactive
- [ ] Sidebar navigation works
- [ ] Search bar is functional
- [ ] Colors match the design
- [ ] Typography is correct
- [ ] Layout responsive on different screen sizes
- [ ] Images load from Figma correctly
