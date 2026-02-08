"use client";

import React from "react";
import { motion } from "framer-motion";

const Terms = () => {
  return (
    <motion.main
      className="max-w-4xl mx-auto py-24 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Page Title */}
      <motion.h1
        className="text-3xl font-bold mb-6 text-center font-heading"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Terms & <span className="text-blue-500">Conditions</span>
      </motion.h1>

      {/* Intro Paragraphs */}
      <motion.p
        className="mb-4 font-body"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Welcome to <span className="font-semibold">easyStay</span>! These terms
        and conditions outline the rules and regulations for using our website,
        booking accommodations, and interacting with our services.
      </motion.p>

      <motion.p
        className="mb-4 font-body"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        By accessing this website, you confirm that you accept these terms and
        conditions. If you do not agree, please do not continue to use{" "}
        <span className="font-semibold">easyStay</span>.
      </motion.p>

      {/* Section 1 - Usage */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mt-6 mb-2 font-heading">
          1. Acceptable Usage
        </h2>
        <p className="mb-4 font-body">
          You agree to use the platform lawfully and ethically. Any form of
          misuse, including fraudulent activity, hacking attempts, spreading
          malware, or unauthorized access, is strictly prohibited and may result
          in suspension or legal action.
        </p>
      </motion.section>

      {/* Section 2 - Booking & Payments */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mt-6 mb-2 font-heading">
          2. Booking & Payments
        </h2>
        <p className="mb-4 font-body">
          All reservations must be made directly through our platform. Payments
          should follow the secure checkout process provided by{" "}
          <span className="font-semibold">easyStay</span>. We are not
          responsible for transactions or agreements made outside of our
          platform.
        </p>
      </motion.section>

      {/* Section 3 - Liability */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mt-6 mb-2 font-heading">
          3. Limitation of Liability
        </h2>
        <p className="mb-4 font-body">
          While we strive to ensure a safe and pleasant experience,{" "}
          <span className="font-semibold">easyStay</span> is not liable for any
          direct or indirect damages, injuries, or losses that may occur during
          a stay. Please review individual property policies and communicate
          with hosts for specific terms.
        </p>
      </motion.section>

      {/* Section 4 - Modifications */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mt-6 mb-2 font-heading">
          4. Changes to Terms
        </h2>
        <p className="mb-4 font-body">
          We reserve the right to update or modify these Terms & Conditions at
          any time. Changes will be posted on this page with an updated revision
          date.
        </p>
      </motion.section>

      {/* Contact */}
      <motion.p
        className="mt-6 font-body"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        For a detailed version of our Terms & Conditions, please contact us at{" "}
        <a
          href="mailto:legal@easystay.com"
          className="text-blue-600 hover:underline"
        >
          legal@easystay.com
        </a>
        .
      </motion.p>
    </motion.main>
  );
};

export default Terms;
