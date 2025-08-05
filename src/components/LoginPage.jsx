import React from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; // Impor useTheme

const LoginPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme(); // Dapatkan tema saat ini

  supabase.auth.onAuthStateChange(async (event) => {
    if (event === "SIGNED_IN") {
      navigate("/admin");
    }
  });

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <header className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-dark-text dark:text-light-text">
            Admin Login
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Selamat datang kembali, Bos!
          </p>
        </header>
        <div className="bg-light-card dark:bg-dark-card p-8 rounded-xl border border-gray-200 dark:border-dark-card">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme={theme} // Gunakan tema dinamis
            providers={["google"]}
            localization={{
              variables: {
                sign_in: {
                  email_label: "Alamat Email",
                  password_label: "Kata Sandi",
                  button_label: "Masuk",
                },
                sign_up: {
                  email_label: "Alamat Email",
                  password_label: "Kata Sandi",
                  button_label: "Daftar",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
