import React, { useState } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { id } from "date-fns/locale";
import TimeSlotGrid from "./TimeSlotGrid";

const BookingCalendar = ({ selectedBarber }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekStartsOn = 1;
  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn });

  const weekDays = Array.from({ length: 7 }).map((_, i) =>
    addDays(startOfCurrentWeek, i)
  );

  return (
    <div className="border-t border-gray-200 dark:border-dark-card pt-8 animate-[fadeIn_0.5s]">
      <h2 className="font-display text-2xl font-bold text-center mb-6 text-yellow-600 dark:text-brand-gold">
        2. Pilih Hari
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 mb-8">
        {weekDays.map((day) => (
          <button
            key={day.toString()}
            onClick={() => setSelectedDate(day)}
            className={`p-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105
              ${
                format(selectedDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
                  ? "bg-brand-gold text-white font-bold shadow-lg"
                  : "bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-brand-gold/20"
              }`}
          >
            <p className="text-sm font-semibold capitalize">
              {format(day, "EEE", { locale: id })}
            </p>
            <p className="text-xl font-bold">{format(day, "d")}</p>
          </button>
        ))}
      </div>

      <div className="border-t border-gray-200 dark:border-dark-card pt-8">
        <h3 className="font-display text-2xl font-bold text-center mb-6">
          3. Pilih Jam Tersedia
        </h3>
        <p className="text-center text-gray-500 -mt-4 mb-6">
          Jadwal untuk{" "}
          <span className="font-bold text-dark-text dark:text-light-text">
            {selectedBarber.name}
          </span>{" "}
          pada{" "}
          <span className="font-bold text-yellow-600 dark:text-brand-gold">
            {format(selectedDate, "d MMMM yyyy", { locale: id })}
          </span>
        </p>
        <TimeSlotGrid
          selectedDate={selectedDate}
          selectedBarber={selectedBarber}
        />
      </div>
    </div>
  );
};

export default BookingCalendar;
