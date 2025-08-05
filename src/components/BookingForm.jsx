// src/components/BookingForm.jsx

import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import Swal from "sweetalert2";
import { X } from "lucide-react";
import { format } from "date-fns";
import { useTheme } from "../context/ThemeContext"; // Impor useTheme

const BookingForm = ({
  selectedDate,
  selectedSlot,
  selectedBarber,
  onClose,
  onSuccess,
}) => {
  const { theme } = useTheme(); // Dapatkan tema saat ini untuk SweetAlert
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Nama tidak boleh kosong.";
    if (!phone.trim()) {
      newErrors.phone = "Nomor WhatsApp tidak boleh kosong.";
    } else if (!/^[0-9]+$/.test(phone)) {
      newErrors.phone = "Nomor WhatsApp hanya boleh berisi angka.";
    } else if (phone.length < 10 || phone.length > 13) {
      newErrors.phone = "Nomor WhatsApp harus antara 10 hingga 13 digit.";
    }

    if (!email.trim()) {
      newErrors.email = "Email tidak boleh kosong.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Format email tidak valid.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const bookingTime = new Date(
      `${format(selectedDate, "yyyy-MM-dd")}T${selectedSlot}:00`
    );

    const { error } = await supabase.from("bookings").insert({
      customer_name: name,
      customer_phone: phone,
      customer_email: email,
      booking_time: bookingTime.toISOString(),
      status: "dipesan",
      barber_id: selectedBarber.id,
      price: 50000,
    });

    setIsSubmitting(false);

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal melakukan booking. Silakan coba lagi.",
        background: theme === "dark" ? "#1F2937" : "#FFFFFF",
        color: theme === "dark" ? "#F3F4F6" : "#111827",
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Booking Berhasil!",
        text: `Konfirmasi akan segera dikirim ke email Anda di ${email}.`,
        background: theme === "dark" ? "#1F2937" : "#FFFFFF",
        color: theme === "dark" ? "#F3F4F6" : "#111827",
        confirmButtonColor: "#B9945A",
      }).then(() => {
        onSuccess();
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-light-card dark:bg-dark-card w-full max-w-md p-8 rounded-2xl shadow-2xl relative border border-gray-200 dark:border-dark-card animate-[scaleUp_0.4s_ease-out_forwards]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-brand-gold transition-colors"
        >
          <X size={24} />
        </button>
        <h2 className="font-display text-2xl font-bold text-center mb-2">
          Konfirmasi Booking
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400">
          dengan{" "}
          <span className="font-bold text-dark-text dark:text-light-text">
            {selectedBarber.name}
          </span>
        </p>
        <p className="text-center text-yellow-600 dark:text-brand-gold mb-6 font-semibold">
          {format(selectedDate, "d MMMM yyyy")} - Pukul {selectedSlot}
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block mb-2 font-semibold text-gray-700 dark:text-gray-300"
            >
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-3 bg-light-bg dark:bg-dark-bg rounded-lg border transition ${
                errors.name
                  ? "border-red-500"
                  : "border-gray-300 dark:border-dark-card"
              } focus:ring-2 focus:ring-brand-gold outline-none`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 font-semibold text-gray-700 dark:text-gray-300"
            >
              Alamat Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 bg-light-bg dark:bg-dark-bg rounded-lg border transition ${
                errors.email ? "border-red-500" : "border-dark-card"
              } focus:ring-2 focus:ring-brand-gold outline-none`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="phone"
              className="block mb-2 font-semibold text-gray-700 dark:text-gray-300"
            >
              Nomor WhatsApp
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full p-3 bg-light-bg dark:bg-dark-bg rounded-lg border transition ${
                errors.phone ? "border-red-500" : "border-dark-card"
              } focus:ring-2 focus:ring-brand-gold outline-none`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full p-4 bg-brand-gold text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:bg-gray-400 dark:disabled:bg-gray-600"
          >
            {isSubmitting ? "Memproses..." : "Booking Sekarang"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
