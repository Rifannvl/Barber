// src/components/TimeSlotGrid.jsx
import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";
import { format, parse, isBefore, addHours, addDays } from "date-fns";
import BookingForm from "./BookingForm";
import { motion } from "framer-motion"; // <-- Impor motion

// Resep animasi untuk container grid dan setiap slot
const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Jeda sangat cepat antar tombol
    },
  },
};

const slotVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1 },
};

const TimeSlotGrid = ({ selectedDate, selectedBarber }) => {
  // ... (semua state dan fungsi logic tidak berubah)
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [scheduleStatus, setScheduleStatus] = useState("loading");

  const generateSlots = (start, end) => {
    const slots = [];
    let currentTime = parse(start, "HH:mm:ss", selectedDate);
    const endTime = parse(end, "HH:mm:ss", selectedDate);
    while (isBefore(currentTime, endTime)) {
      slots.push(format(currentTime, "HH:mm"));
      currentTime = addHours(currentTime, 1);
    }
    return slots;
  };

  const fetchScheduleAndBookings = useCallback(async () => {
    if (!selectedDate || !selectedBarber) return;
    setLoading(true);
    setScheduleStatus("loading");
    const dayOfWeek = selectedDate.getDay();
    const selectedDayStr = format(selectedDate, "yyyy-MM-dd");
    const nextDayStr = format(addDays(selectedDate, 1), "yyyy-MM-dd");
    const { data: schedule, error: scheduleError } = await supabase
      .from("work_schedules")
      .select("start_time, end_time, is_day_off")
      .eq("barber_id", selectedBarber.id)
      .eq("day_of_week", dayOfWeek)
      .single();
    if (scheduleError || !schedule) {
      setScheduleStatus("not-set");
      setAvailableSlots([]);
      setLoading(false);
      return;
    }
    if (schedule.is_day_off) {
      setScheduleStatus("off");
      setAvailableSlots([]);
      setLoading(false);
      return;
    }
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("booking_time")
      .eq("barber_id", selectedBarber.id)
      .gte("booking_time", selectedDayStr)
      .lt("booking_time", nextDayStr);
    if (bookingsError) {
      console.error("Error fetching bookings:", bookingsError);
      setLoading(false);
      return;
    }
    const allPossibleSlots = generateSlots(
      schedule.start_time,
      schedule.end_time
    );
    const bookedSlots = (bookings || []).map((b) =>
      format(new Date(b.booking_time), "HH:mm")
    );
    const available = allPossibleSlots.filter(
      (slot) => !bookedSlots.includes(slot)
    );
    setAvailableSlots(available);
    setScheduleStatus("available");
    setLoading(false);
  }, [selectedDate, selectedBarber]);

  useEffect(() => {
    fetchScheduleAndBookings();
  }, [fetchScheduleAndBookings]);

  const handleBookingSuccess = () => {
    setSelectedSlot(null);
    fetchScheduleAndBookings();
  };

  // ... (bagian loading dan pesan status tidak berubah)
  if (loading) return <div></div>; // Skeleton loader bisa ditambahkan kembali jika mau
  if (scheduleStatus === "off")
    return (
      <p className="text-center text-yellow-400 font-semibold">
        Kapster sedang libur pada hari ini.
      </p>
    );
  if (scheduleStatus === "not-set")
    return (
      <p className="text-center text-red-400 font-semibold">
        Jadwal untuk hari ini belum diatur oleh admin.
      </p>
    );
  if (availableSlots.length === 0)
    return (
      <p className="text-center text-gray-400 font-semibold">
        Tidak ada jadwal tersedia atau sudah penuh.
      </p>
    );

  return (
    <>
      <motion.div
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3"
        variants={gridVariants}
        initial="hidden"
        animate="visible"
      >
        {availableSlots.map((hour) => (
          <motion.button
            key={hour}
            variants={slotVariants}
            onClick={() => setSelectedSlot(hour)}
            className="p-3 rounded-lg text-lg font-bold transition-all duration-300 ease-in-out transform hover:scale-105 bg-gray-100 dark:bg-dark-card hover:bg-brand-gold hover:text-white dark:hover:text-dark-bg focus:ring-2 focus:ring-brand-gold"
          >
            {hour}
          </motion.button>
        ))}
      </motion.div>

      {selectedSlot && (
        <BookingForm
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
          selectedBarber={selectedBarber}
          onClose={() => setSelectedSlot(null)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </>
  );
};

export default TimeSlotGrid;
