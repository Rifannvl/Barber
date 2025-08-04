import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hdimzsynjradnnlboxol.supabase.co"; // Ganti dengan URL Supabase Anda
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkaW16c3luanJhZG5ubGJveG9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyOTIxNDEsImV4cCI6MjA2OTg2ODE0MX0.mA6b7RHgghXw8eCJwXwSTTmI96IljF5w5OuGCxVUgTo"; // Ganti dengan Anon Key Anda

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
