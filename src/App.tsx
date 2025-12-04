import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './store/AuthContext';
import { AppProvider } from './store/AppContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { InspectionPage } from './pages/InspectionPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                
                {/* Protected routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout>
                      <Navigate to="/dashboard" replace />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Layout>
                      <DashboardPage />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/inspection/:id" element={
                  <ProtectedRoute>
                    <Layout>
                      <InspectionPage />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/history" element={
                  <ProtectedRoute>
                    <Layout>
                      <HistoryPage />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Layout>
                      <ProfilePage />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                {/* 404 page */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </Router>
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;