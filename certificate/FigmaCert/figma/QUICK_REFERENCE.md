# Quick Reference Guide

## 📂 File Locations

| Component | Location |
|-----------|----------|
| Empty State Component | `components/empty-state/EmptyStateDashboard.tsx` |
| Empty State Styles | `components/empty-state/EmptyStateDashboard.module.css` |
| Certificates Component | `components/certificates/CertificateDashboard.tsx` |
| Certificates Styles | `components/certificates/CertificateDashboard.module.css` |
| Main Page (Router) | `pages/index.tsx` |

## 🎮 Testing the Implementation

### Start in Empty State (Default)
Already configured - just run the dev server:
```bash
npm run dev
```

### Switch to Certificates View
Click the **"+ Create"** button in the UI

### Test Both Views Programmatically
Edit `pages/index.tsx` and change:
```typescript
// Line with useState
const [view, setView] = useState<DashboardView>('empty');  // Default: empty state
const [view, setView] = useState<DashboardView>('certificates');  // Alternative: certificates
```

## 🎨 Customization Guide

### Change Empty State Stats
File: `components/empty-state/EmptyStateDashboard.tsx`
```typescript
<span className={styles.statNumber}>20,000</span>  // Change "Certificates left" value
```

### Change Certificate Stats
File: `components/certificates/CertificateDashboard.tsx`
```typescript
<span className={styles.statNumber}>5289</span>    // Change "Certificates Created" value
<span className={styles.statNumber}>16,211</span>  // Change "Certificates left" value
```

### Modify Colors
Files: `EmptyStateDashboard.module.css` or `CertificateDashboard.module.css`
```css
.createButton {
  background: linear-gradient(90deg, #00ff88 0%, #00dd66 100%);  /* Green button */
}

.statCardHeaderBlue {
  background: linear-gradient(90deg, #0099ff 0%, #0066ff 100%);  /* Blue header */
}

.statCardHeaderPurple {
  background: linear-gradient(90deg, #9933ff 0%, #6600ff 100%);  /* Purple header */
}
```

## 🔌 API Integration Template

To fetch real data from your backend:

```typescript
// In pages/index.tsx
import { useEffect } from 'react';

const CertificateGenerationDashboard: NextPage = () => {
  const [view, setView] = useState<DashboardView>('empty');
  
  // Fetch dashboard state from API
  useEffect(() => {
    const fetchDashboardState = async () => {
      try {
        const response = await fetch('/api/dashboard/state');
        const data = await response.json();
        
        // Show empty state if no certificates
        if (!data.certificatesExist || data.totalCertificates === 0) {
          setView('empty');
        } else {
          setView('certificates');
        }
      } catch (error) {
        console.error('Failed to fetch dashboard state:', error);
        setView('empty'); // Default to empty on error
      }
    };
    
    fetchDashboardState();
  }, []);
  
  // ... rest of component
};
```

## 🎯 Component Props Reference

### Using EmptyStateDashboard
```typescript
<EmptyStateDashboard
  onCreateClick={() => {
    console.log('User clicked Create');
    // Trigger certificate creation flow
  }}
  onRenewClick={() => {
    console.log('User clicked Renew');
    // Trigger renewal flow
  }}
  onNavigate={() => {
    console.log('User clicked sidebar');
    // Handle navigation
  }}
/>
```

### Using CertificateDashboard
```typescript
<CertificateDashboard
  onCreateClick={() => {
    console.log('User clicked Create');
    // Trigger certificate creation flow
  }}
  onNavigate={() => {
    console.log('User clicked sidebar');
    // Handle navigation
  }}
/>
```

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Styles not applying | Clear Next.js cache: `rm -rf .next` then `npm run dev` |
| Images not loading | Check Figma asset URLs are still valid (expire in 7 days) |
| View not switching | Make sure `handleCreateClick` is calling `setView('certificates')` |
| Type errors | Run `npm run build` to check for TypeScript errors |

## 📊 State Flow Diagram

```
┌─────────────────────┐
│   Main Page         │
│  (pages/index.tsx)  │
└──────────┬──────────┘
           │
           ├─ useState('empty' or 'certificates')
           │
           ├─ onCreateClick() ──┐
           │                    │
           └─ onNavigate()      │ Sets view state
                                │
                    ┌───────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
   ┌────▼─────┐         ┌──────▼──────┐
   │ Empty    │         │ Certificates│
   │ State    │         │ Dashboard   │
   │Dashboard │         │             │
   └──────────┘         └─────────────┘
```

## 🚀 Deployment Checklist

- [ ] Replace all Figma asset URLs with permanent image URLs
- [ ] Connect to real backend API for certificate data
- [ ] Implement certificate creation endpoint
- [ ] Test both views thoroughly
- [ ] Add error handling and loading states
- [ ] Optimize images and assets
- [ ] Test on mobile/tablet (currently optimized for desktop)
- [ ] Setup proper routing for different dashboard sections
- [ ] Add authentication/authorization

## 📞 Component Communication

The components communicate through simple callbacks passed from the parent:

```
Main Page
├── EmptyStateDashboard
│   ├── onCreateClick → switches to 'certificates' view
│   ├── onRenewClick → handles renewal
│   └── onNavigate → handles sidebar clicks
│
└── CertificateDashboard
    ├── onCreateClick → handles new certificate creation
    └── onNavigate → handles sidebar clicks
```

No Redux or Context needed - simple `useState` for view switching!

## 📝 Notes

- Both components share the same header, sidebar, and footer structure
- Styles are isolated using CSS Modules
- Assets are loaded from Figma (Note: they expire in 7 days)
- The implementation uses TypeScript for type safety
- Responsive breakpoints at 1400px and 1200px
