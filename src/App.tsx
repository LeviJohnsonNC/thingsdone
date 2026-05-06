import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useScheduledActivation } from "@/hooks/useScheduledActivation";
import { AppLayout } from "@/components/layout/AppLayout";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import ReviewView from "@/pages/ReviewView";
import ReviewHistoryView from "@/pages/ReviewHistoryView";
import Auth from "@/pages/Auth";
import InboxView from "@/pages/InboxView";
import FocusView from "@/pages/FocusView";
import NextView from "@/pages/NextView";
import ScheduledView from "@/pages/ScheduledView";
import WaitingView from "@/pages/WaitingView";
import SomedayView from "@/pages/SomedayView";
import ProjectsView from "@/pages/ProjectsView";
import ProjectDetailView from "@/pages/ProjectDetailView";
import LogbookView from "@/pages/LogbookView";
import ReferenceView from "@/pages/ReferenceView";
import SettingsView from "@/pages/SettingsView";
import HelpView from "@/pages/HelpView";
import StatsView from "@/pages/StatsView";
import NotFound from "@/pages/NotFound";

const HomePage = lazy(() => import("@/pages/HomePage"));
const FeaturesPage = lazy(() => import("@/pages/FeaturesPage"));
const PricingPage = lazy(() => import("@/pages/PricingPage"));
const BlogPage = lazy(() => import("@/pages/BlogPage"));
const BlogArticlePage = lazy(() => import("@/pages/BlogArticlePage"));
const LegalPage = lazy(() => import("@/pages/LegalPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));

const queryClient = new QueryClient();

function ProtectedRoutes() {
  const { user, loading } = useAuth();
  useScheduledActivation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <ErrorBoundary>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/inbox" replace />} />
          <Route path="/inbox" element={<InboxView />} />
          <Route path="/focus" element={<FocusView />} />
          <Route path="/next" element={<NextView />} />
          <Route path="/scheduled" element={<ScheduledView />} />
          <Route path="/waiting" element={<WaitingView />} />
          <Route path="/someday" element={<SomedayView />} />
          <Route path="/projects" element={<ProjectsView />} />
          <Route path="/projects/:id" element={<ProjectDetailView />} />
          <Route path="/logbook" element={<LogbookView />} />
          <Route path="/reference" element={<ReferenceView />} />
          <Route path="/help" element={<HelpView />} />
          <Route path="/stats" element={<StatsView />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="/review" element={<ReviewView />} />
          <Route path="/review/history" element={<ReviewHistoryView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>
    </ErrorBoundary>
  );
}

/** Redirect authenticated users away from marketing pages */
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  // Render marketing content immediately; redirect signed-in users once auth resolves.
  if (!loading && user) return <Navigate to="/inbox" replace />;
  return <>{children}</>;
}

function AuthPage() {
  const { user, loading } = useAuth();
  if (!loading && user) return <Navigate to="/inbox" replace />;
  return <Auth />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-background">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          }>
            <Routes>
              {/* Public marketing routes */}
              <Route path="/" element={<PublicRoute><MarketingLayout><HomePage /></MarketingLayout></PublicRoute>} />
              <Route path="/features" element={<PublicRoute><MarketingLayout><FeaturesPage /></MarketingLayout></PublicRoute>} />
              <Route path="/pricing" element={<PublicRoute><MarketingLayout><PricingPage /></MarketingLayout></PublicRoute>} />
              <Route path="/blog" element={<PublicRoute><MarketingLayout><BlogPage /></MarketingLayout></PublicRoute>} />
              <Route path="/blog/:slug" element={<PublicRoute><MarketingLayout><BlogArticlePage /></MarketingLayout></PublicRoute>} />
              <Route path="/legal" element={<MarketingLayout><LegalPage /></MarketingLayout>} />
              <Route path="/about" element={<PublicRoute><MarketingLayout><AboutPage /></MarketingLayout></PublicRoute>} />
              <Route path="/auth" element={<AuthPage />} />
              {/* Protected app routes */}
              <Route path="/*" element={<ProtectedRoutes />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
