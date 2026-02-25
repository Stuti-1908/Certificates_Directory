# 🧪 Testing & Verification Guide

## Quick Verification Steps

### 1. Check File Structure
Run this command to verify all files are in place:
```bash
cd FigmaCert/figma
dir /s components\*.tsx components\*.css pages\*.tsx
```

Expected output:
```
✓ components\empty-state\EmptyStateDashboard.tsx
✓ components\empty-state\EmptyStateDashboard.module.css
✓ components\certificates\CertificateDashboard.tsx
✓ components\certificates\CertificateDashboard.module.css
✓ pages\index.tsx (updated)
✓ pages\_app.tsx
```

### 2. Start Development Server
```bash
npm run dev
```

Expected output:
```
▲ Next.js 14.2.5
  - Local:        http://localhost:3001
✓ Ready in X.Xs
```

### 3. View the Empty State (Default)
Open browser to: `http://localhost:3001`

**Expected UI Elements:**
- ✓ SportsKeyz logo (top left)
- ✓ Search bar with magnifying glass icon (top right)
- ✓ Settings button (top right)
- ✓ Dark sidebar on left with navigation icons
- ✓ "Create Certificates" title
- ✓ Two empty state sections: "No Past Events" and "No Ongoing Events"
- ✓ Right panel showing:
  - Certificates Created: 0
  - Certificates Left: 20,000
  - "Generate New Certificate" section with "+ Create" button
  - "Renew Pack" section with artwork
- ✓ Footer with copyright text
- ✓ Language selector button

### 4. Test View Switching
**Action:** Click the **"+ Create"** button

**Expected Result:** Dashboard should switch to show:
- ✓ Left panel now shows:
  - "Past Certificates Created" section with event list
  - "Upcoming Tournaments" section with live badge
- ✓ Right panel updates to show:
  - Certificates Created: 5289
  - Certificates Left: 16,211
- ✓ All other elements (header, sidebar, footer) remain same

### 5. Test Navigation
**Action:** Click any sidebar icon

**Expected Result:** Navigation callbacks should be triggered (currently no-op)

### 6. Test Search
**Action:** Click in the search bar and type

**Expected Result:** Search bar should accept input (can be connected to API later)

### 7. Test Settings
**Action:** Click the settings button (⚙️)

**Expected Result:** Settings callback triggered (can be connected later)

---

## Component Testing

### EmptyStateDashboard Component

**Location:** `components/empty-state/EmptyStateDashboard.tsx`

**Render Test:**
```typescript
import EmptyStateDashboard from '../components/empty-state/EmptyStateDashboard';

// In your test file
test('renders empty state dashboard', () => {
  render(<EmptyStateDashboard />);
  expect(screen.getByText('No Past Events')).toBeInTheDocument();
  expect(screen.getByText('No Ongoing Events')).toBeInTheDocument();
});
```

**Props Test:**
```typescript
test('calls onCreateClick when button is clicked', () => {
  const handleCreate = jest.fn();
  render(<EmptyStateDashboard onCreateClick={handleCreate} />);
  
  const createButton = screen.getByText('+ Create');
  fireEvent.click(createButton);
  
  expect(handleCreate).toHaveBeenCalled();
});
```

### CertificateDashboard Component

**Location:** `components/certificates/CertificateDashboard.tsx`

**Render Test:**
```typescript
test('renders certificate dashboard with data', () => {
  render(<CertificateDashboard />);
  expect(screen.getByText('Past Certificates Created')).toBeInTheDocument();
  expect(screen.getByText('Upcoming Tournaments')).toBeInTheDocument();
  expect(screen.getByText('5289')).toBeInTheDocument();
});
```

### Main Page Routing

**Location:** `pages/index.tsx`

**State Switching Test:**
```typescript
test('switches from empty to certificates view', async () => {
  render(<CertificateGenerationDashboard />);
  
  // Initially shows empty state
  expect(screen.getByText('No Past Events')).toBeInTheDocument();
  
  // Click create button
  const createButton = screen.getByText('+ Create');
  fireEvent.click(createButton);
  
  // Should show certificates view
  await waitFor(() => {
    expect(screen.getByText('Past Certificates Created')).toBeInTheDocument();
  });
});
```

---

## Manual Testing Checklist

### Visual Elements
- [ ] Logo loads correctly (SportsKeyz)
- [ ] Sidebar displays with proper icons
- [ ] Search bar is styled correctly
- [ ] Settings button visible
- [ ] Language selector visible
- [ ] Footer text readable
- [ ] Colors match design specification
- [ ] Typography is correct size and weight
- [ ] Spacing and alignment looks good

### Empty State Specific
- [ ] "No Past Events" message visible
- [ ] "No Ongoing Events" message visible
- [ ] Certificate count shows 0
- [ ] Certificates left shows 20,000
- [ ] Artwork visible in Renew Pack section
- [ ] Empty sections have proper styling

### Certificates View Specific
- [ ] "Past Certificates Created" section visible
- [ ] Event list displays with avatars
- [ ] Event details (name, sport, date) shown
- [ ] "View Details" links visible
- [ ] "Upcoming Tournaments" section visible
- [ ] "Live updates" badge visible
- [ ] Tournament details displayed
- [ ] Tabs visible at bottom of section
- [ ] Certificate counts updated (5289, 16,211)

### Interactions
- [ ] "+ Create" button is clickable
- [ ] Clicking "+ Create" switches views
- [ ] "Renew" button is clickable
- [ ] "View All" links are clickable
- [ ] "View Details" links are clickable
- [ ] Sidebar icons are clickable
- [ ] Hover states work on buttons
- [ ] Hover states work on links

### Responsive Testing
- [ ] Test on 1920x1080 (desktop)
- [ ] Test on 1366x768 (laptop)
- [ ] Test on 1024x768 (tablet)
- [ ] Test on 768x1024 (tablet landscape)
- [ ] Breakpoints at 1400px and 1200px work

### Browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile browsers

---

## Performance Testing

### Bundle Size Check
```bash
npm run build
# Check .next/static/chunks for bundle sizes
```

### Load Time
- [ ] Page loads in under 2 seconds
- [ ] No console errors
- [ ] No console warnings
- [ ] Images load from Figma correctly

### Memory Usage
- [ ] No memory leaks when switching views
- [ ] Component unmounts properly
- [ ] State cleans up on component unmount

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Can tab through all interactive elements
- [ ] Tab order makes sense
- [ ] Focus states are visible
- [ ] Can activate buttons with Enter/Space

### Screen Reader Testing
- [ ] All text is readable
- [ ] Images have alt text
- [ ] Buttons are properly labeled
- [ ] Icons have aria-labels (if needed)

### Color Contrast
- [ ] Text has sufficient contrast (WCAG AA)
- [ ] Not relying on color alone for meaning
- [ ] Links are distinguishable from text

---

## API Integration Testing (When Ready)

### Mock API Endpoint
```typescript
// Add to pages/api/dashboard-state.ts
export default function handler(req, res) {
  res.status(200).json({
    certificatesExist: true,
    totalCertificates: 5289,
    certificatesLeft: 16211,
    pastEvents: [/* ... */],
    upcomingEvents: [/* ... */]
  });
}
```

### Test with Mock
```typescript
jest.mock('fetch');
global.fetch.mockResolvedValueOnce({
  json: async () => ({ certificatesExist: true })
});

render(<CertificateGenerationDashboard />);
await waitFor(() => {
  expect(screen.getByText('Past Certificates Created')).toBeInTheDocument();
});
```

---

## Debugging Tips

### Enable React DevTools
```bash
# Install React DevTools browser extension
# Check component state and props in real-time
```

### Console Logging
Add logs in components:
```typescript
const handleCreateClick = useCallback(() => {
  console.log('Create clicked, switching to certificates view');
  setView('certificates');
}, []);
```

### View State in Browser
Add to `pages/index.tsx` for debugging:
```typescript
<div style={{ position: 'fixed', top: 10, right: 10, background: 'black', color: 'white', padding: '10px', zIndex: 9999 }}>
  Current View: {view}
</div>
```

### Next.js Debug Mode
```bash
NODE_OPTIONS='--inspect' npm run dev
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Blank page | Check browser console for errors, restart dev server |
| Styles not applying | Clear `.next` folder: `rm -rf .next` |
| Images not loading | Check Figma asset URLs are still valid |
| View not switching | Verify `handleCreateClick` is calling `setView('certificates')` |
| Build errors | Run `npm run build` to see specific errors |
| Port 3001 in use | Kill process: `lsof -ti:3001` or use different port |

---

## Success Criteria

✅ **All tests pass when:**
- [ ] Both components render without errors
- [ ] View switching works smoothly
- [ ] All UI elements display correctly
- [ ] Colors match design specification
- [ ] Buttons and links are interactive
- [ ] Responsive design works at all breakpoints
- [ ] No console errors or warnings
- [ ] Performance is acceptable
- [ ] Accessibility meets WCAG AA standards

✅ **Production ready when:**
- [ ] All above criteria met
- [ ] Backend API integrated
- [ ] Real certificate data loads
- [ ] Error handling implemented
- [ ] Loading states shown
- [ ] Images optimized
- [ ] Tested on real devices
- [ ] Accessibility fully validated

---

## Test Coverage Goals

```
Files           | Statements | Branches | Functions | Lines
----------------|------------|----------|-----------|-------
EmptyStateDash  |    90%     |   85%    |    90%   |  90%
CertificateDash |    90%     |   85%    |    90%   |  90%
pages/index.tsx |    95%     |   90%    |    95%   |  95%
Total           |    92%     |   87%    |    92%   |  92%
```

---

## Continuous Testing

### Pre-commit Hook
```bash
npm run lint    # Check for errors
npm run build   # Test build
npm test        # Run tests
```

### CI/CD Pipeline
```yaml
# .github/workflows/test.yml
- Run tests
- Check coverage
- Build project
- Deploy on success
```

---

## Final Verification

Run this complete check:
```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm install

# 2. Check formatting
npm run lint

# 3. Build
npm run build

# 4. Run tests
npm test

# 5. Start dev server
npm run dev

# 6. Manual testing in browser
# http://localhost:3001
```

If all above pass, you're ready! ✅
