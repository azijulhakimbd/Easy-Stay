"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Container from "./Container/Container";

export default function FAQ() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching delay
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const faqs = [
    {
      question: "What is EasyStay?",
      answer:
        "EasyStay is a short-term rental platform where travelers can find and book unique stays, while hosts can list their properties to earn income.",
    },
    {
      question: "How do I book a property?",
      answer:
        "Simply search for your desired destination, select your dates, choose a property, and complete the booking process through our secure checkout.",
    },
    {
      question: "Is my payment secure?",
      answer:
        "Yes, all payments are processed securely through trusted payment gateways to ensure your safety and privacy.",
    },
    {
      question: "Can I cancel a booking?",
      answer:
        "Yes, cancellations are possible depending on the host’s cancellation policy. Please check the property’s details before booking.",
    },
    {
      question: "How can I become a host?",
      answer:
        "You can easily sign up as a host on EasyStay, list your property, set your own prices, and start welcoming guests.",
    },
  ];

  return (
    <Container>
    <section className=" px-4 py-24">
      {/* Animated Heading */}
      {loading ? (
        <div className="text-center mb-8">
          <Skeleton height={40} width={300} className="mx-auto mb-2" baseColor="#e0e0e0" highlightColor="#f5f5f5" />
          <Skeleton height={20} width={200} className="mx-auto" />
        </div>
      ) : (
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center font-heading mb-8 text-gray-900 dark:text-neutral-300 p-5"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Frequently <span className="text-blue-500">Asked Questions</span>
        </motion.h2>
      )}

      {/* Accordion */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        viewport={{ once: true }}
      >
        {loading ? (
          // Skeleton placeholders for FAQs
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, idx) => (
                <div key={idx} className="p-4 border rounded-lg border-gray-700">
                  <Skeleton height={24} width={`80%`} className="mb-2" />
                  <Skeleton count={2} width={`95%`} />
                </div>
              ))}
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="font-heading text-lg text-black dark:text-neutral-300">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="font-body text-gray-600 dark:text-neutral-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </motion.div>
    </section>
    </Container>
  );
}
