"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import Container from "./Container/Container";

export default function Stats() {
  const stats = [
    {
      id: 1,
      label: "Total Bookings",
      value: 4800,
      icon: "https://cdn-icons-png.flaticon.com/512/888/888879.png",
    },
    {
      id: 2,
      label: "Happy Guests",
      value: 3200,
      icon: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
    },
    {
      id: 3,
      label: "Verified Properties",
      value: 1500,
      icon: "https://cdn-icons-png.flaticon.com/512/3103/3103476.png",
    },
    {
      id: 4,
      label: "Customer Reviews",
      value: 960,
      icon: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
    },
  ];

  return (
    <Container className="bg-gray-50 py-24">
      <div className=" text-center px-4">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-neutral-300 p-5 mb-3"
        >
          We Make <span className="text-blue-500 ">Every Stay Memorable</span> 
        </motion.h2>
        <p className="text-gray-600 mb-10">
          From cozy apartments to luxurious villas, EasyStay helps travelers book safe, verified, and comfortable stays — anytime, anywhere.
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-[#efefef] p-6 rounded-2xl dark:bg-black shadow text-center"
            >
              <div className="flex justify-center mb-4">
                <img src={item.icon} alt={item.label} className="w-12 h-12" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-neutral-300">
                <CountUp end={item.value} duration={2.5} />+
              </h3>
              <p className="text-gray-600 mt-1">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Container>
  );
}
