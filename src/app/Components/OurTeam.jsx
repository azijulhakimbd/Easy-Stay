"use client";

import { motion } from "framer-motion";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";

const team = [
  {
    name: "Md. Azijul Hakim",
    role: "Team Lead and MERN Stack Developer",
    img: "https://i.postimg.cc/JhTmsMDs/Profile-Picture.png",
    linkedin: "https://linkedin.com/in/azijulhakimbd",
    twitter: "https://twitter.com/azijulhakimbd",
    github: "https://github.com/azijulhakimbd",
  },
  {
    name: "Naimur Rahman Dujoy",
    role: "MERN Stack Developer",
    img: "https://i.postimg.cc/90bch241/Professional-Profile-3.png",
    linkedin: "https://www.linkedin.com/in/durjoy4004/",
    twitter: "https://twitter.com/",
    github: "https://github.com/rahmandurjoy04",
  },
  {
    name: "Sifat Hasan",
    role: "MERN Stack Developer",
    img: "https://i.ibb.co.com/8LPJqTx3/1754646608911-e-1758153600-v-beta-t-TO7-VI7y1-HS0-z-Vy-Fy-LSr6-K4-UG1-WSyfz-it-JDs-KC8-I.jpg",
    linkedin: "https://www.linkedin.com/in/sifathasan1/",
    twitter: "https://twitter.com/",
    github: "https://github.com/sifathasan2430",
  },
];

export default function OurTeam() {
  return (
    <section className="py-16 transition-colors duration-300">
      {/* container */}
      <div className="max-w-[1280px] mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-10">
          Meet <span className="text-blue-500">Our Team</span>
        </h2>

        {/*Responsive grid for members */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              className="bg-[#efefef] hover:shadow-2xl dark:bg-gray-600 p-6 rounded-2xl shadow-md flex flex-col items-center transition-transform duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-24 h-28 rounded-full object-cover mb-4 shadow-lg"
              />
              <h3 className="text-lg font-semibold text-blue-500 dark:text-gray-100">
                {member.name}
              </h3>
              <p className="text-gray-500 dark:text-gray-300 mb-3">
                {member.role}
              </p>

              {/* Social Links */}
              <div className="flex gap-4">
                {member.linkedin && (
                  <motion.a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2 }}
                    className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
                  >
                    <FaLinkedin size={20} />
                  </motion.a>
                )}
                {member.twitter && (
                  <motion.a
                    href={member.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2 }}
                    className="text-sky-500 hover:text-sky-700 dark:hover:text-sky-300"
                  >
                    <FaTwitter size={20} />
                  </motion.a>
                )}
                {member.github && (
                  <motion.a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2 }}
                    className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                  >
                    <FaGithub size={20} />
                  </motion.a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
