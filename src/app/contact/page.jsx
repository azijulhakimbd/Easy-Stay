"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <section className="min-h-screen bg-background py-24">
      {/* Fixed max width 1280px container */}
      <div className="w-full max-w-[1280px] mx-auto px-6">
        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-4xl font-bold text-center mb-4"
        >
          Contact <span className="text-primary">EasyStay</span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-center text-muted-foreground mb-12"
        >
          Have a question or need assistance? We’d love to hear from you!
        </motion.p>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="space-y-6"
          >
            <Card className="p-6 shadow-md">
              <CardContent className="space-y-4">
                {[
                  {
                    icon: <FaEnvelope className="text-primary w-6 h-6" />,
                    title: "Email",
                    desc: "support@easystay.com",
                  },
                  {
                    icon: <FaPhoneAlt className="text-primary w-6 h-6" />,
                    title: "Phone",
                    desc: "+880 1234 567890",
                  },
                  {
                    icon: <FaMapMarkerAlt className="text-primary w-6 h-6" />,
                    title: "Address",
                    desc: "123 EasyStay Avenue, Dhaka, Bangladesh",
                  },
                ].map((info, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    custom={i + 4}
                    className="flex items-center space-x-4"
                  >
                    {info.icon}
                    <div>
                      <h3 className="font-semibold">{info.title}</h3>
                      <p className="text-muted-foreground">{info.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={6}
            >
              <iframe
                className="w-full h-64 rounded-lg border-2 border-muted"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.433463275976!2d90.41251827411076!3d23.80315218653455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7a8b2bca3ad%3A0x9a5a6c1c07a2e!2sDhaka!5e0!3m2!1sen!2sbd!4v1695725840817!5m2!1sen!2sbd"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="bg-card p-6 rounded-xl shadow-md space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Message sent successfully!");
            }}
          >
            <motion.h2
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={4.2}
              className="text-2xl font-semibold mb-2"
            >
              Send us a message
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-4">
              <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={4.4}>
                <Input placeholder="Your Name" required />
              </motion.div>
              <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={4.6}>
                <Input placeholder="Your Email" type="email" required />
              </motion.div>
            </div>

            <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={4.8}>
              <Input placeholder="Subject" required />
            </motion.div>

            <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={5}>
              <Textarea placeholder="Your Message" rows={5} required />
            </motion.div>

            <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={5.2}>
              <Button className="w-full mt-2" type="submit">
                Send Message
              </Button>
            </motion.div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
