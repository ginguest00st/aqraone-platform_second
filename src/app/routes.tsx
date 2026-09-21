import { createBrowserRouter } from "react-router";
import ProtectedRoute from "./guards/ProtectedRoute";

// Customer & Public Pages
import LoginPage from "../pages/customer/LoginPage";
import RegisterPage from "../pages/customer/RegisterPage";
import HomePage from "../pages/customer/HomePage";
import ProductSearchPage from "../pages/customer/ProductSearchPage";
import ProductDetailPage from "../pages/customer/ProductDetailPage";
import CartPage from "../pages/customer/CartPage";
import CheckoutPage from "../pages/customer/CheckoutPage";
import PaymentPage from "../pages/customer/PaymentPage";
import PaymentStatusPage from "../pages/customer/PaymentStatusPage";
import FinnetCallbackPage from "../pages/customer/FinnetCallbackPage";
import OrderHistoryPage from "../pages/customer/OrderHistoryPage";
import OrderDetailPage from "../pages/customer/OrderDetailPage";
import UMKMStorePage from "../pages/customer/UMKMStorePage";
import CustomerProfilePage from "../pages/customer/CustomerProfilePage";

// UMKM Pages
import UMKMRegisterPage from "../pages/umkm/UMKMRegisterPage";
import UMKMDashboardPage from "../pages/umkm/UMKMDashboardPage";
import UMKMStoreProfil from "../pages/umkm/UMKMStoreProfil";
import UMKMProductsPage from "../pages/umkm/UMKMProductsPage";
import UMKMAddProductPage from "../pages/umkm/UMKMAddProductPage";
import UMKMTransactionsPage from "../pages/umkm/UMKMTransactionsPage";
import UMKMOrderDetailPage from "../pages/umkm/UMKMOrderDetailPage";
import UMKMHistoryPage from "../pages/umkm/UMKMHistoryPage";
import UMKMReportPage from "../pages/umkm/UMKMReportPage";

// Admin Pages
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminManagePage from "../pages/admin/AdminManagePage";
import AdminUMKMPage from "../pages/admin/AdminUMKMPage";
import AdminVerifyUMKMPage from "../pages/admin/AdminVerifyUMKMPage";
import AdminCategoryPage from "../pages/admin/AdminCategoryPage";
import AdminProductMonitorPage from "../pages/admin/AdminProductMonitorPage";
import AdminTransactionPage from "../pages/admin/AdminTransactionPage";
import AdminReportPage from "../pages/admin/AdminReportPage";

// Shared Pages
import DesignSystemPage from "../pages/shared/DesignSystemPage";
import NotFoundPage from "../pages/shared/NotFoundPage";
import UnauthorizedPage from "../pages/shared/UnauthorizedPage";

// Guard Layout Wrappers
const AdminGuardLayout = () => <ProtectedRoute allowedRoles={["ADMIN"]} />;
const UMKMGuardLayout = () => <ProtectedRoute allowedRoles={["UMKM"]} />;
const AuthenticatedGuardLayout = () => <ProtectedRoute allowedRoles={["CUSTOMER", "UMKM", "ADMIN"]} />;

export const router = createBrowserRouter([
  // ==========================================
  // 1. RUTE PUBLIK (Dapat diakses siapapun)
  // ==========================================
  { path: "/", Component: HomePage },
  { path: "/home", Component: HomePage },
  { path: "/login", Component: LoginPage },
  { path: "/register", Component: RegisterPage },
  { path: "/register/umkm", Component: UMKMRegisterPage },
  { path: "/umkm/register", Component: UMKMRegisterPage },
  { path: "/products", Component: ProductSearchPage },
  { path: "/products/:id", Component: ProductDetailPage },
  { path: "/store/:id", Component: UMKMStorePage },
  { path: "/cart", Component: CartPage },
  { path: "/design-system", Component: DesignSystemPage },
  { path: "/unauthorized", Component: UnauthorizedPage },

  // ==========================================
  // 2. RUTE ADMIN (Hanya Role ADMIN)
  // ==========================================
  {
    Component: AdminGuardLayout,
    children: [
      { path: "/admin", Component: AdminDashboardPage },
      { path: "/admin/admins", Component: AdminManagePage },
      { path: "/admin/umkm", Component: AdminUMKMPage },
      { path: "/admin/umkm/verify", Component: AdminVerifyUMKMPage },
      { path: "/admin/categories", Component: AdminCategoryPage },
      { path: "/admin/products", Component: AdminProductMonitorPage },
      { path: "/admin/transactions", Component: AdminTransactionPage },
      { path: "/admin/reports", Component: AdminReportPage },
    ],
  },

  // ==========================================
  // 3. RUTE UMKM (Hanya Role UMKM)
  // ==========================================
  {
    Component: UMKMGuardLayout,
    children: [
      { path: "/umkm/dashboard", Component: UMKMDashboardPage },
      { path: "/umkm/store", Component: UMKMStoreProfil },
      { path: "/umkm/products", Component: UMKMProductsPage },
      { path: "/umkm/products/add", Component: UMKMAddProductPage },
      { path: "/umkm/transactions", Component: UMKMTransactionsPage },
      { path: "/umkm/transactions/:id", Component: UMKMOrderDetailPage },
      { path: "/umkm/history", Component: UMKMHistoryPage },
      { path: "/umkm/report", Component: UMKMReportPage },
    ],
  },

  // ==========================================
  // 4. RUTE PRIVAT CUSTOMER / USER TERAUTENTIKASI
  // ==========================================
  {
    Component: AuthenticatedGuardLayout,
    children: [
      { path: "/profile", Component: CustomerProfilePage },
      { path: "/checkout", Component: CheckoutPage },
      { path: "/payment", Component: PaymentPage },
      { path: "/payment/status", Component: PaymentStatusPage },
      { path: "/payment/callback", Component: FinnetCallbackPage },
      { path: "/orders", Component: OrderHistoryPage },
      { path: "/orders/:id", Component: OrderDetailPage },
    ],
  },

  // ==========================================
  // 5. CATCH-ALL (404 Not Found)
  // ==========================================
  { path: "*", Component: NotFoundPage },
]);
