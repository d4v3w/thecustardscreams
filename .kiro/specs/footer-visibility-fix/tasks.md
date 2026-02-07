# Footer Visibility Fix - Implementation Tasks

## Task List

- [x] 1. Update LayoutClient to include Footer component
  - [x] 1.1 Import Footer component in LayoutClient
  - [x] 1.2 Wrap children and Footer in container with pb-24 padding
  - [x] 1.3 Ensure Footer renders after children content

- [x] 2. Remove Footer from home page
  - [x] 2.1 Remove Footer import from src/app/page.tsx
  - [x] 2.2 Remove Footer component and wrapper div from page.tsx JSX

- [x] 3. Test footer visibility on all pages
  - [x] 3.1 Verify footer appears on home page
  - [x] 3.2 Verify footer appears on music page
  - [x] 3.3 Verify footer appears on live-shows page
  - [x] 3.4 Verify footer appears on about page
  - [x] 3.5 Test footer visibility when scrolled to bottom on each page

- [x] 4. Verify bottom navigation clearance
  - [x] 4.1 Check footer is not obscured by bottom nav on desktop
  - [x] 4.2 Check footer is not obscured by bottom nav on mobile
  - [x] 4.3 Verify all footer links are clickable

- [x] 5. Visual regression testing
  - [x] 5.1 Compare footer styling across all pages
  - [x] 5.2 Verify consistent spacing from content above
  - [x] 5.3 Check home page scroll-snap behavior still works

## Task Details

### Task 1: Update LayoutClient to include Footer component
**File:** `src/app/LayoutClient.tsx`

**Changes:**
1. Add import: `import Footer from "~/components/Footer";`
2. Wrap the return JSX to include Footer with proper padding
3. Structure: `<div className="pb-24">{children}<Footer /></div>`

**Acceptance:**
- Footer component is imported
- Footer renders after children
- Container has pb-24 class for bottom clearance

### Task 2: Remove Footer from home page
**File:** `src/app/page.tsx`

**Changes:**
1. Remove `import Footer from "~/components/Footer";`
2. Remove the footer JSX block:
   ```tsx
   {/* Footer - outside scroll-snap flow */}
   <div className="pb-20">
     <Footer />
   </div>
   ```

**Acceptance:**
- No Footer import in page.tsx
- No Footer component rendered in page.tsx
- No duplicate footer on home page

### Task 3: Test footer visibility on all pages
**Testing:**
- Navigate to each page route
- Scroll to bottom
- Verify footer is present and visible

**Pages to test:**
- `/` (home)
- `/music`
- `/live-shows`
- `/about`

**Acceptance:**
- Footer visible on all pages
- Footer content (social links, copyright) fully readable
- No console errors

### Task 4: Verify bottom navigation clearance
**Testing:**
- Check footer positioning relative to bottom nav
- Test on different viewport sizes
- Verify interactive elements work

**Acceptance:**
- Footer content not overlapped by bottom nav
- All footer links are clickable
- Adequate spacing between footer and bottom nav

### Task 5: Visual regression testing
**Testing:**
- Compare footer appearance across pages
- Verify home page sections still work
- Check overall layout consistency

**Acceptance:**
- Footer styling consistent across all pages
- Home page scroll-snap behavior unchanged
- No layout shifts or visual bugs
