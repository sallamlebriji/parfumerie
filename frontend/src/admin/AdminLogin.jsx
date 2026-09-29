import { Lock, UserRound } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DEMO_PASSWORD = "Demo12345";
const DEMO_ACCOUNTS = [
  { role: "Administrateur", email: "demo.admin@parfumerie.local", hint: "Acces complet a la parfumerie" },
  { role: "Manager", email: "demo.manager@parfumerie.local", hint: "Produits, commandes, rapports" },
  { role: "Employe", email: "demo.employe@parfumerie.local", hint: "Commandes, stock et ventes" }
];

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Connexion impossible.");
    }
  };

  return (
    <main className="luxury-gradient flex min-h-screen items-center justify-center px-4 py-8">
      <form onSubmit={submit} className="w-full max-w-md rounded-[28px] border border-gold/25 bg-white/10 p-8 text-white shadow-luxury backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold text-white"><Lock /></div>
          <h1 className="mt-5 text-4xl font-black">Maison Parfumee</h1>
          <p className="mt-2 text-sm text-white/60">Espace administration</p>
        </div>
        {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <label><span className="mb-2 block text-sm font-semibold text-white/80">Email</span><input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="mt-4 block"><span className="mb-2 block text-sm font-semibold text-white/80">Mot de passe</span><input className="field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        <button className="btn-gold mt-6 w-full">Se connecter</button>
        <div className="mt-8 border-t border-white/15 pt-6">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-white/60">Comptes de demonstration</p>
          <div className="grid gap-2">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => { setEmail(account.email); setPassword(DEMO_PASSWORD); setError(""); }}
                className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-left transition hover:border-gold/60 hover:bg-white/10"
              >
                <UserRound size={18} className="shrink-0 text-gold" />
                <span><span className="block text-sm font-bold">{account.role}</span><span className="block text-xs text-white/60">{account.hint}</span></span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-white/50">Cliquez sur un profil pour remplir les champs, puis Se connecter.</p>
        </div>
      </form>
    </main>
  );
};

export default AdminLogin;
