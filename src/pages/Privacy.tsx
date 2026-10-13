import { LegalPage, type LegalSection } from '../components/Legal';
import { COMPANY, EMAIL } from '../data/company';
import { useT } from '../i18n';

// Template, to be reviewed by a lawyer. Add the company's legal details here once it is registered.
// If analytics, cookies or new processors are added to the site, update this page first.
const SECTIONS: LegalSection[] = [
  {
    id: 'operator',
    title: 'Cine prelucrează datele',
    body: (
      <>
        <p>
          Datele tale sunt prelucrate de echipa Exedria, care administrează acest site. Pentru orice întrebare despre datele tale ne poți
          scrie la <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>
        <p>
          Această politică respectă Regulamentul (UE) 2016/679 („GDPR”) și Legea nr. 190/2018 și explică ce date colectăm prin{' '}
          {COMPANY.domain}, de ce și ce drepturi ai.
        </p>
      </>
    ),
  },
  {
    id: 'ce-date',
    title: 'Ce date colectăm',
    body: (
      <>
        <ul>
          <li>
            <strong>Formularul de contact:</strong> numele, emailul sau telefonul, modulele și produsul care te interesează și
            mesajul tău.
          </li>
          <li>
            <strong>Emailurile trimise direct:</strong> adresa ta de email și conținutul mesajului.
          </li>
          <li>
            <strong>Date tehnice:</strong> când accesezi site-ul, furnizorul de găzduire înregistrează automat date precum adresa IP, tipul
            browserului și paginile cerute, pentru funcționarea și securitatea site-ului.
          </li>
        </ul>
        <p>Nu avem nevoie de date sensibile (de exemplu despre sănătate), așa că te rugăm să nu le incluzi în mesaje.</p>
      </>
    ),
  },
  {
    id: 'scopuri',
    title: 'De ce le folosim și pe ce temei',
    body: (
      <>
        <ul>
          <li>
            <strong>Ca să îți răspundem și să îți trimitem o propunere:</strong> demersuri făcute la cererea ta înainte de încheierea unui
            contract (art. 6 alin. 1 lit. b GDPR).
          </li>
          <li>
            <strong>Ca să executăm contractul,</strong> dacă lucrăm împreună (art. 6 alin. 1 lit. b GDPR).
          </li>
          <li>
            <strong>Pentru facturare și evidența contabilă:</strong> obligație legală (art. 6 alin. 1 lit. c GDPR).
          </li>
          <li>
            <strong>Pentru funcționarea și securitatea site-ului:</strong> interesul nostru legitim (art. 6 alin. 1 lit. f GDPR).
          </li>
        </ul>
        <p>
          Nu îți trimitem mesaje de marketing fără acordul tău și nu luăm decizii bazate exclusiv pe prelucrarea automată a datelor tale.
        </p>
      </>
    ),
  },
  {
    id: 'destinatari',
    title: 'Cui transmitem datele',
    body: (
      <>
        <p>Nu vindem și nu închiriem datele tale. Le transmitem doar furnizorilor care ne ajută să funcționăm, pe bază de contract:</p>
        <ul>
          <li>Vercel Inc., pentru găzduirea site-ului și a formularului;</li>
          <li>Resend, pentru trimiterea emailului cu cererea ta către noi;</li>
          <li>furnizorii serviciului nostru de email, pentru primirea și păstrarea mesajelor;</li>
          <li>contabilul nostru, pentru facturare, dacă lucrăm împreună.</li>
        </ul>
        <p>Putem transmite date autorităților doar atunci când legea ne obligă.</p>
      </>
    ),
  },
  {
    id: 'transferuri',
    title: 'Transferuri în afara Spațiului Economic European',
    body: (
      <p>
        Unii furnizori, de exemplu Vercel și Resend, au sediul în Statele Unite. Transferul datelor se face pe baza Cadrului UE-SUA privind
        protecția datelor, acolo unde furnizorul este certificat, sau a clauzelor contractuale standard aprobate de Comisia Europeană.
      </p>
    ),
  },
  {
    id: 'durata',
    title: 'Cât timp păstrăm datele',
    body: (
      <ul>
        <li>
          Cererile care nu devin colaborare: cel mult 12 luni de la ultimul mesaj.
        </li>
        <li>Datele din contracte și facturi: pe durata contractului și apoi cât cere legislația financiar-contabilă.</li>
        <li>Jurnalele tehnice: o perioadă scurtă, stabilită de furnizorul de găzduire.</li>
      </ul>
    ),
  },
  {
    id: 'drepturi',
    title: 'Drepturile tale',
    body: (
      <>
        <p>Ai dreptul:</p>
        <ul>
          <li>să afli ce date avem despre tine și să primești o copie;</li>
          <li>să ceri corectarea datelor greșite;</li>
          <li>să ceri ștergerea datelor;</li>
          <li>să ceri restricționarea prelucrării;</li>
          <li>să primești datele într-un format care se poate transfera altui furnizor;</li>
          <li>să te opui prelucrării bazate pe interesul nostru legitim.</li>
        </ul>
        <p>
          Ca să îți exerciți aceste drepturi, scrie-ne la <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. Îți răspundem în cel mult o lună. Dacă
          crezi că nu ți-am respectat drepturile, poți depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu
          Caracter Personal (
          <a href="https://www.dataprotection.ro" target="_blank" rel="noreferrer">
            dataprotection.ro
          </a>
          ).
        </p>
      </>
    ),
  },
  {
    id: 'securitate',
    title: 'Securitate',
    body: (
      <p>
        Site-ul folosește conexiune criptată (HTTPS). La mesajele tale au acces doar persoanele din echipa Exedria care se ocupă de cererea
        ta.
      </p>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookie-uri și stocare locală',
    body: (
      <p>
        Site-ul nu folosește cookie-uri de analiză sau de marketing. Păstrăm doar limba aleasă (RO sau EN) în memoria locală a browserului
        (localStorage), ca să o regăsești la următoarea vizită. O poți șterge oricând din setările browserului.
      </p>
    ),
  },
  {
    id: 'modificari',
    title: 'Modificări',
    body: (
      <p>
        Putem actualiza această politică, de exemplu când adăugăm un serviciu nou pe site. Versiunea în vigoare este cea de pe această
        pagină, cu data ultimei actualizări afișată mai sus.
      </p>
    ),
  },
];

export function Privacy() {
  const { t } = useT();
  return <LegalPage title={t.legal.privacy} sections={SECTIONS} />;
}
