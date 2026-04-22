import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import { Spinner } from './components/common/UI';

import HomePage from './pages/HomePage';
import RecipesPage from './pages/RecipesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import { CreateRecipePage, EditRecipePage } from './pages/RecipeFormPages';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { DashboardPage, SavedRecipesPage } from './pages/DashboardPages';
import UserProfilePage from './pages/UserProfilePage';
import NotFoundPage from './pages/NotFoundPage';

import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const PageLoader = () => (
  <div style={{
    minHeight: '60vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center'
  }}>
    <Spinner size={36} />
  </div>
);

function AppLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            },
            success: { iconTheme: { primary: 'var(--sage)', secondary: 'white' } },
            error: { iconTheme: { primary: '#dc2626', secondary: 'white' } },
          }}
        />

        <style>{`
          .recipe-card:hover {
            transform: translateY(-3px);
            box-shadow: var(--shadow-md);
          }
          .recipe-card:hover .recipe-card-img {
            transform: scale(1.04);
          }
          .category-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
            border-color: var(--rust);
          }
          .btn-hover:hover:not(:disabled) {
            filter: brightness(1.08);
            transform: translateY(-1px);
          }
          input:focus, textarea:focus, select:focus {
            border-color: var(--brown-300) !important;
            box-shadow: 0 0 0 3px rgba(196,149,90,0.15);
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>

        <Routes>
          {/* Auth pages — no layout wrapper */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Main app with navbar/footer */}
          <Route path="/*" element={
            <AppLayout>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/recipes" element={<RecipesPage />} />
                  <Route path="/recipes/:slug" element={<RecipeDetailPage />} />

                  {/* Protected routes */}
                  <Route path="/recipes/new" element={
                    <ProtectedRoute><CreateRecipePage /></ProtectedRoute>
                  } />
                  <Route path="/recipes/:id/edit" element={
                    <ProtectedRoute><EditRecipePage /></ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute><DashboardPage /></ProtectedRoute>
                  } />
                  <Route path="/saved" element={
                    <ProtectedRoute><SavedRecipesPage /></ProtectedRoute>
                  } />

                  {/* Public */}
                  <Route path="/user/:username" element={<UserProfilePage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </AppLayout>
          } />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}