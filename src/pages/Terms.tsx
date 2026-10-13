import { Link } from 'react-router';
import { LegalPage, type LegalSection } from '../components/Legal';
import { COMPANY, EMAIL } from '../data/company';
import { useT } from '../i18n';

// Template, to be reviewed by a lawyer. Add the company's legal details here once it is registered.
const SECTIONS: LegalSection[] = [
  {
    id: 'cine-suntem',
    title: 'Cine suntem',
    body: (
      <p>
        Site-ul {COMPANY.domain} este administrat de echipa Exedria, pe care o poți contacta la <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        În acest document, „noi” sau „Exedria” înseamnă această echipă, iar „tu” înseamnă orice persoană care folosește site-ul.
      </p>
    ),
  },
  {
    id: 'acceptare',
    title: 'Acceptarea termenilor',
    body: <p>Folosind site-ul, accepți acești termeni. Dacă nu ești de acord cu ei, te rugăm să nu folosești site-ul.</p>,
  },
  {
    id: 'servicii',
    title: 'Ce oferă site-ul',
    body: (
      <>
        <p>
          Site-ul prezintă platforma Exedria (randare video programatică, frontend-uri web, intake automat de lead-uri, API și
          integrări) și îți permite să soliciți acces.
        </p>
        <p>
          Informațiile de pe site au caracter general și nu sunt o ofertă fermă. Prețul, accesul și condițiile de utilizare se
          stabilesc printr-o propunere scrisă și un contract separat, care au prioritate față de acești termeni.
        </p>
      </>
    ),
  },
  {
    id: 'formular',
    title: 'Formularul de contact',
    body: (
      <p>
        Când ne trimiți o cerere, te rugăm să folosești date corecte și să nu incluzi informații confidențiale sau datele altor persoane
        fără acordul lor. Trimiterea formularului nu creează un contract. Cum folosim datele pe care ni le trimiți afli din{' '}
        <Link to="/confidentialitate">Politica de confidențialitate</Link>.
      </p>
    ),
  },
  {
    id: 'proprietate-intelectuala',
    title: 'Proprietate intelectuală',
    body: (
      <>
        <p>
          Conținutul site-ului (texte, design, cod, animații, logo) aparține Exedria sau este folosit cu acordul titularilor și este protejat
          de Legea nr. 8/1996 privind dreptul de autor și drepturile conexe. Nu îl poți copia, reproduce sau folosi în scop comercial fără
          acordul nostru scris.
        </p>
        <p>
          Proiectele din showcase sunt prezentate cu acordul clienților, iar mărcile și materialele lor rămân proprietatea acestora.
          Drepturile asupra livrabilelor unui proiect se stabilesc prin contractul acelui proiect.
        </p>
      </>
    ),
  },
  {
    id: 'utilizare',
    title: 'Utilizarea site-ului',
    body: (
      <>
        <p>Când folosești site-ul, nu ai voie:</p>
        <ul>
          <li>să încerci să accesezi fără drept site-ul, serverele sau datele altor persoane;</li>
          <li>să trimiți prin formular conținut ilegal, mesaje nesolicitate sau cod malițios;</li>
          <li>să folosești site-ul într-un mod care îi afectează funcționarea.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'raspundere',
    title: 'Limitarea răspunderii',
    body: (
      <p>
        Ne străduim ca informațiile de pe site să fie corecte și ca site-ul să fie disponibil, dar nu garantăm că va funcționa fără
        întreruperi sau erori. În limitele permise de lege, nu răspundem pentru pagube indirecte rezultate din folosirea site-ului. Nimic
        din acești termeni nu limitează drepturile pe care le ai ca consumator potrivit legii.
      </p>
    ),
  },
  {
    id: 'linkuri',
    title: 'Linkuri externe',
    body: (
      <p>
        Site-ul poate conține linkuri către alte site-uri, de exemplu rețele sociale sau site-urile clienților noștri. Nu răspundem pentru
        conținutul sau politicile acestora.
      </p>
    ),
  },
  {
    id: 'modificari',
    title: 'Modificări',
    body: (
      <p>
        Putem actualiza acești termeni. Versiunea în vigoare este cea publicată pe această pagină, cu data ultimei actualizări afișată mai
        sus.
      </p>
    ),
  },
  {
    id: 'litigii',
    title: 'Legea aplicabilă și litigii',
    body: (
      <>
        <p>
          Acești termeni sunt guvernați de legea română. Orice neînțelegere încercăm să o rezolvăm pe cale amiabilă, așa că te rugăm să ne
          scrii mai întâi la <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. Dacă nu reușim, litigiul va fi soluționat de instanțele competente
          din România.
        </p>
        <p>
          Dacă ești consumator, poți apela și la procedura de soluționare alternativă a litigiilor (SAL) a Autorității Naționale pentru
          Protecția Consumatorilor, la{' '}
          <a href="https://anpc.ro" target="_blank" rel="noreferrer">
            anpc.ro
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: 'contact',
    title: 'Contact',
    body: (
      <p>
        Pentru orice întrebare despre acești termeni, scrie-ne la <a href={`mailto:${EMAIL}`}>{EMAIL}</a> sau folosește{' '}
        <Link to="/contact">pagina de contact</Link>.
      </p>
    ),
  },
];

export function Terms() {
  const { t } = useT();
  return <LegalPage title={t.legal.terms} sections={SECTIONS} />;
}
