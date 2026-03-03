# Audit Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement all ~23 fixes from 5 audits (CRO, SEO, Copywriting, Marketing Design, Accessibility) in 3 priority waves.

**Architecture:** Static HTML/CSS/JS site. No build step for HTML. Tailwind CSS v4 compiled via `npx @tailwindcss/cli`. Vanilla JS ES6 classes in `script.js`. Form backend via Formspree.

**Tech Stack:** HTML5, Tailwind CSS v4, Vanilla JavaScript ES6, Formspree (`xkovlvll`)

---

## WAVE 1: Conversion-Critical

### Task 1: Fix Formspree form ID

**Files:**
- Modify: `index.html:1231`

**Step 1: Replace TODO_FORM_ID with real Formspree ID**

In `index.html:1231`, change:
```html
<form id="contact-form" class="contact-form-card" action="https://formspree.io/f/TODO_FORM_ID" method="POST" novalidate data-needs-setup="true">
```
to:
```html
<form id="contact-form" class="contact-form-card" action="https://formspree.io/f/xkovlvll" method="POST" novalidate>
```

Two changes: replace `TODO_FORM_ID` with `xkovlvll` AND remove `data-needs-setup="true"`.

**Step 2: Verify form action in browser**

Open `index.html` in browser, inspect the form element, confirm `action` is `https://formspree.io/f/xkovlvll`.

---

### Task 2: Form accessibility — aria attributes

**Files:**
- Modify: `index.html:1234-1270`
- Modify: `script.js:249-290`

**Step 1: Add aria-required to required fields**

In `index.html`, add `aria-required="true"` to the 3 required fields:

Line 1235 — name input: add `aria-required="true"` after `required`
Line 1245 — email input: add `aria-required="true"` after `required`
Line 1268 — message textarea: add `aria-required="true"` after `required`

**Step 2: Add aria-describedby and live region for errors**

After each required field's `<input>` or `<textarea>`, the JS already appends `.field-error` elements. We need to wire them with `aria-describedby`.

In `script.js`, modify the `validateField` method's `fail` function (line 261-270). Change:
```javascript
const fail = (msg) => {
    if (!error) {
        error = document.createElement('p');
        error.className = 'field-error text-xs text-red-500 mt-1';
        parent.appendChild(error);
    }
    error.textContent = msg;
    field.classList.add('border-red-300');
    field.classList.remove('border-gray-200');
    return false;
};
```
to:
```javascript
const fail = (msg) => {
    if (!error) {
        error = document.createElement('p');
        error.className = 'field-error text-xs text-red-500 mt-1';
        error.id = field.id + '-error';
        error.setAttribute('role', 'alert');
        parent.appendChild(error);
    }
    error.textContent = msg;
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', error.id);
    field.classList.add('border-red-300');
    field.classList.remove('border-gray-200');
    return false;
};
```

**Step 3: Clear aria-invalid on successful validation**

In `script.js`, after line 277 (`if (error) error.remove();`), add aria cleanup. Change:
```javascript
if (error) error.remove();
field.classList.remove('border-red-300');
field.classList.add('border-gray-200');
return true;
```
to:
```javascript
if (error) error.remove();
field.removeAttribute('aria-invalid');
field.removeAttribute('aria-describedby');
field.classList.remove('border-red-300');
field.classList.add('border-gray-200');
return true;
```

**Step 4: Add live region for form submission status**

In `index.html`, right after the closing `</form>` tag (line 1277), add:
```html
<div id="form-status" class="sr-only" aria-live="assertive" aria-atomic="true"></div>
```

In `script.js`, in the `ContactForm` constructor submit handler, update the status region. After line 199 (`span.textContent = 'Wysyłanie...';`), add:
```javascript
const statusRegion = document.getElementById('form-status');
if (statusRegion) statusRegion.textContent = 'Wysyłanie formularza...';
```

After the success path (line 211, after `if (resp.ok) {`), before `_showButtonState`, add:
```javascript
if (statusRegion) statusRegion.textContent = 'Formularz wysłany pomyślnie. Odezwiemy się w ciągu 24 godzin.';
```

In the catch block (line 220), add:
```javascript
if (statusRegion) statusRegion.textContent = 'Wystąpił błąd podczas wysyłania. Spróbuj ponownie.';
```

---

### Task 3: Hamburger menu accessibility

**Files:**
- Modify: `index.html:242, 250`
- Modify: `script.js:74-78`

**Step 1: Add aria attributes to burger button and mobile nav**

In `index.html:242`, change:
```html
<button id="burger" class="md:hidden flex flex-col gap-1.5 p-2" aria-label="Menu">
```
to:
```html
<button id="burger" class="md:hidden flex flex-col gap-1.5 p-2" aria-label="Menu" aria-expanded="false" aria-controls="mobile-nav">
```

In `index.html:250`, change:
```html
<div id="mobile-nav" class="fixed inset-0 z-40 bg-cream-50/98 backdrop-blur-xl flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-500">
```
to:
```html
<div id="mobile-nav" role="dialog" aria-label="Menu nawigacyjne" class="fixed inset-0 z-40 bg-cream-50/98 backdrop-blur-xl flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-500">
```

**Step 2: Toggle aria-expanded in JS**

In `script.js`, in the `toggle()` method (line 74-101), after line 76:
```javascript
this.burger.classList.toggle('active', this.isOpen);
```
add:
```javascript
this.burger.setAttribute('aria-expanded', String(this.isOpen));
```

---

### Task 4: Ghost focus fix on service card details

**Files:**
- Modify: `index.html:489, 536, 584, 631` (4 service detail panels)

**Step 1: Add inert attribute to hidden detail panels**

The 4 service detail panels (`id="details-1"` through `details-4"`) have `aria-hidden="true"` but still allow Tab focus on their child links. Add `inert` to each.

Line 489: change `<div class="service-card__details mt-4" id="details-1" aria-hidden="true">` to:
```html
<div class="service-card__details mt-4" id="details-1" aria-hidden="true" inert>
```

Do the same for lines 536, 584, 631 (details-2, details-3, details-4).

**Step 2: Toggle inert in JS when expanding**

In `script.js`, in the `ServiceCards.toggle()` method (line 304-310), change:
```javascript
toggle(btn) {
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    const details = document.getElementById(btn.getAttribute('aria-controls'));
    if (!details) return;
    btn.setAttribute('aria-expanded', String(!isExpanded));
    details.setAttribute('aria-hidden', String(isExpanded));
}
```
to:
```javascript
toggle(btn) {
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    const details = document.getElementById(btn.getAttribute('aria-controls'));
    if (!details) return;
    btn.setAttribute('aria-expanded', String(!isExpanded));
    details.setAttribute('aria-hidden', String(isExpanded));
    if (!isExpanded) {
        details.removeAttribute('inert');
    } else {
        details.setAttribute('inert', '');
    }
}
```

---

### Task 5: Color contrast fixes

**Files:**
- Modify: `index.html` (multiple lines)

**Step 1: Fix label contrast in contact info**

In `index.html`, change `text-gray-400` to `text-gray-500` on contact info labels:

Line 1189 (Email label): `text-gray-400` → `text-gray-500`
Line 1201 (Telefon label): `text-gray-400` → `text-gray-500`
Line 1212 (Lokalizacja label): `text-gray-400` → `text-gray-500`

**Step 2: Fix placeholder contrast in form inputs**

In `index.html`, change `placeholder-gray-300` to `placeholder-gray-400` on all form inputs:

Lines 1236, 1241, 1246, 1251, 1269: `placeholder-gray-300` → `placeholder-gray-400`

---

### Task 6: Scroll reveal no-JS fallback + hero mockup aria

**Files:**
- Modify: `index.html:207-208` (before `</head>`)
- Modify: `index.html:309`

**Step 1: Add noscript fallback for scroll reveal**

Before `</head>` (line 208), add:
```html
<noscript><style>[data-reveal]{opacity:1!important;transform:none!important}</style></noscript>
```

**Step 2: Add aria-hidden to hero mockup scene**

Line 309, change:
```html
<div class="reveal-scale hidden md:flex items-center justify-center relative" style="animation-delay:.2s">
```
to:
```html
<div class="reveal-scale hidden md:flex items-center justify-center relative" style="animation-delay:.2s" aria-hidden="true">
```

---

## WAVE 2: CRO + Copy

### Task 7: Add Social Proof Bar + reorder sections

**Files:**
- Modify: `index.html` (major section reorder)

**Step 1: Create Social Proof Bar HTML**

Insert this new section immediately after the closing `</section>` of Hero (after line 455):

```html
        <!-- ===== SOCIAL PROOF BAR ===== -->
        <section class="py-8 md:py-10 px-6 bg-verte-950 border-y border-verte-900">
            <div class="max-w-6xl mx-auto">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
                    <div data-reveal>
                        <div class="font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight">50+</div>
                        <div class="text-verte-300 text-xs sm:text-sm mt-1">godzin oszczędności / mies.</div>
                    </div>
                    <div data-reveal>
                        <div class="font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight">98%</div>
                        <div class="text-verte-300 text-xs sm:text-sm mt-1">dokładność OCR</div>
                    </div>
                    <div data-reveal>
                        <div class="font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight">3 dni</div>
                        <div class="text-verte-300 text-xs sm:text-sm mt-1">wdrożenie KSeF</div>
                    </div>
                    <div data-reveal>
                        <div class="font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight">15+</div>
                        <div class="text-verte-300 text-xs sm:text-sm mt-1">firm ze Śląska</div>
                    </div>
                </div>
            </div>
        </section>
```

**Step 2: Move Case Study section up**

Current section order in `index.html`:
1. Hero (line 266)
2. Services (line 456)
3. Process (line 663)
4. Why Verte (line 723)
5. Case Study (line 788)
6. KSeF (line 971)
7. FAQ (line 1054)
8. About (line 1088)
9. Contact (line 1153)

New order after Social Proof Bar:
1. Hero
2. **Social Proof Bar** (NEW, inserted in Step 1)
3. Services
4. **Case Study** (moved up from #5)
5. Process
6. Why Verte
7. KSeF
8. FAQ
9. **Final CTA** (NEW, added in Task 10)
10. About
11. Contact

Cut the entire Case Study section (from `<!-- ===== CASE STUDY ===== -->` at line 788 through `</section>` at line 968) and paste it right after Services section closes (after the `</section>` that ends Services, which is around line 662).

---

### Task 8: FAQ Accordion

**Files:**
- Modify: `index.html:1062-1083`

**Step 1: Convert FAQ items to details/summary**

Replace the FAQ content (the `<div class="space-y-4" data-reveal>` block at line 1062-1083) with:

```html
                <div class="space-y-3" data-reveal>
                    <details class="bg-white rounded-2xl border border-gray-100 group">
                        <summary class="flex items-center justify-between p-6 cursor-pointer list-none font-display text-lg font-semibold text-verte-900 hover:text-verte-700 transition-colors">
                            Ile kosztują usługi Verte?
                            <svg class="w-5 h-5 text-gray-400 transition-transform duration-300 group-open:rotate-45 shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>
                        </summary>
                        <div class="px-6 pb-6 -mt-1">
                            <p class="text-gray-500 text-sm leading-relaxed">Każdy projekt wyceniamy indywidualnie po bezpłatnej konsultacji. Ceny zależą od zakresu prac — proste automatyzacje zaczynają się od kilkuset złotych, kompleksowe wdrożenia to koszt kilku tysięcy. Zawsze podajemy cenę z góry, bez ukrytych kosztów.</p>
                        </div>
                    </details>
                    <details class="bg-white rounded-2xl border border-gray-100 group">
                        <summary class="flex items-center justify-between p-6 cursor-pointer list-none font-display text-lg font-semibold text-verte-900 hover:text-verte-700 transition-colors">
                            Jak długo trwa wdrożenie?
                            <svg class="w-5 h-5 text-gray-400 transition-transform duration-300 group-open:rotate-45 shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>
                        </summary>
                        <div class="px-6 pb-6 -mt-1">
                            <p class="text-gray-500 text-sm leading-relaxed">Zależy od złożoności. Proste automatyzacje (generowanie dokumentów, OCR) uruchamiamy w 3-5 dni roboczych. Kompleksowy obieg dokumentów to 2-4 tygodnie. Zawsze podajemy konkretny harmonogram.</p>
                        </div>
                    </details>
                    <details class="bg-white rounded-2xl border border-gray-100 group">
                        <summary class="flex items-center justify-between p-6 cursor-pointer list-none font-display text-lg font-semibold text-verte-900 hover:text-verte-700 transition-colors">
                            Czy muszę zmieniać swoje oprogramowanie?
                            <svg class="w-5 h-5 text-gray-400 transition-transform duration-300 group-open:rotate-45 shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>
                        </summary>
                        <div class="px-6 pb-6 -mt-1">
                            <p class="text-gray-500 text-sm leading-relaxed">Nie. Rozwiązania Verte integrują się z narzędziami, których już używasz — Excel, programy księgowe (Optima, Symfonia, enova, wFirma), systemy CRM i inne. Budujemy mosty, nie wymagamy rewolucji.</p>
                        </div>
                    </details>
                    <details class="bg-white rounded-2xl border border-gray-100 group">
                        <summary class="flex items-center justify-between p-6 cursor-pointer list-none font-display text-lg font-semibold text-verte-900 hover:text-verte-700 transition-colors">
                            Co jeśli coś nie działa?
                            <svg class="w-5 h-5 text-gray-400 transition-transform duration-300 group-open:rotate-45 shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>
                        </summary>
                        <div class="px-6 pb-6 -mt-1">
                            <p class="text-gray-500 text-sm leading-relaxed">Każde wdrożenie obejmuje okres wsparcia. Dzwoń, pisz — naprawiamy w ramach umowy, bez dodatkowych opłat.</p>
                        </div>
                    </details>
                    <details class="bg-white rounded-2xl border border-gray-100 group">
                        <summary class="flex items-center justify-between p-6 cursor-pointer list-none font-display text-lg font-semibold text-verte-900 hover:text-verte-700 transition-colors">
                            Czy obsługujecie firmy spoza Śląska?
                            <svg class="w-5 h-5 text-gray-400 transition-transform duration-300 group-open:rotate-45 shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>
                        </summary>
                        <div class="px-6 pb-6 -mt-1">
                            <p class="text-gray-500 text-sm leading-relaxed">Tak. Prace wdrożeniowe prowadzimy zdalnie, więc lokalizacja nie jest przeszkodą. Spotkania osobiste oferujemy przede wszystkim firmom z regionu śląskiego.</p>
                        </div>
                    </details>
                </div>
```

**Step 2: Add CSS for details/summary styling**

In `styles.css`, add at the end:
```css
/* FAQ Accordion */
details summary::-webkit-details-marker { display: none; }
details summary::marker { display: none; }
details[open] > summary { border-bottom: 1px solid rgb(243 244 246); border-radius: 1rem 1rem 0 0; }
details > div { animation: faq-open 0.3s ease-out; }
@keyframes faq-open { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
```

---

### Task 9: Add CTA sections after Services and FAQ

**Files:**
- Modify: `index.html`

**Step 1: Add CTA after Services section**

After the Services `</section>` closing tag (and before Case Study in the new order), add:
```html
        <!-- CTA after Services -->
        <div class="py-12 px-6 text-center" data-reveal>
            <p class="text-gray-500 mb-4">Chcesz zobaczyć, jak to działa w Twojej firmie?</p>
            <a href="#contact" class="inline-flex items-center gap-2 text-verte-700 font-semibold hover:text-verte-800 transition-colors">
                Umów bezpłatną konsultację
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
        </div>
```

**Step 2: Add CTA after FAQ section**

After the FAQ `</section>` closing tag, add:
```html
        <!-- CTA after FAQ -->
        <div class="py-12 px-6 text-center" data-reveal>
            <p class="text-gray-500 mb-4">Nie znalazłeś odpowiedzi?</p>
            <a href="#contact" class="inline-flex items-center gap-2 text-verte-700 font-semibold hover:text-verte-800 transition-colors">
                Napisz — odpowiemy w ciągu 24h
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
        </div>
```

---

### Task 10: Add Final CTA section

**Files:**
- Modify: `index.html`

**Step 1: Insert Final CTA section before About**

Between FAQ (with its CTA) and About section, add:
```html
        <!-- ===== FINAL CTA ===== -->
        <section class="py-24 md:py-32 px-6 bg-verte-700 relative overflow-hidden">
            <div class="max-w-3xl mx-auto text-center relative z-10" data-reveal>
                <h2 class="font-display text-3xl sm:text-4xl lg:text-5xl font-600 text-white leading-tight tracking-tight mb-6" style="font-weight:600">
                    Gotowy, żeby odzyskać<br><span class="italic font-normal text-verte-200">13&nbsp;godzin tygodniowo?</span>
                </h2>
                <p class="text-verte-100/80 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                    15 minut rozmowy wystarczy, żebyś zobaczył, ile czasu i pieniędzy tracisz na dokumenty. Bez zobowiązań.
                </p>
                <a href="#contact" class="inline-flex items-center gap-2.5 bg-white text-verte-800 font-bold px-8 py-4 rounded-full hover:bg-cream-50 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-0.5">
                    Umów bezpłatną konsultację
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </a>
            </div>
        </section>
```

---

### Task 11: Friction reducer under Hero CTA

**Files:**
- Modify: `index.html:298-306`

**Step 1: Add micro-copy below CTA buttons**

After the CTA buttons `</div>` (line 306), add:
```html
                    <div class="reveal-up flex items-center gap-4 text-xs text-gray-400 mt-4" style="animation-delay:.3s">
                        <span class="flex items-center gap-1">
                            <svg class="w-3.5 h-3.5 text-verte-500" fill="none" viewBox="0 0 20 20"><path d="M6 10l3 3 5-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            15 minut
                        </span>
                        <span class="flex items-center gap-1">
                            <svg class="w-3.5 h-3.5 text-verte-500" fill="none" viewBox="0 0 20 20"><path d="M6 10l3 3 5-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            Zero zobowiązań
                        </span>
                        <span class="flex items-center gap-1">
                            <svg class="w-3.5 h-3.5 text-verte-500" fill="none" viewBox="0 0 20 20"><path d="M6 10l3 3 5-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            Odpowiedź w 24h
                        </span>
                    </div>
```

---

### Task 12: Copy fixes

**Files:**
- Modify: `index.html` (multiple locations)

**Step 1: Fix "rozwiązania szyte na miarę" buzzword (line 288)**

Change line 288:
```html
Od generowania PDF-ów jednym kliknięciem po&nbsp;pełną integrację z&nbsp;KSeF &mdash; rozwiązania szyte na&nbsp;miarę dla firm ze&nbsp;Śląska.
```
to:
```html
Od generowania PDF-ów jednym kliknięciem po&nbsp;pełną integrację z&nbsp;KSeF &mdash; dopasowane do&nbsp;Twojego sposobu pracy.
```

**Step 2: Fix "Technologia, która rozumie biznes" in About (line 1116)**

Change:
```html
Technologia, <span class="font-display italic font-normal text-verte-600">która rozumie biznes</span>
```
to:
```html
Narzędzia dopasowane<br><span class="font-display italic font-normal text-verte-600">do Twojego biznesu</span>
```

**Step 3: Fix "nowoczesna technologia" in About (line 1123)**

Change:
```html
<strong class="text-gray-700">nowoczesna technologia nie powinna być zarezerwowana dla korporacji.</strong>
```
to:
```html
<strong class="text-gray-700">sprawdzone narzędzia nie powinny być zarezerwowane dla korporacji.</strong>
```

**Step 4: Fix My/Ty ratio — Process section (line 671)**

Change:
```html
Nie musisz znać się na technologii. Ty mówisz, co Ci przeszkadza &mdash; my to naprawiamy.
```
to:
```html
Nie musisz znać się na technologii. Mówisz, co Ci przeszkadza &mdash; dostajesz działające rozwiązanie.
```

**Step 5: Fix "gotowe pudełko" duplicate (line 694 and 752)**

Line 694 (Process step 2): Keep as is — "Nie gotowe pudełko — coś, co pasuje jak rękawiczka."

Line 752 (Why Verte "Na miarę"): Change:
```html
Nie sprzedajemy gotowego pudełka. Budujemy rozwiązanie pod Twój sposób pracy.
```
to:
```html
Każde wdrożenie projektujemy pod Twój sposób pracy. Bez szablonów.
```

**Step 6: Fix FAQ copy — remove "Nasze rozwiązania" (line 1073 in current FAQ)**

In the FAQ accordion (from Task 8), change:
```
Nie. Nasze rozwiązania integrują się z narzędziami
```
to:
```
Nie. Rozwiązania Verte integrują się z narzędziami
```
(Already done in Task 8 accordion text above.)

---

### Task 13: KSeF countdown urgency fix

**Files:**
- Modify: `script.js:381-410`

**Step 1: Always show days when under 60 days**

Change the `KsefCountdown.update()` method (line 389-409):
```javascript
update() {
    const deadline = new Date('2026-04-01T00:00:00');
    const now = new Date();
    const diff = deadline - now;

    if (diff <= 0) {
        this.el.textContent = 'KSeF jest już obowiązkowy!';
        if (this.copy) {
            this.copy.textContent = 'Obowiązkowe e-fakturowanie już obowiązuje. Jeśli Twoja firma jeszcze nie wdrożyła KSeF — czas działać. Pomożemy Ci szybko nadrobić zaległości i uniknąć kar.';
        }
        return;
    }

    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days > 30) {
        const months = Math.floor(days / 30);
        this.el.textContent = `Zostało ${months} ${pluralize(months, 'miesiąc', 'miesiące', 'miesięcy')} do obowiązkowego KSeF`;
    } else {
        this.el.textContent = `Zostało tylko ${days} ${pluralize(days, 'dzień', 'dni', 'dni')} do obowiązkowego KSeF!`;
    }
}
```
to:
```javascript
update() {
    const deadline = new Date('2026-04-01T00:00:00');
    const now = new Date();
    const diff = deadline - now;

    if (diff <= 0) {
        this.el.textContent = 'KSeF jest już obowiązkowy!';
        if (this.copy) {
            this.copy.textContent = 'Obowiązkowe e-fakturowanie już obowiązuje. Jeśli Twoja firma jeszcze nie wdrożyła KSeF — czas działać. Pomożemy Ci szybko nadrobić zaległości i uniknąć kar.';
        }
        return;
    }

    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    this.el.textContent = `Zostało tylko ${days} ${pluralize(days, 'dzień', 'dni', 'dni')} do obowiązkowego KSeF!`;
}
```

This always shows days (e.g. "Zostało tylko 29 dni") instead of rounding to "1 miesiąc" when over 30 days.

---

## WAVE 3: SEO + Performance

### Task 14: Schema.org fixes

**Files:**
- Modify: `index.html:46-69` (LocalBusiness schema)
- Modify: `polityka-prywatnosci.html`

**Step 1: Add telephone and openingHours to LocalBusiness**

In `index.html`, in the LocalBusiness schema (after `"email": "kontakt@verte.pl",` at line 51), add:
```json
"telephone": "+48 XXX XXX XXX",
"openingHours": "Mo-Fr 09:00-17:00",
```

**Step 2: Add Organization schema to @graph**

After the Review object in the @graph array (around line 204), add:
```json
,
{
    "@type": "Organization",
    "name": "Verte",
    "url": "https://verte.pl/",
    "logo": "https://verte.pl/og-image.png",
    "email": "kontakt@verte.pl",
    "address": {
        "@type": "PostalAddress",
        "addressLocality": "Gliwice",
        "addressRegion": "Śląsk",
        "addressCountry": "PL"
    }
}
```

**Step 3: Add BreadcrumbList to polityka-prywatnosci.html**

In `polityka-prywatnosci.html`, add a JSON-LD block in `<head>` before `</head>`:
```html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        {
            "@type": "ListItem",
            "position": 1,
            "name": "Strona główna",
            "item": "https://verte.pl/"
        },
        {
            "@type": "ListItem",
            "position": 2,
            "name": "Polityka prywatności"
        }
    ]
}
</script>
```

---

### Task 15: Script defer

**Files:**
- Modify: `index.html:1342`

**Step 1: Add defer to script tag**

Change line 1342:
```html
<script src="script.js"></script>
```
to:
```html
<script src="script.js" defer></script>
```

---

### Task 16: Font optimization

**Files:**
- Modify: `index.html:32-33`
- Modify: `404.html:12-13`

**Step 1: Reduce font variants in index.html**

Change line 32 (the preload link):
```
family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500;1,9..144,600&family=Outfit:wght@300;400;500;600;700
```
to:
```
family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Outfit:wght@400;500;600
```

Apply the same change to line 33 (noscript fallback) and to `404.html:12-13`.

---

### Task 17: Critical CSS inline

**Files:**
- Modify: `index.html:34-35`

**Step 1: Add critical CSS inline in head**

Before `<link rel="stylesheet" href="tailwind-output.css">` (line 34), add a `<style>` block with the critical above-the-fold CSS. This includes nav styles, hero text sizing, bg-cream-50 color, basic font-display/font-body definitions, and the most important Tailwind utilities:

```html
<style>
/* Critical CSS — above the fold */
:root{--color-cream-50:#faf8f5;--color-verte-50:#e8f5ee;--color-verte-100:#c5e8d3;--color-verte-200:#89cca7;--color-verte-500:#2a9d5e;--color-verte-600:#247f4d;--color-verte-700:#245f40;--color-verte-800:#1b4a31;--color-verte-900:#143a26;--color-verte-950:#0d2418}
body{margin:0;background:#faf8f5;font-family:Outfit,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.font-display{font-family:Fraunces,Georgia,serif}
.font-body{font-family:Outfit,system-ui,sans-serif}
#nav{position:fixed;top:0;left:0;right:0;z-index:50}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}
[data-reveal]{opacity:0;transform:translateY(20px);transition:opacity .6s ease,transform .6s ease}
[data-reveal].visible{opacity:1;transform:none}
</style>
```

Then change the CSS links to lazy-load:
```html
<link rel="stylesheet" href="tailwind-output.css" media="print" onload="this.media='all'">
<link rel="stylesheet" href="styles.css" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="tailwind-output.css"><link rel="stylesheet" href="styles.css"></noscript>
```

---

### Task 18: Fix 404 link

**Files:**
- Modify: `404.html:26`

**Step 1: Change index.html to /**

Change line 26:
```html
<a href="index.html"
```
to:
```html
<a href="/"
```

---

### Task 19: Add external link to KSeF section

**Files:**
- Modify: `index.html` (KSeF section, around line 983)

**Step 1: Add gov.pl reference**

In the KSeF section paragraph (line 983), after "Przeprowadzimy Cię przez to bez stresu.", add a sentence with link:

Change:
```html
Przeprowadzimy Cię przez to bez stresu.
```
to:
```html
Przeprowadzimy Cię przez to bez stresu. <a href="https://www.podatki.gov.pl/ksef/" target="_blank" rel="noopener noreferrer" class="text-white underline underline-offset-2 hover:text-verte-200 transition-colors">Więcej o&nbsp;KSeF na&nbsp;gov.pl&nbsp;&rarr;</a>
```

---

### Task 20: OG image + phone placeholders cleanup

**Files:**
- Modify: `index.html:17`

**Step 1: Improve OG image comment**

Change line 17:
```html
<!-- TODO: Replace with actual OG image path (recommended: 1200x630px) -->
```
to:
```html
<!-- TODO: Dodaj plik og-image.png (1200x630px) do katalogu głównego. Powinien zawierać: logo Verte, hasło "Automatyzacja dokumentów", zielone tło brand. Bez tego social media nie pokażą miniaturki. -->
```

Phone number: already hidden with `display:none` and has a TODO comment — leave as is.

---

### Task 21: Build Tailwind CSS

**Step 1: Rebuild tailwind-output.css**

Run: `npm run build:css`

This recompiles Tailwind with any new utility classes used in new HTML (Social Proof Bar, Final CTA, FAQ accordion, etc.).

---

### Task 22: Visual verification in browser

**Step 1: Open index.html and check all sections**

Verify in browser:
- Social Proof Bar visible between Hero and Services
- Case Study appears after Services
- FAQ items collapse/expand
- Final CTA section visible before About
- Friction reducer checkmarks visible under Hero CTA
- Form submits to Formspree (test with real data)
- Mobile hamburger reports correct aria-expanded
- Tab key does not focus into collapsed service details
- Color contrast looks acceptable on labels

---
