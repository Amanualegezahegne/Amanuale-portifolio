# Implementation Plan: Portfolio Redesign

## Overview

Refactor the existing React 19 + Vite portfolio in-place: extend the design-token system, add three shared hooks, create one sub-component, and update every page and shared component. All animations are CSS `@keyframes` + native `IntersectionObserver`; no new runtime dependencies except `fast-check` for tests.

---

## Tasks

- [x] 1. Install test dependencies and extend design tokens
  - [x] 1.1 Install fast-check and Vitest testing libraries
    - Run `npm install --save-dev fast-check vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/jest-dom`
    - Add `"test": "vitest run"` script to `package.json`
    - Add `vitest.config.js` (or update `vite.config.js`) with `environment: 'jsdom'` and `setupFiles`
    - _Requirements: Testing Strategy (design doc)_

  - [x] 1.2 Add design tokens and global utility classes to `src/css/index.css`
    - Append 11 new CSS custom properties to `:root`: `--shadow-card`, `--shadow-glow`, `--shadow-heavy`, `--radius-card`, `--radius-pill`, `--radius-sm`, `--glass-bg`, `--glass-border`, `--cursor-color`, `--font-mono` (JetBrains Mono stack), `--terminal-prompt` (lime `#a3e635`), `--terminal-bg`
    - Add `@import` for `JetBrains Mono` from Google Fonts alongside existing Outfit/Inter imports
    - Add `.reveal-item` utility class (`opacity:0`, `transform: translateY(30px)`, `transition: opacity 600ms ease, transform 600ms ease`, `transition-delay: var(--reveal-delay, 0ms)`)
    - Add `.reveal-item.is-visible` final state (`opacity:1`, `transform:none`)
    - Add global `:focus-visible` outline using `var(--accent-color)`
    - Add `@media (prefers-reduced-motion: reduce)` block that kills all animations and forces reveal items visible
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.4, 3.5, 10.4, 10.5_


- [x] 2. Implement shared hooks
  - [x] 2.1 Create `src/hooks/useScrollReveal.js`
    - Check `window.matchMedia('(prefers-reduced-motion: reduce)')` at mount; if true, add `reveal-item` + `is-visible` immediately and skip observer
    - For each ref at index `i`: add class `reveal-item`, set `--reveal-delay` to `i * staggerMs + 'ms'`
    - Create one `IntersectionObserver` with configurable `threshold` (default 0.15); on `isIntersecting`, add `is-visible` and unobserve
    - Disconnect observer on unmount
    - Guard against null refs and missing `IntersectionObserver` API
    - _Requirements: 3.1, 3.3, 3.4, 3.5_

  - [ ]* 2.2 Write property test for `useScrollReveal` — Property 1: `is-visible` class
    - **Property 1: Scroll reveal adds `is-visible` class**
    - **Validates: Requirements 3.1**
    - Generate arrays of 1–10 mock DOM elements; simulate IntersectionObserver callback with `isIntersecting: true`; assert each element's classList contains `is-visible`
    - Tag: `// Feature: portfolio-redesign, Property 1: is-visible class`
    - File: `src/hooks/__tests__/useScrollReveal.test.js`

  - [ ]* 2.3 Write property test for `useScrollReveal` — Property 2: stagger delay
    - **Property 2: Scroll reveal stagger delay is index-proportional**
    - **Validates: Requirements 3.3**
    - Generate array length 1–20, stagger values 50–200 ms; assert `--reveal-delay` on element at index `i` equals `i × staggerMs + 'ms'`
    - Tag: `// Feature: portfolio-redesign, Property 2: stagger delay`
    - File: `src/hooks/__tests__/useScrollReveal.test.js`

  - [x] 2.4 Create `src/hooks/useTypedEffect.js`
    - Accept `strings[]` and `speed` (default 80 ms)
    - Guard against empty array; return `''` with no interval if empty
    - State: `{ text, sIdx, cIdx, deleting }`; interval appends/removes one character per tick; pause 1500 ms at full string before deleting; advance `sIdx` when empty
    - Default strings for hero: `['Software Engineering Student', 'Full-Stack Developer', 'Problem Solver', 'Open Source Enthusiast']`
    - If `prefers-reduced-motion`, rotate full strings every 3 s without character animation
    - Clear interval on unmount
    - _Requirements: 4.3_

  - [ ]* 2.5 Write property test for `useTypedEffect` — Property 5: typed cycling
    - **Property 5: Typed effect cycles through all strings**
    - **Validates: Requirements 4.3**
    - Generate arrays of 1–5 non-empty strings; run hook at speed 1 ms (accelerated via fake timers); assert each string appears in full at least once before re-cycling
    - Tag: `// Feature: portfolio-redesign, Property 5: typed cycling`
    - File: `src/hooks/__tests__/useTypedEffect.test.js`

  - [x] 2.6 Create `src/hooks/useActiveSection.js`
    - Accept `sectionIds[]`; initialize state to `sectionIds[0]`
    - Create `IntersectionObserver` with `threshold: 0`, `rootMargin: '-60px 0px -40% 0px'`
    - Observe each `document.getElementById(id)` (guard null)
    - On `isIntersecting === true`, set active to `entry.target.id`
    - Disconnect on unmount
    - _Requirements: 5.1_

  - [ ]* 2.7 Write property test for `useActiveSection` — Property 7: active section tracking
    - **Property 7: Active section tracks the intersecting section**
    - **Validates: Requirements 5.1**
    - Generate arrays of 2–6 unique section IDs; mock IntersectionObserver; fire `isIntersecting: true` for a random element; assert hook returns that element's id
    - Tag: `// Feature: portfolio-redesign, Property 7: active section`
    - File: `src/hooks/__tests__/useActiveSection.test.js`


- [ ] 3. Checkpoint — hooks and tokens
  - Ensure all hook tests pass (`npx vitest run src/hooks`). Ask the user if any questions arise before continuing to components.

- [x] 4. Create `SkillBar` sub-component
  - [x] 4.1 Create `src/Components/SkillBar.jsx`
    - Accept props: `label` (string), `percent` (number 0–100), `isVisible` (boolean)
    - Render outer `.skill-bar-item`, header row with `.skill-label` and `.skill-percent`, track div `.skill-track`, fill div `.skill-fill`
    - Set `width: isVisible ? \`${percent}%\` : '0%'` on `.skill-fill` inline style
    - Add `role="progressbar"`, `aria-valuenow`, `aria-valuemin={0}`, `aria-valuemax={100}`, `aria-label={\`${label} proficiency\`}`
    - Add `.skill-track` and `.skill-fill` CSS to `src/css/About.css` (height 8px, gradient fill, `transition: width 800ms ease-out`)
    - _Requirements: 6.1, 6.2, 10.3_

  - [ ]* 4.2 Write property test for `SkillBar` — Property 6: fill width matches percent
    - **Property 6: Skill bar fill width matches percent**
    - **Validates: Requirements 6.2**
    - Generate integers 0–100 for `percent`, boolean for `isVisible`; render component; assert fill `width` style is `percent + '%'` when visible, `'0%'` when not
    - Tag: `// Feature: portfolio-redesign, Property 6: skill bar fill width`
    - File: `src/Components/__tests__/SkillBar.test.jsx`

  - [ ]* 4.3 Write unit tests for `SkillBar`
    - Test that label text renders, percent text renders, `progressbar` role is present
    - Test edge values: `percent=0`, `percent=100`, `isVisible=false`
    - _Requirements: 6.1, 6.2_


- [ ] 5. Redesign Navbar component
  - [ ] 5.1 Update `src/Components/Navbar.jsx`
    - Replace logo text with `"AG."` styled with the existing gradient class
    - Add `scrolled` state: attach `scroll` event listener in `useEffect`; set `scrolled = true` when `window.scrollY > 50`; clean up on unmount
    - Import and call `useActiveSection(['Home','About','Projects','Contact'])`; apply `active-link` class to matching `<a>` elements
    - Update hamburger `<button>` to toggle `open` class on its three `.bar` spans and add `aria-label="Toggle navigation menu"`
    - Close mobile menu (`setIsOpen(false)`) on nav link click
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ] 5.2 Update `src/css/Navbar.css`
    - Add `.navbar.scrolled` rule: `background: rgba(13,22,32,0.95)`, `box-shadow: 0 4px 24px rgba(0,0,0,0.4)`, `transition: all 300ms ease`
    - Add `.nav-links a.active-link` rule: `color: var(--accent-color)`, underline indicator `width: 100%`
    - Add hamburger X animation rules: `.hamburger.open .bar-1` rotate 45°, `.hamburger.open .bar-2` `opacity:0`, `.hamburger.open .bar-3` rotate -45°, all over 300ms
    - Add `@keyframes navbarSlideDown` and apply to `.navbar`
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ]* 5.3 Write unit tests for Navbar
    - Test: logo text is "AG."; `scrolled` class applied when scrollY > 50; `active-link` class on correct link; hamburger `open` class toggles; mobile menu closes on link click
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_


- [ ] 6. Redesign Home / Hero section
  - [ ] 6.1 Update `src/Pages/Home.jsx`
    - Import and call `useTypedEffect(['Software Engineering Student','Full-Stack Developer','Problem Solver','Open Source Enthusiast'], 80)`; bind result to `displayedText`
    - Replace greeting badge with a `.terminal-badge` element: `$ whoami → software-engineer` using spans `.terminal-prompt`, `.terminal-cmd`, `.terminal-arrow`, `.terminal-output`
    - Wrap developer name in `<span className="gradient-name">` inside `<h1>`
    - Add `.hero-role` paragraph with `<span className="typed-text">{displayedText}</span>` and `<span className="typed-cursor" aria-hidden="true">|</span>`
    - Update hero subtext to: "4th-year Software Engineering student at Debre Birhan University. Building full-stack web apps and turning complex problems into elegant solutions."
    - Add `.image-glow-ring` `<div aria-hidden="true" />` inside `.home-image`
    - Replace single CTA with two CTAs in `.hero-ctas`: primary `<a href="#Projects">View My Work</a>` and secondary `<a href="/cv.pdf" download>Download CV</a>`
    - Update image `alt` to `"Amanuale Gezahegn — Software Engineering Student"`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.6, 10.3_

  - [ ] 6.2 Update `src/css/Home.css`
    - Add `.terminal-badge` styles: `font-family: var(--font-mono)`, `background: var(--terminal-bg)`, `border: 1px solid rgba(163,230,53,0.3)`, `border-radius: var(--radius-sm)`, `padding: 6px 14px`, `display: inline-flex`, `gap: 8px`, `font-size: 0.85rem`
    - Add `.terminal-prompt` (color `var(--terminal-prompt)` — lime green), `.terminal-cmd` (accent color), `.terminal-arrow` (text-secondary), `.terminal-output` (text-primary)
    - Add `.gradient-name` with gradient text effect
    - Add `.hero-role` (font-size 1.4rem, min-height 2rem), `.typed-cursor` with `@keyframes blink`
    - Add `.hero-ctas` flex layout (gap 16px, flex-wrap); `.btn-secondary` ghost button style
    - Add `.image-glow-ring` + `@keyframes glowPulse`; `.home-image img` `@keyframes floatImage`
    - Add `@keyframes fadeInUp` with staggered `animation-delay` on all hero elements
    - Add responsive rules: ≤768px column layout, center text, vertical CTA stack
    - _Requirements: 2.1, 2.2, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

  - [ ]* 6.3 Write unit tests for Home / Hero
    - Test: `.hero-badge` renders; `.typed-cursor` element present; two CTA buttons render; image has non-empty `alt`; `download` attribute on CV button
    - _Requirements: 4.1, 4.3, 4.4, 4.6_


- [ ] 7. Redesign About section
  - [ ] 7.1 Update `src/Pages/About.jsx`
    - Import `SkillBar` from `src/Components/SkillBar.jsx`
    - Define `SKILLS` constant: HTML 90%, CSS 85%, JavaScript 80%, React 82%, Node.js 70%, MongoDB 65%, Python 60%, Git 78%
    - Add `skillsRef` and `skillsVisible` state; set up a dedicated `IntersectionObserver` on `skillsRef` that sets `skillsVisible = true` once and disconnects
    - Create `cardRefs` array (3 refs); call `useScrollReveal(cardRefs)` for staggered card reveals
    - Replace existing skills text card with `<div className="skill-bars">` mapping `SKILLS` to `<SkillBar … isVisible={skillsVisible} />`
    - Update bio text to: "Hi, I'm **Amanuale Gezahegn**, a 4th-year Software Engineering student at Debre Birhan University, focused on building full-stack web applications."
    - Add `.image-accent-border` child `<div aria-hidden="true" />` inside `.about-image`
    - Add "Download CV" `<a href="/cv.pdf" download className="btn btn-secondary download-cv">` below bio paragraphs
    - Apply `ref`, `reveal-item` class, and `--reveal-delay` style to each card `<div>`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 10.3_

  - [ ] 7.2 Update `src/css/About.css`
    - Add `.image-accent-border` absolute positioning with 4px accent-color border + glow shadow
    - Add `.card:hover` left-border accent rule (`border-left: 3px solid var(--accent-color)`)
    - Add `.download-cv` spacing (margin 20px 0)
    - Add `.skill-bars` flex column layout (gap 12px)
    - Ensure `.skill-track` and `.skill-fill` CSS is present (from Task 4.1 — consolidate here)
    - Add responsive rules: ≤768px column layout, image centered; ≤320px label font-size
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 7.3 Write unit tests for About section
    - Test: 7 SkillBar instances render; Download CV link has `download` attribute; `.image-accent-border` element present; cards have `reveal-item` class
    - _Requirements: 6.1, 6.3, 6.4_


- [ ] 8. Redesign Projects section
  - [ ] 8.1 Update project data and filter logic in `src/Pages/Projects.jsx`
    - Add `category: 'Web' | 'Backend' | 'Other'` and `tags: string[]` fields to each existing project (per design table: Portfolio→Web/[React,CSS,Vite], Quiz→Web/[React,MongoDB,Node.js], Hotel→Web/[HTML,CSS,JS], Sweetbee→Web/[HTML,CSS,JS], Ankesebirhan→Web/[React,CSS], SpamFilter→Other/[Python,ML], ProjectMgmt→Backend/[React,Node.js,MongoDB], ToDo→Web/[HTML,CSS,JS], KotlinGradle→Backend/[Kotlin,Gradle])
    - Add `activeCategory` state (default `'All'`) and `CATEGORIES = ['All','Web','Backend','Other']` constant
    - Replace existing filter with combined filter: category match AND search query match (`title`, `description`, or any `tags` entry, case-insensitive)
    - _Requirements: 7.1, 7.2, 7.3, 7.5_

  - [ ]* 8.2 Write property test for Projects filter — Property 3: category filter
    - **Property 3: Category filter includes only matching projects**
    - **Validates: Requirements 7.2**
    - Generate random project arrays and random `activeCategory` from `{'All','Web','Other'}`; assert all results have `category === activeCategory || activeCategory === 'All'`
    - Tag: `// Feature: portfolio-redesign, Property 3: category filter`
    - File: `src/Pages/__tests__/Projects.filter.test.js`

  - [ ]* 8.3 Write property test for Projects filter — Property 4: combined filter
    - **Property 4: Combined filter satisfies both category and search predicates**
    - **Validates: Requirements 7.5**
    - Generate random projects, random `activeCategory`, and random non-empty `searchQuery`; assert every result matches both predicates simultaneously
    - Tag: `// Feature: portfolio-redesign, Property 4: combined filter`
    - File: `src/Pages/__tests__/Projects.filter.test.js`

  - [ ] 8.4 Update Projects JSX and CSS
    - Add category filter tab bar `<div role="tablist">` with `<button role="tab" aria-selected={…}>` for each category (All/Web/Backend/Other) above the search input
    - Add `<div className="project-top-accent" aria-hidden="true" />` as first child of each `.project-card`
    - Add `<div className="tech-tags">` with `<span className="tech-tag">` pills (monospace font via `var(--font-mono)`) below description
    - Add `reveal-item` class and `--reveal-delay` style (80ms per index) to each project card
    - Update `src/css/Projects.css`: add `.filter-tabs` (flex, gap, overflow-x auto), `.filter-tab` pill style, `.filter-tab.active` gradient fill, `.project-top-accent` absolute top line that transitions `width: 0→100%` on card hover, `.tech-tags` flex-wrap layout, `.tech-tag` pill badge style
    - Add responsive rules: ≤768px single-column, filter tabs `white-space: nowrap` + horizontal scroll; ≤320px reduced tag font-size
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 10.2_

  - [ ]* 8.5 Write unit tests for Projects section
    - Test: three filter tabs render (All/Web/Other); selecting a tab updates `activeCategory`; tech tags render on a project card; `project-top-accent` element present; combined filter shows correct subset
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_


- [ ] 9. Checkpoint — components complete
  - Ensure all component and filter tests pass (`npx vitest run`). Ask the user if any questions arise before continuing to Contact and Footer.

- [ ] 10. Redesign Contact section
  - [ ] 10.1 Update `src/Pages/Contact.jsx`
    - Add `successVisible` state (boolean, default `false`); on successful submission set `successVisible = true` and call `setTimeout(() => setSuccessVisible(false), 5000)`
    - Define `CONTACT_INFO` constant array (FaEnvelope, FaPhone, FaLinkedin, FaGithub with href and label)
    - Render `.contact-info-row` above the form, mapping `CONTACT_INFO` to `<a>` elements with icon + label text and `aria-label`
    - Render `.form-banner.form-banner--success` (with FaCheckCircle) when `successVisible === true`
    - Render `.form-banner.form-banner--error` (with FaExclamationCircle, status message, "Try Again" button) when `status === 'error'`
    - Switch all form field `<div>` wrappers to `.field-group` with floating-label pattern: `placeholder=" "` (single space) on inputs/textarea, `<label>` as next sibling
    - Replace submit button content with spinner + "Sending…" when `isSubmitting === true`
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ] 10.2 Update `src/css/Contact.css`
    - Add `.contact-info-row` flex centered layout; `.contact-info-link` column flex with hover scale 1.2× + accent glow drop-shadow
    - Add `.field-group` relative positioning; label absolute inside field, transitions to floating-small state on `:focus` or `:not(:placeholder-shown)`
    - Add `.form-banner` base, `.form-banner--success` green tint, `.form-banner--error` red tint + inline dismiss button
    - Add `.spinner` keyframe `spin` (0.8s linear infinite), inline `width:16px height:16px` border spinner
    - Add responsive rules: ≤768px info row gap 16px; ≤480px wraps to 2-per-row
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ]* 10.3 Write unit tests for Contact section
    - Test: 4 contact info links render with `aria-label`; spinner renders when `isSubmitting=true`; success banner renders when `successVisible=true` and auto-dismisses after 5000ms (fake timers); error banner persists with "Try Again"; floating label structure (`.field-group` + sibling `<label>`)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_


- [ ] 11. Redesign Footer component
  - [ ] 11.1 Update `src/Components/Footer.jsx`
    - Replace existing markup with three-row centered layout inside `.footer-inner`: row 1 = `.footer-name` ("Amanuale Gezahegn"), row 2 = `.footer-tagline`, row 3 = `.footer-icons` with all social icon links (FaEnvelope, FaPhone, FaLinkedin, FaGithub, FaTelegram, FaInstagram)
    - Ensure every icon link has an `aria-label` attribute; add `aria-hidden="true"` to icon elements
    - Add "Back to Top" `<button>` with `onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}` and `aria-label="Back to top"`
    - Keep copyright paragraph with `{new Date().getFullYear()}`
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 10.3_

  - [ ] 11.2 Update `src/css/Footer.css`
    - Apply glassmorphism to `footer`: `backdrop-filter: blur(12px)`, `background: var(--glass-bg)`, `border-top: 1px solid var(--glass-border)`
    - Style `.footer-inner` as flex column, centered, max-width 1200px, gap 12px
    - Style `.footer-name` (Outfit 700, 1.1rem) and `.footer-tagline` (0.9rem, text-secondary)
    - Style `.footer-icons` flex row with gap 24px; `.footer-icon` hover: scale 1.2×, accent color, drop-shadow glow, 300ms transition
    - Style `.back-to-top` pill button (transparent bg, accent border on hover)
    - Add responsive rules: ≤480px icon size 1.5rem; ≤320px tagline 0.8rem
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ]* 11.3 Write unit tests for Footer
    - Test: footer name text renders; tagline renders; Back to Top button calls `window.scrollTo`; copyright year is current year; all social links have `aria-label`
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 10.3_


- [ ] 12. Responsive and accessibility audit
  - [ ] 12.1 Verify design token coverage and accessibility attributes
    - Grep all CSS files (excluding `index.css`) to confirm no hardcoded hex color values remain outside `index.css`; fix any violations
    - Confirm `:root` in `index.css` has ≥ 12 custom properties and the `@media (prefers-reduced-motion: reduce)` block is present
    - Confirm every icon-only `<a>` and `<button>` across all components has a non-empty `aria-label`; confirm all `<img>` have non-empty `alt`
    - Confirm `:focus-visible` outline rule exists in `index.css`
    - _Requirements: 1.1, 1.2, 2.4, 3.5, 10.3, 10.4, 10.5_

  - [ ] 12.2 Verify responsive breakpoints with automated layout tests
    - Write smoke tests that render the App at viewport widths 320px, 480px, 768px, 1024px, 1440px using jsdom and assert no critical layout elements are missing (nav, sections, footer) and filter tabs container has `overflow-x: auto` at ≤768px
    - _Requirements: 10.1, 10.2_

- [ ] 13. Final checkpoint — all tests pass
  - Run `npx vitest run` and confirm all tests (unit + property) pass with zero failures. Ask the user if any questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints (Tasks 3, 9, 13) ensure incremental validation before moving to the next phase
- Property tests use fast-check with `numRuns: 100`; each test is tagged with `// Feature: portfolio-redesign, Property N: <text>`
- Unit tests use Vitest + Testing Library; run with `npx vitest run`
- All CSS color values must go through `var(--…)` tokens — no hardcoded hex outside `index.css`
- The `useScrollReveal` hook adds the `reveal-item` class programmatically; elements do not need it in JSX beforehand
- Floating labels rely on CSS `:not(:placeholder-shown)` with `placeholder=" "` (single space) — no JS required for the label transition


## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "2.4", "2.6"] },
    { "id": 2, "tasks": ["2.2", "2.3", "2.5", "2.7", "4.1"] },
    { "id": 3, "tasks": ["4.2", "4.3", "5.1", "6.1", "8.1"] },
    { "id": 4, "tasks": ["5.2", "5.3", "6.2", "7.1", "8.2", "8.3"] },
    { "id": 5, "tasks": ["6.3", "7.2", "8.4", "10.1", "11.1"] },
    { "id": 6, "tasks": ["7.3", "8.5", "10.2", "11.2"] },
    { "id": 7, "tasks": ["10.3", "11.3"] },
    { "id": 8, "tasks": ["12.1", "12.2"] }
  ]
}
```
