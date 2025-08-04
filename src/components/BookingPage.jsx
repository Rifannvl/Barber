// src/components/BookingPage.jsx
import React, { useState } from "react";
import BookingCalendar from "./BookingCalendar";
import BarberSelector from "./BarberSelector"; // Impor komponen baru
import { Scissors } from "lucide-react";

const BookingPage = () => {
  const [selectedBarber, setSelectedBarber] = useState(null);

  return (
    <div className="min-h-screen p-4 sm:p-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-4xl mx-auto animate-[fadeIn_1s_ease-in-out]">
        <header className="text-center mb-10">
          <Scissors className="mx-auto h-16 w-16 text-brand-blue mb-4 transform -rotate-45" />
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-light-text">
            Klimis Jaya Barbershop
          </h1>
          <p className="mt-3 text-lg text-gray-400">
            Booking online dalam 3 langkah mudah.
          </p>
        </header>

        <main className="bg-dark-card/50 p-6 sm:p-8 rounded-2xl shadow-2xl shadow-brand-blue/10 border border-dark-card">
          <BarberSelector onBarberSelect={setSelectedBarber} />

          {/* Kalender hanya akan muncul setelah kapster dipilih */}
          {selectedBarber && (
            <BookingCalendar
              key={selectedBarber.id}
              selectedBarber={selectedBarber}
            />
          )}
        </main>

        <footer className="text-center mt-10 text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Klimis Jaya. Dibuat untuk
            Portofolio.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default BookingPage;
