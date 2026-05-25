import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

const schema = z.object({
  fullName: z.string().min(3, "Nom requis"),
  phone: z.string().min(8, "Telephone requis"),
  email: z.string().email("Email invalide"),
  address: z.string().min(5, "Adresse requise"),
  city: z.string().min(2, "Ville requise"),
  delivery: z.string(),
  payment: z.string()
});

export const CheckoutForm = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { delivery: "Livraison a domicile", payment: "Paiement a la livraison" }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 rounded-[28px] border border-[#C8A96A]/15 bg-white/80 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.08)] backdrop-blur md:grid-cols-2">
      <Input label="Nom complet" error={errors.fullName?.message} {...register("fullName")} />
      <Input label="Telephone" error={errors.phone?.message} {...register("phone")} />
      <Input label="Email" error={errors.email?.message} {...register("email")} />
      <Input label="Ville" error={errors.city?.message} {...register("city")} />
      <Input label="Adresse" className="md:col-span-2" error={errors.address?.message} {...register("address")} />
      <Select label="Mode de livraison" options={["Livraison a domicile", "Retrait boutique"]} {...register("delivery")} />
      <Select label="Methode paiement" options={["Paiement a la livraison", "Paiement par carte", "Virement"]} {...register("payment")} />
      <Button className="md:col-span-2">Confirmer la commande</Button>
    </form>
  );
};
