// src/components/ChatIcon.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X } from "lucide-react";

const ChatIcon = ({ isOpen, toggleChat }) => {
  return (
    <motion.button
      onClick={toggleChat}
      className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-brand-gold text-white dark:text-gray-500 flex items-center justify-center shadow-lg z-50"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={isOpen ? "x" : "chat"}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X size={32} /> : <MessageSquare size={32} />}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};

export default ChatIcon;
