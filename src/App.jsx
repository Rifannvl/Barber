// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "./supabaseClient";
import BookingPage from "./components/BookingPage";
import LoginPage from "./components/LoginPage";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

import CustomChatbot from "./components/CustomChatbot"; // <-- Impor bot baru
import ChatIcon from "./components/ChatIcon";

function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null); // <-- State untuk profil
  const [authLoading, setAuthLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        // Jika ada sesi, ambil juga profilnya
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        setProfile(userProfile);
      }
      setAuthLoading(false);
    };

    fetchSessionAndProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // Jika logout, hapus profil
      if (!session) {
        setProfile(null);
      } else {
        fetchSessionAndProfile(); // Ambil ulang profil saat login
      }
    });

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
            <ProtectedRoute
              session={session}
              profile={profile}
              authLoading={authLoading}
            >
              <AdminDashboard session={session} />
            </ProtectedRoute>
          }
        />
      </Routes>
      <CustomChatbot
        isOpen={isChatOpen}
        toggleChat={() => setIsChatOpen(!isChatOpen)}
      />
      <ChatIcon
        isOpen={isChatOpen}
        toggleChat={() => setIsChatOpen(!isChatOpen)}
      />
    </BrowserRouter>
  );
}

export default App;
