import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../../components/common/PageHeader";
import { Button } from "../../components/ui/Button";
import { usePageTitle } from "../../hooks/usePageTitle";
import { whatsappUrl } from "../../utils/format";
import { MessageCircle } from "lucide-react";

export const FaqPage = () => {
  const { t } = useTranslation();
  usePageTitle(t("faq.title"));
  const items = t("faq.items", { returnObjects: true });

  return (
    <main className="pb-24">
      <PageHeader eyebrow={t("faq.eyebrow")} title={t("faq.title")} text={t("faq.text")} />
      <div className="page-shell pt-12">
        <div className="mx-auto max-w-3xl divide-y divide-brand-ink/10 border-y border-brand-ink/10">
          {items.map((item) => (
            <details key={item.q} className="group py-2">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-xl font-medium marker:content-none [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-brand-ink/15 transition group-open:rotate-45 group-open:border-brand-gold group-open:bg-brand-gold"><Plus size={18} /></span>
              </summary>
              <p className="max-w-2xl pb-6 leading-8 text-brand-ink/80">{item.a}</p>
            </details>
          ))}
        </div>
        <div className="mx-auto mt-14 max-w-3xl rounded-3xl bg-brand-porcelain p-8 text-center">
          <h2 className="font-display text-2xl font-medium">{t("home.cta.title")}</h2>
          <Button as="a" href={whatsappUrl(t("contact.defaultMessage"))} target="_blank" rel="noreferrer" variant="whatsapp" className="mt-6"><MessageCircle size={17} /> {t("common.writeOnWhatsapp")}</Button>
        </div>
      </div>
    </main>
  );
};
