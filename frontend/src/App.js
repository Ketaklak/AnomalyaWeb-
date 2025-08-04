import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import NewsDetail from "./pages/NewsDetail";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import ActualitesPage from "./pages/ActualitesPage";
import CompetencesPage from "./pages/CompetencesPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AnalyticsDashboard from "./pages/admin/AnalyticsDashboard";
import AdminArticles from "./pages/admin/AdminArticles";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminUsersUnified from "./pages/admin/AdminUsersUnified";
import AdminQuotes from "./pages/admin/AdminQuotes";
import AdminTickets from "./pages/admin/AdminTickets";
import AdminNotifications from "./pages/admin/AdminNotifications";
import ClientDashboard from "./pages/client/ClientDashboard";
import RequestQuote from "./pages/client/RequestQuote";
import ClientProfile from "./pages/client/ClientProfile";
import MyQuotes from "./pages/client/MyQuotes";
import CreateTicket from "./pages/client/CreateTicket";
import MyTickets from "./pages/client/MyTickets";
import TicketDetail from "./pages/client/TicketDetail";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Unauthorized from "./pages/Unauthorized";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/actualites" element={<ActualitesPage />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/competences" element={<CompetencesPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/analytics" element={
              <ProtectedRoute requireAdmin={true}>
                <AnalyticsDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/articles" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminArticles />
              </ProtectedRoute>
            } />
            <Route path="/admin/contacts" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminContacts />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminUsersUnified />
              </ProtectedRoute>
            } />
            <Route path="/admin/clients" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminUsersUnified />
              </ProtectedRoute>
            } />
            <Route path="/admin/quotes" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminQuotes />
              </ProtectedRoute>
            } />
            <Route path="/admin/tickets" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminTickets />
              </ProtectedRoute>
            } />
            <Route path="/admin/notifications" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminNotifications />
              </ProtectedRoute>
            } />
            
            {/* Client Routes */}
            <Route path="/client/dashboard" element={
              <ProtectedRoute requiredRole="client">
                <ClientDashboard />
              </ProtectedRoute>
            } />
            <Route path="/client/quotes/new" element={
              <ProtectedRoute requiredRole="client">
                <RequestQuote />
              </ProtectedRoute>
            } />
            <Route path="/client/quotes" element={
              <ProtectedRoute requiredRole="client">
                <MyQuotes />
              </ProtectedRoute>
            } />
            <Route path="/client/tickets/new" element={
              <ProtectedRoute requiredRole="client">
                <CreateTicket />
              </ProtectedRoute>
            } />
            <Route path="/client/tickets" element={
              <ProtectedRoute requiredRole="client">
                <MyTickets />
              </ProtectedRoute>
            } />
            <Route path="/client/tickets/:ticketId" element={
              <ProtectedRoute requiredRole="client">
                <TicketDetail />
              </ProtectedRoute>
            } />
            <Route path="/client/profile" element={
              <ProtectedRoute requiredRole="client">
                <ClientProfile />
              </ProtectedRoute>
            } />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;