import { motion } from "framer-motion";
import gsap from "gsap";
import { AlertCircle, ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

const titles = {
  login: "Connexion admin",
  register: "Creation compte",
  forgot: "Mot de passe oublie"
};

const subtitles = {
  login: "Accedez au cockpit premium pour piloter produits, commandes, stock et ventes.",
  register: "La creation de comptes admin reste controlee par le superadmin.",
  forgot: "Recevez les instructions de recuperation si cette option est activee."
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const AuthPage = ({ type = "login" }) => {
  const rootRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectTo = location.state?.from?.pathname || "/admin/dashboard";

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(".auth-logo", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.75, ease: "power3.out" });
      gsap.to(".auth-orbit", { rotate: 360, duration: 28, repeat: -1, ease: "none" });
      gsap.to(".auth-glow", { scale: 1.08, opacity: 0.8, duration: 3.2, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }, rootRef);
    return () => context.revert();
  }, []);

  if (!isLoading && isAuthenticated && type === "login") {
    return <Navigate to={redirectTo} replace />;
  }

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "", submit: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (type === "register" && form.name.trim().length < 2) nextErrors.name = "Nom complet requis.";
    if (!emailPattern.test(form.email.trim())) nextErrors.email = "Adresse email invalide.";
    if (type === "login" && form.password.length < 6) nextErrors.password = "Mot de passe requis, 6 caracteres minimum.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    if (type !== "login") {
      toast("Cette action sera activee par le superadmin.");
      setErrors({ submit: "Cette action sera activee par le superadmin." });
      return;
    }

    try {
      setIsSubmitting(true);
      await login(form.email.trim(), form.password);
      toast.success("Connexion reussie");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || "Email ou mot de passe incorrect.";
      setErrors({ submit: message });
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main ref={rootRef} className="relative grid min-h-screen place-items-center overflow-hidden bg-[#0B0909] px-4 py-8 text-white">
      <div className="auth-glow pointer-events-none absolute right-[-10rem] top-[-14rem] h-[32rem] w-[32rem] rounded-full bg-[#D8B87E]/18 blur-3xl" />
      <div className="auth-glow pointer-events-none absolute bottom-[-16rem] left-[-12rem] h-[34rem] w-[34rem] rounded-full bg-[#C79078]/12 blur-3xl" />
      <div className="auth-orbit pointer-events-none absolute h-[42rem] w-[42rem] rounded-full border border-[#D8B87E]/10" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,248,236,0.055),transparent_36%,rgba(145,83,59,0.12)),radial-gradient(circle_at_50%_12%,rgba(216,184,126,0.12),transparent_24rem)]" />

      <section className="relative z-10 grid w-full max-w-4xl overflow-hidden rounded-[30px] border border-[#D8B87E]/22 bg-[#120E0E]/86 shadow-[0_32px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:grid-cols-[0.9fr_1fr]">
        <div className="auth-logo relative hidden overflow-hidden border-r border-[#D8B87E]/18 bg-[#171111] p-8 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(216,184,126,0.24),transparent_42%),radial-gradient(circle_at_20%_18%,rgba(255,245,226,0.08),transparent_18rem)]" />
          <div className="relative">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D8B87E] text-[#211817]">
              <ShieldCheck size={22} />
            </div>
            <p className="mt-7 text-xs font-black uppercase tracking-[0.28em] text-[#D8B87E]">Administration</p>
            <h1 className="mt-3 max-w-sm font-title text-4xl font-black leading-tight tracking-normal">Maison Parfumee</h1>
            <p className="mt-4 max-w-sm text-sm leading-7 text-[#F8EAD7]/66">Console securisee pour une gestion douce, claire et raffinee de la boutique.</p>
          </div>
          <div className="relative mt-10 grid gap-3">
            {[
              ["Catalogue", "Produits, prix et images"],
              ["Commandes", "Suivi et statuts clients"],
              ["Pilotage", "Ventes, stock et alertes"]
            ].map(([title, text]) => (
              <div key={title} className="rounded-[22px] border border-[#D8B87E]/18 bg-[#FFF5E7]/[0.055] p-4">
                <p className="text-sm font-black text-[#FFF9EF]">{title}</p>
                <p className="mt-1 text-xs font-semibold text-[#F8EAD7]/48">{text}</p>
              </div>
            ))}
          </div>
        </div>
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.98 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-md p-6 sm:p-8 lg:p-10"
        >
          <div>
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-[#D8B87E]/35 bg-[#D8B87E]/14 text-[#D8B87E] shadow-[0_20px_60px_rgba(216,184,126,0.18)]">
              <LockKeyhole size={24} />
            </div>
            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.28em] text-[#D8B87E]">Acces admin</p>
            <h2 className="mt-3 text-3xl font-black tracking-normal">{titles[type]}</h2>
            <p className="mt-3 text-sm leading-6 text-[#F8EAD7]/62">{subtitles[type]}</p>
          </div>

          {errors.submit && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex gap-3 rounded-2xl border border-[#8E2F3C]/35 bg-[#7A2633]/20 p-4 text-sm font-semibold text-[#F8D9D9]">
              <AlertCircle className="mt-0.5 shrink-0 text-[#F0B8B8]" size={18} />
              <span>{errors.submit}</span>
            </motion.div>
          )}

          <div className="mt-7 grid gap-4">
            {type === "register" && (
              <PremiumField label="Nom complet" value={form.name} onChange={(event) => update("name", event.target.value)} error={errors.name} autoComplete="name" />
            )}
            <PremiumField label={type === "forgot" ? "Email de recuperation" : "Email admin"} type="email" value={form.email} onChange={(event) => update("email", event.target.value)} error={errors.email} icon={Mail} autoComplete="email" />
            {type !== "forgot" && (
              <PasswordField value={form.password} onChange={(event) => update("password", event.target.value)} error={errors.password} show={showPassword} onToggle={() => setShowPassword((current) => !current)} />
            )}
          </div>

          <Button className="mt-6 w-full !rounded-2xl" disabled={isSubmitting}>
            {isSubmitting ? "Verification..." : titles[type]}
            <ArrowRight size={17} />
          </Button>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-bold text-white/58">
            {type === "login" ? (
              <Link to="/forgot-password" className="transition hover:text-[#D6B56D]">Mot de passe oublie ?</Link>
            ) : (
              <Link to="/login" className="transition hover:text-[#D6B56D]">Retour connexion</Link>
            )}
          </div>
        </motion.form>
      </section>
    </main>
  );
};

const PremiumField = ({ label, error, icon: Icon, className = "", ...props }) => (
  <motion.label whileFocus={{ scale: 1.01 }} className="block">
    <span className="mb-2 block text-sm font-bold text-[#FFF5E7]/82">{label}</span>
    <span className="relative block">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D8B87E]" size={18} />}
      <input
        className={`w-full rounded-[20px] border border-[#D8B87E]/22 bg-[#FFF5E7]/[0.055] px-4 py-3 text-sm font-semibold text-[#FFF9EF] outline-none transition placeholder:text-[#F8EAD7]/30 focus:border-[#D8B87E] focus:bg-[#FFF5E7]/10 focus:ring-4 focus:ring-[#D8B87E]/14 ${Icon ? "pl-12" : ""} ${className}`}
        {...props}
      />
    </span>
    {error && <span className="mt-2 block text-xs font-bold text-[#F0B8B8]">{error}</span>}
  </motion.label>
);

const PasswordField = ({ value, onChange, error, show, onToggle }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-bold text-[#FFF5E7]/82">Mot de passe</span>
    <span className="relative block">
      <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D8B87E]" size={18} />
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        autoComplete="current-password"
        className="w-full rounded-[20px] border border-[#D8B87E]/22 bg-[#FFF5E7]/[0.055] py-3 pl-12 pr-12 text-sm font-semibold text-[#FFF9EF] outline-none transition placeholder:text-[#F8EAD7]/30 focus:border-[#D8B87E] focus:bg-[#FFF5E7]/10 focus:ring-4 focus:ring-[#D8B87E]/14"
      />
      <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#F8EAD7]/56 transition hover:bg-[#FFF5E7]/10 hover:text-[#FFF9EF]" aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </span>
    {error && <span className="mt-2 block text-xs font-bold text-[#F0B8B8]">{error}</span>}
  </label>
);
