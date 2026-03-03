# SEO Audit Fixes — Verte

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix all 28 SEO issues from the audit, prioritized by impact — critical blockers first, then important ranking factors, then nice-to-haves.

**Architecture:** Static HTML site (index.html, polityka-prywatnosci.html, 404.html) with Tailwind Play CDN, custom styles.css, and script.js. No build system, no git. The biggest change is replacing Tailwind Play CDN with compiled CSS via Tailwind CLI. All other changes are direct HTML/CSS edits.

**Tech Stack:** Tailwind CLI (standalone binary), HTML, CSS, vanilla JS

**User-Dependent Items (need real data before deploying):**
- Real phone number (issue #3)
- Real Calendly link (issue #4)
- Real Formspree form ID (issue #5)
- Real OG image file (issue #2)
- Real photo for "O mnie" section (issue #11)

---

## PHASE 1: CRITICAL — Tailwind CDN Replacement (Issue #1)

### Task 1: Install Tailwind CLI and configure

**Files:**
- Create: `tailwind.config.js`
- Create: `src/input.css`
- Modify: `package.json` (create if needed)

**Step 1: Install Tailwind CLI standalone binary**

Run:
```bash
cd /Users/mikolajtomasik/Downloads/UlatwiajZycie
npm init -y
npm install -D tailwindcss @tailwindcss/cli
```

**Step 2: Create tailwind.config.js with the existing custom config**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html'],
  theme: {
    extend: {
      colors: {
        verte: {
          50: '#f0f9f4',
          100: '#daf0e3',
          200: '#b8e1c9',
          300: '#89cca7',
          400: '#56b17f',
          500: '#3a9464',
          600: '#2d7850',
          700: '#245f40',
          800: '#1f4d35',
          900: '#1a402d',
          950: '#0d2318',
        },
        cream: {
          50: '#fdfaf6',
          100: '#f9f3ea',
          200: '#f0e6d5',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Outfit', 'system-ui', 'sans-serif'],
      },
    }
  },
  plugins: [],
}
```

**Step 3: Create src/input.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Step 4: Add build script to package.json**

Add to `"scripts"`:
```json
"build:css": "npx @tailwindcss/cli -i ./src/input.css -o ./tailwind-output.css --minify",
"watch:css": "npx @tailwindcss/cli -i ./src/input.css -o ./tailwind-output.css --watch"
```

**Step 5: Build the CSS**

Run: `npm run build:css`
Expected: `tailwind-output.css` generated with all utility classes used in HTML files.

### Task 2: Replace Tailwind CDN with compiled CSS in all 3 HTML files

**Files:**
- Modify: `index.html` (lines 30-62)
- Modify: `polityka-prywatnosci.html` (lines 13-45)
- Modify: `404.html` (lines 12-28)

**Step 1: In index.html — remove CDN script and tailwind.config, add compiled CSS link**

Replace lines 30-62 (the `<script src="https://cdn.tailwindcss.com">` and the entire `<script>tailwind.config = {...}</script>` block) with:
```html
<link rel="stylesheet" href="tailwind-output.css">
```

Keep the existing `<link rel="stylesheet" href="styles.css">` that follows.

**Step 2: In polityka-prywatnosci.html — same replacement**

Replace lines 13-45 (CDN script + config) with:
```html
<link rel="stylesheet" href="tailwind-output.css">
<link rel="stylesheet" href="styles.css">
```

Note: This page was missing `styles.css` link — adding it fixes issue #27 simultaneously.

**Step 3: In 404.html — same replacement**

Replace lines 12-28 (CDN script + config) with:
```html
<link rel="stylesheet" href="tailwind-output.css">
<link rel="stylesheet" href="styles.css">
```

**Step 4: Rebuild and verify**

Run: `npm run build:css`

**Step 5: Open each page in browser and verify visually that nothing broke**

Serve locally:
```bash
npx serve .
```

Check index.html, polityka-prywatnosci.html, and 404.html — all should render identically to before.

---

## PHASE 2: CRITICAL — Placeholder/Broken Content (Issues #2-5)

### Task 3: Fix placeholder phone number (Issue #3)

**Files:**
- Modify: `index.html:1143-1154`

**Step 1: Replace placeholder phone with a visible "contact via form" note**

Since we don't have the real phone number, replace the phone link with a temporary but non-damaging placeholder. Change lines 1143-1154:

Replace `+48 XXX XXX XXX` and `tel:+48000000000` with a comment marking it for replacement, and hide the phone section until a real number is provided:

```html
<!-- REPLACE: Add real phone number here. Example: href="tel:+48123456789" and display "+48 123 456 789" -->
<a href="tel:+48123456789" class="flex items-center gap-4 group" style="display:none">
```

**Important:** The user MUST provide a real phone number before launch. This task just prevents the fake number from being crawled.

### Task 4: Fix broken Calendly link (Issue #4)

**Files:**
- Modify: `index.html:1169`

**Step 1: Replace #TODO_CALENDLY_LINK with a safe anchor**

Change the href from `#TODO_CALENDLY_LINK` to `#contact` so it scrolls to the contact form instead of creating a broken link:

```html
<a href="#contact" class="inline-flex items-center gap-2.5 border-2 border-verte-200 text-verte-700 font-semibold px-6 py-3.5 rounded-full hover:border-verte-400 hover:bg-verte-50 transition-all duration-300 w-full justify-center">
```

Remove the `target="_blank" rel="noopener noreferrer"` attributes since it's now an internal link.

**Note:** When the user gets a Calendly/Cal.com link, update this href.

### Task 5: Fix broken Formspree form ID (Issue #5)

**Files:**
- Modify: `index.html:1181`

**Step 1: Ask user for Formspree ID or leave a clear marker**

Since we don't have the ID, change the action to prevent form submission attempts with a bad URL. The form already has JS validation that prevents submission, but the action URL should be valid or the form should be clearly marked.

For now, add a `data-needs-setup="true"` attribute and keep the TODO visible in code:
```html
<form id="contact-form" class="contact-form-card" action="https://formspree.io/f/TODO_FORM_ID" method="POST" novalidate data-needs-setup="true">
```

**The user MUST replace `TODO_FORM_ID` with their real Formspree form ID before launch.**

### Task 6: Create OG image placeholder (Issue #2)

**Files:**
- Modify: `index.html:17-19`

**Step 1: Generate a simple OG image**

Create a 1200x630 placeholder OG image. Since we can't generate images programmatically here, update the meta tags to include dimensions (fixes issue #18 too):

```html
<meta property="og:image" content="https://verte.pl/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:image" content="https://verte.pl/og-image.png">
```

**The user MUST create an actual `og-image.png` file (1200x630px) and place it in the project root.**

---

## PHASE 3: IMPORTANT — Schema & Meta (Issues #6-8, #15, #17)

### Task 7: Complete LocalBusiness schema (Issue #6)

**Files:**
- Modify: `index.html:70-85` (JSON-LD in `<head>`)

**Step 1: Expand the LocalBusiness schema with missing fields**

Replace the existing LocalBusiness object with:

```json
{
    "@type": "LocalBusiness",
    "name": "Verte",
    "description": "Automatyzacja dokumentów dla małych i średnich firm ze Śląska. Integracja z KSeF, obieg dokumentów, eliminacja błędów.",
    "url": "https://verte.pl/",
    "email": "kontakt@verte.pl",
    "image": "https://verte.pl/og-image.png",
    "priceRange": "$$",
    "address": {
        "@type": "PostalAddress",
        "addressLocality": "Gliwice",
        "addressRegion": "Śląsk",
        "addressCountry": "PL"
    },
    "geo": {
        "@type": "GeoCoordinates",
        "latitude": "50.2945",
        "longitude": "18.6714"
    },
    "areaServed": {
        "@type": "Place",
        "name": "Śląsk, Polska"
    },
    "serviceType": ["Automatyzacja dokumentów", "Integracja KSeF", "Obieg dokumentów", "OCR"]
}
```

**Note:** Phone number and openingHours should be added when real data is available.

### Task 8: Add missing FAQ items to schema (Issue #8)

**Files:**
- Modify: `index.html` JSON-LD FAQPage section

**Step 1: Add the 2 missing FAQ questions to the FAQPage schema**

Add these 2 questions to the `mainEntity` array in the FAQPage schema (they exist in HTML but not in schema):

```json
{
    "@type": "Question",
    "name": "Czy muszę zmieniać swoje oprogramowanie?",
    "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nie. Nasze rozwiązania integrują się z narzędziami, których już używasz — Excel, programy księgowe (Optima, Symfonia, enova, wFirma), systemy CRM i inne. Budujemy mosty, nie wymagamy rewolucji."
    }
},
{
    "@type": "Question",
    "name": "Co jeśli coś nie działa?",
    "acceptedAnswer": {
        "@type": "Answer",
        "text": "Każde wdrożenie obejmuje okres wsparcia. Jesteśmy pod telefonem i mailem. Jeśli coś wymaga poprawki — naprawiamy to w ramach umowy, bez dodatkowych opłat."
    }
}
```

### Task 9: Add canonical and OG tags to polityka-prywatnosci.html (Issues #7, #15)

**Files:**
- Modify: `polityka-prywatnosci.html` `<head>` section

**Step 1: Add canonical tag after line 8**

```html
<link rel="canonical" href="https://verte.pl/polityka-prywatnosci.html">
```

**Step 2: Add OG tags after the canonical**

```html
<meta property="og:type" content="website">
<meta property="og:url" content="https://verte.pl/polityka-prywatnosci.html">
<meta property="og:title" content="Polityka prywatności — Verte">
<meta property="og:description" content="Polityka prywatności serwisu Verte. Informacje o przetwarzaniu danych osobowych zgodnie z RODO.">
<meta property="og:locale" content="pl_PL">
<meta property="og:site_name" content="Verte">
<meta property="og:image" content="https://verte.pl/og-image.png">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="Polityka prywatności — Verte">
<meta name="twitter:description" content="Polityka prywatności serwisu Verte. Informacje o przetwarzaniu danych osobowych zgodnie z RODO.">
```

### Task 10: Add meta robots tag (Issue #17)

**Files:**
- Modify: `index.html` `<head>`
- Modify: `polityka-prywatnosci.html` `<head>`

**Step 1: Add robots meta tag to both pages**

Add after the viewport meta tag:
```html
<meta name="robots" content="index, follow">
```

On 404.html, add:
```html
<meta name="robots" content="noindex, follow">
```

---

## PHASE 4: IMPORTANT — Heading Hierarchy & Contrast (Issues #9-10, #12-13)

### Task 11: Fix heading hierarchy in KSeF section (Issue #9)

**Files:**
- Modify: `index.html:944-988` (KSeF FAQ items)

**Step 1: Change h4 to h3 in KSeF FAQ items**

The KSeF section has `<h2>` then jumps to `<h4>`. Change all `<h4>` tags in the KSeF FAQ items (lines ~944, 955, 966, 977, 988) to `<h3>`:

```html
<h3 class="text-white font-semibold mb-1">Co to jest KSeF?</h3>
```

(Repeat for all 5 KSeF FAQ items)

### Task 12: Fix heading hierarchy in footer (Issue #9)

**Files:**
- Modify: `index.html:1250,1262`

**Step 1: Change footer h4 tags to proper semantic elements**

Footer headings "Nawigacja" and "Kontakt" are `<h4>` without a parent `<h3>`. Since these are presentational labels, change them to `<p>` with the same styling:

```html
<p class="text-xs font-bold text-gray-400 uppercase tracking-[.1em] mb-4">Nawigacja</p>
```

```html
<p class="text-xs font-bold text-gray-400 uppercase tracking-[.1em] mb-4">Kontakt</p>
```

### Task 13: Fix color contrast (Issue #10)

**Files:**
- Modify: `index.html` (multiple locations)
- Modify: `polityka-prywatnosci.html:163`

**Step 1: Replace text-gray-400 with text-gray-500 on light backgrounds**

Search for `text-gray-400` on elements that appear on light backgrounds (cream-50, white) and replace with `text-gray-500` (contrast ratio ~5.7:1, passes WCAG AA).

Specific locations in index.html:
- Form labels: `text-gray-400` → `text-gray-500` where used as descriptive text on white/cream backgrounds
- Footer copyright: `text-gray-300` → `text-gray-500` (line 1273)
- Footer link "Polityka prywatności": `text-gray-300` → `text-gray-500` (line 1268)

In polityka-prywatnosci.html:
- Footer text `text-gray-400` → `text-gray-500` (line 163)

**Note:** Don't change `text-gray-400` on dark backgrounds (e.g., inside KSeF section with bg-verte-700) — those have sufficient contrast.

### Task 14: Fix H1 keyword optimization (Issue #12)

**Files:**
- Modify: `index.html:229-233`

**Step 1: Rephrase H1 to include primary keyword "automatyzacja dokumentów"**

Change from:
```html
Twoja firma traci
<span class="text-verte-600 hero-heading-accent">13&nbsp;godzin tygodniowo</span>
na&nbsp;papierkową robotę
```

To:
```html
Twoja firma traci
<span class="text-verte-600 hero-heading-accent">13&nbsp;godzin tygodniowo</span>
na&nbsp;dokumenty. Czas na&nbsp;automatyzację
```

This keeps the emotional hook while including "dokumenty" and "automatyzację" keywords.

### Task 15: Fix blocking fonts on subpages (Issue #13)

**Files:**
- Modify: `polityka-prywatnosci.html:10-12`
- Modify: `404.html:9-11`

**Step 1: In polityka-prywatnosci.html — make fonts non-blocking**

Replace the synchronous font loading:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">
```

With async loading (same pattern as index.html):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500;1,9..144,600&family=Outfit:wght@300;400;500;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500;1,9..144,600&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet"></noscript>
```

**Step 2: Do the same for 404.html**

Same pattern — replace the synchronous `<link>` with `<link rel="preload" ... onload>` + `<noscript>` fallback.

---

## PHASE 5: IMPORTANT — Content & Social Proof (Issues #14, #19)

### Task 16: Add twitter:site and twitter:creator meta tags (Issue #19)

**Files:**
- Modify: `index.html` (Twitter meta section)

**Step 1: Add Twitter handle tags after existing Twitter tags**

```html
<meta name="twitter:site" content="@VertePL">
<meta name="twitter:creator" content="@VertePL">
```

**Note:** User should replace `@VertePL` with actual Twitter/X handle if different.

### Task 17: Note about weak social proof (Issue #14)

This is a content issue, not a code issue. The user should:
1. Ask Katarzyna M. for permission to use her full last name
2. Add 2-3 more testimonials from real clients
3. Consider adding company logos in the trust signals area

**No code changes for this task** — it's a content recommendation.

---

## PHASE 6: NICE-TO-HAVE (Issues #16, #18, #20-28)

### Task 18: Remove meta keywords tag (Issue #16)

**Files:**
- Modify: `index.html:8`

**Step 1: Delete the meta keywords line**

Remove:
```html
<meta name="keywords" content="automatyzacja dokumentów, KSeF, obieg dokumentów, OCR, faktury, Gliwice, Śląsk">
```

### Task 19: Add WebSite schema (Issue #20)

**Files:**
- Modify: `index.html` JSON-LD `@graph` array

**Step 1: Add WebSite schema to the @graph array**

Add as first item in the `@graph` array:
```json
{
    "@type": "WebSite",
    "name": "Verte",
    "url": "https://verte.pl/",
    "potentialAction": {
        "@type": "SearchAction",
        "target": "https://verte.pl/?q={search_term_string}",
        "query-input": "required name=search_term_string"
    }
}
```

**Note:** Since this is a static site without actual search, this is mainly for rich snippets. Can be removed if search isn't implemented.

### Task 20: Add Service schema per service (Issue #21)

**Files:**
- Modify: `index.html` JSON-LD `@graph` array

**Step 1: Add 4 Service schemas to the @graph array**

```json
{
    "@type": "Service",
    "name": "Generowanie dokumentów",
    "description": "Automatyczne generowanie dokumentów — umowy, oferty, protokoły, faktury pro-forma. Gotowy PDF w kilka sekund zamiast 30 minut.",
    "provider": { "@type": "LocalBusiness", "name": "Verte" },
    "areaServed": { "@type": "Place", "name": "Śląsk, Polska" },
    "serviceType": "Automatyzacja dokumentów"
},
{
    "@type": "Service",
    "name": "Wdrożenie KSeF",
    "description": "Kompleksowe wdrożenie Krajowego Systemu e-Faktur — audyt gotowości, integracja z programem księgowym, szkolenie zespołu.",
    "provider": { "@type": "LocalBusiness", "name": "Verte" },
    "areaServed": { "@type": "Place", "name": "Śląsk, Polska" },
    "serviceType": "Integracja KSeF"
},
{
    "@type": "Service",
    "name": "Obieg dokumentów",
    "description": "Uporządkowany obieg dokumentów — tworzenie, akceptacja, podpis i archiwizacja w jednym miejscu.",
    "provider": { "@type": "LocalBusiness", "name": "Verte" },
    "areaServed": { "@type": "Place", "name": "Śląsk, Polska" },
    "serviceType": "Obieg dokumentów"
},
{
    "@type": "Service",
    "name": "OCR i wyciąganie danych",
    "description": "Automatyczne wyciąganie danych ze skanów i PDF-ów z dokładnością powyżej 98% dzięki AI i OCR.",
    "provider": { "@type": "LocalBusiness", "name": "Verte" },
    "areaServed": { "@type": "Place", "name": "Śląsk, Polska" },
    "serviceType": "OCR"
}
```

### Task 21: Add Review schema for testimonial (Issue #22)

**Files:**
- Modify: `index.html` JSON-LD `@graph` array

**Step 1: Add Review schema**

```json
{
    "@type": "Review",
    "author": {
        "@type": "Person",
        "name": "Katarzyna M."
    },
    "reviewBody": "Myślałam, że automatyzacja to coś dla dużych firm. Okazało się, że w 3 dni mieliśmy działający system, który oszczędza nam ponad 50 godzin miesięcznie. Żałuję, że nie zrobiliśmy tego wcześniej.",
    "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
    },
    "itemReviewed": {
        "@type": "LocalBusiness",
        "name": "Verte"
    }
}
```

### Task 22: Add aria-hidden to decorative SVGs (Issue #23)

**Files:**
- Modify: `index.html` (multiple SVG icons in service cards, process cards, why cards, contact section)

**Step 1: Add aria-hidden="true" to all decorative SVG icons**

Search for `<svg` elements that are purely decorative (inside cards next to text, icon decorations) and add `aria-hidden="true"`. Specifically:
- Service card icons (4 SVGs around lines 421-569)
- Process card icons (4 SVGs around lines 628-662)
- Why card icons (4 SVGs around lines 686-721)
- Contact section icons (email, phone, location SVGs around lines 1134-1158)
- Checkmark SVGs in service card details
- Arrow SVGs in CTAs

**Note:** SVGs that are the sole content of a button/link should keep `aria-label` instead.

### Task 23: Add focus trap to mobile nav (Issue #24)

**Files:**
- Modify: `script.js` (Navigation class)

**Step 1: Add focus trap logic to the Navigation class toggle method**

After `this.isOpen = !this.isOpen;`:
```js
if (this.isOpen) {
    // Trap focus inside mobile nav
    const focusable = this.mobile.querySelectorAll('a, button');
    if (focusable.length) {
        focusable[0].focus();
        this.mobile.addEventListener('keydown', this._trapFocus = (e) => {
            if (e.key !== 'Tab') return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        });
    }
} else {
    if (this._trapFocus) {
        this.mobile.removeEventListener('keydown', this._trapFocus);
    }
    this.burger.focus();
}
```

### Task 24: Add <main> to 404 page (Issue #25)

**Files:**
- Modify: `404.html:30-43`

**Step 1: Wrap content div in <main>**

Change:
```html
<body class="bg-cream-50 text-gray-800 font-body antialiased min-h-screen flex flex-col items-center justify-center px-6">
    <div class="text-center max-w-md">
```

To:
```html
<body class="bg-cream-50 text-gray-800 font-body antialiased min-h-screen flex flex-col items-center justify-center px-6">
    <main class="text-center max-w-md">
```

And close with `</main>` instead of `</div>`.

### Task 25: Rebuild Tailwind CSS after all changes

**Step 1: Rebuild**

Run:
```bash
cd /Users/mikolajtomasik/Downloads/UlatwiajZycie
npm run build:css
```

**Step 2: Verify all 3 pages render correctly**

Run: `npx serve .`

Check each page visually.

---

## Summary of user-required actions before launch:

| Item | What to provide | Where it goes |
|------|----------------|---------------|
| Phone number | Real phone number | `index.html:1144,1152` |
| Calendly link | Cal.com or Calendly URL | `index.html:1169` |
| Formspree ID | Form ID from formspree.io | `index.html:1181` |
| OG image | 1200x630px PNG | `og-image.png` in root |
| Photo | Professional headshot | Replace placeholder in about section |
| Twitter handle | Real @handle | `index.html` twitter:site meta |

## Issues NOT addressed in code (content-only):

- **#11** (Real photo in "O mnie") — needs actual image file
- **#14** (Weak social proof) — needs more testimonials from real clients
- **#26** (URL .html extensions) — requires server-side URL rewriting (Apache/Nginx config or hosting provider settings)
- **#28** (CSS minification) — handled automatically by `--minify` flag in Tailwind build; custom `styles.css` can be minified with a separate tool if desired
