# Verte Website Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Comprehensively improve the Verte B2B marketing website — better copy, SEO, accessibility, design, and conversion optimization.

**Architecture:** Static HTML/CSS/JS site using Tailwind CSS v4 (CDN), Fraunces + Outfit fonts, vanilla JS. Three files: `index.html`, `styles.css`, `script.js`. All changes are in-place edits to these files.

**Tech Stack:** HTML5, Tailwind CSS (CDN), vanilla JS ES6, CSS animations

---

### Task 1: SEO & Meta Tags Enhancement

**Files:**
- Modify: `index.html:1-46` (head section)

**Step 1: Add Open Graph, Twitter Card, canonical URL, and Schema.org JSON-LD**

Replace the entire `<head>` content (lines 3-45) with:

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verte — Automatyzacja dokumentów dla firm | Gliwice</title>
    <meta name="description" content="Oszczędź 13 godzin tygodniowo. Automatyzujemy dokumenty, eliminujemy błędy i integrujemy z KSeF. Rozwiązania na miarę dla firm ze Śląska.">
    <meta name="keywords" content="automatyzacja dokumentów, KSeF, obieg dokumentów, OCR, faktury, Gliwice, Śląsk, e-fakturowanie">
    <link rel="canonical" href="https://verte.pl/">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://verte.pl/">
    <meta property="og:title" content="Verte — Automatyzacja dokumentów dla firm">
    <meta property="og:description" content="Oszczędź 13 godzin tygodniowo. Automatyzujemy dokumenty, eliminujemy błędy i integrujemy z KSeF. Rozwiązania na miarę dla firm ze Śląska.">
    <meta property="og:locale" content="pl_PL">
    <meta property="og:site_name" content="Verte">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Verte — Automatyzacja dokumentów dla firm">
    <meta name="twitter:description" content="Oszczędź 13 godzin tygodniowo. Automatyzujemy dokumenty, eliminujemy błędy i integrujemy z KSeF.">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500;1,9..144,600&family=Outfit:wght@300;400;500;600;700&display=swap" as="style">
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500;1,9..144,600&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Tailwind -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
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
            }
        }
    </script>
    <link rel="stylesheet" href="styles.css">

    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "LocalBusiness",
                "name": "Verte",
                "description": "Automatyzacja dokumentów dla małych i średnich firm. Generowanie dokumentów, integracja KSeF, obieg dokumentów, OCR + AI.",
                "url": "https://verte.pl",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Gliwice",
                    "addressRegion": "Śląsk",
                    "addressCountry": "PL"
                },
                "areaServed": {
                    "@type": "GeoCircle",
                    "geoMidpoint": { "@type": "GeoCoordinates", "latitude": 50.2945, "longitude": 18.6714 },
                    "geoRadius": "100000"
                },
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Usługi automatyzacji",
                    "itemListElement": [
                        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Automatyczne generowanie dokumentów" } },
                        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Integracja z KSeF" } },
                        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Obieg dokumentów" } },
                        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Ekstrakcja danych OCR + AI" } }
                    ]
                }
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "Co to jest KSeF?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Krajowy System e-Faktur to centralna platforma Ministerstwa Finansów do wystawiania i odbierania faktur w formacie elektronicznym."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Kogo dotyczy KSeF?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Wszystkich podatników VAT czynnych. Niezależnie od wielkości firmy — obowiązek dotyczy zarówno jednoosobowych działalności, jak i dużych spółek."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Co grozi za brak wdrożenia KSeF?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Kary finansowe, problemy z odliczeniem VAT, komplikacje w rozliczeniach z kontrahentami i urzędem skarbowym."
                        }
                    }
                ]
            }
        ]
    }
    </script>
</head>
```

**Step 2: Add skip-to-content link and improve body opening**

After `<body>` tag (line 47), add:

```html
<a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-verte-700 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold">
    Przejdź do treści
</a>
```

And change `<main>` (line 97) to `<main id="main-content">`.

**Step 3: Verify the page loads correctly in browser**

Open `index.html` in Playwright browser and check that no console errors appear.

---

### Task 2: Hero Section — Copy & Conversion Rewrite

**Files:**
- Modify: `index.html:97-277` (hero section)

**Step 1: Rewrite hero copy with problem-first approach and stronger CTAs**

Replace the hero text content (lines 108-130) with:

```html
                    <div class="reveal-up inline-flex items-center gap-2 bg-verte-50 border border-verte-200 rounded-full px-4 py-1.5 mb-8">
                        <span class="hero-badge-dot w-2 h-2 bg-verte-500 rounded-full animate-pulse"></span>
                        <span class="text-verte-700 text-xs font-semibold tracking-wide uppercase">Automatyzacja dla firm ze Śląska</span>
                    </div>
                    <h1 class="reveal-up font-display text-4xl sm:text-5xl lg:text-6xl font-600 text-verte-950 leading-[1.08] tracking-tight mb-6" style="font-weight:600">
                        Twoja firma traci<br>
                        <span class="text-verte-600 hero-heading-accent">13 godzin tygodniowo</span><br>
                        na papierkową robotę
                    </h1>
                    <p class="reveal-up text-lg sm:text-xl text-verte-800/80 font-medium mb-4 max-w-lg" style="animation-delay:.1s">
                        Automatyzujemy dokumenty, eliminujemy błędy i&nbsp;oddajemy Ci czas na rozwijanie biznesu.
                    </p>
                    <p class="reveal-up text-gray-500 leading-relaxed mb-8 max-w-lg" style="animation-delay:.15s">
                        Od faktur i&nbsp;umów przez obieg dokumentów po&nbsp;integrację z&nbsp;KSeF &mdash; budujemy rozwiązania na&nbsp;miarę dla małych i&nbsp;średnich firm.
                    </p>
                    <!-- Social proof -->
                    <div class="reveal-up flex items-center gap-3 mb-10" style="animation-delay:.2s">
                        <div class="flex -space-x-2">
                            <div class="w-8 h-8 bg-verte-200 rounded-full border-2 border-cream-50 flex items-center justify-center text-[10px] font-bold text-verte-700">KM</div>
                            <div class="w-8 h-8 bg-amber-200 rounded-full border-2 border-cream-50 flex items-center justify-center text-[10px] font-bold text-amber-700">PW</div>
                            <div class="w-8 h-8 bg-sky-200 rounded-full border-2 border-cream-50 flex items-center justify-center text-[10px] font-bold text-sky-700">AT</div>
                        </div>
                        <span class="text-sm text-gray-400">Zaufały nam firmy z&nbsp;Gliwic i&nbsp;okolic</span>
                    </div>
                    <div class="reveal-up flex flex-col sm:flex-row gap-4" style="animation-delay:.25s">
                        <a href="#contact" class="hero-cta-primary inline-flex items-center justify-center gap-2.5 bg-verte-700 text-white font-semibold px-8 py-4 rounded-full hover:bg-verte-800 transition-all duration-300 hover:shadow-xl hover:shadow-verte-700/20 hover:-translate-y-0.5">
                            Umów 15-minutową rozmowę
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </a>
                        <a href="#cases" class="hero-cta-secondary inline-flex items-center justify-center gap-2 border-2 border-verte-200 text-verte-700 font-semibold px-8 py-4 rounded-full hover:border-verte-400 hover:bg-verte-50 transition-all duration-300">
                            Zobacz efekty u klientów
                        </a>
                    </div>
```

**Step 2: Verify in browser**

Open the page in Playwright and verify the hero section renders correctly.

---

### Task 3: Service Cards — Benefit-Focused Copy

**Files:**
- Modify: `index.html:279-468` (services section)

**Step 1: Rewrite section header and card titles/descriptions to be benefit-focused**

Replace the services header (lines 283-289) with:

```html
                <header class="mb-16" data-reveal>
                    <span class="inline-block text-verte-600 text-xs font-bold tracking-[.16em] uppercase mb-4">Co robimy</span>
                    <h2 class="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-600 text-verte-950 leading-tight tracking-tight" style="font-weight:600">
                        Cztery sposoby, żebyś<br>
                        <span class="font-display italic font-normal text-verte-600 services-heading-accent">pracował mniej na papierach</span>
                    </h2>
                </header>
```

Replace service card titles and descriptions (preserve all surrounding markup):

**Card 1** (line 303-304):
- Title: `Generuj dokumenty w sekundy` (was: "Automatyczne generowanie dokumentów")
- Description: `Koniec z kopiowaniem danych do Worda. Wypełniasz formularz — system generuje gotowy PDF z logo Twojej firmy. Umowy, oferty, protokoły — w kilka kliknięć zamiast 30 minut.`

**Card 2** (line 346-347):
- Title: `Przygotuj firmę na KSeF` (was: "Integracja z KSeF")
- Description: `Obowiązkowy KSeF wchodzi w kwietniu 2026. Przeprowadzimy Cię przez cały proces — od audytu gotowości, przez integrację z programem księgowym, po szkolenie zespołu.`

**Card 3** (line 390-391):
- Title: `Uporządkuj obieg dokumentów` (was: "Obieg dokumentów")
- Description: `Koniec z mailami "w załączniku wersja finalna v3 (poprawiona)". Tworzenie, akceptacja, podpis i archiwizacja — cały obieg w jednym miejscu.`

**Card 4** (line 433-434):
- Title: `Wyciągaj dane z dokumentów automatycznie` (was: "Ekstrakcja danych (OCR + AI)")
- Description: `Wrzucasz skan lub PDF — AI wyciąga dane i wrzuca do Excela lub Twojego systemu. 98% dokładności, sekundy zamiast godzin ręcznego przepisywania.`

**Step 2: Add micro-stats to each service card (above the "Dowiedz się więcej" button)**

For each card, add a subtle stat badge before the toggle button:

Card 1: `<div class="inline-flex items-center gap-1.5 bg-verte-50 text-verte-700 text-xs font-semibold rounded-full px-3 py-1 mb-4"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Oszczędność: ~8h / tydzień</div>`

Card 2: `<div class="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full px-3 py-1 mb-4"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Wdrożenie: od 3 dni</div>`

Card 3: `<div class="inline-flex items-center gap-1.5 bg-verte-50 text-verte-700 text-xs font-semibold rounded-full px-3 py-1 mb-4"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Zero zagubionych dokumentów</div>`

Card 4: `<div class="inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 text-xs font-semibold rounded-full px-3 py-1 mb-4"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg> Dokładność: 98%+</div>`

---

### Task 4: Case Study — CTA & Testimonial Enhancement

**Files:**
- Modify: `index.html:589-761` (case study section)

**Step 1: Add CTA after case study stats**

After the closing `</div>` of `case-stats` (after line 737, inside the case-card), add:

```html
                    <!-- Case study CTA -->
                    <div class="mt-8 pt-8 border-t border-gray-100 text-center" data-reveal>
                        <p class="text-gray-500 mb-4">Chcesz podobnych wyników w swojej firmie?</p>
                        <a href="#contact" class="inline-flex items-center gap-2.5 bg-verte-700 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-verte-800 transition-all duration-300 hover:shadow-lg hover:shadow-verte-700/20 hover:-translate-y-0.5">
                            Porozmawiajmy o Twojej firmie
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 13L13 1M13 1H5M13 1v8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </a>
                    </div>
```

---

### Task 5: KSeF Section — Urgency & Additional FAQ

**Files:**
- Modify: `index.html:763-822` (KSeF section)

**Step 1: Add countdown urgency element and expand FAQ**

Replace the badge text (line 770) with a dynamic countdown:

```html
                        <span class="text-white/90 text-xs font-semibold tracking-wide uppercase" id="ksef-countdown">Obowiązkowy od kwietnia 2026</span>
```

Add two more FAQ items after the existing three (after line 813, before the closing `</div>` of the FAQ container):

```html
                    <div class="ksef-faq">
                        <div class="flex items-start gap-4">
                            <div class="w-8 h-8 bg-white/10 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5">
                                <span class="text-verte-200 text-sm font-bold">?</span>
                            </div>
                            <div>
                                <h4 class="text-white font-semibold mb-1">Ile trwa wdrożenie KSeF?</h4>
                                <p class="text-verte-200/70 text-sm leading-relaxed">W zależności od złożoności firmy &mdash; od&nbsp;3 dni roboczych dla małych firm do&nbsp;2-3 tygodni dla większych organizacji. Zaczynamy od&nbsp;audytu, żeby dokładnie oszacować zakres prac.</p>
                            </div>
                        </div>
                    </div>
                    <div class="ksef-faq">
                        <div class="flex items-start gap-4">
                            <div class="w-8 h-8 bg-white/10 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5">
                                <span class="text-verte-200 text-sm font-bold">?</span>
                            </div>
                            <div>
                                <h4 class="text-white font-semibold mb-1">Czy mój program księgowy jest kompatybilny?</h4>
                                <p class="text-verte-200/70 text-sm leading-relaxed">Integrujemy z&nbsp;najpopularniejszymi programami: Optima, Symfonia, enova, wFirma, Fakturownia i&nbsp;wieloma innymi. Jeśli Twojego programu nie ma&nbsp;na&nbsp;liście &mdash; napisz, sprawdzimy.</p>
                            </div>
                        </div>
                    </div>
```

**Step 2: Add KSeF countdown to script.js**

Append to `script.js` before the `DOMContentLoaded` listener or inside it:

```javascript
// ================================================
// KSeF COUNTDOWN
// ================================================
class KsefCountdown {
    constructor() {
        this.el = document.getElementById('ksef-countdown');
        if (!this.el) return;
        this.update();
    }

    update() {
        const deadline = new Date('2026-04-01T00:00:00');
        const now = new Date();
        const diff = deadline - now;
        if (diff <= 0) {
            this.el.textContent = 'KSeF jest już obowiązkowy!';
            return;
        }
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (days > 30) {
            const months = Math.floor(days / 30);
            this.el.textContent = `Zostało ${months} mies. do obowiązkowego KSeF`;
        } else {
            this.el.textContent = `Zostało ${days} dni do obowiązkowego KSeF`;
        }
    }
}
```

Add `new KsefCountdown();` inside the `DOMContentLoaded` block.

---

### Task 6: About Section — Storytelling & Consistency

**Files:**
- Modify: `index.html:824-875` (about section)

**Step 1: Expand bio with storytelling and reframe tech badges**

Replace the about text content (lines 854-871) with:

```html
                        <div class="space-y-4 text-gray-500 leading-relaxed">
                            <p>
                                Cześć! Jestem programistą z&nbsp;Gliwic. Zaczynałem od&nbsp;pisania skryptów, które automatyzowały moją własną nudną robotę &mdash; kopiowanie danych z&nbsp;PDF-ów, wypełnianie formularzy, generowanie raportów. Szybko okazało się, że firmy wokół mnie mają dokładnie te same problemy.
                            </p>
                            <p>
                                Verte powstało z&nbsp;prostego przekonania: <strong class="text-gray-700">nowoczesna technologia nie powinna być zarezerwowana dla korporacji.</strong> Małe i&nbsp;średnie firmy zasługują na&nbsp;rozwiązania, które naprawdę działają &mdash; bez przepłacania, bez technicznego bełkotu i&nbsp;bez miesięcy czekania na&nbsp;wdrożenie.
                            </p>
                            <p class="text-gray-400">
                                Pracuję z&nbsp;firmami ze&nbsp;Śląska i&nbsp;okolic. Lubię spotkania przy kawie, rozmowy o&nbsp;realnych problemach i&nbsp;rozwiązania, których efekty widać od&nbsp;pierwszego dnia.
                            </p>
                        </div>
                        <!-- What this means for you -->
                        <div class="mt-8">
                            <p class="text-xs font-semibold text-gray-400 uppercase tracking-[.1em] mb-3">Co to oznacza dla Ciebie</p>
                            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div class="bg-gray-50 rounded-xl px-4 py-3 text-center">
                                    <div class="text-sm font-semibold text-verte-700 mb-0.5">AI & OCR</div>
                                    <div class="text-xs text-gray-400">Inteligentne odczytywanie dokumentów</div>
                                </div>
                                <div class="bg-gray-50 rounded-xl px-4 py-3 text-center">
                                    <div class="text-sm font-semibold text-verte-700 mb-0.5">Automatyzacja</div>
                                    <div class="text-xs text-gray-400">Systemy pracujące 24/7</div>
                                </div>
                                <div class="bg-gray-50 rounded-xl px-4 py-3 text-center">
                                    <div class="text-sm font-semibold text-verte-700 mb-0.5">Integracje</div>
                                    <div class="text-xs text-gray-400">Łączenie z Twoimi narzędziami</div>
                                </div>
                            </div>
                        </div>
```

---

### Task 7: Contact Section — Conversion Improvements

**Files:**
- Modify: `index.html:877-961` (contact section)

**Step 1: Improve contact copy and add response time promise**

Replace contact header copy (lines 884-890) with:

```html
                        <h2 class="font-display text-3xl sm:text-4xl font-600 text-verte-950 leading-tight tracking-tight mb-6" style="font-weight:600">
                            15 minut rozmowy,<br>
                            <span class="font-display italic font-normal text-verte-600">godziny oszczędności</span>
                        </h2>
                        <p class="text-gray-500 leading-relaxed mb-6 max-w-md">
                            Opisz nam swój biznes i wyzwania. Pierwsza konsultacja jest zawsze bezpłatna &mdash; bez zobowiązań, bez sprzedażowego nacisku.
                        </p>
                        <!-- Trust signals -->
                        <div class="flex flex-col gap-3 mb-10">
                            <div class="flex items-center gap-2.5 text-sm text-gray-500">
                                <svg class="w-4 h-4 text-verte-500 shrink-0" fill="none" viewBox="0 0 20 20"><path d="M6 10l3 3 5-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                Odpowiadamy w ciągu 24 godzin
                            </div>
                            <div class="flex items-center gap-2.5 text-sm text-gray-500">
                                <svg class="w-4 h-4 text-verte-500 shrink-0" fill="none" viewBox="0 0 20 20"><path d="M6 10l3 3 5-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                Bez zobowiązań — poznajemy się
                            </div>
                            <div class="flex items-center gap-2.5 text-sm text-gray-500">
                                <svg class="w-4 h-4 text-verte-500 shrink-0" fill="none" viewBox="0 0 20 20"><path d="M6 10l3 3 5-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                Konkretne pomysły na automatyzację po rozmowie
                            </div>
                        </div>
```

---

### Task 8: Footer — Trust Signals & Privacy

**Files:**
- Modify: `index.html:964-988` (footer)

**Step 1: Expand footer with privacy link, social placeholders, and trust signal**

Replace entire footer content with:

```html
    <footer class="py-12 px-6 border-t border-gray-100">
        <div class="max-w-6xl mx-auto">
            <div class="grid md:grid-cols-3 gap-8 items-start">
                <!-- Brand -->
                <div>
                    <div class="flex items-center gap-2 mb-3">
                        <div class="w-6 h-6 bg-verte-700 rounded-md flex items-center justify-center">
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 1L2 5v6l6 4 6-4V5L8 1z" fill="white" opacity=".9"/></svg>
                        </div>
                        <span class="font-display text-sm font-semibold text-verte-900">Verte</span>
                    </div>
                    <p class="text-sm text-gray-400 leading-relaxed max-w-xs">Automatyzacja dokumentów dla małych i&nbsp;średnich firm ze Śląska. Mniej papierów, więcej biznesu.</p>
                </div>
                <!-- Navigation -->
                <div>
                    <h4 class="text-xs font-bold text-gray-400 uppercase tracking-[.1em] mb-4">Nawigacja</h4>
                    <nav class="flex flex-col gap-2.5">
                        <a href="#services" class="text-sm text-gray-500 hover:text-verte-600 transition-colors">Usługi</a>
                        <a href="#process" class="text-sm text-gray-500 hover:text-verte-600 transition-colors">Proces</a>
                        <a href="#ksef" class="text-sm text-gray-500 hover:text-verte-600 transition-colors">KSeF</a>
                        <a href="#about" class="text-sm text-gray-500 hover:text-verte-600 transition-colors">O mnie</a>
                        <a href="#contact" class="text-sm text-gray-500 hover:text-verte-600 transition-colors">Kontakt</a>
                    </nav>
                </div>
                <!-- Contact & Legal -->
                <div>
                    <h4 class="text-xs font-bold text-gray-400 uppercase tracking-[.1em] mb-4">Kontakt</h4>
                    <div class="space-y-2.5 text-sm text-gray-500">
                        <a href="mailto:kontakt@verte.pl" class="block hover:text-verte-600 transition-colors">kontakt@verte.pl</a>
                        <p>Gliwice, Śląsk</p>
                    </div>
                    <div class="mt-6 pt-4 border-t border-gray-100">
                        <p class="text-xs text-gray-300">Dane przetwarzamy zgodnie z RODO.</p>
                    </div>
                </div>
            </div>
            <div class="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <small class="text-xs text-gray-300">&copy; 2026 Verte. Wszelkie prawa zastrzeżone.</small>
                <div class="flex items-center gap-4 text-gray-300">
                    <span class="text-xs">Gliwice, Śląsk</span>
                </div>
            </div>
        </div>
    </footer>
```

---

### Task 9: Accessibility & CSS Improvements

**Files:**
- Modify: `styles.css` (accessibility additions)

**Step 1: Add improved focus styles and contrast fixes to styles.css**

Append to `styles.css`:

```css
/* ================================================
   ACCESSIBILITY IMPROVEMENTS
   ================================================ */

/* Skip to content link */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}

/* Enhanced focus styles for keyboard navigation */
a:focus-visible,
button:focus-visible,
input:focus-visible,
textarea:focus-visible {
    outline: 2px solid #245f40;
    outline-offset: 2px;
    border-radius: 4px;
}

/* Improve gray text contrast on cream background */
.text-gray-500 {
    color: #4b5563 !important; /* Darker gray for better WCAG AA contrast */
}

.text-gray-400 {
    color: #6b7280 !important; /* Slightly darker for readability */
}
```

---

### Task 10: Form Validation Enhancement

**Files:**
- Modify: `script.js` (ContactForm class)

**Step 1: Add real-time validation feedback to ContactForm**

Replace the `ContactForm` class (lines 132-155) with:

```javascript
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!this.validate()) return;

            const btn = this.form.querySelector('button[type="submit"]');
            const span = btn.querySelector('span');
            const origText = span.textContent;

            span.textContent = 'Wysłano! Odezwiemy się w ciągu 24h';
            btn.style.pointerEvents = 'none';
            btn.classList.remove('bg-verte-700', 'hover:bg-verte-800');
            btn.classList.add('bg-verte-500');

            setTimeout(() => {
                span.textContent = origText;
                btn.style.pointerEvents = '';
                btn.classList.remove('bg-verte-500');
                btn.classList.add('bg-verte-700', 'hover:bg-verte-800');
                this.form.reset();
                this.clearErrors();
            }, 4000);
        });

        // Real-time validation on blur
        this.form.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
        });
    }

    validate() {
        let valid = true;
        this.form.querySelectorAll('[required]').forEach(field => {
            if (!this.validateField(field)) valid = false;
        });
        return valid;
    }

    validateField(field) {
        const parent = field.parentElement;
        let error = parent.querySelector('.field-error');

        if (!field.value.trim()) {
            if (!error) {
                error = document.createElement('p');
                error.className = 'field-error text-xs text-red-500 mt-1';
                parent.appendChild(error);
            }
            error.textContent = 'To pole jest wymagane';
            field.classList.add('border-red-300');
            field.classList.remove('border-gray-200');
            return false;
        }

        if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
            if (!error) {
                error = document.createElement('p');
                error.className = 'field-error text-xs text-red-500 mt-1';
                parent.appendChild(error);
            }
            error.textContent = 'Podaj poprawny adres email';
            field.classList.add('border-red-300');
            field.classList.remove('border-gray-200');
            return false;
        }

        if (error) error.remove();
        field.classList.remove('border-red-300');
        field.classList.add('border-gray-200');
        return true;
    }

    clearErrors() {
        this.form.querySelectorAll('.field-error').forEach(e => e.remove());
        this.form.querySelectorAll('.border-red-300').forEach(f => {
            f.classList.remove('border-red-300');
            f.classList.add('border-gray-200');
        });
    }
}
```

---

### Task 11: Final Verification

**Step 1: Open the page in Playwright browser and visually verify all sections**

Navigate to the local file and take screenshots of each section.

**Step 2: Check console for errors**

Read browser console messages and fix any issues.

**Step 3: Test mobile responsiveness**

Resize browser to 375px width and verify all sections look good.
