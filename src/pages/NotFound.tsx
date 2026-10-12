import { Button, PageHeader, usePageTitle } from '../components/ui';
import { useT } from '../i18n';

export function NotFound() {
  const { t } = useT();
  usePageTitle('404');
  return (
    <PageHeader label="404" tone="magenta" title={t.notFound.title} lead={t.notFound.body}>
      <div className="mt-10 pb-24">
        <Button href="/">{t.notFound.home}</Button>
      </div>
    </PageHeader>
  );
}
