// src/components/AnalyticsDashboard.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader2, Book, Users, DollarSign } from "lucide-react";

const StatCard = ({ title, value, icon, color }) => (
  <div className={`p-6 rounded-xl ${color} flex items-center gap-6`}>
    {icon}
    <div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-sm opacity-80">{title}</p>
    </div>
  </div>
);

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    uniqueCustomers: 0,
  });
  const [dailyData, setDailyData] = useState([]);
  const [barberData, setBarberData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // 1. Fetch Statistik Utama
      const { data: bookingStats, error: bookingError } = await supabase
        .from("bookings")
        .select("price, customer_phone");

      if (bookingStats) {
        const totalRevenue = bookingStats.reduce(
          (sum, booking) => sum + (booking.price || 0),
          0
        );
        const uniqueCustomers = new Set(
          bookingStats.map((b) => b.customer_phone)
        ).size;
        setStats({
          totalBookings: bookingStats.length,
          totalRevenue,
          uniqueCustomers,
        });
      }

      // 2. Panggil FUNGSI DATABASE (RPC) yang baru kita buat
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6);

      const { data: dailyStats, error: rpcError } = await supabase.rpc(
        "get_daily_booking_stats",
        {
          start_date: sevenDaysAgo.toISOString().split("T")[0],
          end_date: today.toISOString().split("T")[0],
        }
      );

      if (rpcError) console.error("RPC Error:", rpcError);

      if (dailyStats) {
        const formattedDailyData = dailyStats.map((d) => ({
          name: new Date(d.day).toLocaleDateString("id-ID", {
            weekday: "short",
          }),
          bookings: d.booking_count,
        }));
        setDailyData(formattedDailyData);
      }

      // 3. Fetch Performa Kapster
      const { data: barberStats, error: barberError } = await supabase.rpc(
        "count_bookings_by_barber"
      );

      // Note: Supabase.rpc can also call simple group by queries if needed,
      // but for simplicity, we'll do it on the client for this part.
      // A more optimized way is another RPC.
      const { data: rawBarberStats } = await supabase
        .from("bookings")
        .select("barbers (name)");

      if (rawBarberStats) {
        const counts = rawBarberStats.reduce((acc, { barbers }) => {
          if (barbers) {
            acc[barbers.name] = (acc[barbers.name] || 0) + 1;
          }
          return acc;
        }, {});

        const formattedBarberData = Object.keys(counts).map((name) => ({
          name,
          bookings: counts[name],
        }));
        setBarberData(formattedBarberData);
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-brand-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Booking"
          value={stats.totalBookings}
          icon={<Book size={32} />}
          color="bg-dark-card"
        />
        <StatCard
          title="Total Pendapatan"
          value={`Rp ${stats.totalRevenue.toLocaleString("id-ID")}`}
          icon={<DollarSign size={32} />}
          color="bg-dark-card"
        />
        <StatCard
          title="Total Pelanggan"
          value={stats.uniqueCustomers}
          icon={<Users size={32} />}
          color="bg-dark-card"
        />
      </div>

      {/* Grafik */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-dark-card p-6 rounded-xl">
          <h3 className="font-display text-xl font-bold mb-4">
            Tren Booking (7 Hari Terakhir)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #2C2C2C",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="bookings"
                name="Jumlah Booking"
                stroke="#00A9FF"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-dark-card p-6 rounded-xl">
          <h3 className="font-display text-xl font-bold mb-4">
            Performa Kapster
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={barberData}
              layout="vertical"
              margin={{ right: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis type="number" stroke="#9ca3af" allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#9ca3af"
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #2C2C2C",
                }}
                cursor={{ fill: "rgba(0, 169, 255, 0.1)" }}
              />
              <Bar dataKey="bookings" name="Jumlah Booking" fill="#00A9FF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
