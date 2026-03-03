# Verte Audit Fixes Design — 2026-03-03

## Context

5 audytow strony Verte (CRO, SEO, Copywriting, Marketing Design, Accessibility WCAG) zidentyfikowalo ~30 poprawek. Wdrazamy wszystkie w 3 falach priorytetow.

## Decisions

- **Formspree ID**: `xkovlvll` — wstawiamy od razu
- **Calendly**: Nie ma jeszcze — link zostaje `#contact`
- **Zdjecie, telefon, og-image**: Placeholdery z instrukcjami — user podmieni pozniej
- **Podejscie**: Fale priorytetow (A) — Conversion-Critical → CRO+Copy → SEO+Performance

---

## FALA 1: Conversion-Critical (~7 poprawek)

### 1.1 Formularz Formspree
- **Plik**: `index.html:1231`
- Zamienic `TODO_FORM_ID` → `xkovlvll` w `action="https://formspree.io/f/xkovlvll"`
- Usunac `data-needs-setup="true"` z `<form>`

### 1.2 Accessibility formularza
- **Pliki**: `index.html`, `script.js`
- Dodac `aria-required="true"` na polach `name`, `email`, `message`
- Dodac `aria-invalid` toggle w JS przy bledach walidacji
- Dodac `role="alert"` + `aria-live="assertive"` na kontener bledow
- Dodac live region dla stanow: "Wysylanie...", "Wyslano!", "Blad"

### 1.3 Hamburger menu accessibility
- **Plik**: `index.html:242`, `script.js`
- `aria-expanded="false"` na `<button id="burger">`
- `aria-controls="mobile-nav"` na burger
- Toggle `aria-expanded` w JS
- `role="dialog"` + `aria-label="Menu nawigacyjne"` na `#mobile-nav`

### 1.4 Ghost focus fix
- **Pliki**: `index.html`, `styles.css`
- Ukryte panele uslug z `aria-hidden="true"` → dodac `inert` lub `tabindex="-1"` na interaktywnych elementach

### 1.5 Kontrast kolorow
- **Plik**: `styles.css` / `index.html`
- `text-gray-400` → `text-gray-500` na etykietach kontaktowych
- `placeholder-gray-300` → `placeholder-gray-400` na inputach

### 1.6 Scroll reveal a11y
- **Pliki**: `index.html`, `styles.css`
- Dodac `<noscript><style>[data-reveal]{opacity:1!important;transform:none!important}</style></noscript>`

### 1.7 Hero mockup aria-hidden
- **Plik**: `index.html:309`
- Dodac `aria-hidden="true"` na `.doc-scene`

---

## FALA 2: CRO + Copy (~8 poprawek)

### 2.1 Social Proof Bar (NOWA sekcja)
- Wstawic miedzy Hero a Services
- 3-4 metryki: "50+ godzin oszczednosci/mies.", "98% dokladnosc OCR", "3 dni wdrozenia KSeF", "15+ firm ze Slaska"
- Opcjonalnie placeholder na loga klientow

### 2.2 Reorder sekcji
Nowa kolejnosc:
1. Hero
2. Social Proof Bar (NOWA)
3. Services
4. Case Study (z pozycji #5)
5. Process
6. Why Verte
7. KSeF
8. FAQ
9. Final CTA (NOWA)
10. About
11. Contact

### 2.3 FAQ Accordion
- Zamienic na natywne `<details>`/`<summary>` ze stylowaniem CSS
- Zero dodatkowego JS, pelna accessibility za darmo

### 2.4 CTA po sekcjach
- Mini CTA po: Services, Case Study, FAQ
- "Umow bezplatna konsultacje" → `#contact`

### 2.5 Final CTA section (NOWA)
- Pelnoszerokowa sekcja przed Contact
- "Gotowy, zeby odzyskac 13 godzin tygodniowo?"

### 2.6 Friction reducer pod Hero CTA
- Mikro-copy: "15 minut · Zero zobowiazan · Odpowiedz w 24h"

### 2.7 Copy fixes
- **Proporcja My/Ty**: z 55/45 na ~70/30 na korzysc "Ty"
- **Buzzwordy**: "rozwiazania szyte na miare" → "dopasowane do Twojego workflow" etc.
- **"Dowiedz sie wiecej" x4** → unikalne benefity
- **Powtorzenia**: usunac duplikaty

### 2.8 KSeF urgency
- Dynamiczny countdown do 1 kwietnia 2026
- Zamienic statyczny "1 miesiac" na "za X dni"

---

## FALA 3: SEO + Performance (~8 poprawek)

### 3.1 Schema.org fixes
- Dodac `telephone`, `openingHours` do LocalBusiness (placeholder)
- Dodac `Organization` schema z `logo`
- Dodac `BreadcrumbList` na `polityka-prywatnosci.html`

### 3.2 Script defer
- `<script src="script.js" defer>`

### 3.3 Font optimization
- Redukcja wariantow: Fraunces 400,600 + Outfit 400,500,600
- Usunac nieuzywane (300, 700, italic)

### 3.4 Critical CSS inline
- Krytyczny CSS (nav, hero) inline w `<style>` w `<head>`
- Reszta CSS z lazy load pattern

### 3.5 Link 404 fix
- `index.html` → `/` w 404.html

### 3.6 Linki zewnetrzne
- Link do gov.pl/ksef w sekcji KSeF
- `rel="noopener noreferrer" target="_blank"`

### 3.7 OG image placeholder
- Zostawic reference, dodac komentarz z instrukcja (1200x630px)

### 3.8 Telefon
- Zostawic ukryty z czytelnym TODO komentarzem

---

## Podsumowanie

| Fala | Poprawek | Pliki | Efekt |
|------|----------|-------|-------|
| 1 | 7 | index.html, script.js, styles.css | Dzialajacy formularz, dostepnosc, zero ghost focus |
| 2 | 8 | index.html, script.js | Social proof, lepsza konwersja, czystszy copy |
| 3 | 8 | index.html, 404.html, polityka-prywatnosci.html | Szybsze ladowanie, lepsze SEO |
