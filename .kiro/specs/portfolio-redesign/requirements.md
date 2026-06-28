# Requirements Document

## Introduction

This feature redesigns the existing React + Vite portfolio website (Amanuale Gezahegn) to deliver a polished, developer-centric visual experience that clearly positions the owner as a software engineering student. The redesign covers all pages (Home, About, Projects, Contact) and shared components (Navbar, Footer). Goals are: a clean, technical aesthetic inspired by developer tooling (dark background, monospace accents, terminal-style details), smooth animations, and improved typography, spacing, and layout consistency across all viewports.

The project already uses React 19, Vite, `react-icons`, a dark-theme design-token system in `index.css`, and individual CSS files per page/component. The redesign must remain within this tech stack and must not break existing functionality (navigation, contact form submission, project search).

---

## Glossary

- **Portfolio_App**: The single-page React application as a whole.
- **Navbar**: The sticky top navigation bar component (`src/Components/Navbar.jsx`).
- **Hero_Section**: The `#Home` section containing the greeting text and profile image.
- **About_Section**: The `#About` section containing the bio text and cards.
- **Projects_Section**: The `#Projects` section containing the searchable project card grid.
- **Contact_Section**: The `#Contact` section containing the contact form.
- **Footer**: The bottom component containing social links.
- **Design_System**: The set of CSS custom properties defined in `src/css/index.css` (colors, typography, spacing, transition, gradients).
- **Scroll_Animation**: A CSS/JS-driven animation that triggers when an element enters the viewport during scrolling.
- **Page_Load_Animation**: An animation that plays once when the Portfolio_App first renders.
- **Hover_Effect**: A visual change applied to an interactive element when the pointer moves over it.
- **Intersection_Observer**: The browser API used to detect when elements enter or exit the viewport, enabling Scroll_Animations.
- **Glassmorphism**: A design style using semi-transparent backgrounds, backdrop blur, and subtle borders to create a "frosted glass" appearance.
- **Skill_Bar**: A visual progress indicator displaying proficiency level for a specific technical skill.
- **Typed_Effect**: An animation that simulates text being typed one character at a time.
- **Active_Link**: A Navbar link whose visual style indicates the currently visible section.
- **Terminal_Badge**: A small UI element styled to look like a terminal command prompt (e.g., `$ whoami`), used as decorative or labeling element.
- **Code_Accent**: Use of monospace font (`JetBrains Mono` or `Fira Code`) for specific UI details like badges, tags, and section labels to reinforce the developer aesthetic.

---

## Requirements

### Requirement 1: Design System Enhancement

**User Story:** As a visitor, I want a cohesive color palette and typography system throughout the site, so that the portfolio feels professional and polished.

#### Acceptance Criteria

1. THE Design_System SHALL define a minimum of 12 CSS custom properties covering background colors, accent colors, text colors, card styles, button gradients, transition timing, and shadow values.
2. WHEN any page or component uses a color, font size, or spacing value, THE Design_System SHALL be the single source of truth via CSS custom properties — no hardcoded hex values outside of `index.css`.
3. THE Portfolio_App SHALL use the `Outfit` font family for all headings (`h1`–`h3`), `Inter` for all body text and UI elements, and `JetBrains Mono` (or `Fira Code` as fallback) for Code_Accent elements such as tech tags, Terminal_Badge labels, and section number prefixes.
4. THE Design_System SHALL include a `--shadow-card`, `--shadow-glow`, and `--radius-card` token used consistently across all card elements.
5. WHEN the viewport width is 1200px or wider, THE Portfolio_App SHALL display content at a maximum container width of 1200px, horizontally centered with equal left and right padding.

---

### Requirement 2: Page-Load Animation Sequence

**User Story:** As a visitor, I want a polished entrance animation when the site first loads, so that the experience feels dynamic and engaging.

#### Acceptance Criteria

1. WHEN the Portfolio_App first renders, THE Hero_Section SHALL animate its heading, subtext, and call-to-action button sequentially with a staggered fade-in-upward motion, with each element delayed by 150ms from the previous.
2. WHEN the Portfolio_App first renders, THE Navbar SHALL fade in from the top within 400ms using a CSS `@keyframes` animation.
3. THE Page_Load_Animation SHALL run exactly once per page visit and SHALL NOT repeat on scroll or on navigation between sections.
4. IF a visitor has the operating system `prefers-reduced-motion` setting enabled, THEN THE Portfolio_App SHALL disable all Page_Load_Animations and Scroll_Animations, displaying content in its final visible state immediately.

---

### Requirement 3: Scroll-Triggered Reveal Animations

**User Story:** As a visitor, I want content to animate into view as I scroll down, so that each section feels alive and guides my attention naturally.

#### Acceptance Criteria

1. WHEN an element with a scroll-reveal class enters the viewport by at least 15% of its height, THE Intersection_Observer SHALL add an `is-visible` CSS class to that element, triggering a fade-in-upward animation over 600ms.
2. THE About_Section cards, Projects_Section project cards, and Contact_Section form SHALL each have the scroll-reveal behavior applied.
3. WHEN multiple sibling elements (e.g., About cards, project cards) are revealed, THE Portfolio_App SHALL stagger their animations with a 100ms delay increment per element index.
4. WHILE an element has not yet entered the viewport, THE Portfolio_App SHALL render it with `opacity: 0` and a 30px downward `translateY` offset to prepare the animation start state.
5. IF a visitor has the operating system `prefers-reduced-motion` setting enabled, THEN THE Portfolio_App SHALL display all scroll-reveal elements fully visible without animation.

---

### Requirement 4: Hero Section Redesign

**User Story:** As a visitor, I want the homepage hero section to make an immediate strong impression, so that I understand who this developer is within seconds.

#### Acceptance Criteria

1. THE Hero_Section SHALL display a Terminal_Badge above the main heading styled as a terminal prompt (e.g., `$ whoami → software-engineer`) with a monospace font, accent-colored `$` prefix, and a subtle border, replacing a generic greeting.
2. THE Hero_Section heading SHALL display the developer's name with a gradient text effect using the Design_System accent colors.
3. THE Hero_Section SHALL include a Typed_Effect on a role descriptor line cycling through software-engineering-specific titles: `"Software Engineering Student"`, `"Full-Stack Developer"`, `"Problem Solver"`, `"Open Source Enthusiast"` — looping continuously.
4. THE Hero_Section profile image SHALL be displayed with a circular or rounded-square clip, an accent-color animated border glow, and a subtle floating `translateY` animation that loops with a 4-second ease-in-out cycle.
5. WHEN the visitor hovers over the Hero_Section profile image, THE Hero_Section SHALL scale the image to 1.05× and intensify the glow shadow, completing the transition within 300ms.
6. THE Hero_Section SHALL include two call-to-action buttons: a primary "View My Work" button linking to `#Projects` and a secondary "Download CV" button, both aligned horizontally with a gap of at least 16px.
7. WHEN the viewport width is 768px or less, THE Hero_Section SHALL stack the text content above the image, center-align all text, and stack the two call-to-action buttons vertically.

---

### Requirement 5: Navbar Improvements

**User Story:** As a visitor, I want the navbar to clearly indicate my current position on the page and feel smooth to interact with, so that navigation is effortless.

#### Acceptance Criteria

1. WHEN a section's top edge is within 60px of the viewport top during scrolling, THE Navbar SHALL apply the `active` style to the corresponding navigation link, changing its color to `var(--accent-color)` and making its underline indicator fully visible.
2. WHEN the visitor scrolls more than 50px from the top, THE Navbar SHALL increase its background opacity from 75% to 95% and add a stronger `box-shadow` beneath it, completing the transition within 300ms.
3. THE Navbar logo text SHALL display as "AG." using a gradient matching the Design_System accent, replacing the current "My Portfolio" text.
4. WHEN the hamburger menu is open on mobile, THE Navbar SHALL animate each bar: the top bar SHALL rotate 45°, the middle bar SHALL fade out, and the bottom bar SHALL rotate −45°, forming an "×" icon over 300ms.
5. WHEN a mobile navigation link is tapped, THE Navbar SHALL close the mobile menu and smoothly scroll to the target section.

---

### Requirement 6: About Section Improvements

**User Story:** As a visitor, I want the About section to display skills and background in a visually engaging way, so that I get a clear picture of the developer's capabilities.

#### Acceptance Criteria

1. THE About_Section SHALL replace the plain skills text card with a Skill_Bar grid showing each skill (HTML, CSS, JavaScript, React, Node.js, MongoDB, Python, Git) with a named label in Code_Accent monospace font and an animated horizontal fill bar indicating relative proficiency.
2. WHEN the About_Section enters the viewport, THE Skill_Bar fill animation SHALL play, growing from 0% width to the defined proficiency percentage over 800ms using a CSS `ease-out` transition.
3. THE About_Section SHALL include a "Download CV" button below the bio text, styled as a secondary button using the Design_System tokens.
4. THE About_Section image SHALL display with an accent-colored decorative border or offset shadow effect that visually separates it from the background.
5. WHEN the visitor hovers over an About_Section card, THE About_Section SHALL apply a subtle left border accent line (3px, `var(--accent-color)`) in addition to the existing lift and glow effect.
6. THE About_Section bio text SHALL reference the developer's identity as a Software Engineering student at Debre Birhan University, 4th year, with a focus on full-stack web development.

---

### Requirement 7: Projects Section Improvements

**User Story:** As a visitor, I want the projects section to present my work clearly with filtering options and smooth interactions, so that I can explore projects easily.

#### Acceptance Criteria

1. THE Projects_Section SHALL display a category filter tab bar above the project grid with at least four tabs: "All", "Web", "Backend", and "Other", allowing visitors to filter cards by project type.
2. WHEN a filter tab is selected, THE Projects_Section SHALL fade out non-matching cards and fade in matching cards over 300ms without a full page re-render.
3. THE project cards SHALL each display a tech stack tag row (e.g., `React`, `Node.js`, `MongoDB`) below the description, styled as Code_Accent pill badges using monospace font and the Design_System accent color.
4. WHEN the visitor hovers over a project card, THE Projects_Section SHALL reveal a subtle top accent line (2px solid `var(--accent-color)`) animating from left to right over 300ms.
5. THE search input and filter tabs SHALL work in combination: WHEN both a filter tab and a search query are active, THE Projects_Section SHALL show only cards matching both criteria simultaneously.

---

### Requirement 8: Contact Section Improvements

**User Story:** As a visitor, I want the contact section to feel welcoming and provide visual feedback as I interact with the form, so that I am confident my message will be sent.

#### Acceptance Criteria

1. THE Contact_Section SHALL display a row of direct contact method icons (email, phone, LinkedIn, GitHub) above the form as clickable links, each with a Hover_Effect that scales to 1.2× and applies an accent glow.
2. WHEN the visitor focuses on a form field, THE Contact_Section SHALL animate a label transitioning from placeholder-style text inside the field to a smaller label floating above the field border over 200ms (floating label pattern).
3. THE Contact_Section submit button SHALL display a loading spinner icon replacing the "Send Message" text while the form is in the `isSubmitting` state.
4. WHEN the form submission succeeds, THE Contact_Section SHALL display a full-width animated success banner with a checkmark icon that auto-dismisses after 5000ms.
5. IF the form submission fails, THEN THE Contact_Section SHALL display an error banner with a descriptive message and a "Try Again" action, persisting until the visitor dismisses it or retries.

---

### Requirement 9: Footer Improvements

**User Story:** As a visitor, I want the footer to display clearly with social links that are easy to find and interact with.

#### Acceptance Criteria

1. THE Footer SHALL display the developer's name, a brief tagline, and the social icon row in a three-row centered layout.
2. WHEN the visitor hovers over a social icon, THE Footer SHALL scale the icon to 1.2× and apply a color transition to `var(--accent-color)` with a drop-shadow glow, completing the transition within 300ms.
3. THE Footer SHALL include a "Back to Top" button that, WHEN clicked, SHALL smoothly scroll the viewport to the top of the page.
4. THE Footer background SHALL use Glassmorphism styling with `backdrop-filter: blur(12px)` and a semi-transparent `var(--bg-color)` base.

---

### Requirement 10: Responsive Design and Accessibility

**User Story:** As a visitor on any device, I want the portfolio to look and function correctly, so that I have a seamless experience regardless of screen size or accessibility needs.

#### Acceptance Criteria

1. THE Portfolio_App SHALL render correctly and maintain all layouts at viewport widths of 320px, 480px, 768px, 1024px, and 1440px without horizontal overflow or broken grid structures.
2. WHEN the viewport width is 768px or less, THE Projects_Section cards SHALL stack into a single-column layout and the filter tabs SHALL scroll horizontally if they overflow the viewport width.
3. THE Portfolio_App SHALL achieve a minimum Lighthouse accessibility score of 80, with all interactive elements having accessible labels or `aria-label` attributes, and all images having non-empty `alt` text.
4. WHEN the visitor navigates using a keyboard, THE Navbar links, Footer icons, and form fields SHALL receive a visible `:focus-visible` outline styled with `var(--accent-color)`.
5. IF a visitor has the operating system `prefers-reduced-motion` setting enabled, THEN THE Portfolio_App SHALL not play any CSS or JS-driven animations, as specified in Requirements 2 and 3.
