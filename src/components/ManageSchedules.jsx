import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";
import Swal from "sweetalert2";
import { ChevronDown } from "lucide-react";

const daysOfWeek = [
  { id: 1, name: "Senin" },
  { id: 2, name: "Selasa" },
  { id: 3, name: "Rabu" },
  { id: 4, name: "Kamis" },
  { id: 5, name: "Jumat" },
  { id: 6, name: "Sabtu" },
  { id: 0, name: "Minggu" },
];

const ManageSchedules = () => {
  const [barbers, setBarbers] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBarbers = async () => {
      const { data } = await supabase.from("barbers").select("*");
      setBarbers(data || []);
    };
    fetchBarbers();
  }, []);

  const fetchSchedules = useCallback(async () => {
    if (!selectedBarber) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("work_schedules")
      .select("*")
      .eq("barber_id", selectedBarber);

    if (error) {
      console.error("Error fetching schedules", error);
      return;
    }

    const existingSchedules = daysOfWeek.map((day) => {
      const found = data.find((d) => d.day_of_week === day.id);
      return (
        found || {
          barber_id: selectedBarber,
          day_of_week: day.id,
          start_time: "10:00",
          end_time: "19:00",
          is_day_off: true,
        }
      );
    });
    setSchedules(existingSchedules);
    setLoading(false);
  }, [selectedBarber]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleScheduleChange = (dayOfWeek, field, value) => {
    setSchedules((currentSchedules) =>
      currentSchedules.map((schedule) =>
        schedule.day_of_week === dayOfWeek
          ? { ...schedule, [field]: value }
          : schedule
      )
    );
  };

  const handleSaveSchedules = async () => {
    if (!selectedBarber || schedules.length === 0) return;

    // PERBAIKAN: Hapus properti 'id' dari setiap objek sebelum mengirim ke Supabase
    const schedulesToSave = schedules.map(({ id, ...rest }) => rest);

    const { error } = await supabase
      .from("work_schedules")
      .upsert(schedulesToSave, {
        onConflict: "barber_id, day_of_week",
      });

    if (error) {
      Swal.fire("Error", "Gagal menyimpan jadwal.", "error");
      console.error(error);
    } else {
      Swal.fire("Sukses!", "Jadwal kerja berhasil diperbarui.", "success");
    }
  };

  return (
    <div className="bg-dark-card/50 p-6 rounded-xl border border-dark-card">
      <h2 className="font-display text-xl font-bold mb-4">
        Atur Jadwal Kerja Kapster
      </h2>

      <div className="max-w-xs mb-6">
        <label className="block mb-2 font-semibold">Pilih Kapster</label>
        <div className="relative">
          <select
            value={selectedBarber}
            onChange={(e) => setSelectedBarber(e.target.value)}
            className="w-full p-2 bg-dark-bg rounded border border-dark-card appearance-none focus:ring-brand-blue"
          >
            <option value="">-- Pilih Kapster --</option>
            {barbers.map((barber) => (
              <option key={barber.id} value={barber.id}>
                {barber.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {selectedBarber &&
        (loading ? (
          <p>Memuat jadwal...</p>
        ) : (
          <div>
            <div className="space-y-4">
              {schedules.map((schedule) => {
                const day = daysOfWeek.find(
                  (d) => d.id === schedule.day_of_week
                );
                return (
                  <div
                    key={day.id}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-dark-card p-4 rounded-lg"
                  >
                    <div className="font-semibold text-lg md:col-span-1">
                      {day.name}
                    </div>
                    <div className="flex items-center gap-4 md:col-span-2">
                      <input
                        type="time"
                        value={schedule.start_time || ""}
                        disabled={schedule.is_day_off}
                        onChange={(e) =>
                          handleScheduleChange(
                            day.id,
                            "start_time",
                            e.target.value
                          )
                        }
                        className="p-2 bg-dark-bg rounded border border-gray-600 disabled:opacity-50"
                      />
                      <span>-</span>
                      <input
                        type="time"
                        value={schedule.end_time || ""}
                        disabled={schedule.is_day_off}
                        onChange={(e) =>
                          handleScheduleChange(
                            day.id,
                            "end_time",
                            e.target.value
                          )
                        }
                        className="p-2 bg-dark-bg rounded border border-gray-600 disabled:opacity-50"
                      />
                    </div>
                    <div className="flex items-center gap-2 md:col-span-1 md:justify-end">
                      <input
                        type="checkbox"
                        id={`day-off-${day.id}`}
                        checked={schedule.is_day_off}
                        onChange={(e) =>
                          handleScheduleChange(
                            day.id,
                            "is_day_off",
                            e.target.checked
                          )
                        }
                        className="w-5 h-5 accent-brand-blue"
                      />
                      <label htmlFor={`day-off-${day.id}`}>Libur</label>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={handleSaveSchedules}
              className="mt-6 w-full md:w-auto p-3 bg-brand-blue text-dark-bg font-bold rounded hover:opacity-90"
            >
              Simpan Jadwal
            </button>
          </div>
        ))}
    </div>
  );
};

export default ManageSchedules;
