// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { Loader2, ShieldAlert } from "lucide-react";

// Halaman sederhana untuk ditampilkan jika bukan admin
const NotAuthorized = () => (
  <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center text-center p-4">
    <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
    <h1 className="font-display text-4xl font-bold">Akses Ditolak</h1>
    <p className="text-gray-400 mt-2">
      Anda tidak memiliki izin untuk mengakses halaman ini.
    </p>
    <a
      href="/"
      className="mt-6 bg-brand-blue text-dark-bg font-bold py-2 px-6 rounded-lg"
    >
      Kembali ke Halaman Utama
    </a>
  </div>
);

const ProtectedRoute = ({ session, profile, authLoading, children }) => {
  // 1. Tampilkan loading jika sesi/profil sedang diperiksa
  if (authLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-brand-blue animate-spin" />
      </div>
    );
  }

  // 2. Jika tidak ada sesi, redirect ke login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // 3. Jika ada sesi TAPI perannya bukan 'admin', tampilkan halaman "Akses Ditolak"
  if (session && profile?.role !== "admin") {
    return <NotAuthorized />;
  }

  // 4. Jika semua pemeriksaan lolos (ada sesi dan peran adalah 'admin'), tampilkan halaman dasbor
  return children;
};

export default ProtectedRoute;
