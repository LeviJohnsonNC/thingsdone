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
import Auth from "@/pages/Auth";
import InboxView from "@/pages/InboxView";
import FocusView from "@/pages/FocusView";
import NextView from "@/pages/NextView";
import ScheduledView from "@/pages/ScheduledView";
import SomedayView from "@/pages/SomedayView";
import ProjectsView from "@/pages/ProjectsView";
import ProjectDetailView from "@/pages/ProjectDetailView";
import LogbookView from "@/pages/LogbookView";
import SettingsView from "@/pages/SettingsView";
import NotFound from "@/pages/NotFound";

const HomePage = lazy(() => import("@/pages/HomePage"));
const FeaturesPage = lazy(() => import("@/pages/FeaturesPage"));
const PricingPage = lazy(() => import("@/pages/PricingPage"));

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
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/inbox" replace />} />
        <Route path="/inbox" element={<InboxView />} />
        <Route path="/focus" element={<FocusView />} />
        <Route path="/next" element={<NextView />} />
        <Route path="/scheduled" element={<ScheduledView />} />
        <Route path="/someday" element={<SomedayView />} />
        <Route path="/projects" element={<ProjectsView />} />
        <Route path="/projects/:id" element={<ProjectDetailView />} />
        <Route path="/logbook" element={<LogbookView />} />
        <Route path="/settings" element={<SettingsView />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

/** Redirect authenticated users away from marketing pages */
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/inbox" replace />;
  return <>{children}</>;
}

function AuthPage() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/inbox" replace />;
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
