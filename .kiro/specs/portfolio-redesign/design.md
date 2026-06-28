# Design Document — Portfolio Redesign

## Overview

This document describes the technical design for the portfolio-redesign feature. The existing React 19 + Vite SPA is refactored in-place: every component file is modified but none are deleted or renamed, no router is introduced, and no new npm packages are required. All new animations are driven by CSS `@keyframes` and the native `IntersectionObserver` API. Three new shared hooks (`useScrollReveal`, `useTypedEffect`, `useActiveSection`) are added to `src/hooks/`. Design tokens in `index.css` are extended but backwards-compatible.

The end result is a polished, developer-centric dark-theme portfolio that clearly positions Amanuale as a Software Engineering student — with terminal-style UI accents, monospace code fonts for tech tags and badges, SE-specific role titles, and a technical aesthetic inspired by developer tooling. It includes page-load animations, scroll-triggered reveals, an enhanced hero section, category-filtered projects, floating-label contact form, and an improved footer — all fully responsive from 320 px to 1440 px and respecting `prefers-reduced-motion`.

---

## Architecture

### Component Tree (after redesign)

```
App
├── Navbar          ← scroll + activeSection state, hamburger X animation
├── Home (Hero)     ← terminal badge, typed SE role, floating image, two CTAs
├── About           ← SkillBar sub-component, Download CV, decorative image
├── Projects        ← category tabs (All/Web/Backend/Other) + search, tech tag pills
├── Contact         ← contact info row, floating labels, spinner, auto-dismiss banner
└── Footer          ← three-row layout, Back to Top button, glassmorphism
```

No new page-level components are introduced. One sub-component is extracted:

- `src/Components/SkillBar.jsx` — renders a single labeled progress bar; used only inside `About.jsx`.

### New Shared Hooks

All three hooks live in `src/hooks/`:

| File | Hook | Purpose |
|---|---|---|
| `useScrollReveal.js` | `useScrollReveal(refs, options)` | IntersectionObserver → toggles `is-visible`, injects `--reveal-delay` |
| `useTypedEffect.js` | `useTypedEffect(strings, speed)` | Interval-based character cycling, no library |
| `useActiveSection.js` | `useActiveSection(sectionIds)` | IntersectionObserver → returns active section id string |

### New Shared CSS Utilities in `index.css`

- Additional design tokens (see next section).
- `.reveal-item` — universal initial animation state (`opacity:0`, `transform: translateY(30px)`).
- `.reveal-item.is-visible` — animated final state (`opacity:1`, `transform: none`, transition 600ms).
- `@media (prefers-reduced-motion: reduce)` block that resets all custom animations to `none` and forces reveal items visible.

---

## Design Token Additions

Add the following to the `:root` block in `src/css/index.css`. All existing tokens are preserved.

```css
/* Shadow system */
--shadow-card:  0 10px 30px rgba(0, 0, 0, 0.25);
--shadow-glow:  0 0 30px rgba(56, 189, 248, 0.25);
--shadow-heavy: 0 20px 50px rgba(0, 0, 0, 0.45);

/* Border radius system */
--radius-card:  16px;
--radius-pill:  999px;
--radius-sm:    8px;

/* Glassmorphism surface */
--glass-bg:     rgba(13, 22, 32, 0.6);
--glass-border: rgba(255, 255, 255, 0.07);

/* Typing cursor color */
--cursor-color: var(--accent-color);

/* Code / monospace accent font */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;

/* Terminal badge colors */
--terminal-prompt: #a3e635;   /* lime-green $ prompt */
--terminal-bg:     rgba(0, 0, 0, 0.4);
```

Total custom properties after addition: 26 (satisfies Requirement 1.1 ≥ 12).

---

## Components and Interfaces

### 3.1 `src/css/index.css`

**Changes:**
- Add the 9 new tokens listed above to `:root`.
- Add `.reveal-item` and `.reveal-item.is-visible` utility classes.
- Add `@media (prefers-reduced-motion: reduce)` block.

**New utility classes:**

```
.reveal-item
  opacity: 0
  transform: translateY(30px)
  transition: opacity 600ms ease, transform 600ms ease
  transition-delay: var(--reveal-delay, 0ms)

.reveal-item.is-visible
  opacity: 1
  transform: translateY(0)

@media (prefers-reduced-motion: reduce)
  .reveal-item, .reveal-item.is-visible
    opacity: 1
    transform: none
    transition: none
  *, *::before, *::after
    animation-duration: 0.01ms !important
    animation-iteration-count: 1 !important
    transition-duration: 0.01ms !important
```

---

### 3.2 `src/Components/Navbar.jsx` + `src/css/Navbar.css`

**State variables:**

| Name | Type | Initial | Purpose |
|---|---|---|---|
| `isOpen` | `boolean` | `false` | hamburger menu toggle (existing) |
| `scrolled` | `boolean` | `false` | true when `window.scrollY > 50` |
| `activeSection` | `string` | `""` | id of currently visible section |

`scrolled` is set via a `scroll` event listener in `useEffect` (add/remove on mount/unmount).  
`activeSection` comes from `useActiveSection(['Home','About','Projects','Contact'])`.

**Props:** none (unchanged).

**JSX structure changes:**

```
<nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
  <span className="logo">AG.</span>

  <div className={`nav-links ${isOpen ? 'active' : ''}`}>
    {['Home','About','Projects','Contact'].map(id => (
      <a href={`#${id}`}
         className={activeSection === id ? 'active-link' : ''}
         onClick={() => setIsOpen(false)}>
        {id}
      </a>
    ))}
  </div>

  <button className={`hamburger ${isOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu">
    <span className="bar bar-1" />
    <span className="bar bar-2" />
    <span className="bar bar-3" />
  </button>
</nav>
```

**New/changed CSS classes:**

| Class | Effect |
|---|---|
| `.navbar.scrolled` | `background: rgba(13,22,32,0.95)`, `box-shadow: 0 4px 24px rgba(0,0,0,0.4)` |
| `.logo` | text `"AG."`, gradient same as existing logo gradient |
| `.nav-links a.active-link` | `color: var(--accent-color)`, `::after { width: 100% }` |
| `.hamburger.open .bar-1` | `transform: translateY(7px) rotate(45deg)` |
| `.hamburger.open .bar-2` | `opacity: 0; transform: scaleX(0)` |
| `.hamburger.open .bar-3` | `transform: translateY(-7px) rotate(-45deg)` |

**Animation — Navbar page-load fade-from-top:**

```
@keyframes navbarSlideDown {
  from { transform: translateY(-100%); opacity: 0; }
  to   { transform: translateY(0);     opacity: 1; }
}
.navbar { animation: navbarSlideDown 400ms cubic-bezier(0.4,0,0.2,1) both; }
```

---

### 3.3 `src/Pages/Home.jsx` + `src/css/Home.css`

**State variables:**

| Name | Type | Initial | Purpose |
|---|---|---|---|
| `displayedText` | `string` | `""` | current typed role text |

`displayedText` is driven by `useTypedEffect(['Software Engineering Student', 'Full-Stack Developer', 'Problem Solver', 'Open Source Enthusiast'], 80)`.

**JSX structure:**

```
<section id="Home" className="home">
  <div className="home-content">

    <div className="intro">
      <div className="hero-badge terminal-badge">
        <span className="terminal-prompt">$</span>
        <span className="terminal-cmd">whoami</span>
        <span className="terminal-arrow">→</span>
        <span className="terminal-output">software-engineer</span>
      </div>

      <h1 className="hero-name">
        Hi, I'm <span className="gradient-name">Amanuale Gezahegn</span>
      </h1>

      <p className="hero-role">
        <span className="typed-text">{displayedText}</span>
        <span className="typed-cursor" aria-hidden="true">|</span>
      </p>

      <p className="hero-subtext">
        4th-year Software Engineering student at Debre Birhan University.
        Building full-stack web apps and turning complex problems into elegant solutions.
      </p>

      <div className="hero-ctas">
        <a href="#Projects" className="btn btn-primary">View My Work</a>
        <a href="/cv.pdf" download className="btn btn-secondary">Download CV</a>
      </div>
    </div>

    <div className="home-image">
      <div className="image-glow-ring" aria-hidden="true" />
      <img src={image} alt="Amanuale Gezahegn — Software Engineering Student" />
    </div>

  </div>
</section>
```

**New/changed CSS classes:**

| Class | Effect |
|---|---|
| `.hero-badge` | alias for `.terminal-badge` (see below) |
| `.terminal-badge` | `font-family: var(--font-mono)`, `background: var(--terminal-bg)`, `border: 1px solid rgba(163,230,53,0.3)`, `border-radius: var(--radius-sm)`, `padding: 6px 14px`, `display: inline-flex`, `gap: 8px`, `font-size: 0.85rem`, `margin-bottom: 20px` |
| `.terminal-prompt` | `color: var(--terminal-prompt)` (lime green) |
| `.terminal-cmd` | `color: var(--accent-color)` |
| `.terminal-arrow` | `color: var(--text-secondary)` |
| `.terminal-output` | `color: var(--text-primary)` |
| `.gradient-name` | `background: linear-gradient(135deg, #fff 30%, var(--accent-color))`, `-webkit-background-clip: text`, `-webkit-text-fill-color: transparent` |
| `.hero-role` | `font-size: 1.4rem`, `font-weight: 600`, `min-height: 2rem` (prevents layout shift) |
| `.typed-cursor` | `animation: blink 1s step-end infinite` |
| `.hero-ctas` | `display: flex`, `gap: 16px`, `flex-wrap: wrap` |
| `.btn-secondary` | `background: transparent`, `border: 1px solid var(--accent-color)`, `color: var(--accent-color)`, hover: fills with accent |
| `.home-image` | `position: relative` |
| `.image-glow-ring` | `position: absolute`, `inset: -6px`, `border-radius: inherit`, `border: 2px solid var(--accent-color)`, `animation: glowPulse 3s ease-in-out infinite` |
| `.home-image img` | `animation: floatImage 4s ease-in-out infinite` |

**Animations:**

```
@keyframes blink        { 50% { opacity: 0 } }
@keyframes glowPulse    { 0%,100% { box-shadow: 0 0 15px var(--accent-glow) }
                          50%      { box-shadow: 0 0 35px var(--accent-glow), 0 0 60px var(--accent-glow) } }
@keyframes floatImage   { 0%,100% { transform: translateY(0) }
                          50%      { transform: translateY(-12px) } }

/* Page-load stagger — applied directly via animation-delay */
.hero-badge     { animation: fadeInUp 500ms 0ms   both; }
.hero-name      { animation: fadeInUp 500ms 150ms both; }
.hero-role      { animation: fadeInUp 500ms 300ms both; }
.hero-subtext   { animation: fadeInUp 500ms 450ms both; }
.hero-ctas      { animation: fadeInUp 500ms 600ms both; }
.home-image     { animation: fadeInUp 500ms 200ms both; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

**Responsive (≤768 px):** `flex-direction: column`, text block first, image second, `text-align: center`, `.hero-ctas { flex-direction: column; align-items: center }`.

---

### 3.4 `src/Components/SkillBar.jsx` (new file)

A pure presentational component; no state.

**Props:**

| Prop | Type | Description |
|---|---|---|
| `label` | `string` | Skill name, e.g. `"React"` |
| `percent` | `number` | 0–100 proficiency value |
| `isVisible` | `boolean` | Passed from parent; when true, CSS transition animates fill |

**JSX:**

```
<div className="skill-bar-item">
  <div className="skill-bar-header">
    <span className="skill-label">{label}</span>
    <span className="skill-percent">{percent}%</span>
  </div>
  <div className="skill-track">
    <div
      className="skill-fill"
      style={{ width: isVisible ? `${percent}%` : '0%' }}
      role="progressbar"
      aria-valuenow={isVisible ? percent : 0}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${label} proficiency`}
    />
  </div>
</div>
```

**CSS (lives in `About.css`):**

```
.skill-track  { height: 8px; border-radius: var(--radius-pill);
                background: rgba(255,255,255,0.07); overflow: hidden; }
.skill-fill   { height: 100%; border-radius: var(--radius-pill);
                background: linear-gradient(90deg, var(--accent-color), rgba(56,189,248,0.5));
                transition: width 800ms ease-out; }
```

---

### 3.5 `src/Pages/About.jsx` + `src/css/About.css`

**State / hooks:**

```js
const skillsRef = useRef(null);
const [skillsVisible, setSkillsVisible] = useState(false);
// useScrollReveal on card refs (stagger)
const cardRefs = [useRef(), useRef(), useRef()];
useScrollReveal(cardRefs);
// Trigger skillsVisible once skills section enters viewport
useEffect(() => {
  const obs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { setSkillsVisible(true); obs.disconnect(); }
  }, { threshold: 0.15 });
  if (skillsRef.current) obs.observe(skillsRef.current);
  return () => obs.disconnect();
}, []);
```

**Skills data (constant, same file):**

```js
const SKILLS = [
  { label: 'HTML',       percent: 90 },
  { label: 'CSS',        percent: 85 },
  { label: 'JavaScript', percent: 80 },
  { label: 'React',      percent: 82 },
  { label: 'Node.js',    percent: 70 },
  { label: 'MongoDB',    percent: 65 },
  { label: 'Python',     percent: 60 },
  { label: 'Git',        percent: 78 },
];
```

**JSX structure changes:**

```
<section id="About" className="about">
  <div className="about-content">

    <div className="about-image">
      <div className="image-accent-border" aria-hidden="true" />
      <img src={profilePic} alt="Amanuale Gezahegn" />
    </div>

    <div className="about-text">
      <h2>About Me</h2>
      <p>…bio paragraphs unchanged…</p>

      <a href="/cv.pdf" download className="btn btn-secondary download-cv">
        Download CV
      </a>

      <div className="about-cards">
        {/* Education card — ref={cardRefs[0]} + reveal-item class */}
        <div className="card reveal-item" ref={cardRefs[0]}
             style={{'--reveal-delay': '0ms'}}>
          <h3>Education</h3>…
        </div>

        {/* Skills card replaced with SkillBar grid */}
        <div className="card reveal-item" ref={cardRefs[1]}
             style={{'--reveal-delay': '100ms'}} ref={skillsRef}>
          <h3>Skills</h3>
          <div className="skill-bars">
            {SKILLS.map(s => (
              <SkillBar key={s.label} label={s.label}
                        percent={s.percent} isVisible={skillsVisible} />
            ))}
          </div>
        </div>

        {/* Hobbies card */}
        <div className="card reveal-item" ref={cardRefs[2]}
             style={{'--reveal-delay': '200ms'}}>
          <h3>Hobbies</h3>…
        </div>
      </div>
    </div>

  </div>
</section>
```

**New/changed CSS classes:**

| Class | Effect |
|---|---|
| `.about-image` | `position: relative` (for accent border pseudo or child) |
| `.image-accent-border` | `position: absolute`, `inset: -4px`, `border-radius: 24px`, `border: 4px solid var(--accent-color)`, `box-shadow: var(--shadow-glow)`, `pointer-events: none` |
| `.card:hover` | Add `border-left: 3px solid var(--accent-color)` |
| `.download-cv` | `margin: 20px 0`, secondary button style |
| `.skill-bars` | `display: flex`, `flex-direction: column`, `gap: 12px`, `margin-top: 8px` |

---

### 3.6 `src/Pages/Projects.jsx` + `src/css/Projects.css`

**State variables:**

| Name | Type | Initial | Purpose |
|---|---|---|---|
| `searchQuery` | `string` | `""` | existing search |
| `activeCategory` | `string` | `"All"` | selected filter tab |

**Updated project data shape:**

```js
{
  title:       string,
  description: string,
  link:        string,
  demo:        string,
  category:    'Web' | 'Other',
  tags:        string[],   // e.g. ['React', 'CSS', 'Vite']
}
```

Updated category + tags for each existing project:

| Title | Category | Tags |
|---|---|---|
| Portfolio Website | Web | React, CSS, Vite |
| Quiz App | Web | React, MongoDB, Node.js |
| Hotel Management System | Web | HTML, CSS, JavaScript |
| sweetbee Honey website | Web | HTML, CSS, JavaScript |
| Ankesebirhan Sunday School | Web | React, CSS |
| Spam Filter Detection | Other | Python, ML |
| Project Management Tool | Backend | React, Node.js, MongoDB |
| To-Do List App | Web | HTML, CSS, JavaScript |
| Kotlin Gradle Project | Backend | Kotlin, Gradle |

**Filter logic:**

```js
const CATEGORIES = ['All', 'Web', 'Backend', 'Other'];

const filteredProjects = projects.filter(p => {
  const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
  const q = searchQuery.toLowerCase();
  const matchesSearch = !q ||
    p.title.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q));
  return matchesCategory && matchesSearch;
});
```

**JSX structure changes:**

```
<section id="Projects">
  <h2>My Projects</h2>

  {/* Category filter tabs */}
  <div className="filter-tabs" role="tablist">
    {CATEGORIES.map(cat => (
      <button key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              className={`filter-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}>
        {cat}
      </button>
    ))}
  </div>

  {/* Search (existing, unchanged) */}
  <div className="search-container">…</div>

  {/* Cards */}
  <div className="projects-container">
    {filteredProjects.map((project, i) => (
      <div className="project-card reveal-item"
           key={project.title}
           style={{'--reveal-delay': `${i * 80}ms`}}>
        <div className="project-top-accent" aria-hidden="true" />
        <div className="project-icon">{project.title.charAt(0)}</div>
        <div className="project-info">
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <div className="tech-tags">
            {project.tags.map(tag => (
              <span className="tech-tag" key={tag}>{tag}</span>
            ))}
          </div>
          <div className="project-actions">…buttons unchanged…</div>
        </div>
      </div>
    ))}
  </div>
</section>
```

**New/changed CSS classes:**

| Class | Effect |
|---|---|
| `.filter-tabs` | `display: flex`, `gap: 8px`, `margin-bottom: 24px`, `overflow-x: auto` (mobile scroll) |
| `.filter-tab` | pill button, `border-radius: var(--radius-pill)`, `padding: 8px 20px`, inactive: ghost style |
| `.filter-tab.active` | `background: var(--btn-gradient)`, `color: #fff` |
| `.project-top-accent` | `position: absolute`, `top: 0`, `left: 0`, `width: 0`, `height: 2px`, `background: var(--accent-color)`, `transition: width 300ms ease` |
| `.project-card:hover .project-top-accent` | `width: 100%` |
| `.project-card` | `position: relative`, `overflow: hidden` (for accent line clip) |
| `.tech-tags` | `display: flex`, `flex-wrap: wrap`, `gap: 8px`, `margin: 12px 0` |
| `.tech-tag` | `padding: 4px 10px`, `border-radius: var(--radius-sm)`, `background: rgba(56,189,248,0.08)`, `border: 1px solid rgba(56,189,248,0.25)`, `font-size: 0.75rem`, `color: var(--accent-color)`, **`font-family: var(--font-mono)`** — monospace font reinforces code identity |

---

### 3.7 `src/Pages/Contact.jsx` + `src/css/Contact.css`

**State variables (additions to existing):**

| Name | Type | Initial | Purpose |
|---|---|---|---|
| `formData` | `object` | `{name:'',email:'',message:''}` | existing |
| `status` | `string` | `""` | existing |
| `statusMessage` | `string` | `""` | existing |
| `isSubmitting` | `boolean` | `false` | existing |
| `successVisible` | `boolean` | `false` | auto-dismiss success banner |

On success, set `successVisible = true` and call `setTimeout(() => setSuccessVisible(false), 5000)`.

**Contact info row data (constant):**

```js
const CONTACT_INFO = [
  { icon: FaEnvelope, href: 'mailto:Amanualegezahegne2066@gmail.com', label: 'Email' },
  { icon: FaPhone,    href: 'tel:+251920663551',                       label: 'Phone' },
  { icon: FaLinkedin, href: 'https://linkedin.com/in/Amanualegezahegne', label: 'LinkedIn' },
  { icon: FaGithub,   href: 'https://github.com/amanualegezahegne',    label: 'GitHub' },
];
```

**JSX structure changes:**

```
<section id="Contact">
  <h2>Contact Me</h2>
  <p>…subtitle unchanged…</p>

  {/* Contact info icon row */}
  <div className="contact-info-row">
    {CONTACT_INFO.map(({ icon: Icon, href, label }) => (
      <a href={href} className="contact-info-link"
         aria-label={label} target="_blank" rel="noopener noreferrer">
        <Icon />
        <span>{label}</span>
      </a>
    ))}
  </div>

  <div className="contact-form reveal-item">

    {/* Auto-dismiss success banner */}
    {successVisible && (
      <div className="form-banner form-banner--success" role="alert">
        <FaCheckCircle /> Message sent! I'll get back to you soon.
      </div>
    )}

    {/* Persistent error banner */}
    {status === 'error' && (
      <div className="form-banner form-banner--error" role="alert">
        <FaExclamationCircle /> {statusMessage}
        <button className="banner-dismiss" onClick={() => setStatus('')}>
          Try Again
        </button>
      </div>
    )}

    <form onSubmit={handleSubmit}>
      {/* Floating label pattern (CSS-only) */}
      <div className="field-group">
        <input id="name" type="text" name="name"
               placeholder=" "
               value={formData.name} onChange={handleChange}
               required disabled={isSubmitting} />
        <label htmlFor="name">Your Name</label>
      </div>

      <div className="field-group">
        <input id="email" type="email" name="email"
               placeholder=" "
               value={formData.email} onChange={handleChange}
               required disabled={isSubmitting} />
        <label htmlFor="email">Your Email</label>
      </div>

      <div className="field-group">
        <textarea id="message" name="message"
                  placeholder=" "
                  value={formData.message} onChange={handleChange}
                  required disabled={isSubmitting} />
        <label htmlFor="message">Your Message</label>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? <><span className="spinner" aria-hidden="true" /> Sending…</>
          : 'Send Message'}
      </button>
    </form>
  </div>
</section>
```

**New/changed CSS classes:**

| Class | Effect |
|---|---|
| `.contact-info-row` | `display: flex`, `gap: 24px`, `justify-content: center`, `flex-wrap: wrap`, `margin-bottom: 40px` |
| `.contact-info-link` | `display: flex`, `flex-direction: column`, `align-items: center`, `gap: 6px`, `color: var(--text-secondary)`, hover: `color: var(--accent-color)`, `transform: scale(1.2)`, `filter: drop-shadow(0 0 8px var(--accent-glow))` |
| `.field-group` | `position: relative`, `margin-bottom: 28px` |
| `.field-group input, .field-group textarea` | `padding: 18px 16px 6px` (room for label) |
| `.field-group label` | `position: absolute`, `left: 16px`, `top: 50%`, `transform: translateY(-50%)`, `font-size: 1rem`, `color: var(--text-secondary)`, `pointer-events: none`, `transition: all 200ms ease` |
| `.field-group input:not(:placeholder-shown) ~ label, .field-group input:focus ~ label` | `top: 10px`, `transform: translateY(0)`, `font-size: 0.75rem`, `color: var(--accent-color)` |
| `.form-banner` | `width: 100%`, `padding: 12px 18px`, `border-radius: var(--radius-sm)`, `display: flex`, `align-items: center`, `gap: 10px`, `margin-bottom: 20px` |
| `.form-banner--success` | green tint (existing `.form-status.success` styles) |
| `.form-banner--error` | red tint + `.banner-dismiss` button inline |
| `.spinner` | `display: inline-block`, `width: 16px`, `height: 16px`, `border: 2px solid rgba(255,255,255,0.3)`, `border-top-color: #fff`, `border-radius: 50%`, `animation: spin 0.8s linear infinite` |
| `@keyframes spin` | `to { transform: rotate(360deg) }` |

Note: The floating label relies on CSS `:not(:placeholder-shown)` with `placeholder=" "` (single space). No JS required.

---

### 3.8 `src/Components/Footer.jsx` + `src/css/Footer.css`

**State:** none.

**JSX structure changes:**

```
<footer>
  <div className="footer-inner">

    {/* Row 1 — name */}
    <p className="footer-name">Amanuale Gezahegn</p>

    {/* Row 2 — tagline */}
    <p className="footer-tagline">Building the web, one component at a time.</p>

    {/* Row 3 — social icons (existing links, keep all 6) */}
    <div className="footer-icons">
      <a href="mailto:…" aria-label="Email"><FaEnvelope className="footer-icon" /></a>
      <a href="tel:…"    aria-label="Phone"><FaPhone    className="footer-icon" /></a>
      <a href="…"        aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
        <FaLinkedin className="footer-icon" /></a>
      {/* …GitHub, Telegram, Instagram — same pattern with aria-label */}
    </div>

    {/* Back to Top */}
    <button className="back-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top">
      ↑ Back to Top
    </button>

    <p className="footer-copy">
      &copy; {new Date().getFullYear()} Amanuale Gezahegn. All rights reserved.
    </p>

  </div>
</footer>
```

**New/changed CSS classes:**

| Class | Effect |
|---|---|
| `footer` | `backdrop-filter: blur(12px)`, `background: var(--glass-bg)` |
| `.footer-inner` | `display: flex`, `flex-direction: column`, `align-items: center`, `gap: 12px`, `max-width: 1200px`, `margin: 0 auto` |
| `.footer-name` | `font-family: 'Outfit'`, `font-weight: 700`, `font-size: 1.1rem`, `color: var(--text-primary)` |
| `.footer-tagline` | `font-size: 0.9rem`, `color: var(--text-secondary)` |
| `.footer-icons` | `display: flex`, `gap: 24px` |
| `.back-to-top` | `margin-top: 8px`, `padding: 8px 20px`, `border-radius: var(--radius-pill)`, `border: 1px solid var(--card-border)`, `background: transparent`, `color: var(--text-secondary)`, hover: border accent-color, cursor pointer |

---

---

## Shared Hooks Design

### 4.1 `useScrollReveal(refs, options)`

**File:** `src/hooks/useScrollReveal.js`

**Parameters:**

| Param | Type | Default | Description |
|---|---|---|---|
| `refs` | `React.RefObject[]` | required | Array of element refs to observe |
| `options.threshold` | `number` | `0.15` | IntersectionObserver threshold |
| `options.staggerMs` | `number` | `100` | ms increment per index for `--reveal-delay` |

**Behavior:**

1. On mount, create one `IntersectionObserver` with `threshold` from options.
2. For each ref at index `i`: set `style['--reveal-delay'] = i * staggerMs + 'ms'` and add class `reveal-item`, then call `observer.observe(ref.current)`.
3. When an entry fires with `isIntersecting === true`: add class `is-visible` to the element.
4. On unmount, call `observer.disconnect()`.
5. If `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is true at mount time, skip observer setup and immediately add `is-visible` to all refs.

**Pseudocode:**

```js
export function useScrollReveal(refs, { threshold = 0.15, staggerMs = 100 } = {}) {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    refs.forEach((ref, i) => {
      if (!ref.current) return;
      ref.current.classList.add('reveal-item');
      ref.current.style.setProperty('--reveal-delay', `${i * staggerMs}ms`);
      if (prefersReduced) ref.current.classList.add('is-visible');
    });

    if (prefersReduced) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold });

    refs.forEach(ref => { if (ref.current) observer.observe(ref.current); });
    return () => observer.disconnect();
  }, []);
}
```

---

### 4.2 `useTypedEffect(strings, speed)`

**File:** `src/hooks/useTypedEffect.js`

**Parameters:**

| Param | Type | Default | Description |
|---|---|---|---|
| `strings` | `string[]` | required | Role strings to cycle through |
| `speed` | `number` | `80` | ms per character typed/deleted |

**Returns:** `string` — the current displayed text.

**Behavior:**

1. State: `{ displayText: '', stringIndex: 0, charIndex: 0, isDeleting: boolean }`.
2. Interval fires every `speed` ms:
   - If not deleting: append next character. When full string reached, pause 1500 ms then set `isDeleting = true`.
   - If deleting: remove last character. When empty, advance `stringIndex` (wrap), set `isDeleting = false`.
3. Clear interval on unmount.
4. If `prefers-reduced-motion` is true, simply return each full string on a 3-second rotation with no character animation.

**Pseudocode:**

```js
export function useTypedEffect(strings, speed = 80) {
  const [state, setState] = useState({ text: '', sIdx: 0, cIdx: 0, deleting: false });

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      let i = 0;
      const id = setInterval(() => {
        i = (i + 1) % strings.length;
        setState(s => ({ ...s, text: strings[i] }));
      }, 3000);
      setState(s => ({ ...s, text: strings[0] }));
      return () => clearInterval(id);
    }

    const id = setInterval(() => {
      setState(prev => {
        const current = strings[prev.sIdx];
        if (!prev.deleting) {
          const next = current.slice(0, prev.cIdx + 1);
          if (next === current) return { ...prev, text: next, deleting: true };
          return { ...prev, text: next, cIdx: prev.cIdx + 1 };
        } else {
          const next = current.slice(0, prev.cIdx - 1);
          if (next === '') {
            return { text: '', sIdx: (prev.sIdx + 1) % strings.length, cIdx: 0, deleting: false };
          }
          return { ...prev, text: next, cIdx: prev.cIdx - 1 };
        }
      });
    }, speed);
    return () => clearInterval(id);
  }, []);

  return state.text;
}
```

---

### 4.3 `useActiveSection(sectionIds)`

**File:** `src/hooks/useActiveSection.js`

**Parameters:**

| Param | Type | Description |
|---|---|---|
| `sectionIds` | `string[]` | Ordered list of section element IDs |

**Returns:** `string` — the id of the currently active section.

**Behavior:**

1. On mount, create one `IntersectionObserver` with `threshold: 0` and `rootMargin: '-60px 0px -40% 0px'` (top 60 px offset matches Requirement 5.1).
2. Observe each `document.getElementById(id)`.
3. When an entry fires with `isIntersecting === true`, set `activeSection` to that entry's target id.
4. The last section to fire wins (natural scroll behavior).
5. Disconnect on unmount.

**Pseudocode:**

```js
export function useActiveSection(sectionIds) {
  const [active, setActive] = useState(sectionIds[0] ?? '');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { threshold: 0, rootMargin: '-60px 0px -40% 0px' });

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return active;
}
```

---

## Animation Catalog

| # | Keyframe Name | Element | Trigger | Duration | Easing | Delay Range |
|---|---|---|---|---|---|---|
| 1 | `navbarSlideDown` | `.navbar` | Page load | 400 ms | `cubic-bezier(0.4,0,0.2,1)` | 0 ms |
| 2 | `fadeInUp` | `.hero-badge` | Page load | 500 ms | `ease` | 0 ms |
| 3 | `fadeInUp` | `.hero-name` | Page load | 500 ms | `ease` | 150 ms |
| 4 | `fadeInUp` | `.hero-role` | Page load | 500 ms | `ease` | 300 ms |
| 5 | `fadeInUp` | `.hero-subtext` | Page load | 500 ms | `ease` | 450 ms |
| 6 | `fadeInUp` | `.hero-ctas` | Page load | 500 ms | `ease` | 600 ms |
| 7 | `fadeInUp` | `.home-image` | Page load | 500 ms | `ease` | 200 ms |
| 8 | `floatImage` | `.home-image img` | Continuous loop | 4 s | `ease-in-out` | — |
| 9 | `glowPulse` | `.image-glow-ring` | Continuous loop | 3 s | `ease-in-out` | — |
| 10 | `blink` | `.typed-cursor` | Continuous loop | 1 s | `step-end` | — |
| 11 | `floatGlow` | `.home::before/after` | Continuous loop | 12 s | `ease-in-out` | 0 / 6 s |
| 12 | `reveal` (CSS transition) | `.reveal-item.is-visible` | Scroll (IntersectionObserver) | 600 ms | `ease` | 0–800 ms (stagger) |
| 13 | Skill fill (CSS transition) | `.skill-fill` | Scroll (IntersectionObserver) | 800 ms | `ease-out` | 0 ms |
| 14 | Top accent line (CSS transition) | `.project-top-accent` | Hover | 300 ms | `ease` | — |
| 15 | `spin` | `.spinner` | Submit state | 0.8 s | `linear` | — |
| 16 | Hamburger bars | `.bar-1/.bar-2/.bar-3` | Menu open | 300 ms | `cubic-bezier(0.4,0,0.2,1)` | — |

All animations are suppressed by:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Data Models

### Project Object

```ts
interface Project {
  title:       string;        // display name
  description: string;        // short paragraph
  link:        string;        // GitHub URL
  demo:        string;        // live demo URL, empty string if none
  category:    'Web' | 'Other';
  tags:        string[];      // technology pill labels
}
```

### Skill Object (About section constant)

```ts
interface Skill {
  label:   string;   // "React", "HTML", etc.
  percent: number;   // 0–100
}
```

### Contact Form State

```ts
interface FormData {
  name:    string;
  email:   string;
  message: string;
}
type FormStatus = '' | 'info' | 'success' | 'error';
```

---

## Responsive Breakpoints

All breakpoints use `max-width` media queries. The default (no query) targets 1440 px+.

### Navbar

| Breakpoint | Behavior |
|---|---|
| ≥ 769 px | horizontal link row, no hamburger visible |
| ≤ 768 px | hamburger shown, nav-links drawer from right (existing), width 220 px |
| ≤ 480 px | padding reduced to 15px |

### Home (Hero)

| Breakpoint | Behavior |
|---|---|
| ≥ 1025 px | `.home-content` `flex-direction: row`, image right, text left, max-width 1200 px |
| ≤ 1024 px | h1 font-size: 3 rem, image width: 270 px |
| ≤ 768 px | `flex-direction: column`, text above image, `text-align: center`, `.hero-ctas flex-direction: column align-items: center` |
| ≤ 480 px | h1: 2.2 rem, image: 200 px, padding 60 px 15 px |
| ≤ 320 px | h1: 1.9 rem, hero-badge font-size: 0.8 rem |

### About

| Breakpoint | Behavior |
|---|---|
| ≥ 1025 px | two-column flex row, image left, text right |
| ≤ 1024 px | gap reduced, h2 2.2 rem |
| ≤ 768 px | `flex-direction: column`, image centered above text, cards stack |
| ≤ 480 px | image width 200 px, padding 60 px 15 px |
| ≤ 320 px | SkillBar label font-size 0.8 rem, percent hidden to save space |

### Projects

| Breakpoint | Behavior |
|---|---|
| ≥ 1025 px | 3-column card grid |
| ≤ 1024 px | 2-column |
| ≤ 768 px | 1-column (`flex-direction: column`), filter tabs `overflow-x: auto` with `white-space: nowrap` |
| ≤ 480 px | card width 100%, padding reduced |
| ≤ 320 px | tech tag font-size 0.7 rem |

### Contact

| Breakpoint | Behavior |
|---|---|
| ≥ 769 px | form max-width 600 px centered |
| ≤ 768 px | padding 80 px 25 px, h2 2 rem, `.contact-info-row gap: 16px` |
| ≤ 480 px | form padding 20 px 15 px, info row wraps to 2 per row |
| ≤ 320 px | info row icon + text stacked more tightly, font-size 0.85 rem |

### Footer

| Breakpoint | Behavior |
|---|---|
| All | centered single column, max-width 1200 px |
| ≤ 480 px | icon size 1.5 rem, footer padding reduced |
| ≤ 320 px | tagline font-size 0.8 rem |

---

## Accessibility Checklist

### aria-labels on icon-only links

Every icon-only interactive element must carry `aria-label`:

```jsx
// Footer / Contact info links
<a href="mailto:…" aria-label="Send email">
  <FaEnvelope aria-hidden="true" />
</a>

// Navbar hamburger button
<button className="hamburger" aria-label="Toggle navigation menu">…</button>

// Footer Back to Top
<button className="back-to-top" aria-label="Back to top">↑ Back to Top</button>

// SkillBar progress bar
<div role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}
     aria-label={`${label} proficiency`} />
```

### All images must have descriptive alt text

```jsx
<img src={heroImage}   alt="Amanuale Gezahegn — Web Developer" />
<img src={profilePic}  alt="Amanuale Gezahegn" />
```

### Focus-visible outlines

Add to `index.css` (global):

```css
:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 3px;
  border-radius: 4px;
}

/* Remove default outline only when focus-visible is supported */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Filter tabs ARIA

```jsx
<div role="tablist" aria-label="Project categories">
  <button role="tab" aria-selected={activeCategory === 'All'}>All</button>
  …
</div>
```

### prefers-reduced-motion implementation pattern

Single block in `index.css`, applied globally:

```css
@media (prefers-reduced-motion: reduce) {
  /* 1. Kill all CSS animations and transitions */
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* 2. Force reveal items visible immediately */
  .reveal-item {
    opacity: 1 !important;
    transform: none !important;
  }

  /* 3. Force skill bars to their final width */
  .skill-fill {
    transition: none !important;
  }
}
```

In `useScrollReveal` and `useTypedEffect`, check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` at mount time and skip animation setup accordingly (see hook pseudocode above).

---

## Error Handling

| Scenario | Handling |
|---|---|
| `IntersectionObserver` not supported | Guard with `if ('IntersectionObserver' in window)` before creating observer. Fall back to showing all elements visible immediately. |
| `useTypedEffect` receives empty array | Guard: return empty string, no interval started. |
| Web3Forms fetch throws network error | Existing `catch` block sets `status = 'error'` with the persistent banner pattern. |
| CV file not found (`/cv.pdf`) | The `download` attribute on the anchor gracefully handles 404 with a browser error; no JS required. |
| Project has no `demo` link | Existing `{project.demo && <a>…</a>}` conditional unchanged. |
| `document.getElementById(id)` returns null | Guard in `useActiveSection`: `if (el) observer.observe(el)`. |

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

The prework analysis identified the following acceptance criteria as suitable for property-based testing. The remaining criteria are covered by example-based unit tests or smoke checks (see Testing Strategy).

**Property Reflection:** Properties 1 and 2 (scroll-reveal class + stagger delay) both concern the `useScrollReveal` hook output. They are complementary rather than redundant — one asserts the class toggle, the other asserts the delay value — so both are retained. Properties 3 and 4 (project filter + combined filter/search) both concern the `filteredProjects` computation. They are not redundant: Property 3 tests the category axis alone while Property 4 tests the intersection of two axes. The skill-fill property (6) is independent of all others. No redundancy was found.

---

### Property 1: Scroll reveal adds `is-visible` class

*For any* DOM element passed to `useScrollReveal`, when the `IntersectionObserver` fires with `isIntersecting: true` for that element, the element's class list SHALL contain `is-visible`.

**Validates: Requirements 3.1**

---

### Property 2: Scroll reveal stagger delay is index-proportional

*For any* array of n elements passed to `useScrollReveal` with stagger interval `s` ms, the inline CSS custom property `--reveal-delay` on the element at index `i` SHALL equal `i × s` ms.

**Validates: Requirements 3.3**

---

### Property 3: Category filter includes only matching projects

*For any* `activeCategory` value from `{ 'All', 'Web', 'Other' }` and any array of projects with `category` fields, every project returned by the filter function SHALL have `category === activeCategory` OR `activeCategory === 'All'`.

**Validates: Requirements 7.2**

---

### Property 4: Combined filter (category + search) satisfies both predicates

*For any* `(activeCategory, searchQuery)` pair and any array of projects, every project in the filtered result SHALL satisfy BOTH `category === activeCategory || activeCategory === 'All'` AND at least one of `title`, `description`, or a `tags` entry contains `searchQuery` (case-insensitive) — when `searchQuery` is non-empty.

**Validates: Requirements 7.5**

---

### Property 5: Typed effect cycles through all strings

*For any* non-empty array of role strings passed to `useTypedEffect`, the hook SHALL eventually display each string in full at least once before cycling back to the first string.

**Validates: Requirements 4.3**

---

### Property 6: Skill bar fill width matches percent

*For any* skill with proficiency value `p` in [0, 100], when `isVisible` is `true`, the `SkillBar` component SHALL set the fill element's inline `width` to `p + '%'`; when `isVisible` is `false`, the fill width SHALL be `'0%'`.

**Validates: Requirements 6.2**

---

### Property 7: Active section tracks the intersecting section

*For any* set of section IDs passed to `useActiveSection`, when the `IntersectionObserver` fires with `isIntersecting: true` for the element with id `X`, the hook SHALL return `X` as the active section id.

**Validates: Requirements 5.1**

---

## Testing Strategy

### Dual Testing Approach

Unit tests verify specific examples, edge cases, and error conditions. Property tests verify universal properties across generated inputs. Both are required for comprehensive coverage.

### Property-Based Testing Library

Use **fast-check** (JavaScript). It is tree-shakeable, works with Vitest/Jest, and does not require any server or network access.

```bash
npm install --save-dev fast-check
```

Each property test runs a minimum of **100 iterations** (fast-check default is 100; set `numRuns: 100` explicitly).

Tag format for each test: `// Feature: portfolio-redesign, Property N: <property_text>`

### Property Tests

| Property | File | What to generate |
|---|---|---|
| P1 — `is-visible` class | `src/hooks/__tests__/useScrollReveal.test.js` | Array of mock DOM elements (length 1–10) |
| P2 — stagger delay | `src/hooks/__tests__/useScrollReveal.test.js` | Array length 1–20, stagger values 50–200 ms |
| P3 — category filter | `src/Pages/__tests__/Projects.filter.test.js` | Random projects with category, random activeCategory |
| P4 — combined filter | `src/Pages/__tests__/Projects.filter.test.js` | Random projects, random (category, searchQuery) pairs |
| P5 — typed cycling | `src/hooks/__tests__/useTypedEffect.test.js` | Arrays of 1–5 strings, speed 1 ms (accelerated) |
| P6 — skill bar fill | `src/Components/__tests__/SkillBar.test.jsx` | Integers 0–100 for percent, boolean for isVisible |
| P7 — active section | `src/hooks/__tests__/useActiveSection.test.js` | Arrays of 2–6 section IDs, random intersection events |

### Unit / Example Tests

| Area | What to test |
|---|---|
| Navbar | `scrolled` class applied at 50 px scroll; logo text is "AG."; hamburger CSS classes on `open` state |
| Hero | Two CTA buttons render; hero-badge renders; typed-cursor element present |
| About | SkillBar renders 7 items; Download CV link has `download` attribute |
| Projects | Filter tabs render All/Web/Other; tech tags render for each project |
| Contact | Spinner renders when `isSubmitting=true`; success banner dismisses after 5 s (fake timers); error banner persists; floating label CSS class structure |
| Footer | Back to Top button calls `window.scrollTo`; copyright year is current; all social links have `aria-label` |
| Accessibility | Every icon-only link has `aria-label`; all `img` have non-empty `alt` |

### Smoke / Static Checks

- `index.css` has ≥ 12 CSS custom properties in `:root`.
- No hardcoded hex values in any CSS file except `index.css` (enforced by a grep-based lint check or Stylelint rule).
- `@media (prefers-reduced-motion: reduce)` block exists in `index.css`.
- All component CSS files reference only `var(--…)` for color values.

### Test Runner

Vitest (already configured via Vite). Run with:

```bash
npx vitest run
```

No watch mode needed for CI.
