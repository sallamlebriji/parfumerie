import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/common/PageHeader";
import { Button } from "../../components/ui/Button";
import { usePageTitle } from "../../hooks/usePageTitle";

export const AboutPage = () => {
  const { t } = useTranslation();
  usePageTitle(t("nav.about"));
  const blocks = t("about.blocks", { returnObjects: true });

  return (
    <main className="pb-24">
      <PageHeader eyebrow={t("about.eyebrow")} title={t("about.title")} text={t("about.text")} />
      <div className="page-shell pt-16">
        <div className="grid gap-x-12 gap-y-10 md:grid-cols-3">
          {blocks.map((block) => (
            <section key={block.title} className="border-t-2 border-brand-gold pt-6">
              <h2 className="font-display text-2xl font-medium">{block.title}</h2>
              <p className="mt-3 leading-8 text-brand-ink/75">{block.text}</p>
            </section>
          ))}
        </div>
        <div className="mt-20 flex flex-wrap gap-3">
          <Button as={Link} to="/shop" size="lg">{t("home.hero.primary")} <ArrowRight size={18} className="rtl:-scale-x-100" /></Button>
          <Button as={Link} to="/faq" variant="outline" size="lg">{t("faq.title")}</Button>
        </div>
      </div>
    </main>
  );
};
