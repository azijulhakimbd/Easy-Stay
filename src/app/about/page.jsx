"use client";

import { motion } from "framer-motion";
import { FaHome, FaGlobe, FaUsers, FaHandshake } from "react-icons/fa";
import OurTeam from "../Components/OurTeam";

export default function AboutPage() {
  const values = [
    {
      icon: <FaHome className="w-10 h-10 text-primary" />,
      title: "Comfort First",
      desc: "We carefully select and verify properties to ensure every stay is safe, comfortable, and memorable.",
    },
    {
      icon: <FaGlobe className="w-10 h-10 text-primary" />,
      title: "Global Reach",
      desc: "Whether you’re traveling locally or abroad, EasyStay connects you to thousands of short-term rentals worldwide.",
    },
    {
      icon: <FaUsers className="w-10 h-10 text-primary" />,
      title: "Community-Driven",
      desc: "We empower hosts to share their spaces and travelers to explore the world affordably and authentically.",
    },
    {
      icon: <FaHandshake className="w-10 h-10 text-primary" />,
      title: "Trust & Transparency",
      desc: "We prioritize secure bookings, verified reviews, and fair policies to build lasting trust between hosts and guests.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
      {/*  Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/90 to-primary/70 text-white py-10">
        <div className="max-w-[1280px] mx-auto px-6 py-20 text-center">
          <motion.h1
            className="text-4xl font-heading md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            About EasyStay
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl font-body text-white/90 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            EasyStay is your trusted marketplace for short-term rentals. We connect travelers with unique stays and help hosts earn by sharing their spaces.
          </motion.p>
        </div>
      </section>

      {/*  Mission Section */}
      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Our <span className="text-blue-500">Mission</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 font-body max-w-2xl mx-auto">
            Our mission is to make travel easy, affordable, and meaningful. We believe that finding a great place to stay should be simple and stress-free.
          </p>
        </div>

        {/* Core Values */}
        <div className="grid gap-8 md:grid-cols-2">
          {values.map((item, index) => (
            <motion.div
              key={item.title}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md flex items-start gap-4 transition-colors duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="shrink-0">{item.icon}</div>
              <div>
                <h3 className="text-xl font-heading font-semibold text-gray-800 dark:text-gray-100">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 font-body">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/*  Our Team Section */}
      <section className="max-w-[1280px] mx-auto px-6">
        <OurTeam />
      </section>

      {/*  Closing Statement */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16 transition-colors duration-300">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <motion.h3
            className="text-2xl md:text-3xl font-heading font-bold text-gray-800 dark:text-gray-100 mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Travel Smarter, <span className="text-blue-500">Stay Happier</span>
          </motion.h3>
          <motion.p
            className="text-gray-600 dark:text-gray-300 font-body max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            With EasyStay, you can explore new destinations, meet welcoming hosts, and enjoy personalized stays that feel just like home.
          </motion.p>
        </div>
      </section>
    </div>
  );
}
