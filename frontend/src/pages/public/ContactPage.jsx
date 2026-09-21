import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../../components/common/PageHeader";
import { Button } from "../../components/ui/Button";
import { Input, Textarea } from "../../components/ui/Input";
import { usePageTitle } from "../../hooks/usePageTitle";
import { formatPhone, whatsappNumber, whatsappUrl } from "../../utils/format";

export const ContactPage = () => {
  const { t } = useTranslation();
  usePageTitle(t("nav.contact"));
  const [form, setForm] = useState({ name: "", message: "" });
  const number = whatsappNumber();

  const submit = (event) => {
    event.preventDefault();
    const text = [form.message.trim() || t("contact.defaultMessage"), form.name.trim() && `— ${form.name.trim()}`].filter(Boolean).join("\n");
    window.open(whatsappUrl(text), "_blank", "noopener");
  };

  return (
    <main className="pb-24">
      <PageHeader eyebrow={t("contact.eyebrow")} title={t("contact.title")} text={t("contact.text")} />
      <div className="page-shell grid gap-12 pt-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <section className="h-fit rounded-3xl bg-brand-pine p-8 text-white">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-whatsapp"><MessageCircle size={22} /></span>
          <h2 className="mt-6 font-display text-2xl font-medium">{t("contact.direct")}</h2>
          {number && <p className="mt-3 font-display text-3xl font-medium tabular-nums text-brand-goldsoft" dir="ltr">{formatPhone(number)}</p>}
          <Button as="a" href={whatsappUrl(t("contact.defaultMessage"))} target="_blank" rel="noreferrer" variant="whatsapp" size="lg" className="mt-8 w-full"><MessageCircle size={18} /> {t("common.writeOnWhatsapp")}</Button>
        </section>
        <form onSubmit={submit} className="grid gap-5 rounded-3xl bg-white p-6 shadow-lift sm:p-8">
          <Input label={t("contact.name")} autoComplete="name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          <Textarea label={t("contact.message")} rows={6} value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} placeholder={t("contact.defaultMessage")} />
          <Button type="submit" variant="whatsapp" size="lg" className="w-full sm:w-auto sm:justify-self-start"><MessageCircle size={18} /> {t("contact.send")}</Button>
        </form>
      </div>
    </main>
  );
};
