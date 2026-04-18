# Implementation Plan

## Phase 1: Exploratory Bug Condition Testing

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Centered Layout Missing on Music, Live Shows, and About Pages
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: For deterministic bugs, scope the property to the concrete failing case(s) to ensure reproducibility
  - Test implementation details from Bug Condition in design:
    - Music page should have `flex flex-col items-center justify-center` classes
    - Live shows page should have `flex flex-col items-center justify-center` classes
    - About page should have `flex flex-col items-center justify-center` classes
    - All pages should have `max-w-4xl` wrapper constraint
    - All pages should have `p-4 md:p-6` responsive padding (not `p2 md:p-3`)
  - The test assertions should match the Expected Behavior Properties from design
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found to understand root cause:
    - Music page renders with `p2 md:p-3` instead of `p-4 md:p-6`
    - Live shows page renders with `p2 md:p-3` instead of `p-4 md:p-6`
    - About page renders with `p2 md:p-3` instead of `p-4 md:p-6`
    - None of the pages have flex centering applied
    - None of the pages have max-width constraint wrapper
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

## Phase 2: Preservation Testing

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Home Page and Other Pages Maintain Existing Layout
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs:
    - Home page (HeroSection) renders with `flex flex-col items-center justify-center p-4 md:p-6` and `max-w-4xl` wrapper
    - Privacy policy page renders without changes
    - Embedded content (Bandcamp iframes, YouTube embeds, Bandsintown widget) displays correctly
    - Semantic HTML structure (article, section, h1, h2) is preserved
    - Page metadata (title, description, canonical URLs) is unchanged
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements:
    - Home page layout remains centered with flex centering
    - Embedded iframes maintain their dimensions and styling
    - Semantic HTML elements maintain their structure
    - Navigation between pages continues to work
    - Responsive behavior at different viewport sizes is preserved
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

## Phase 3: Implementation

- [x] 3. Fix centered layout for music, live-shows, and about pages

  - [x] 3.1 Apply centered layout to music page
    - Update `src/app/music/page.tsx`
    - Add `flex flex-col items-center justify-center` to outer article element
    - Wrap content in div with `max-w-4xl` class
    - Update responsive padding from `p2 md:p-3` to `p-4 md:p-6` on outer article
    - Adjust nested article elements to remove conflicting padding (change `p-2 md:p-3` to no padding or inherit)
    - Ensure Bandcamp iframes remain properly constrained within centered layout
    - Ensure YouTube embed remains properly centered within max-width constraint
    - _Bug_Condition: isBugCondition(input) where input.route = '/music' AND NOT hasFlexCentering AND NOT hasMaxWidthConstraint AND NOT hasResponsivePadding_
    - _Expected_Behavior: Music page renders with flex centering, max-width constraint, and responsive padding matching home page pattern_
    - _Preservation: Semantic HTML structure, embedded iframes, page metadata, and navigation functionality remain unchanged_
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4_

  - [x] 3.2 Apply centered layout to live-shows page
    - Update `src/app/live-shows/page.tsx`
    - Add `flex flex-col items-center justify-center` to outer article element
    - Wrap content in div with `max-w-4xl` class
    - Update responsive padding from `p2 md:p-3` to `p-4 md:p-6` on outer article
    - Adjust nested article elements to remove conflicting padding (change `p2 md:p-3` to no padding or inherit)
    - Ensure Bandsintown widget is properly centered within max-width constraint
    - _Bug_Condition: isBugCondition(input) where input.route = '/live-shows' AND NOT hasFlexCentering AND NOT hasMaxWidthConstraint AND NOT hasResponsivePadding_
    - _Expected_Behavior: Live shows page renders with flex centering, max-width constraint, and responsive padding matching home page pattern_
    - _Preservation: Semantic HTML structure, Bandsintown widget functionality, page metadata, and navigation functionality remain unchanged_
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4_

  - [x] 3.3 Apply centered layout to about page
    - Update `src/app/about/page.tsx`
    - Add `flex flex-col items-center justify-center` to outer article element
    - Wrap content in div with `max-w-4xl` class
    - Update responsive padding from `p2 md:p-3` to `p-4 md:p-6` on outer article
    - Preserve semantic HTML for band members list and info sections
    - Ensure list structure and styling remain intact
    - _Bug_Condition: isBugCondition(input) where input.route = '/about' AND NOT hasFlexCentering AND NOT hasMaxWidthConstraint AND NOT hasResponsivePadding_
    - _Expected_Behavior: About page renders with flex centering, max-width constraint, and responsive padding matching home page pattern_
    - _Preservation: Semantic HTML structure, band member list, page metadata, and navigation functionality remain unchanged_
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4_

  - [x] 3.4 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Centered Layout Applied to All Pages
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - Verify all three pages (music, live-shows, about) now have:
      - `flex flex-col items-center justify-center` classes
      - `max-w-4xl` wrapper constraint
      - `p-4 md:p-6` responsive padding
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 3.5 Verify preservation tests still pass
    - **Property 2: Preservation** - Home Page and Other Pages Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - Verify home page layout remains unchanged
    - Verify embedded content (Bandcamp, YouTube, Bandsintown) displays correctly
    - Verify semantic HTML structure is preserved
    - Verify page metadata is unchanged
    - Verify navigation functionality works correctly
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

## Phase 4: Checkpoint

- [x] 4. Checkpoint - Ensure all tests pass
  - Verify all exploration tests pass (Property 1: Expected Behavior)
  - Verify all preservation tests pass (Property 2: Preservation)
  - Verify no regressions in existing functionality
  - Verify responsive behavior works correctly at all breakpoints (mobile, tablet, desktop)
  - Verify visual consistency across all pages (music, live-shows, about, home)
  - Ensure all tests pass, ask the user if questions arise
