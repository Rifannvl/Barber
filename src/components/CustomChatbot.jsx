// src/components/CustomChatbot.jsx

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageSquare } from "lucide-react";

// "Otak" dari bot kita (tidak ada perubahan)
// Ganti "const steps" lama Anda dengan yang ini

// Ganti "const steps" lama Anda dengan yang ini

const steps = {
  // 1. PEMBUKA & SAPAAN
  start: {
    message:
      "Halo! Saya Asisten Virtual Klimis Jaya. Tanyakan apa saja, atau pilih salah satu opsi di bawah.",
    options: [
      { text: "Layanan & Harga", trigger: "layanan" },
      { text: "Info Booking", trigger: "info-booking" },
      { text: "Tentang Kapster", trigger: "info-kapster" },
      { text: "Lokasi & Fasilitas", trigger: "lokasi" },
    ],
  },
  sapaan: {
    keywords: [
      "halo",
      "hai",
      "hi",
      "pagi",
      "siang",
      "sore",
      "malam",
      "apa kabar",
    ],
    message:
      "Halo juga! Semoga hari Anda menyenangkan. Ada yang bisa saya bantu?",
    trigger: "start",
  },
  "terima-kasih": {
    keywords: [
      "terima kasih",
      "makasih",
      "thanks",
      "ok",
      "oke",
      "sip",
      "mantap",
    ],
    message: "Sama-sama! Senang bisa membantu Anda.",
    trigger: "tanya-lagi",
  },

  // 2. LAYANAN & HARGA
  layanan: {
    keywords: ["layanan", "servis", "selain potong", "apa saja"],
    message:
      "Tentu! Ini daftar layanan utama kami: Potong Rambut (Rp 50.000), Cukur Jenggot & Kumis (Rp 25.000), dan Paket Ganteng (Potong + Cukur) hanya Rp 65.000.",
    trigger: "tanya-lagi-layanan",
  },
  harga: {
    keywords: ["harga", "biaya", "tarif", "price list"],
    message:
      "Harga potong rambut standar kami Rp 50.000 (termasuk cuci & pijat ringan). Untuk layanan lain seperti cukur jenggot atau paket, silakan tanya 'layanan'.",
    trigger: "tanya-lagi-layanan",
  },
  "diskon-mahasiswa": {
    keywords: ["mahasiswa", "pelajar", "diskon", "promo", "murah"],
    message:
      "Tentu ada! Tunjukkan kartu mahasiswamu dan dapatkan diskon 10% untuk semua layanan di hari kerja (Senin-Jumat).",
    trigger: "tanya-lagi",
  },
  "cat-rambut": {
    keywords: ["cat", "warna", "coloring", "semir", "highlight"],
    message:
      "Untuk saat ini kami fokus pada seni potong dan cukur rambut. Jadi, kami belum menyediakan layanan pewarnaan rambut.",
    trigger: "tanya-lagi",
  },
  "tanya-lagi-layanan": {
    message: "Ada lagi pertanyaan seputar layanan kami?",
    options: [
      { text: "Diskon Mahasiswa?", trigger: "diskon-mahasiswa" },
      { text: "Bisa Cat Rambut?", trigger: "cat-rambut" },
      { text: "Kembali ke Awal", trigger: "start" },
    ],
  },

  // 3. BOOKING & JADWAL
  "info-booking": {
    message: "Ada yang ingin Anda tanyakan seputar booking?",
    options: [
      { text: "Cara Booking?", trigger: "cara-booking" },
      { text: "Bisa Walk-in?", trigger: "walk-in" },
      { text: "Bagaimana jika telat?", trigger: "jika-telat" },
      { text: "Kembali ke Awal", trigger: "start" },
    ],
  },
  "jam-buka": {
    keywords: ["jam", "buka", "operasional", "waktu"],
    message:
      "Kami buka setiap hari Senin - Sabtu, dari jam 10:00 pagi sampai jam 19:00 malam. Hari Minggu kami libur.",
    trigger: "tanya-lagi",
  },
  "cara-booking": {
    keywords: ["booking", "pesan", "reservasi", "daftar", "gimana"],
    message:
      "Cara termudah untuk booking adalah langsung melalui halaman ini! Cukup ikuti 3 langkah di atas: 1. Pilih Kapster, 2. Pilih Hari, 3. Pilih Jam. Sangat mudah!",
    trigger: "tanya-lagi",
  },
  "walk-in": {
    keywords: ["walk-in", "langsung", "tanpa booking"],
    message:
      "Tentu, kami menerima walk-in. Namun, untuk memastikan Anda mendapatkan slot tanpa menunggu lama, kami sangat menyarankan untuk melakukan booking online terlebih dahulu.",
    trigger: "tanya-lagi",
  },
  "jika-telat": {
    keywords: ["telat", "terlambat", "lewat jam", "hangus"],
    message:
      "Kami memberikan toleransi keterlambatan hingga 10 menit. Jika lebih dari itu, kami mungkin harus memberikan slot Anda ke pelanggan lain untuk menjaga jadwal. Mohon hubungi kami jika Anda akan telat ya!",
    trigger: "tanya-lagi",
  },

  // 4. LOKASI & FASILITAS
  lokasi: {
    keywords: ["lokasi", "alamat", "mana", "tempat", "maps"],
    message:
      'Lokasi kami ada di Jl. Keren No. 123, Jakarta. Anda bisa cari "Klimis Jaya" di Google Maps!',
    trigger: "tanya-lagi-fasilitas",
  },
  fasilitas: {
    keywords: ["fasilitas", "parkir", "wifi", "ac", "ruang tunggu"],
    message:
      "Tentu! Kami menyediakan parkiran yang cukup untuk motor dan mobil. Di dalam, kami punya ruang tunggu nyaman ber-AC, WiFi gratis, dan musik yang asik.",
    trigger: "tanya-lagi-fasilitas",
  },
  pembayaran: {
    keywords: ["bayar", "pembayaran", "qris", "cash", "debit", "tunai"],
    message:
      "Kami menerima pembayaran via Tunai (Cash), Kartu Debit, dan semua jenis QRIS.",
    trigger: "tanya-lagi-fasilitas",
  },
  "tanya-lagi-fasilitas": {
    message: "Ada lagi info seputar lokasi & fasilitas?",
    options: [
      { text: "Ada parkiran?", trigger: "fasilitas" },
      { text: "Cara bayar?", trigger: "pembayaran" },
      { text: "Kembali ke Awal", trigger: "start" },
    ],
  },

  // 5. TENTANG KAPSTER
  "info-kapster": {
    keywords: ["kapster", "barber", "tukang cukur", "siapa"],
    message:
      "Tim kami terdiri dari para kapster profesional! Saat ini yang jadwalnya tersedia online adalah Kapster Riski, spesialis model rambut klasik dan modern.",
    trigger: "tanya-lagi",
  },

  // 6. PERTANYAAN KREATIF & TIDAK MASUK AKAL
  "potongan-aneh": {
    keywords: ["nanas", "segitiga", "mohawk pelangi", "aneh"],
    message:
      "Haha, itu model yang sangat kreatif! Kapster kami jago, tapi mungkin model nanas sedikit di luar spesialisasi kami. Bagaimana kalau model fade yang keren?",
    trigger: "start",
  },
  "bayar-doa": {
    keywords: ["bayar pakai doa", "gratisan", "bayar senyum"],
    message:
      "Doa Anda sangat kami hargai dan akan menjadi penyemangat kami! Namun, untuk urusan transaksi, mesin kasir kami lebih akrab dengan QRIS dan Rupiah. 🙏",
    trigger: "start",
  },
  "tentang-bot": {
    keywords: ["kamu siapa", "robot", "bot", "ai", "buatan siapa"],
    message:
      "Saya adalah Asisten Virtual Klimis Jaya. Saya dibuat untuk membantu Anda. Ngomong-ngomong, website keren ini dibuat oleh developer handal lho! nama developernya: Rifan.",
    trigger: "tanya-lagi",
  },

  // 7. PENUTUP
  "tidak-paham": {
    message:
      "Maaf, saya kurang mengerti. Mungkin Anda bisa pilih salah satu opsi di bawah atau coba tanyakan dengan kata kunci lain?",
    trigger: "start",
  },
  "tanya-lagi": {
    message: "Ada lagi yang bisa dibantu?",
    trigger: "start",
  },
};

const TypingIndicator = () => (
  <motion.div
    className="flex items-center gap-1.5 ml-12 mb-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.span
      className="w-2 h-2 bg-gray-400 rounded-full"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.span
      className="w-2 h-2 bg-gray-400 rounded-full"
      animate={{ y: [0, -4, 0] }}
      transition={{
        duration: 0.8,
        delay: 0.1,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    <motion.span
      className="w-2 h-2 bg-gray-400 rounded-full"
      animate={{ y: [0, -4, 0] }}
      transition={{
        duration: 0.8,
        delay: 0.2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  </motion.div>
);

const CustomChatbot = ({ isOpen }) => {
  const [messages, setMessages] = useState([]);
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const startStep = steps["start"];
      setTimeout(() => {
        setMessages([
          { sender: "bot", text: startStep.message, id: Date.now() },
        ]);
        setOptions(startStep.options);
      }, 500);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const processUserInput = (userInput) => {
    const userMessage = { sender: "user", text: userInput, id: Date.now() };
    setMessages((prev) => [...prev, userMessage]);
    setOptions([]);
    setIsTyping(true);
    setTimeout(() => {
      const lowerCaseInput = userInput.toLowerCase();
      let triggeredStep = "tidak-paham";
      for (const key in steps) {
        if (
          steps[key].keywords?.some((keyword) =>
            lowerCaseInput.includes(keyword)
          )
        ) {
          triggeredStep = key;
          break;
        }
      }
      const nextStep = steps[triggeredStep];
      const botMessage = {
        sender: "bot",
        text: nextStep.message,
        id: Date.now() + 1,
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, botMessage]);
      setOptions(steps[nextStep.trigger]?.options || []);
    }, 1500);
  };

  const handleOptionClick = (option) => {
    processUserInput(option.text);
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    processUserInput(inputValue);
    setInputValue("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
          className="fixed bottom-24 right-6 w-80 sm:w-96 h-[32rem] bg-light-card dark:bg-dark-card shadow-2xl rounded-xl flex flex-col z-50 border border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="p-4 bg-brand-gold rounded-t-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-dark-bg flex items-center justify-center">
              <MessageSquare size={18} className="text-brand-gold" />
            </div>
            <h3 className="font-display text-lg font-bold text-dark-text">
              Asisten Klimis Jaya
            </h3>
          </div>

          {/* Message Area */}
          <div className="flex-1 p-4 overflow-y-auto text-dark-text dark:text-light-text">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                layout
                className={`flex mb-4 items-end gap-2 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-brand-gold text-dark-text flex-shrink-0 flex items-center justify-center font-bold text-sm font-display">
                    KJ
                  </div>
                )}
                <div
                  className={`py-2 px-4 rounded-2xl max-w-[80%] ${
                    msg.sender === "user"
                      ? "bg-gray-200 dark:bg-gray-600 rounded-br-none"
                      : "bg-brand-gold text-dark-text rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={chatEndRef} />
          </div>

          {/* Bagian bawah */}
          <div className="p-2 border-t border-gray-200 dark:border-gray-700">
            {options.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2">
                {options.map((opt, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleOptionClick(opt)}
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-dark-text dark:text-light-text text-sm px-4 py-2 rounded-full transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {opt.text}
                  </motion.button>
                ))}
              </div>
            )}
            <form
              onSubmit={handleFormSubmit}
              className="flex items-center gap-2 p-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ketik pesan..."
                className="w-full p-2 bg-gray-100 dark:bg-gray-700 text-dark-text dark:text-light-text rounded-lg border border-transparent focus:ring-2 focus:ring-brand-gold focus:outline-none"
              />
              <button
                type="submit"
                className="p-2 bg-brand-gold text-white rounded-full hover:opacity-90 transition-opacity"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomChatbot;
