// src/components/AdminDashboard.jsx

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Swal from "sweetalert2";
import ManageBarbers from "./ManageBarbers";
import ManageSchedules from "./ManageSchedules";
import AnalyticsDashboard from "./AnalyticsDashboard";
import { LogOut, RefreshCw } from "lucide-react";

// Komponen untuk menampilkan daftar booking
const BookingList = ({ bookings, loading, onStatusChange }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead className="border-b border-dark-card">
        <tr>
          <th className="p-4 font-semibold">Pelanggan</th>
          <th className="p-4 font-semibold">Kapster</th>
          <th className="p-4 font-semibold">Jadwal Booking</th>
          <th className="p-4 font-semibold">Status</th>
          <th className="p-4 font-semibold text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan="5" className="text-center p-8">
              Memuat data...
            </td>
          </tr>
        ) : bookings.length === 0 ? (
          <tr>
            <td colSpan="5" className="text-center p-8">
              Belum ada data booking.
            </td>
          </tr>
        ) : (
          bookings.map((booking) => (
            <tr
              key={booking.id}
              className="border-b border-dark-card last:border-0 hover:bg-dark-card/50 transition-colors"
            >
              <td className="p-4">
                <div className="font-bold">{booking.customer_name}</div>
                <div className="text-sm text-gray-400">
                  {booking.customer_phone}
                </div>
              </td>
              <td className="p-4 font-semibold">
                {booking.barbers ? booking.barbers.name : "N/A"}
              </td>
              <td className="p-4 font-semibold">
                {format(
                  new Date(booking.booking_time),
                  "EEEE, d MMM yyyy - HH:mm",
                  { locale: id }
                )}
              </td>
              <td className="p-4">
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    booking.status === "selesai"
                      ? "bg-green-500/20 text-green-400"
                      : booking.status === "dibatalkan"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {booking.status}
                </span>
              </td>
              <td className="p-4 text-center">
                <select
                  value={booking.status}
                  onChange={(e) => onStatusChange(booking.id, e.target.value)}
                  className="bg-dark-bg border border-gray-600 rounded-lg p-2 font-semibold outline-none focus:ring-2 focus:ring-brand-blue"
                >
                  <option value="dipesan">Dipesan</option>
                  <option value="selesai">Selesai</option>
                  <option value="dibatalkan">Dibatalkan</option>
                </select>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

// Komponen utama Dasbor Admin
const AdminDashboard = ({ session }) => {
  const [activeTab, setActiveTab] = useState("analytics"); // <-- HANYA SATU DEKLARASI
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*, barbers ( name )")
      .order("booking_time", { ascending: false });

    if (error) {
      console.error("Error fetching bookings:", error);
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab === "bookings") {
      fetchBookings();
    }
  }, [activeTab, fetchBookings]);

  const handleStatusChange = async (bookingId, newStatus) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", bookingId);

    if (error) {
      Swal.fire("Error", "Gagal memperbarui status.", "error");
    } else {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Status diperbarui!",
        showConfirmButton: false,
        timer: 2000,
      });
      fetchBookings();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const tabs = [
    { id: "analytics", label: "Analitik" },
    { id: "bookings", label: "Manajemen Booking" },
    { id: "barbers", label: "Manajemen Kapster" },
    { id: "schedules", label: "Manajemen Jadwal" },
  ];

  return (
    <div className="min-h-screen bg-dark-bg p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Dasbor Admin</h1>
            <p className="text-gray-400">Email: {session.user.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchBookings}
              className="text-gray-400 hover:text-brand-blue transition-colors"
              title="Segarkan Data"
            >
              <RefreshCw
                className={
                  loading && activeTab === "bookings" ? "animate-spin" : ""
                }
              />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-dark-card hover:bg-red-500/20 text-red-400 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </header>

        <div className="mb-6 border-b border-dark-card">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-4 font-semibold transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-brand-blue text-brand-blue"
                  : "text-gray-400 hover:text-light-text"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div>
          {activeTab === "analytics" && <AnalyticsDashboard />}
          {activeTab === "bookings" && (
            <div className="bg-dark-card/50 p-1 rounded-2xl shadow-lg border border-dark-card">
              <BookingList
                bookings={bookings}
                loading={loading}
                onStatusChange={handleStatusChange}
              />
            </div>
          )}
          {activeTab === "barbers" && <ManageBarbers />}
          {activeTab === "schedules" && <ManageSchedules />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
