import { AlertCircle, Check, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/axios";
import { PageHeader } from "../../components/common/PageHeader";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { usePageTitle } from "../../hooks/usePageTitle";
import { formatPrice, whatsappUrl } from "../../utils/format";

const flow = ["pending", "confirmed", "delivered"];

const StatusTimeline = ({ status }) => {
  const { t } = useTranslation();
  const index = flow.indexOf(status);
  return (
    <ol className="relative mt-10 grid grid-cols-3 gap-2">
      <span className="absolute inset-x-[16.6%] top-5 h-0.5 bg-brand-ink/15" aria-hidden="true" />
      <span className="absolute start-[16.6%] top-5 h-0.5 bg-brand-gold transition-all" style={{ width: `${Math.max(0, index) * 33.4}%` }} aria-hidden="true" />
      {flow.map((key, position) => {
        const done = index >= position;
        return (
          <li key={key} className="relative text-center" aria-current={index === position ? "step" : undefined}>
            <span className={`mx-auto grid h-10 w-10 place-items-center rounded-full border-2 bg-white text-sm font-bold ${done ? "border-brand-gold bg-brand-gold text-brand-night" : "border-brand-ink/20 text-brand-muted"}`}>{done ? <Check size={18} /> : position + 1}</span>
            <span className={`mt-3 block text-sm font-semibold ${done ? "text-brand-ink" : "text-brand-muted"}`}>{t(`track.status.${key}`)}</span>
          </li>
        );
      })}
    </ol>
  );
};

export const TrackOrderPage = () => {
  const { t, i18n } = useTranslation();
  usePageTitle(t("track.title"));
  const [form, setForm] = useState({ ref: "", phone: "" });
  const [state, setState] = useState({ loading: false, error: "", order: null });

  const submit = async (event) => {
    event.preventDefault();
    setState({ loading: true, error: "", order: null });
    try {
      const { data } = await api.get("/orders/track", { params: { ref: form.ref.trim(), phone: form.phone.trim() } });
      setState({ loading: false, error: "", order: data });
    } catch (error) {
      const status = error.response?.status;
      const message = status === 400 || status === 404 ? t("track.notFound") : status === 429 ? error.response.data?.message : t("common.error");
      setState({ loading: false, error: message, order: null });
    }
  };

  const { order } = state;
  const date = order ? new Date(order.createdAt).toLocaleDateString(i18n.language === "ar" ? "ar-MA" : i18n.language === "en" ? "en-GB" : "fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "";

  return (
    <main className="pb-24">
      <PageHeader eyebrow={t("track.eyebrow")} title={t("track.title")} text={t("track.text")} />
      <div className="page-shell pt-12">
        <div className="mx-auto max-w-2xl">
          <form onSubmit={submit} className="grid gap-5 rounded-3xl bg-white p-6 shadow-lift sm:grid-cols-2 sm:p-8">
            <Input label={t("track.reference")} placeholder={t("track.referencePlaceholder")} autoCapitalize="characters" required maxLength={7} value={form.ref} onChange={(event) => setForm((current) => ({ ...current, ref: event.target.value }))} />
            <Input label={t("track.phone")} type="tel" inputMode="tel" autoComplete="tel" required value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
            <Button type="submit" size="lg" disabled={state.loading} className="sm:col-span-2">{state.loading ? t("track.searching") : t("track.submit")}</Button>
          </form>

          {state.error && (
            <p role="alert" className="mt-6 flex items-start gap-3 rounded-2xl border border-brand-wine/30 bg-brand-wine/5 p-4 text-sm font-semibold text-brand-wine"><AlertCircle size={20} className="mt-0.5 shrink-0" /> {state.error}</p>
          )}

          {order && (
            <section className="mt-8 rounded-3xl bg-white p-6 shadow-lift sm:p-8" aria-live="polite">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">{t("success.reference")}</p>
                  <p className="mt-2 font-display text-4xl font-medium tracking-[0.16em]">{order.reference}</p>
                </div>
                <p className="text-sm text-brand-muted">{t("track.placedOn", { date })}</p>
              </div>

              {order.status === "cancelled" ? (
                <p className="mt-8 rounded-2xl bg-brand-wine/10 p-4 text-sm font-semibold text-brand-wine">{t("track.status.cancelled")} — {t("track.statusText.cancelled")}</p>
              ) : (
                <>
                  <StatusTimeline status={order.status} />
                  <p className="mt-8 text-center text-sm text-brand-ink/80">{t(`track.statusText.${order.status}`, "")}</p>
                </>
              )}

              <h2 className="mt-10 text-sm font-bold uppercase tracking-[0.18em] text-brand-muted">{t("track.items")}</h2>
              <ul className="mt-3 divide-y divide-brand-ink/10 text-sm">
                {order.items.map((item, position) => (
                  <li key={`${item.name}-${position}`} className="flex justify-between gap-4 py-3"><span>{item.name} <span className="text-brand-muted">· {item.volume} × {item.quantity}</span></span></li>
                ))}
              </ul>
              <p className="mt-4 flex justify-between border-t border-brand-ink/10 pt-4 font-semibold"><span>{t("common.total")}</span><span className="font-display text-xl tabular-nums">{formatPrice(order.totalAmount)}</span></p>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-brand-ivory p-4 text-sm">
                <span className="font-semibold">{t("track.help")}</span>
                <Button as="a" size="sm" variant="whatsapp" href={whatsappUrl(`${t("contact.defaultMessage")} (${order.reference})`)} target="_blank" rel="noreferrer"><MessageCircle size={15} /> {t("common.writeOnWhatsapp")}</Button>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
};
