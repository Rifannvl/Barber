// src/components/BookingPage.jsx
import React, { useState, useRef } from "react";
import BookingCalendar from "./BookingCalendar";
import BarberSelector from "./BarberSelector";
import ThemeSwitcher from "./ThemeSwitcher";
import { motion, useInView } from "framer-motion";

const headerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const BookingPage = () => {
  const [selectedBarber, setSelectedBarber] = useState(null);

  const mainRef = useRef(null);
  const isInView = useInView(mainRef, { once: true, amount: 0.3 });

  return (
    <div className="relative min-h-screen bg-light-bg dark:bg-dark-bg text-dark-text dark:text-light-text p-4 sm:p-8 flex flex-col items-center font-sans transition-colors duration-300 overflow-x-hidden">
      <div className="absolute top-4 right-4 z-10">
        <ThemeSwitcher />
      </div>
      <div className="w-full max-w-4xl mx-auto">
        <motion.header
          className="text-center mb-10"
          variants={headerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="w-full h-48 md:h-64 rounded-xl mb-6 overflow-hidden shadow-lg"
            variants={childVariants}
          >
            <img
              src="https://i.pinimg.com/736x/68/05/7c/68057cfb77d54ad1232215b6ce71a3c3.jpg"
              alt="Interior Barbershop Klimis Jaya"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.h1
            className="font-display text-4xl sm:text-6xl font-bold tracking-tight"
            variants={childVariants}
          >
            Night Ride Barbershop
          </motion.h1>
          <motion.p
            className="mt-3 text-lg text-gray-600 dark:text-gray-400"
            variants={childVariants}
          >
            Booking online dalam 3 langkah mudah.
          </motion.p>
        </motion.header>

        <motion.main
          ref={mainRef}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-light-card dark:bg-dark-card/50 p-6 sm:p-8 rounded-2xl shadow-2xl shadow-brand-gold/10 border border-gray-200 dark:border-dark-card"
        >
          <BarberSelector onBarberSelect={setSelectedBarber} />
          {selectedBarber && (
            <BookingCalendar
              key={selectedBarber.id}
              selectedBarber={selectedBarber}
            />
          )}
        </motion.main>

        <footer className="text-center mt-10 text-gray-500 dark:text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Night Ride Barbershop. All rights
            reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default BookingPage;
