// src/components/BookingForm.jsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import Swal from "sweetalert2";
import { X } from "lucide-react";
import { format } from "date-fns";

const BookingForm = ({
  selectedDate,
  selectedSlot,
  selectedBarber,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(""); // <-- State baru untuk email
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
      customer_email: email, // <-- Mengirim data email ke Supabase
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
        background: "#1A1A1A",
        color: "#F0F0F0",
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Booking Berhasil!",
        text: `Konfirmasi akan segera dikirim ke email Anda di ${email}.`,
        background: "#1A1A1A",
        color: "#F0F0F0",
        confirmButtonColor: "#00A9FF",
      }).then(() => {
        onSuccess();
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-dark-card w-full max-w-md p-8 rounded-2xl shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-brand-blue transition-colors"
        >
          {" "}
          <X size={24} />{" "}
        </button>
        <h2 className="font-display text-2xl font-bold text-center mb-2">
          Konfirmasi Booking
        </h2>
        <p className="text-center text-gray-400">
          dengan{" "}
          <span className="font-bold text-light-text">
            {selectedBarber.name}
          </span>
        </p>
        <p className="text-center text-brand-blue mb-6 font-semibold">
          {" "}
          {format(selectedDate, "d MMMM yyyy")} - Pukul {selectedSlot}{" "}
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block mb-2 font-semibold text-gray-300"
            >
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-3 bg-dark-bg rounded-lg border transition ${
                errors.name ? "border-red-500" : "border-dark-card"
              } focus:ring-2 focus:ring-brand-blue outline-none`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 font-semibold text-gray-300"
            >
              Alamat Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 bg-dark-bg rounded-lg border transition ${
                errors.email ? "border-red-500" : "border-dark-card"
              } focus:ring-2 focus:ring-brand-blue outline-none`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="phone"
              className="block mb-2 font-semibold text-gray-300"
            >
              Nomor WhatsApp
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full p-3 bg-dark-bg rounded-lg border transition ${
                errors.phone ? "border-red-500" : "border-dark-card"
              } focus:ring-2 focus:ring-brand-blue outline-none`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full p-4 bg-brand-blue text-dark-bg font-bold rounded-lg hover:opacity-90 transition-opacity disabled:bg-gray-500"
          >
            {isSubmitting ? "Memproses..." : "Booking Sekarang"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
