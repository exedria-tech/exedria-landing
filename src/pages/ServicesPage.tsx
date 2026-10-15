import { PayloadSync } from '../components/PayloadSync';
import { ServiceRows } from '../components/Services';
import { WebSpeed } from '../components/WebSpeed';
import { PageHeader, usePageTitle } from '../components/ui';
import { useT } from '../i18n';

export function ServicesPage() {
  const { t } = useT();
  usePageTitle(t.services.label);
  return (
    <>
      <PageHeader label={t.services.label} title={t.services.title} lead={t.services.body} />
      <div className="border-t border-line">
        <ServiceRows extras={{ 'site-uri': <WebSpeed />, software: <PayloadSync /> }} />
      </div>
    </>
  );
}
