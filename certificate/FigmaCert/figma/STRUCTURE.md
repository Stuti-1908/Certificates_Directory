# Certificate Dashboard Structure

## Overview
This project implements a certificate generation dashboard with two distinct views:
1. **Empty State Dashboard** - Displayed when no certificates have been created yet
2. **Certificate Dashboard** - Displayed when certificates exist and there are events

## Folder Structure

```
figma/
├── components/
│   ├── empty-state/
│   │   ├── EmptyStateDashboard.tsx      # Empty state component
│   │   └── EmptyStateDashboard.module.css # Empty state styles
│   │
│   └── certificates/
│       ├── CertificateDashboard.tsx     # Certificates view component
│       └── CertificateDashboard.module.css # Certificates styles
│
├── pages/
│   ├── index.tsx                        # Main page (handles view switching)
│   └── _app.tsx                         # Next.js app wrapper
│
├── global.css                           # Global styles
├── index.module.css                     # Legacy styles (deprecated)
├── package.json
├── tsconfig.json
└── next.config.js
```

## Components

### EmptyStateDashboard
**Location:** `components/empty-state/EmptyStateDashboard.tsx`

The empty state dashboard is displayed when:
- No certificates have been created yet
- No past events exist
- No ongoing events exist

**Features:**
- Shows "No Past Events" section
- Shows "No Ongoing Events" section
- Displays stats: "Certificates Created" (0) and "Certificates left" (20,000)
- "Generate New Certificate" action button
- "Renew Pack" section with colorful artwork

**Props:**
- `onCreateClick?: () => void` - Callback when Create button is clicked
- `onRenewClick?: () => void` - Callback when Renew button is clicked
- `onNavigate?: () => void` - Callback for sidebar navigation

### CertificateDashboard
**Location:** `components/certificates/CertificateDashboard.tsx`

The certificate dashboard is displayed when:
- Certificates have been created
- There are past events and/or upcoming tournaments
- Real certificate data exists

**Features:**
- "Past Certificates Created" section with event list
- "Upcoming Tournaments" section with live updates badge
- Stats showing actual certificate counts
- "Generate New Certificate" action button
- "Renew Pack" section

**Props:**
- `onNavigate?: () => void` - Callback for sidebar navigation
- `onCreateClick?: () => void` - Callback when Create button is clicked

## Main Page (index.tsx)

The main page (`pages/index.tsx`) handles switching between the two views:

```typescript
const [view, setView] = useState<DashboardView>('empty');

// Switch to 'certificates' view when Create button is clicked
const handleCreateClick = useCallback(() => {
  setView('certificates');
}, []);
```

**Current Logic:**
- Starts with the `empty` state view
- Switches to `certificates` view when user clicks the "+ Create" button
- In a production app, this would be determined by API calls to check if certificates exist

## Styling

### Empty State (EmptyStateDashboard.module.css)
- Clean, minimalist design showing empty states
- Right panel with stats and action buttons
- Colorful artwork for the Renew Pack section

### Certificates (CertificateDashboard.module.css)
- Full dashboard with left panels showing event history
- Upcoming tournaments with live update badge
- Right panel with current stats and actions
- Multiple tabs for tournament categories

## Usage

To switch views, modify the initial state in `pages/index.tsx`:

```typescript
// Empty state
const [view, setView] = useState<DashboardView>('empty');

// Certificates view
const [view, setView] = useState<DashboardView>('certificates');
```

Or, fetch the actual state from your backend:

```typescript
useEffect(() => {
  // Fetch certificate data
  const fetchCertificates = async () => {
    const response = await fetch('/api/certificates');
    const data = await response.json();
    setView(data.certificatesExist ? 'certificates' : 'empty');
  };
  fetchCertificates();
}, []);
```

## Future Enhancements

- Integrate with backend API to automatically determine which view to show
- Add animations for smooth transitions between views
- Implement actual certificate creation flow
- Add filters and search functionality
- Implement real-time event updates
- Add user authentication and permissions
