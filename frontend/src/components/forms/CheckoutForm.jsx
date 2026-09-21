import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "../ui/Button";
import { Input, Textarea } from "../ui/Input";

const Choice = ({ label, value, register, name }) => (
  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-brand-ink/15 bg-white px-4 py-3 text-sm font-semibold transition has-[:checked]:border-brand-pine has-[:checked]:bg-brand-pine/5 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-gold/30">
    <input type="radio" value={value} className="h-4 w-4 accent-brand-pine" {...register(name)} />
    {label}
  </label>
);

export const CheckoutForm = ({ onSubmit, submitting = false, error = "", onSendAnyway }) => {
  const { t } = useTranslation();
  const schema = useMemo(() => z.object({
    fullName: z.string().trim().min(3, t("checkout.errors.name")),
    phone: z.string().trim().refine((value) => value.replace(/\D/g, "").length >= 8, t("checkout.errors.phone")),
    delivery: z.enum(["home", "pickup"]),
    payment: z.enum(["cash", "transfer"]),
    city: z.string().trim().optional(),
    address: z.string().trim().optional(),
    notes: z.string().trim().max(300).optional()
  }).superRefine((values, ctx) => {
    if (values.delivery !== "home") return;
    if (!values.city || values.city.length < 2) ctx.addIssue({ code: "custom", path: ["city"], message: t("checkout.errors.city") });
    if (!values.address || values.address.length < 5) ctx.addIssue({ code: "custom", path: ["address"], message: t("checkout.errors.address") });
  }), [t]);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { delivery: "home", payment: "cash", fullName: "", phone: "", city: "", address: "", notes: "" }
  });
  const delivery = watch("delivery");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-10">
      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-5 font-display text-2xl font-medium">{t("checkout.contact")}</legend>
        <Input label={t("checkout.fullName")} autoComplete="name" error={errors.fullName?.message} {...register("fullName")} />
        <Input label={t("checkout.phone")} type="tel" inputMode="tel" autoComplete="tel" hint={t("checkout.phoneHint")} error={errors.phone?.message} {...register("phone")} />
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-5 font-display text-2xl font-medium">{t("checkout.delivery.label")}</legend>
        <Choice name="delivery" value="home" label={t("checkout.delivery.home")} register={register} />
        <Choice name="delivery" value="pickup" label={t("checkout.delivery.pickup")} register={register} />
        {delivery === "home" && (
          <>
            <Input label={t("checkout.city")} autoComplete="address-level2" error={errors.city?.message} {...register("city")} />
            <Input label={t("checkout.address")} autoComplete="street-address" error={errors.address?.message} {...register("address")} />
          </>
        )}
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-5 font-display text-2xl font-medium">{t("checkout.payment.label")}</legend>
        <Choice name="payment" value="cash" label={t("checkout.payment.cash")} register={register} />
        <Choice name="payment" value="transfer" label={t("checkout.payment.transfer")} register={register} />
      </fieldset>

      <Textarea label={t("checkout.notes")} error={errors.notes?.message} {...register("notes")} />

      {error && (
        <div role="alert" className="flex gap-3 rounded-2xl border border-brand-wine/30 bg-brand-wine/5 p-4 text-sm text-brand-wine">
          <AlertCircle size={20} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">{error}</p>
            {onSendAnyway && <button type="button" onClick={onSendAnyway} className="mt-2 font-bold underline underline-offset-4">{t("checkout.sendAnyway")}</button>}
          </div>
        </div>
      )}

      <div>
        <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">{submitting ? t("checkout.submitting") : t("checkout.submit")}</Button>
        <p className="mt-4 max-w-xl text-xs leading-6 text-brand-muted">{t("checkout.consent")}</p>
      </div>
    </form>
  );
};
