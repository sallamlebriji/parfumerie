import { AnimatePresence, motion } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AdminLayout } from "../components/layout/AdminLayout";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import { PublicLayout } from "../components/layout/PublicLayout";
import { RequireAccess } from "../components/layout/RequireAccess";
import { AuthPage } from "../pages/auth/AuthPages";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { AdminModulePage } from "../pages/admin/AdminModulePage";
import { ProductFormPage } from "../pages/admin/ProductFormPage";
import { CartPage } from "../pages/public/CartPage";
import { CheckoutPage } from "../pages/public/CheckoutPage";
import { HomePage } from "../pages/public/HomePage";
import { ProductDetailPage } from "../pages/public/ProductDetailPage";
import { ShopPage } from "../pages/public/ShopPage";
import { SimplePublicPage } from "../pages/public/SimplePublicPage";
import { TrackOrderPage } from "../pages/public/TrackOrderPage";

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

export const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
      <Route path="/shop" element={<PageTransition><ShopPage /></PageTransition>} />
      <Route path="/shop/:id" element={<PageTransition><ProductDetailPage /></PageTransition>} />
      <Route path="/collections" element={<PageTransition><SimplePublicPage type="collections" eyebrow="Collections" title="Collections parfumees" text="Homme, Femme, Mixte, Luxe, Oud, Musc et coffrets." /></PageTransition>} />
      <Route path="/brands" element={<PageTransition><SimplePublicPage type="brands" eyebrow="Marques" title="Marques premium" text="Une selection de maisons de fragrance modernes et commerciales." /></PageTransition>} />
      <Route path="/cart" element={<PageTransition><CartPage /></PageTransition>} />
      <Route path="/checkout" element={<PageTransition><CheckoutPage /></PageTransition>} />
      <Route path="/order-success" element={<PageTransition><SimplePublicPage type="success" eyebrow="Succes" title="Commande preparee" text="Votre message WhatsApp est pret pour confirmation." /></PageTransition>} />
      <Route path="/track-order" element={<PageTransition><TrackOrderPage /></PageTransition>} />
      <Route path="/about" element={<PageTransition><SimplePublicPage type="about" eyebrow="A propos" title="Maison de fragrance locale" text="Une boutique digitale premium pour une parfumerie moderne." /></PageTransition>} />
      <Route path="/contact" element={<PageTransition><SimplePublicPage type="contact" eyebrow="Contact" title="Nous contacter" text="WhatsApp, telephone, adresse, horaires et conseil parfum." /></PageTransition>} />
      <Route path="/faq" element={<PageTransition><SimplePublicPage type="faq" eyebrow="FAQ" title="Questions frequentes" text="Commande, livraison, paiement et suivi." /></PageTransition>} />
      <Route path="/access-denied" element={<PageTransition><SimplePublicPage eyebrow="403" title="Acces refuse" text="Votre role ou votre abonnement ne permet pas d'ouvrir cette ressource." /></PageTransition>} />
    </Route>

    <Route path="/login" element={<PageTransition><AuthPage type="login" /></PageTransition>} />
    <Route path="/register" element={<PageTransition><AuthPage type="register" /></PageTransition>} />
    <Route path="/forgot-password" element={<PageTransition><AuthPage type="forgot" /></PageTransition>} />

    <Route element={<ProtectedRoute />}>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<RequireAccess module="dashboard"><PageTransition><AdminDashboardPage /></PageTransition></RequireAccess>} />
        <Route path="products" element={<RequireAccess module="products"><PageTransition><AdminModulePage type="products" /></PageTransition></RequireAccess>} />
        <Route path="products/new" element={<RequireAccess module="products"><PageTransition><ProductFormPage /></PageTransition></RequireAccess>} />
        <Route path="products/:id" element={<RequireAccess module="products"><PageTransition><ProductFormPage /></PageTransition></RequireAccess>} />
        <Route path="categories" element={<RequireAccess module="products"><PageTransition><AdminModulePage type="categories" /></PageTransition></RequireAccess>} />
        <Route path="brands" element={<RequireAccess module="products"><PageTransition><AdminModulePage type="brands" /></PageTransition></RequireAccess>} />
        <Route path="orders" element={<RequireAccess module="orders"><PageTransition><AdminModulePage type="orders" /></PageTransition></RequireAccess>} />
        <Route path="customers" element={<RequireAccess module="customers"><PageTransition><AdminModulePage type="customers" /></PageTransition></RequireAccess>} />
        <Route path="users" element={<RequireAccess module="users"><PageTransition><AdminModulePage type="users" /></PageTransition></RequireAccess>} />
        <Route path="stocks" element={<RequireAccess module="stocks"><PageTransition><AdminModulePage type="stocks" /></PageTransition></RequireAccess>} />
        <Route path="promotions" element={<RequireAccess module="promotions"><PageTransition><AdminModulePage type="promotions" /></PageTransition></RequireAccess>} />
        <Route path="payments" element={<RequireAccess module="billing"><PageTransition><AdminModulePage type="payments" /></PageTransition></RequireAccess>} />
        <Route path="reports" element={<RequireAccess module="reports"><PageTransition><AdminModulePage type="reports" /></PageTransition></RequireAccess>} />
        <Route path="parfumeries" element={<RequireAccess module="tenants"><PageTransition><AdminModulePage type="parfumeries" /></PageTransition></RequireAccess>} />
        <Route path="settings" element={<RequireAccess module="settings"><PageTransition><AdminModulePage type="settings" /></PageTransition></RequireAccess>} />
      </Route>
    </Route>

    <Route path="/catalogue" element={<Navigate to="/shop" replace />} />
    <Route path="/panier" element={<Navigate to="/cart" replace />} />
    <Route path="/commande" element={<Navigate to="/checkout" replace />} />
    <Route path="*" element={<PageTransition><SimplePublicPage eyebrow="404" title="Page introuvable" text="Cette page n'existe pas ou a ete deplacee." /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};
