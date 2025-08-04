import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "./supabaseClient";
import BookingPage from "./components/BookingPage";
import LoginPage from "./components/LoginPage";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // <-- TAMBAHKAN INI

  useEffect(() => {
    setAuthLoading(true);
    // Cek sesi yang sedang berjalan saat aplikasi dimuat
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false); // <-- TAMBAHKAN INI
    });

    // Dengarkan perubahan status otentikasi (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // Tidak perlu set loading di sini karena getSession sudah cukup
    });

    // Berhenti mendengarkan saat komponen di-unmount
    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute session={session} authLoading={authLoading}>
              {" "}
              {/* <-- Kirim state loading */}
              <AdminDashboard session={session} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
