# Exedria — site de prezentare (exedria.tech)

Exedria este, deocamdată, o **agenție**: producem video programatic (React/Remotion), site-uri rapide și integrări API pentru firme din România. Nu ne prezentăm ca SaaS sau platformă B2B self-service.

## Ce vindem

- **Video:** un clip generat pentru fiecare companie, pentru multe companii (nu zeci de variante de reclamă pentru o singură firmă). Clipurile pot avea orice durată: nu scrie „15 secunde” sau altă durată fixă.
- **Web:** site-uri rapide, prerandate.
- **API:** integrări și sincronizare de date.
- Pașii procesului se numesc „Scripting” și „Compilare” / „Compile”. Nu pune „AI” sau „Remotion” în numele pașilor.
- Modulul Speed-to-Lead nu există: nu-l readuce pe site și nu promite răspunsuri pe WhatsApp/SMS.

## Ton și copy

- Româna e limba implicită; engleza e opțională (comutator RO/EN în meniu). Alegerea salvată a vizitatorului (`localStorage` `exedria-lang`) are prioritate.
- Tot textul stă în `src/i18n.tsx`, în ambele limbi. Păstrează cheile RO și EN sincronizate.
- CTA principal: „Cere o ofertă” / „Get a quote”. Meniul și formularul: „Contact”. Butonul formularului: „Trimite cererea”.
- Ton de agenție profesionistă, scurt și concret. Formulări de agenție sunt în regulă; evită jargonul SaaS („Request Access”, „Explore API”, „Generate Preview”).
- Firma nu e încă înregistrată: fără CUI, Reg. Com., adresă sau denumire juridică pe site. Paginile legale spun „echipa Exedria” + hello@exedria.tech.
- Nu afirma lucruri false despre stack: site-ul e Vite + SSG, nu Next.js.

## Design

- Fundal deschis (`--color-paper` #f5f7fa), text închis (#0b1220), contrast bun. Accente de brand: albastru deschis (`--color-sky` #22aef5, text `--color-sky-ink` #0673b0) și magenta (`--color-magenta` #e0179e). Verde doar pentru stări.
- **Densitate mică:** puține elemente pe secțiune, doar textul esențial, timeline-uri simple, fără etichete sau chip-uri redundante. Păstrăm interacțiunile (hero cu matrice de puncte, scrub la hover, slidere în lab, wordmark din puncte).
- Fără reclame sau video pe Home. Lab-ul apare o singură dată (pe /servicii).

## Structura site-ului

| Rută | Fișier | Conținut |
| --- | --- | --- |
| `/` | `src/pages/Home.tsx` | Hero, link mare spre /lucrari, 3 carduri de servicii, „Cum lucrăm” (`#cum-lucram`), „Pentru cine”, CTA |
| `/servicii` | `src/pages/ServicesPage.tsx` | Capitolele Video (cu lab) / Web / API |
| `/lucrari` | `src/pages/Portfolio.tsx` | Portofoliu |
| `/lucrari/:slug` | `src/pages/CaseStudy.tsx` | Studiu de caz |
| `/contact` | `src/pages/ContactPage.tsx` | Formular de ofertă |
| `/termeni`, `/confidentialitate` | `src/pages/Terms.tsx`, `Privacy.tsx` | Pagini legale (doar RO, șabloane de revizuit) |

- Meniu: Lucrări · Servicii · Contact. Rutele și meniul sunt definite într-un singur loc: `src/routes.ts`.
- Redirecturi în `vercel.json`: `/platforma` → `/servicii`, `/studio` → `/#cum-lucram`.
- Portofoliu (`src/data/projects.ts`), în ordine: Marina Park, Flip Finder, DiagramAI. Media în `public/media/`.
- Date de contact: `src/data/company.ts` (hello@exedria.tech, domeniul exedria.tech; nu exedria.ro).

## Stack și build

- Vite 7 + React 19 + Tailwind v4 + react-router 7 + `@remotion/player` 4.0.535. Fonturi Geist / Geist Mono (`@fontsource-variable`, cu latin-ext pentru ș ț ă).
- `npm run build` = `tsc -b` + build client + build SSR (`src/entry-server.tsx`) + `scripts/prerender.mjs`, care scrie `dist/<rută>.html` pentru fiecare rută din `ROUTES`. O pagină nouă se adaugă în `src/routes.ts`.
- `main.tsx` hidratează doar când `data-path` se potrivește, fără query string și cu limba RO. Widget-urile care au nevoie de browser stau în `ClientOnly`.
- Codul Remotion și paginile interioare sunt chunk-uri lazy; nu aduce Remotion în bundle-ul principal.
- CSP strict în `vercel.json`: fără `<script>` inline, fără resurse externe în afară de Cloudflare Turnstile.
- Ultimele reguli CSS fără layer cu `!important` din `src/index.css` protejează previzualizarea de reset-ul injectat de host; nu le șterge.

## Formularul de contact

- `api/contact.ts` (Vercel Function, zod + Resend) trimite cererea la `CONTACT_TO` (implicit hello@exedria.tech). Trimite etichetele în română indiferent de limbă.
- Câmpuri: nume, contact, servicii, număr de companii, formate (când e bifat Video), termen opțional, mesaj. Opțiunile din `i18n.tsx`, `Contact.tsx` și enum-urile din `api/contact.ts` trebuie să rămână sincronizate.
- Variabile Vercel: `RESEND_API_KEY`, opțional `RESEND_FROM`, `CONTACT_TO`, `TURNSTILE_SECRET_KEY`; la build `VITE_TURNSTILE_SITE_KEY` (vezi `.env.example`).
- `npm run dev` nu servește `/api`; folosește `vercel dev`.

## Workflow

- Vercel deployează producția din `main`. Modificările mici se urcă direct pe `main`; schimbările mari pe un branch, ca David să le vadă în preview înainte de merge.
- Înainte de push: `npm run build` trebuie să treacă.
- Mesajele de commit sunt în engleză, scurte, la imperativ.
- Remotion cere licență de companie pentru echipe de peste 3 persoane: https://remotion.dev/license
