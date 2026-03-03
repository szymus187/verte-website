# Production-Ready Verte — Design

**Goal:** Make the Verte website production-ready with form backend, legal compliance, conversion optimization, and content expansion.

## Faza 1: Blokery launch

### 1.1 Backend formularza (Formspree)
- Form gets `action="https://formspree.io/f/TODO_FORM_ID"` + `method="POST"`
- JS `ContactForm.submit()` sends via `fetch()` to Formspree
- Success: existing "Wysłano!" flow; Error: "Coś poszło nie tak" message
- TODO comment with setup instructions

### 1.2 Polityka prywatności
- New `polityka-prywatnosci.html` with full RODO-compliant Polish privacy policy
- Sections: data controller, data types, purpose, legal basis, retention, rights, contact
- Linked from footer and below contact form
- Same visual style (Tailwind, same fonts)

### 1.3 SEO techniczne
- `sitemap.xml` with URLs
- `robots.txt` with sitemap link
- `og:image` + `twitter:image` meta tags (TODO placeholder path)
- `theme-color` meta tag (#245f40)

### 1.4 Placeholdery danych
- Phone/email: keep current values with `<!-- TODO -->` comments
- About photo: placeholder with TODO comment

## Faza 2: Konwersja

### 2.1 Scroll-spy nawigacja
- IntersectionObserver on sections
- Active link gets `text-verte-500` class
- Smooth transitions

### 2.2 Sticky CTA na mobile
- Fixed bottom bar on mobile after 300px scroll
- "Napisz do nas" → #kontakt anchor
- Hidden in hero zone, subtle blur background

### 2.3 Rozbudowa formularza
- Optional phone field (`type="tel"`)
- Service selector dropdown (Dokumenty, KSeF, Workflow, OCR, Inne)
- Same blur validation pattern

### 2.4 Calendly CTA
- Outlined button "Umów rozmowę online" in contact section
- TODO link to Calendly

### 2.5 CTA po "Dlaczego Verte"
- "Porozmawiajmy" button → #kontakt anchor

## Faza 3: Content i polish

### 3.1 Odświeżenie KSeF
- Dual copy: before deadline = urgency, after deadline = "already mandatory"
- JS auto-switches based on date

### 3.2 Ogólne FAQ
- 5 general questions about services
- Schema.org FAQ markup
- Placed after or merged with KSeF FAQ

### 3.3 Strona 404
- `404.html` with return-to-home CTA
- Same visual style

### 3.4 Accessibility fixes
- Escape closes mobile nav
- `novalidate` on form (custom validation only)

## Approach
- Formspree for form backend (TODO placeholder ID)
- All personal data as TODO placeholders
- Polish language throughout
- Full HTML/CSS/JS freedom
