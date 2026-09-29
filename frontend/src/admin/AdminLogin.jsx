import { Lock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@parfumerie.local");
  const [password, setPassword] = useState("Admin12345");
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
    <main className="luxury-gradient flex min-h-screen items-center justify-center px-4">
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
      </form>
    </main>
  );
};

export default AdminLogin;
