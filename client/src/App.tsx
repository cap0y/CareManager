import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/navigation";
import PWAInstaller from "@/components/PWAInstallButton";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AuthModal from "@/components/auth-modal";
import Home from "@/pages/home";
import Search from "@/pages/search";
import Bookings from "@/pages/bookings";
import Chat from "@/pages/chat";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import KakaoCallback from "@/pages/oauth/kakao/callback";
import CareManagerDetail from "@/pages/care-manager-detail";
import NoticeDetail from "@/pages/notice-detail";
import ShopPage from "@/pages/shop";
import ProductDetailPage from "@/pages/product-detail";
import CheckoutPage from "@/pages/checkout";
import PaymentHistoryPage from "@/pages/payment-history";
import MyReviewsPage from "@/pages/my-reviews";
import MyInquiriesPage from './pages/my-inquiries';
import FavoritesPage from './pages/favorites';
import NotificationsPage from './pages/notifications';
import PrivacyPage from './pages/privacy';
import SupportPage from './pages/support';
import CartPage from "./pages/cart";
import AvatarChatPage from "./pages/avatar-chat";

// 헤더와 푸터가 포함된 공통 레이아웃 컴포넌트
const Layout = ({ children, path }: { children: React.ReactNode, path: string }) => {
  // 홈 페이지의 경우 헤더와 푸터를 포함하지 않음 (이미 Home 컴포넌트에 있음)
  const isHome = path === "/";
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {!isHome && <Header />}
      <main className="flex-grow">{children}</main>
      {!isHome && <Footer />}
      <Navigation />
    </div>
  );
};

function Router() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Switch>
        <Route path="/">
          {() => <Layout path="/"><Home /></Layout>}
        </Route>
        <Route path="/search">
          {() => <Layout path="/search"><Search /></Layout>}
        </Route>
        <Route path="/shop">
          {() => <Layout path="/shop"><ShopPage /></Layout>}
        </Route>
        <Route path="/product/:productId">
          {(params) => <Layout path={`/product/${params.productId}`}><ProductDetailPage /></Layout>}
        </Route>
        <Route path="/bookings">
          {() => <Layout path="/bookings"><Bookings /></Layout>}
        </Route>
        <Route path="/chat">
          {() => <Layout path="/chat"><Chat /></Layout>}
        </Route>
        <Route path="/avatar-chat">
          {() => <Layout path="/avatar-chat"><AvatarChatPage /></Layout>}
        </Route>
        <Route path="/profile">
          {() => <Layout path="/profile"><Profile /></Layout>}
        </Route>
        <Route path="/care-manager/:id">
          {(params) => <Layout path={`/care-manager/${params.id}`}><CareManagerDetail id={params.id} /></Layout>}
        </Route>
        <Route path="/notice/:id">
          {(params) => <Layout path={`/notice/${params.id}`}><NoticeDetail id={params.id} /></Layout>}
        </Route>
        <Route path="/oauth/kakao/callback" component={KakaoCallback} />
        <Route path="/checkout">
          {() => <Layout path="/checkout"><CheckoutPage /></Layout>}
        </Route>
        <Route path="/payment-history">
          {() => <Layout path="/payment-history"><PaymentHistoryPage /></Layout>}
        </Route>
        <Route path="/my-reviews">
          {() => <Layout path="/my-reviews"><MyReviewsPage /></Layout>}
        </Route>
        <Route path="/my-inquiries">
          {() => <Layout path="/my-inquiries"><MyInquiriesPage /></Layout>}
        </Route>
        <Route path="/favorites">
          {() => <Layout path="/favorites"><FavoritesPage /></Layout>}
        </Route>
        <Route path="/notifications">
          {() => <Layout path="/notifications"><NotificationsPage /></Layout>}
        </Route>
        <Route path="/privacy">
          {() => <Layout path="/privacy"><PrivacyPage /></Layout>}
        </Route>
        <Route path="/support">
          {() => <Layout path="/support"><SupportPage /></Layout>}
        </Route>
        <Route path="/cart">
          {(params) => (
            <Layout path="/cart">
              <CartPage />
            </Layout>
          )}
        </Route>
        <Route>
          {() => <Layout path="/404"><NotFound /></Layout>}
        </Route>
      </Switch>
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Router />
          <Toaster />
          {/* 홈 화면에 설치 팝업 노출 */}
          <PWAInstaller />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
