"use client";

import React from "react";
import { motion } from "framer-motion";

const HelpCenter = () => {
  return (
    <motion.main
      className="max-w-4xl mx-auto py-24 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Page Title */}
      <motion.h1
        className="text-3xl text-center font-bold mb-6 font-heading"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Help <span className="text-blue-500">Center</span>
      </motion.h1>

      {/* Intro Paragraph */}
      <motion.p
        className="mb-4 font-body"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Welcome to easyStay Help Center! Here you can find answers to frequently
        asked questions and contact support if needed.
      </motion.p>

      {/* Booking Issues Section */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mt-6 mb-2 font-heading">
          Booking Issues
        </h2>
        <p className="mb-4 font-body">
          If you face issues while booking a property, please ensure your payment
          details are correct and try again. Contact support if the issue
          persists.
        </p>
      </motion.section>

      {/* Account Support Section */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mt-6 mb-2 font-heading">
          Account Support
        </h2>
        <p className="mb-4 font-body">
          For account-related issues such as login problems, password reset, or
          account verification, reach out to our support team.
        </p>
      </motion.section>

      {/* Property Support Section */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mt-6 mb-2 font-heading">
          Property Support
        </h2>
        <p className="mb-4 font-body">
          Hosts and guests can contact support for property-related concerns,
          cancellations, or refunds.
        </p>
      </motion.section>

      {/* Contact Support */}
      <motion.p
        className="mt-6 font-body"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        Still have questions?{" "}
        <a
          href="mailto:support@easystay.com"
          className="text-blue-600 hover:underline"
        >
          Contact Support
        </a>
      </motion.p>
    </motion.main>
  );
};

export default HelpCenter;
