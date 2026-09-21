import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { EmptyState } from "../../components/common/EmptyState";
import { PageHeader } from "../../components/common/PageHeader";
import { CheckoutForm } from "../../components/forms/CheckoutForm";
import { Button } from "../../components/ui/Button";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useAppStore } from "../../store/appStore";
import { formatPrice, orderReference } from "../../utils/format";
import { buildOrderMessage, buildOrderNotes, deliveryLabels } from "../../utils/order";

export const CheckoutPage = () => {
  const { t } = useTranslation();
  usePageTitle(t("checkout.title"));
  const navigate = useNavigate();
  const cart = useAppStore((state) => state.cart);
  const clearCart = useAppStore((state) => state.clearCart);
  const total = cart.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [lastValues, setLastValues] = useState(null);

  const finish = (id, values) => {
    const order = {
      reference: id ? orderReference(id) : "",
      total,
      message: buildOrderMessage({ id, values, cart, total })
    };
    navigate("/order-success", { replace: true, state: { order } });
    clearCart();
  };

  const submit = async (values) => {
    setSubmitting(true);
    setError("");
    setLastValues(values);
    try {
      const pickup = values.delivery === "pickup";
      const { data } = await api.post("/orders", {
        customerName: values.fullName,
        phone: values.phone,
        address: pickup ? deliveryLabels.pickup : values.address,
        city: pickup ? "—" : values.city,
        notes: buildOrderNotes(values),
        products: cart.map((line) => ({ perfumeId: line.id, quantity: line.quantity }))
      });
      finish(data.order?._id, values);
    } catch {
      setError(t("checkout.failed"));
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="pb-24">
        <PageHeader eyebrow={t("checkout.eyebrow")} title={t("checkout.title")} />
        <div className="page-shell pt-10">
          <EmptyState icon={ShoppingBag} title={t("checkout.empty.title")} text={t("checkout.empty.text")} action={<Button as={Link} to="/shop">{t("common.backToShop")}</Button>} />
        </div>
      </main>
    );
  }

  return (
    <main className="pb-24">
      <PageHeader eyebrow={t("checkout.eyebrow")} title={t("checkout.title")} text={t("checkout.text")} />
      <div className="page-shell grid gap-12 pt-12 lg:grid-cols-[1fr_24rem] lg:gap-16">
        <CheckoutForm onSubmit={submit} submitting={submitting} error={error} onSendAnyway={error && lastValues ? () => finish(null, lastValues) : undefined} />
        <aside className="h-fit rounded-3xl bg-brand-pine p-7 text-white lg:sticky lg:top-28">
          <h2 className="font-display text-2xl font-medium">{t("checkout.summary")}</h2>
          <ul className="mt-5 divide-y divide-white/10">
            {cart.map((line) => (
              <li key={line.id} className="flex justify-between gap-4 py-3 text-sm">
                <span className="text-white/80">{line.name} <span className="text-white/50">× {line.quantity}</span></span>
                <span className="shrink-0 tabular-nums">{formatPrice(line.price * line.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 flex items-end justify-between border-t border-white/15 pt-5">
            <dt className="text-sm text-white/65">{t("common.total")}</dt>
            <dd className="font-display text-3xl font-medium tabular-nums text-brand-goldsoft">{formatPrice(total)}</dd>
          </dl>
          <p className="mt-5 text-xs leading-6 text-white/60">{t("cart.deliveryNote")}</p>
        </aside>
      </div>
    </main>
  );
};
