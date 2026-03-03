# Production-Ready Verte Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the Verte website production-ready with working form backend, legal compliance, conversion optimization, and expanded content.

**Architecture:** Static HTML/CSS/JS site. No build step. Tailwind CSS v4 via CDN. Vanilla JS ES6 classes. Form backend via Formspree (third-party service, zero server code). New pages (privacy policy, 404) share the same Tailwind config and font stack.

**Tech Stack:** HTML5, Tailwind CSS v4 (CDN), Vanilla JavaScript ES6, Formspree (form backend)

---

## FAZA 1: Blokery Launch

### Task 1: Form Backend Integration (Formspree)

**Context:** The contact form at `index.html:1082-1110` currently fakes submission — `ContactForm` in `script.js:132-223` intercepts submit, shows a fake success message after 600ms setTimeout, and silently discards all data. We need to wire it to Formspree so leads actually arrive.

**Files:**
- Modify: `index.html:1082` (add form attributes)
- Modify: `script.js:132-166` (replace fake submit with real fetch)

**Step 1: Add Formspree attributes to the form tag**

In `index.html`, find line 1082:
```html
<form id="contact-form" class="contact-form-card">
```

Replace with:
```html
<!-- TODO: Replace TODO_FORM_ID with your Formspree form ID.
     1. Go to https://formspree.io and create a free account
     2. Create a new form, copy the form ID (e.g. "xpzvqkdl")
     3. Replace TODO_FORM_ID below with that ID -->
<form id="contact-form" class="contact-form-card" action="https://formspree.io/f/TODO_FORM_ID" method="POST" novalidate>
```

**Step 2: Replace the fake submit handler with real fetch**

In `script.js`, replace the entire submit event listener (lines 137-166) with:

```javascript
this.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!this.validate()) return;

    const btn = this.form.querySelector('button[type="submit"]');
    const span = btn.querySelector('span');
    const origText = span.textContent;

    // Loading state
    span.textContent = 'Wysyłanie...';
    btn.style.pointerEvents = 'none';
    btn.classList.add('opacity-80');

    try {
        const resp = await fetch(this.form.action, {
            method: 'POST',
            body: new FormData(this.form),
            headers: { 'Accept': 'application/json' }
        });

        if (resp.ok) {
            // Success state
            span.textContent = 'Wysłano! Odezwiemy się w ciągu 24h';
            btn.classList.remove('opacity-80');
            btn.classList.remove('bg-verte-700', 'hover:bg-verte-800');
            btn.classList.add('bg-verte-500');

            setTimeout(() => {
                span.textContent = origText;
                btn.style.pointerEvents = '';
                btn.classList.remove('bg-verte-500');
                btn.classList.add('bg-verte-700', 'hover:bg-verte-800');
                this.form.reset();
                this.clearErrors();
            }, 3500);
        } else {
            throw new Error('Form submission failed');
        }
    } catch (err) {
        // Error state
        span.textContent = 'Coś poszło nie tak — spróbuj ponownie';
        btn.classList.remove('opacity-80');
        btn.classList.remove('bg-verte-700', 'hover:bg-verte-800');
        btn.classList.add('bg-red-500');

        setTimeout(() => {
            span.textContent = origText;
            btn.style.pointerEvents = '';
            btn.classList.remove('bg-red-500');
            btn.classList.add('bg-verte-700', 'hover:bg-verte-800');
        }, 3500);
    }
});
```

**Step 3: Verify in browser**

Open `index.html` in browser, fill in the form, submit. Because `TODO_FORM_ID` isn't a real ID yet, the fetch should fail gracefully and show the error message "Coś poszło nie tak — spróbuj ponownie". This confirms the error path works. The success path will work once a real Formspree ID is configured.

---

### Task 2: Privacy Policy Page

**Context:** The footer at `index.html:1150` says "Dane przetwarzamy zgodnie z RODO" but there's no linked privacy policy. GDPR requires one when collecting personal data via the contact form.

**Files:**
- Create: `polityka-prywatnosci.html`
- Modify: `index.html:1150` (link to privacy policy from footer)
- Modify: `index.html:1109` (add privacy note under form)

**Step 1: Create `polityka-prywatnosci.html`**

Create a new file with the same `<head>` structure as `index.html` (same Tailwind CDN, same fonts, same favicon, same config). Body contains a simple centered article layout with these sections in Polish:

```html
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Polityka prywatności — Verte</title>
    <meta name="description" content="Polityka prywatności serwisu Verte. Informacje o przetwarzaniu danych osobowych zgodnie z RODO.">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='32' height='32' rx='6' fill='%23245f40'/%3E%3Cpath d='M16 6L8 11v10l8 5 8-5V11L16 6z' fill='white' opacity='.9'/%3E%3C/svg%3E">
    <meta name="theme-color" content="#245f40">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500;1,9..144,600&family=Outfit:wght@300;400;500;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500;1,9..144,600&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet"></noscript>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        verte: { 50:'#f0f9f4',100:'#daf0e3',200:'#b8e1c9',300:'#89cca7',400:'#56b17f',500:'#3a9464',600:'#2d7850',700:'#245f40',800:'#1f4d35',900:'#1a402d',950:'#0d2318' },
                        cream: { 50:'#fdfaf6',100:'#f9f3ea',200:'#f0e6d5' }
                    },
                    fontFamily: {
                        display: ['Fraunces','Georgia','serif'],
                        body: ['Outfit','system-ui','sans-serif']
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-cream-50 text-gray-800 font-body antialiased">
    <nav class="border-b border-gray-100 bg-cream-50/90 backdrop-blur-sm sticky top-0 z-50">
        <div class="max-w-3xl mx-auto flex items-center justify-between px-6 py-4">
            <a href="index.html" class="flex items-center gap-2">
                <div class="w-8 h-8 bg-verte-700 rounded-lg flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L2 5v6l6 4 6-4V5L8 1z" fill="white" opacity=".9"/></svg>
                </div>
                <span class="font-display text-xl font-semibold text-verte-900 tracking-tight">Verte</span>
            </a>
            <a href="index.html" class="text-sm text-gray-500 hover:text-verte-600 transition-colors">&larr; Wróć na stronę</a>
        </div>
    </nav>

    <main class="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <h1 class="font-display text-3xl sm:text-4xl font-semibold text-verte-950 tracking-tight mb-8">Polityka prywatności</h1>
        <p class="text-sm text-gray-400 mb-12">Ostatnia aktualizacja: 2 marca 2026</p>

        <article class="prose-verte space-y-10 text-gray-600 leading-relaxed">
            <section>
                <h2 class="font-display text-xl font-semibold text-verte-900 mb-3">1. Administrator danych</h2>
                <!-- TODO: Wstaw prawdziwe dane firmy (nazwa, NIP, adres) -->
                <p>Administratorem Twoich danych osobowych jest Verte z siedzibą w Gliwicach. Kontakt: <a href="mailto:kontakt@verte.pl" class="text-verte-600 hover:text-verte-700 underline">kontakt@verte.pl</a>.</p>
            </section>

            <section>
                <h2 class="font-display text-xl font-semibold text-verte-900 mb-3">2. Jakie dane zbieramy</h2>
                <p>Zbieramy wyłącznie dane podane przez Ciebie dobrowolnie w formularzu kontaktowym:</p>
                <ul class="list-disc pl-6 mt-2 space-y-1">
                    <li>Imię i nazwisko</li>
                    <li>Nazwa firmy (opcjonalnie)</li>
                    <li>Adres email</li>
                    <li>Numer telefonu (opcjonalnie)</li>
                    <li>Treść wiadomości</li>
                </ul>
            </section>

            <section>
                <h2 class="font-display text-xl font-semibold text-verte-900 mb-3">3. Cel przetwarzania</h2>
                <p>Twoje dane przetwarzamy wyłącznie w celu:</p>
                <ul class="list-disc pl-6 mt-2 space-y-1">
                    <li>Odpowiedzi na Twoje zapytanie</li>
                    <li>Przedstawienia oferty usług Verte</li>
                    <li>Kontaktu w sprawie potencjalnej współpracy</li>
                </ul>
            </section>

            <section>
                <h2 class="font-display text-xl font-semibold text-verte-900 mb-3">4. Podstawa prawna</h2>
                <p>Podstawą prawną przetwarzania jest art. 6 ust. 1 lit. f) RODO — prawnie uzasadniony interes administratora (odpowiedź na zapytanie) oraz art. 6 ust. 1 lit. a) RODO (Twoja zgoda wyrażona przez wysłanie formularza).</p>
            </section>

            <section>
                <h2 class="font-display text-xl font-semibold text-verte-900 mb-3">5. Okres przechowywania</h2>
                <p>Dane przechowujemy przez okres niezbędny do realizacji celu, w jakim zostały zebrane — nie dłużej niż 12 miesięcy od ostatniego kontaktu, chyba że nawiążemy współpracę (wtedy przez okres jej trwania + okres wymagany przepisami prawa).</p>
            </section>

            <section>
                <h2 class="font-display text-xl font-semibold text-verte-900 mb-3">6. Twoje prawa</h2>
                <p>Masz prawo do:</p>
                <ul class="list-disc pl-6 mt-2 space-y-1">
                    <li>Dostępu do swoich danych</li>
                    <li>Sprostowania danych</li>
                    <li>Usunięcia danych ("prawo do bycia zapomnianym")</li>
                    <li>Ograniczenia przetwarzania</li>
                    <li>Przenoszenia danych</li>
                    <li>Wniesienia sprzeciwu wobec przetwarzania</li>
                    <li>Wniesienia skargi do Prezesa UODO</li>
                </ul>
                <p class="mt-2">Aby skorzystać z powyższych praw, napisz na: <a href="mailto:kontakt@verte.pl" class="text-verte-600 hover:text-verte-700 underline">kontakt@verte.pl</a>.</p>
            </section>

            <section>
                <h2 class="font-display text-xl font-semibold text-verte-900 mb-3">7. Odbiorcy danych</h2>
                <p>Dane z formularza kontaktowego przetwarzane są za pośrednictwem usługi Formspree Inc. (podmiot przetwarzający dane zgodnie z polityką prywatności Formspree). Nie przekazujemy danych innym podmiotom trzecim.</p>
            </section>

            <section>
                <h2 class="font-display text-xl font-semibold text-verte-900 mb-3">8. Pliki cookies</h2>
                <p>Strona nie wykorzystuje plików cookies ani narzędzi śledzących.</p>
            </section>
        </article>
    </main>

    <footer class="py-8 px-6 border-t border-gray-100">
        <div class="max-w-3xl mx-auto text-center">
            <small class="text-xs text-gray-300">&copy; 2026 Verte. Wszelkie prawa zastrzeżone.</small>
        </div>
    </footer>
</body>
</html>
```

**Step 2: Link from footer**

In `index.html`, find line 1150:
```html
<p class="text-xs text-gray-300">Dane przetwarzamy zgodnie z RODO.</p>
```

Replace with:
```html
<a href="polityka-prywatnosci.html" class="text-xs text-gray-300 hover:text-verte-600 transition-colors underline">Polityka prywatności (RODO)</a>
```

**Step 3: Add privacy note under contact form**

In `index.html`, find line 1109:
```html
<p class="text-xs text-gray-400 text-center mt-4">Odpowiadamy w ciągu 24 godzin. Bez spamu, obiecujemy.</p>
```

Replace with:
```html
<p class="text-xs text-gray-400 text-center mt-4">Odpowiadamy w ciągu 24 godzin. Bez spamu, obiecujemy. <a href="polityka-prywatnosci.html" class="underline hover:text-verte-600 transition-colors">Polityka prywatności</a>.</p>
```

**Step 4: Verify** — open `polityka-prywatnosci.html` in browser. Confirm styling matches main site. Click "Wróć na stronę" link — should go to `index.html`.

---

### Task 3: SEO Technical Files

**Context:** Missing `sitemap.xml`, `robots.txt`, `og:image`, and `theme-color` meta tag.

**Files:**
- Create: `sitemap.xml`
- Create: `robots.txt`
- Modify: `index.html:15-21` (add og:image, twitter:image, theme-color)

**Step 1: Create `sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://verte.pl/</loc>
        <lastmod>2026-03-02</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://verte.pl/polityka-prywatnosci.html</loc>
        <lastmod>2026-03-02</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
    </url>
</urlset>
```

**Step 2: Create `robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://verte.pl/sitemap.xml
```

**Step 3: Add og:image, twitter:image, and theme-color meta tags**

In `index.html`, after line 16 (`og:locale` meta tag), add:
```html
<!-- TODO: Replace with actual OG image path (recommended: 1200x630px) -->
<meta property="og:image" content="https://verte.pl/og-image.png">
<meta name="twitter:image" content="https://verte.pl/og-image.png">
<meta name="theme-color" content="#245f40">
```

---

### Task 4: TODO Placeholders for Personal Data

**Context:** Phone number at line 1064 is placeholder `+48 XXX XXX XXX`. About photo at line 964 is a placeholder. Need clear TODO comments.

**Files:**
- Modify: `index.html:1056` (phone TODO)
- Modify: `index.html:957-967` (photo TODO)

**Step 1: Add TODO comment before phone link**

In `index.html`, find line 1056:
```html
<a href="tel:+48000000000" class="flex items-center gap-4 group">
```

Add a comment before it:
```html
<!-- TODO: Wstaw prawdziwy numer telefonu w href i w tekście poniżej -->
<a href="tel:+48000000000" class="flex items-center gap-4 group">
```

**Step 2: Add TODO comment for about photo**

In `index.html`, find line 958:
```html
<div class="w-full aspect-square bg-verte-100 rounded-3xl flex items-center justify-center relative overflow-hidden">
```

Add a comment before it:
```html
<!-- TODO: Zamień ten placeholder na prawdziwe zdjęcie: <img src="twoje-zdjecie.jpg" alt="..." class="w-full aspect-square object-cover rounded-3xl"> -->
<div class="w-full aspect-square bg-verte-100 rounded-3xl flex items-center justify-center relative overflow-hidden">
```

---

## FAZA 2: Konwersja

### Task 5: Scroll-Spy Active Navigation

**Context:** The navigation at `index.html:134-140` has 5 links (Usługi, Proces, KSeF, O mnie, Kontakt) but none highlights when the corresponding section is visible. We need a ScrollSpy class.

**Files:**
- Modify: `script.js` (add ScrollSpy class + init)
- Modify: `styles.css` (add active nav link style)

**Step 1: Add CSS for active nav link**

In `styles.css`, after the nav section (after line 62, after `#mobile-nav.active`), add:

```css
/* Active nav link (scroll-spy) */
.nav-link.active {
    color: #245f40;
}
.nav-link {
    position: relative;
}
.nav-link::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    right: 0;
    height: 2px;
    background: #245f40;
    border-radius: 1px;
    transform: scaleX(0);
    transition: transform .25s ease;
}
.nav-link.active::after {
    transform: scaleX(1);
}
```

**Step 2: Add ScrollSpy class to script.js**

Add before the `// INIT` section (before line 347):

```javascript
// ================================================
// SCROLL SPY — highlight active nav link
// ================================================
class ScrollSpy {
    constructor() {
        this.links = document.querySelectorAll('.nav-link');
        this.sections = [];

        this.links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const section = document.querySelector(href);
                if (section) this.sections.push({ id: href.slice(1), el: section, link });
            }
        });

        if (!this.sections.length) return;

        this.ticking = false;
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.update();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });

        this.update();
    }

    update() {
        const scrollY = window.scrollY + 120;
        let current = null;

        for (const s of this.sections) {
            if (s.el.offsetTop <= scrollY) current = s;
        }

        this.sections.forEach(s => s.link.classList.remove('active'));
        if (current) current.link.classList.add('active');
    }
}
```

**Step 3: Initialize in DOMContentLoaded**

In the init section, add `new ScrollSpy();` after `new Navigation();`.

**Step 4: Verify** — open page, scroll through sections. The nav link for the current section should underline in green.

---

### Task 6: Sticky Mobile CTA Bar

**Context:** On mobile, after scrolling past the hero, there's no visible CTA. We need a fixed bottom bar on screens < 768px that appears after ~300px scroll.

**Files:**
- Modify: `index.html` (add sticky bar before `</body>`)
- Modify: `styles.css` (add styles)
- Modify: `script.js` (add show/hide logic)

**Step 1: Add HTML before closing `</body>` tag**

In `index.html`, before `<script src="script.js"></script>` (line 1163), add:

```html
<!-- Sticky mobile CTA -->
<div id="mobile-cta" class="fixed bottom-0 left-0 right-0 z-40 md:hidden translate-y-full transition-transform duration-300" aria-hidden="true">
    <div class="bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-3 flex items-center justify-between gap-3">
        <span class="text-sm text-gray-600 font-medium">Porozmawiajmy o Twojej firmie</span>
        <a href="#contact" class="inline-flex items-center gap-1.5 bg-verte-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-verte-800 transition-colors shrink-0">
            Napisz do nas
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
    </div>
</div>
```

**Step 2: Add MobileCTA class to script.js**

Add before the `// INIT` section:

```javascript
// ================================================
// MOBILE CTA — sticky bottom bar
// ================================================
class MobileCTA {
    constructor() {
        this.el = document.getElementById('mobile-cta');
        if (!this.el || window.innerWidth >= 768) return;

        this.visible = false;
        window.addEventListener('scroll', () => {
            const show = window.scrollY > 300;
            if (show !== this.visible) {
                this.visible = show;
                this.el.classList.toggle('translate-y-full', !show);
                this.el.classList.toggle('translate-y-0', show);
                this.el.setAttribute('aria-hidden', String(!show));
            }
        }, { passive: true });
    }
}
```

**Step 3: Initialize in DOMContentLoaded**

Add `new MobileCTA();` in the init block.

**Step 4: Verify** — resize browser to < 768px width, scroll past hero. Bar should slide up from bottom. Click "Napisz do nas" — should smooth-scroll to contact.

---

### Task 7: Expand Contact Form (Phone + Service Selector)

**Context:** The form at `index.html:1082-1110` collects name, company, email, message. Missing: phone field (optional) and service selector dropdown.

**Files:**
- Modify: `index.html:1098-1099` (add phone field and service dropdown between email and message)
- Modify: `script.js:198-208` (add phone validation)

**Step 1: Add phone and service fields in HTML**

In `index.html`, after the email field's closing `</div>` (after the email input div, which ends around line 1098), add:

```html
<div>
    <label for="phone" class="block text-sm font-medium text-gray-700 mb-1.5">Telefon <span class="text-gray-300 font-normal">(opcjonalnie)</span></label>
    <input type="tel" id="phone" name="phone" placeholder="+48 123 456 789" autocomplete="tel"
        class="w-full bg-cream-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-300 focus:outline-none focus:border-verte-500 focus:ring-4 focus:ring-verte-500/10 transition-all">
</div>
<div>
    <label for="service" class="block text-sm font-medium text-gray-700 mb-1.5">Czego dotyczy zapytanie?</label>
    <select id="service" name="service"
        class="w-full bg-cream-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-verte-500 focus:ring-4 focus:ring-verte-500/10 transition-all appearance-none"
        style="background-image: url('data:image/svg+xml,%3Csvg width=%2712%27 height=%2712%27 viewBox=%270 0 12 12%27 fill=%27none%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath d=%27M3 4.5l3 3 3-3%27 stroke=%27%239CA3AF%27 stroke-width=%271.5%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E'); background-repeat: no-repeat; background-position: right 16px center;">
        <option value="">Wybierz temat...</option>
        <option value="dokumenty">Generowanie dokumentów</option>
        <option value="ksef">Wdrożenie KSeF</option>
        <option value="obieg">Obieg dokumentów</option>
        <option value="ocr">OCR / wyciąganie danych</option>
        <option value="inne">Inne</option>
    </select>
</div>
```

**Step 2: Add phone validation in script.js**

In the `validateField` method, after the email validation block (after line 208), add phone validation:

```javascript
if (field.type === 'tel' && field.value.trim() && !/^[+\d\s()-]{7,}$/.test(field.value)) {
    if (!error) {
        error = document.createElement('p');
        error.className = 'field-error text-xs text-red-500 mt-1';
        parent.appendChild(error);
    }
    error.textContent = 'Podaj poprawny numer telefonu';
    field.classList.add('border-red-300');
    field.classList.remove('border-gray-200');
    return false;
}
```

**Step 3: Verify** — refresh page, see two new fields. Phone validation should only trigger if something is typed (optional field). Service dropdown should show 5 options.

---

### Task 8: Calendly CTA in Contact Section

**Context:** The hero CTA says "Umów 15-minutową rozmowę" but there's no booking link. Add a Calendly alternative CTA in the contact section.

**Files:**
- Modify: `index.html:1078` (add Calendly button after contact info)

**Step 1: Add Calendly CTA**

In `index.html`, after the location div's closing `</div>` (after line 1077), add:

```html
<!-- TODO: Wstaw prawdziwy link do Calendly/Cal.com -->
<div class="mt-8 pt-6 border-t border-gray-100">
    <a href="#TODO_CALENDLY_LINK" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2.5 border-2 border-verte-200 text-verte-700 font-semibold px-6 py-3.5 rounded-full hover:border-verte-400 hover:bg-verte-50 transition-all duration-300 w-full justify-center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>
        Umów rozmowę online
    </a>
</div>
```

---

### Task 9: CTA After "Why Verte" Section

**Context:** The "Dlaczego Verte" section at `index.html:627-683` ends abruptly after 4 cards. Add a bridging CTA.

**Files:**
- Modify: `index.html:682` (add CTA before section closing)

**Step 1: Add CTA**

In `index.html`, after the closing `</div>` of the grid (after line 681, after the last why-card), add:

```html
<div class="mt-12 text-center" data-reveal>
    <a href="#contact" class="inline-flex items-center gap-2.5 bg-verte-700 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-verte-800 transition-all duration-300 hover:shadow-lg hover:shadow-verte-700/20 hover:-translate-y-0.5">
        Porozmawiajmy
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 13L13 1M13 1H5M13 1v8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>
</div>
```

---

## FAZA 3: Content i Polish

### Task 10: KSeF Section Refresh for Post-Deadline

**Context:** KSeF deadline is April 1, 2026 — only ~30 days away. The `KsefCountdown` class in `script.js:315-345` shows countdown before deadline and "KSeF jest już obowiązkowy!" after. But the section copy at `index.html:880-881` still says "Czy Twoja firma jest gotowa?" which won't make sense post-deadline. We need dual-mode copy.

**Files:**
- Modify: `script.js:315-345` (expand KsefCountdown to also update section copy)
- Modify: `index.html:880-881` (add id to paragraph for JS targeting)

**Step 1: Add id to the KSeF paragraph**

In `index.html`, find line 880:
```html
<p class="text-verte-100/80 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
```

Add an id:
```html
<p id="ksef-copy" class="text-verte-100/80 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
```

**Step 2: Update KsefCountdown class**

Replace the entire `KsefCountdown` class in `script.js` (lines 315-345) with:

```javascript
class KsefCountdown {
    constructor() {
        this.el = document.getElementById('ksef-countdown');
        this.copy = document.getElementById('ksef-copy');
        if (!this.el) return;
        this.update();
    }

    update() {
        const deadline = new Date('2026-04-01T00:00:00');
        const now = new Date();
        const diff = deadline - now;

        if (diff <= 0) {
            // Post-deadline mode
            this.el.textContent = 'KSeF jest już obowiązkowy!';
            if (this.copy) {
                this.copy.textContent = 'Obowiązkowe e-fakturowanie już obowiązuje. Jeśli Twoja firma jeszcze nie wdrożyła KSeF — czas działać. Pomożemy Ci szybko nadrobić zaległości i uniknąć kar.';
            }
            return;
        }

        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (days > 30) {
            const months = Math.floor(days / 30);
            let word;
            if (months === 1) word = 'miesiąc';
            else if (months >= 2 && months <= 4) word = 'miesiące';
            else word = 'miesięcy';
            this.el.textContent = `Zostało ${months} ${word} do obowiązkowego KSeF`;
        } else {
            let word;
            if (days === 1) word = 'dzień';
            else word = 'dni';
            this.el.textContent = `Zostało tylko ${days} ${word} do obowiązkowego KSeF!`;
        }
    }
}
```

---

### Task 11: General FAQ Section

**Context:** There are 5 KSeF-specific FAQs but no general FAQ about Verte's services. Add a general FAQ section after KSeF, before About. Also update Schema.org FAQPage markup.

**Files:**
- Modify: `index.html` (add new section between KSeF closing `</section>` and About section)
- Modify: `index.html:84-110` (add new FAQ items to Schema.org JSON-LD)

**Step 1: Add FAQ section HTML**

In `index.html`, after the KSeF section's closing `</section>` tag (after line 949) and before the About section (line 951), insert:

```html
<!-- ===== FAQ OGÓLNE ===== -->
<section id="faq" class="py-24 md:py-32 px-6">
    <div class="max-w-3xl mx-auto">
        <header class="mb-12 text-center" data-reveal>
            <span class="inline-block text-verte-600 text-xs font-bold tracking-[.16em] uppercase mb-4">FAQ</span>
            <h2 class="font-display text-3xl sm:text-4xl font-600 text-verte-950 leading-tight tracking-tight" style="font-weight:600">
                Najczęstsze pytania
            </h2>
        </header>
        <div class="space-y-4" data-reveal>
            <div class="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 class="font-display text-lg font-semibold text-verte-900 mb-2">Ile kosztują usługi Verte?</h3>
                <p class="text-gray-500 text-sm leading-relaxed">Każdy projekt wyceniamy indywidualnie po bezpłatnej konsultacji. Ceny zależą od zakresu prac — proste automatyzacje zaczynają się od kilkuset złotych, kompleksowe wdrożenia to koszt kilku tysięcy. Zawsze podajemy cenę z góry, bez ukrytych kosztów.</p>
            </div>
            <div class="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 class="font-display text-lg font-semibold text-verte-900 mb-2">Jak długo trwa wdrożenie?</h3>
                <p class="text-gray-500 text-sm leading-relaxed">Zależy od złożoności. Proste automatyzacje (generowanie dokumentów, OCR) uruchamiamy w 3-5 dni roboczych. Kompleksowy obieg dokumentów to 2-4 tygodnie. Zawsze podajemy konkretny harmonogram.</p>
            </div>
            <div class="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 class="font-display text-lg font-semibold text-verte-900 mb-2">Czy muszę zmieniać swoje oprogramowanie?</h3>
                <p class="text-gray-500 text-sm leading-relaxed">Nie. Nasze rozwiązania integrują się z narzędziami, których już używasz — Excel, programy księgowe (Optima, Symfonia, enova, wFirma), systemy CRM i inne. Budujemy mosty, nie wymagamy rewolucji.</p>
            </div>
            <div class="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 class="font-display text-lg font-semibold text-verte-900 mb-2">Co jeśli coś nie działa?</h3>
                <p class="text-gray-500 text-sm leading-relaxed">Każde wdrożenie obejmuje okres wsparcia. Jesteśmy pod telefonem i mailem. Jeśli coś wymaga poprawki — naprawiamy to w ramach umowy, bez dodatkowych opłat.</p>
            </div>
            <div class="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 class="font-display text-lg font-semibold text-verte-900 mb-2">Czy obsługujecie firmy spoza Śląska?</h3>
                <p class="text-gray-500 text-sm leading-relaxed">Tak, choć większość naszych klientów jest ze Śląska i okolic. Prace wdrożeniowe prowadzimy zdalnie, więc lokalizacja nie jest przeszkodą. Spotkania osobiste oferujemy przede wszystkim firmom z regionu.</p>
            </div>
        </div>
    </div>
</section>
```

**Step 2: Update Schema.org FAQPage in `<head>`**

In `index.html`, in the JSON-LD script (lines 84-110), add the 5 new FAQ items to the `mainEntity` array, after the existing 3 questions:

```json
,
{
    "@type": "Question",
    "name": "Ile kosztują usługi Verte?",
    "acceptedAnswer": {
        "@type": "Answer",
        "text": "Każdy projekt wyceniamy indywidualnie po bezpłatnej konsultacji. Proste automatyzacje zaczynają się od kilkuset złotych, kompleksowe wdrożenia to koszt kilku tysięcy."
    }
},
{
    "@type": "Question",
    "name": "Jak długo trwa wdrożenie?",
    "acceptedAnswer": {
        "@type": "Answer",
        "text": "Proste automatyzacje uruchamiamy w 3-5 dni roboczych. Kompleksowy obieg dokumentów to 2-4 tygodnie."
    }
},
{
    "@type": "Question",
    "name": "Czy muszę zmieniać swoje oprogramowanie?",
    "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nie. Nasze rozwiązania integrują się z narzędziami, których już używasz — Excel, programy księgowe, systemy CRM."
    }
},
{
    "@type": "Question",
    "name": "Co jeśli coś nie działa?",
    "acceptedAnswer": {
        "@type": "Answer",
        "text": "Każde wdrożenie obejmuje okres wsparcia. Naprawiamy problemy w ramach umowy, bez dodatkowych opłat."
    }
},
{
    "@type": "Question",
    "name": "Czy obsługujecie firmy spoza Śląska?",
    "acceptedAnswer": {
        "@type": "Answer",
        "text": "Tak. Prace wdrożeniowe prowadzimy zdalnie, spotkania osobiste oferujemy firmom z regionu."
    }
}
```

**Step 3: Add FAQ link to navigation**

In `index.html`, in the desktop nav (around line 138, after the KSeF link), add:
```html
<a href="#faq" class="nav-link text-sm font-medium text-gray-500 hover:text-verte-700 transition-colors">FAQ</a>
```

Also add in the mobile nav (around line 160):
```html
<a href="#faq" class="mobile-link font-display text-3xl text-verte-900 hover:text-verte-600 transition-colors">FAQ</a>
```

And in the footer navigation (around line 1138):
```html
<a href="#faq" class="text-sm text-gray-500 hover:text-verte-600 transition-colors">FAQ</a>
```

---

### Task 12: 404 Page

**Context:** No 404 page exists. Users hitting invalid URLs get a generic host 404.

**Files:**
- Create: `404.html`

**Step 1: Create `404.html`**

```html
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 — Strona nie znaleziona | Verte</title>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='32' height='32' rx='6' fill='%23245f40'/%3E%3Cpath d='M16 6L8 11v10l8 5 8-5V11L16 6z' fill='white' opacity='.9'/%3E%3C/svg%3E">
    <meta name="theme-color" content="#245f40">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600&family=Outfit:wght@400;500;600&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        verte: { 50:'#f0f9f4',100:'#daf0e3',200:'#b8e1c9',300:'#89cca7',400:'#56b17f',500:'#3a9464',600:'#2d7850',700:'#245f40',800:'#1f4d35',900:'#1a402d',950:'#0d2318' },
                        cream: { 50:'#fdfaf6',100:'#f9f3ea',200:'#f0e6d5' }
                    },
                    fontFamily: {
                        display: ['Fraunces','Georgia','serif'],
                        body: ['Outfit','system-ui','sans-serif']
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-cream-50 text-gray-800 font-body antialiased min-h-screen flex flex-col items-center justify-center px-6">
    <div class="text-center max-w-md">
        <div class="w-16 h-16 bg-verte-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#245f40" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2M9 9h.01M15 9h.01"/>
            </svg>
        </div>
        <h1 class="font-display text-5xl font-semibold text-verte-950 tracking-tight mb-4">404</h1>
        <p class="text-gray-500 text-lg mb-8">Tej strony nie znaleźliśmy. Może link jest nieaktualny, a może po prostu trafił się literówka.</p>
        <a href="index.html" class="inline-flex items-center gap-2.5 bg-verte-700 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-verte-800 transition-all duration-300 hover:shadow-lg hover:shadow-verte-700/20">
            Wróć na stronę główną
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
    </div>
</body>
</html>
```

---

### Task 13: Accessibility Fixes

**Context:** Mobile nav has no Escape key handler. Form has native browser validation fighting with custom JS validation.

**Files:**
- Modify: `script.js:9-55` (add Escape listener to Navigation class)

**Step 1: Add Escape key handler to Navigation**

In `script.js`, inside the `Navigation` constructor (after line 25, after the mobile link click listeners), add:

```javascript
// Close mobile nav on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && this.isOpen) this.close();
});
```

**Step 2: Verify** — open mobile nav (resize to < 768px, click burger). Press Escape. Nav should close.

Note: The `novalidate` attribute was already added to the form in Task 1.

---

## Summary of all files touched

| File | Action |
|------|--------|
| `index.html` | Modified (form, privacy link, meta tags, TODOs, mobile CTA, form fields, Calendly, Why CTA, KSeF id, FAQ section, FAQ nav links, FAQ schema) |
| `script.js` | Modified (ContactForm fetch, ScrollSpy, MobileCTA, KsefCountdown dual-mode, Escape handler, init block) |
| `styles.css` | Modified (nav-link active styles) |
| `polityka-prywatnosci.html` | Created |
| `sitemap.xml` | Created |
| `robots.txt` | Created |
| `404.html` | Created |
