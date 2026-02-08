"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaHome } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center px-4">
      {/* Animated 404 */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-7xl font-bold text-primary font-heading mb-4"
      >
        404
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-lg text-muted-foreground mb-8 font-body"
      >
        Oops! The page you are looking for doesn’t exist.
      </motion.p>

      {/* Back to Home Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary font-heading text-primary-foreground px-5 py-3 rounded-2xl shadow hover:shadow-lg hover:scale-105 transition-transform"
        >
          <FaHome /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
}