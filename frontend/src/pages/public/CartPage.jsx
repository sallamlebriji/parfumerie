import { ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CartItem } from "../../components/cart/CartItem";
import { EmptyState } from "../../components/common/EmptyState";
import { PageHeader } from "../../components/common/PageHeader";
import { Button } from "../../components/ui/Button";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useAppStore } from "../../store/appStore";
import { formatPrice } from "../../utils/format";

export const CartPage = () => {
  const { t } = useTranslation();
  usePageTitle(t("cart.title"));
  const cart = useAppStore((state) => state.cart);
  const total = cart.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <main className="pb-24">
      <PageHeader eyebrow={t("cart.eyebrow")} title={t("cart.title")} />
      <div className="page-shell pt-10">
        {cart.length === 0 ? (
          <EmptyState icon={ShoppingBag} title={t("cart.empty.title")} text={t("cart.empty.text")} action={<Button as={Link} to="/shop">{t("common.backToShop")}</Button>} />
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1fr_24rem] lg:gap-16">
            <section aria-label={t("cart.title")}>
              <p className="mb-6 text-sm font-semibold text-brand-muted">{t("cart.items", { count })}</p>
              <ul className="divide-y divide-brand-ink/10">{cart.map((item) => <CartItem key={item.id} item={item} />)}</ul>
            </section>
            <aside className="h-fit rounded-3xl bg-brand-pine p-7 text-white lg:sticky lg:top-28">
              <dl className="flex items-end justify-between gap-4">
                <dt className="text-sm text-white/65">{t("common.subtotal")}</dt>
                <dd className="font-display text-4xl font-medium tabular-nums text-brand-goldsoft">{formatPrice(total)}</dd>
              </dl>
              <p className="mt-4 text-sm leading-6 text-white/65">{t("cart.deliveryNote")}</p>
              <Button as={Link} to="/checkout" size="lg" className="mt-7 w-full">{t("cart.checkout")}</Button>
              <Button as={Link} to="/shop" variant="light" className="mt-3 w-full">{t("cart.continue")}</Button>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};
