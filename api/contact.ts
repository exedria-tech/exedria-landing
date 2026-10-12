// Vercel Function: POST /api/contact
// Validates the brief from the contact form and sends it to CONTACT_TO (default hello@exedria.tech) via Resend.
// Needs RESEND_API_KEY (and optionally RESEND_FROM, CONTACT_TO) in the Vercel project env.
import { Resend } from 'resend';
import { z } from 'zod';

const SERVICII = ['Video promo', 'Site', 'Rezervări', 'Software', 'Suport'] as const;
const TERMENE = ['Urgent', 'O lună', 'Flexibil'] as const;

const TO = process.env.CONTACT_TO ?? 'hello@exedria.tech';
const FROM = process.env.RESEND_FROM ?? 'Exedria Brief <brief@exedria.tech>';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9\s().-]{7,20}$/;

const ContactSchema = z.object({
  nume: z.string().trim().min(1, 'Numele este obligatoriu.').max(120),
  contact: z
    .string()
    .trim()
    .min(1, 'Lasă un email sau un număr de telefon.')
    .max(160)
    .refine((v) => EMAIL_RE.test(v) || PHONE_RE.test(v), 'Contactul trebuie să fie un email sau un număr de telefon valid.'),
  servicii: z.array(z.enum(SERVICII, { message: 'Serviciu necunoscut.' })).min(1, 'Alege cel puțin un serviciu.'),
  termen: z.enum(TERMENE, { message: 'Alege un termen.' }),
  mesaj: z.string().trim().min(1, 'Mesajul este obligatoriu.').max(5000),
});

type ContactResult = { success: true; id: string } | { success: false; error: string };

export async function POST(request: Request): Promise<Response> {
  const reply = (result: ContactResult, status: number) => Response.json(result, { status });

  const input: unknown = await request.json().catch(() => null);
  const parsed = ContactSchema.safeParse(input);
  if (!parsed.success) {
    return reply({ success: false, error: parsed.error.issues[0]?.message ?? 'Date invalide.' }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY lipsește');
    return reply({ success: false, error: 'Serviciul de email nu este configurat.' }, 500);
  }

  const data = parsed.data;
  const isEmail = EMAIL_RE.test(data.contact);
  const resend = new Resend(apiKey);

  try {
    const { data: sent, error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: isEmail ? data.contact : undefined,
      subject: `[brief] ${data.nume} · ${data.servicii.join(' + ')} · ${data.termen}`,
      html: renderHtml(data),
      text: renderText(data),
    });

    if (error || !sent) {
      console.error('[contact] Resend error', error);
      return reply({ success: false, error: 'Mesajul nu a putut fi trimis. Încearcă din nou.' }, 502);
    }
    return reply({ success: true, id: sent.id }, 200);
  } catch (err) {
    console.error('[contact] send failed', err);
    return reply({ success: false, error: 'Mesajul nu a putut fi trimis. Încearcă din nou.' }, 502);
  }
}

type Brief = z.output<typeof ContactSchema>;

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function timecode(d: Date) {
  return d.toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest', hour12: false });
}

function renderText(d: Brief) {
  return [
    `nume:     ${d.nume}`,
    `contact:  ${d.contact}`,
    `servicii: ${d.servicii.join(', ')}`,
    `termen:   ${d.termen}`,
    '',
    d.mesaj,
  ].join('\n');
}

function renderHtml(d: Brief) {
  const mono = "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";
  const row = (key: string, value: string) => `
    <tr>
      <td style="padding:10px 14px;border-top:1px solid #e3e8ef;color:#64748b;font:12px ${mono};text-transform:uppercase;letter-spacing:.12em;width:110px;vertical-align:top;">${key}</td>
      <td style="padding:10px 14px;border-top:1px solid #e3e8ef;color:#0b1220;font:14px ${mono};">${value}</td>
    </tr>`;

  const chips = d.servicii
    .map((s) => `<span style="display:inline-block;margin:0 6px 4px 0;padding:3px 8px;border:1px solid #22aef5;border-radius:2px;color:#0673b0;font:12px ${mono};">${esc(s)}</span>`)
    .join('');

  const contactCell = EMAIL_RE.test(d.contact)
    ? `<a href="mailto:${esc(d.contact)}" style="color:#0673b0;">${esc(d.contact)}</a>`
    : `<a href="tel:${esc(d.contact.replace(/[^\d+]/g, ''))}" style="color:#0673b0;">${esc(d.contact)}</a>`;

  return `<!doctype html>
<html lang="ro">
<body style="margin:0;padding:24px;background:#f5f7fa;">
  <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;margin:0 auto;background:#ffffff;border:1px solid #d5dce6;border-collapse:collapse;">
    <tr>
      <td colspan="2" style="padding:14px;background:#0b1220;color:#f5f7fa;font:12px ${mono};letter-spacing:.08em;">
        <span style="color:#e0179e;">●</span> BRIEF NOU · exedria.tech
        <span style="float:right;color:#94a3b8;">[${esc(timecode(new Date()))}]</span>
      </td>
    </tr>
    ${row('nume', esc(d.nume))}
    ${row('contact', contactCell)}
    ${row('servicii', chips)}
    ${row('termen', `{ termen: "<span style="color:#e0179e;">${esc(d.termen)}</span>" }`)}
    <tr>
      <td colspan="2" style="padding:10px 14px 4px;border-top:1px solid #e3e8ef;color:#64748b;font:12px ${mono};text-transform:uppercase;letter-spacing:.12em;">mesaj</td>
    </tr>
    <tr>
      <td colspan="2" style="padding:4px 14px 18px;">
        <pre style="margin:0;padding:12px;background:#f5f7fa;border-left:2px solid #22aef5;color:#0b1220;font:13px/1.6 ${mono};white-space:pre-wrap;word-break:break-word;">${esc(d.mesaj)}</pre>
      </td>
    </tr>
    <tr>
      <td colspan="2" style="padding:10px 14px;border-top:1px solid #e3e8ef;color:#94a3b8;font:11px ${mono};">{ status: "received", sursa: "formular contact" }</td>
    </tr>
  </table>
</body>
</html>`;
}

