import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import { PublicLayout } from "../components/layout/PublicLayout";
import { RequireAccess } from "../components/layout/RequireAccess";
import { AboutPage } from "../pages/public/AboutPage";
import { BrandsPage } from "../pages/public/BrandsPage";
import { CartPage } from "../pages/public/CartPage";
import { CollectionsPage } from "../pages/public/CollectionsPage";
import { ContactPage } from "../pages/public/ContactPage";
import { FaqPage } from "../pages/public/FaqPage";
import { FavoritesPage } from "../pages/public/FavoritesPage";
import { HomePage } from "../pages/public/HomePage";
import { NotFoundPage } from "../pages/public/NotFoundPage";
import { OrderSuccessPage } from "../pages/public/OrderSuccessPage";
import { ProductDetailPage } from "../pages/public/ProductDetailPage";
import { ShopPage } from "../pages/public/ShopPage";
import { TrackOrderPage } from "../pages/public/TrackOrderPage";

// L'espace admin et la connexion sont chargés à la demande : la boutique reste légère.
const AdminLayout = lazy(() => import("../components/layout/AdminLayout").then((module) => ({ default: module.AdminLayout })));
const AdminDashboardPage = lazy(() => import("../pages/admin/AdminDashboardPage").then((module) => ({ default: module.AdminDashboardPage })));
const AdminModulePage = lazy(() => import("../pages/admin/AdminModulePage").then((module) => ({ default: module.AdminModulePage })));
const ProductFormPage = lazy(() => import("../pages/admin/ProductFormPage").then((module) => ({ default: module.ProductFormPage })));
const AuthPage = lazy(() => import("../pages/auth/AuthPages").then((module) => ({ default: module.AuthPage })));
// La validation de formulaire (react-hook-form + zod) n'est utile qu'au moment de commander.
const CheckoutPage = lazy(() => import("../pages/public/CheckoutPage").then((module) => ({ default: module.CheckoutPage })));

const Loading = () => (
  <div className="grid min-h-[60vh] place-items-center text-sm font-semibold text-brand-muted" role="status">
    <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-gold border-t-transparent" aria-hidden="true" />
    <span className="sr-only">Chargement…</span>
  </div>
);

const admin = (module, element) => <RequireAccess module={module}>{element}</RequireAccess>;

export const AppRoutes = () => (
  <Suspense fallback={<Loading />}>
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:id" element={<ProductDetailPage />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/brands" element={<BrandsPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/track-order" element={<TrackOrderPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/access-denied" element={<NotFoundPage type="denied" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="/login" element={<AuthPage type="login" />} />
      <Route path="/register" element={<AuthPage type="register" />} />
      <Route path="/forgot-password" element={<AuthPage type="forgot" />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={admin("dashboard", <AdminDashboardPage />)} />
          <Route path="products" element={admin("products", <AdminModulePage type="products" />)} />
          <Route path="products/new" element={admin("products", <ProductFormPage />)} />
          <Route path="products/:id" element={admin("products", <ProductFormPage />)} />
          <Route path="categories" element={admin("products", <AdminModulePage type="categories" />)} />
          <Route path="brands" element={admin("products", <AdminModulePage type="brands" />)} />
          <Route path="orders" element={admin("orders", <AdminModulePage type="orders" />)} />
          <Route path="customers" element={admin("customers", <AdminModulePage type="customers" />)} />
          <Route path="users" element={admin("users", <AdminModulePage type="users" />)} />
          <Route path="stocks" element={admin("stocks", <AdminModulePage type="stocks" />)} />
          <Route path="promotions" element={admin("promotions", <AdminModulePage type="promotions" />)} />
          <Route path="payments" element={admin("billing", <AdminModulePage type="payments" />)} />
          <Route path="reports" element={admin("reports", <AdminModulePage type="reports" />)} />
          <Route path="parfumeries" element={admin("tenants", <AdminModulePage type="parfumeries" />)} />
          <Route path="settings" element={admin("settings", <AdminModulePage type="settings" />)} />
        </Route>
      </Route>

      <Route path="/catalogue" element={<Navigate to="/shop" replace />} />
      <Route path="/panier" element={<Navigate to="/cart" replace />} />
      <Route path="/commande" element={<Navigate to="/checkout" replace />} />
    </Routes>
  </Suspense>
);
