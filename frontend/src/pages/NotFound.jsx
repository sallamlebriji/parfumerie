import { Link } from "react-router-dom";

const NotFound = () => (
  <main className="container-page py-32 text-center">
    <h1 className="text-5xl font-black">404</h1>
    <p className="mt-4 text-ink/60">Page introuvable.</p>
    <Link to="/" className="btn-gold mt-8">Retour accueil</Link>
  </main>
);

export default NotFound;
