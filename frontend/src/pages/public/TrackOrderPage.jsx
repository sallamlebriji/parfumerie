import { useState } from "react";
import { PageHeader } from "../../components/common/PageHeader";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";

export const TrackOrderPage = () => {
  const [code, setCode] = useState("");
  const [show, setShow] = useState(false);
  const statuses = ["En attente", "Confirmee", "Preparee", "Expediee", "Livree"];
  return (
    <main className="pb-20">
      <PageHeader eyebrow="Suivi" title="Suivre une commande" text="Saisissez votre numero de commande pour consulter son statut." image="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1800&q=90" />
      <section className="mx-auto -mt-8 max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[28px] bg-white p-6 shadow-xl">
          <Input label="Numero de commande" value={code} onChange={(e) => setCode(e.target.value)} placeholder="CMD-24001" />
          <Button className="mt-5" onClick={() => setShow(true)}>Afficher statut</Button>
          {show && <div className="mt-8 grid gap-3">{statuses.map((status, index) => <div key={status} className="flex items-center justify-between rounded-2xl bg-[#F8F5EF] p-4"><span className="font-bold">{status}</span><Badge tone={index < 3 ? "green" : "soft"}>{index < 3 ? "OK" : "A venir"}</Badge></div>)}</div>}
        </div>
      </section>
    </main>
  );
};
