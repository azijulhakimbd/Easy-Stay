"use client";

import React from "react";
import { motion } from "framer-motion";

const Privacy = () => {
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
        Privacy <span className="text-blue-500">Policy</span>
      </motion.h1>

      {/* Intro */}
      <motion.p
        className="mb-4 font-body"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        At <span className="font-semibold">easyStay</span>, we value your privacy and are committed
        to protecting your personal data. This policy explains how we collect,
        use, and safeguard your information when you use our platform.
      </motion.p>

      {/* Section 1 - Data Collection */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mt-6 mb-2 font-heading">
          1. Data Collection
        </h2>
        <p className="mb-4 font-body">
          We collect information such as your name, email address, phone number,
          payment details, and booking history. This helps us process
          reservations, provide customer support, and enhance your overall
          experience on our platform.
        </p>
      </motion.section>

      {/* Section 2 - Data Usage */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mt-6 mb-2 font-heading">
          2. How We Use Your Data
        </h2>
        <p className="mb-4 font-body">
          Your data is used for booking management, fraud prevention, customer
          support, marketing (only with your consent), and legal compliance. We
          do <span className="font-semibold">not</span> sell your data to third
          parties.
        </p>
      </motion.section>

      {/* Section 3 - Cookies */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mt-6 mb-2 font-heading">
          3. Cookies & Tracking
        </h2>
        <p className="mb-4 font-body">
          We use cookies and similar technologies to personalize your browsing
          experience and analyze site performance. You can disable cookies in
          your browser settings, but some features may not work as intended.
        </p>
      </motion.section>

      {/* Section 4 - Data Protection */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mt-6 mb-2 font-heading">
          4. Data Protection
        </h2>
        <p className="mb-4 font-body">
          We use encryption, secure servers, and regular security audits to
          protect your personal information. Only authorized personnel have
          access to your data.
        </p>
      </motion.section>

      {/* Contact */}
      <motion.p
        className="mt-6 font-body"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        For any privacy concerns, please contact us at{" "}
        <a
          href="mailto:privacy@easystay.com"
          className="text-blue-600 hover:underline"
        >
          privacy@easystay.com
        </a>
        .
      </motion.p>
    </motion.main>
  );
};

export default Privacy;
