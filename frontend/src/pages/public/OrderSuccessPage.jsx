import { Check, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { PageHeader } from "../../components/common/PageHeader";
import { Button } from "../../components/ui/Button";
import { usePageTitle } from "../../hooks/usePageTitle";
import { formatPrice, whatsappUrl } from "../../utils/format";

export const OrderSuccessPage = () => {
  const { t } = useTranslation();
  usePageTitle(t("success.eyebrow"));
  const order = useLocation().state?.order;

  if (!order) {
    return (
      <main className="pb-24">
        <PageHeader eyebrow={t("success.eyebrow")} title={t("nav.orderNow")} text={t("success.noOrder")} />
        <div className="page-shell pt-10"><Button as={Link} to="/shop">{t("common.backToShop")}</Button></div>
      </main>
    );
  }

  return (
    <main className="pb-24">
      <PageHeader eyebrow={t("success.eyebrow")} title={t("success.title")} text={t("success.text")} />
      <div className="page-shell pt-12">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white px-6 py-12 text-center shadow-lift sm:px-12">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-gold/20 text-brand-golddeep"><Check size={26} /></span>
          {order.reference && (
            <>
              <p className="eyebrow mt-8">{t("success.reference")}</p>
              <p className="mt-3 font-display text-5xl font-medium tracking-[0.18em]">{order.reference}</p>
              <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-brand-muted">{t("success.keep")}</p>
            </>
          )}
          <p className="mt-6 text-sm text-brand-muted">{t("common.total")} : <strong className="font-bold text-brand-ink">{formatPrice(order.total)}</strong></p>
          <Button as="a" href={whatsappUrl(order.message)} target="_blank" rel="noreferrer" variant="whatsapp" size="lg" className="mt-8 w-full sm:w-auto"><MessageCircle size={18} /> {t("success.whatsapp")}</Button>
          <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-bold">
            {order.reference && <Link to="/track-order" className="underline underline-offset-4 transition hover:text-brand-golddeep">{t("success.track")}</Link>}
            <Link to="/" className="underline underline-offset-4 transition hover:text-brand-golddeep">{t("success.home")}</Link>
          </div>
        </div>
      </div>
    </main>
  );
};
