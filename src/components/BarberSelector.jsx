// src/components/BarberSelector.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { ChevronDown } from "lucide-react";

const BarberSelector = ({ onBarberSelect }) => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBarbers = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("barbers").select("*");
      if (error) {
        console.error("Error fetching barbers:", error);
      } else {
        setBarbers(data || []);
      }
      setLoading(false);
    };
    fetchBarbers();
  }, []);

  if (loading) {
    return (
      <div className="h-12 w-full bg-dark-card rounded-lg animate-pulse"></div>
    );
  }

  if (barbers.length === 0) {
    return (
      <p className="text-center text-gray-400">
        Belum ada kapster yang terdaftar.
      </p>
    );
  }

  return (
    <div className="mb-8">
      <label
        htmlFor="barber-select"
        className="font-display text-2xl font-bold text-center mb-4 block text-brand-blue"
      >
        1. Pilih Kapster
      </label>
      <div className="relative">
        <select
          id="barber-select"
          onChange={(e) => {
            const selected = barbers.find((b) => b.id === e.target.value);
            onBarberSelect(selected || null);
          }}
          defaultValue=""
          className="w-full p-4 bg-dark-card border border-gray-700 rounded-lg appearance-none focus:ring-2 focus:ring-brand-blue focus:outline-none font-semibold text-lg"
        >
          <option value="" disabled>
            -- Pilih salah satu kapster --
          </option>
          {barbers.map((barber) => (
            <option key={barber.id} value={barber.id}>
              {barber.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};

export default BarberSelector;
