"use client";

import { Marquee } from "@/components/ui/marquee";
import Container from "./Container/Container";

const partners = [
  {
    name: "Booking.com",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/be/Booking.com_logo.svg",
  },
  {
    name: "Airbnb",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg",
  },
  {
    name: "TripAdvisor",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/25/Tripadvisor_Logo_stacked.svg",
  },
  {
    name: "Expedia",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Expedia_Logo_2023.svg",
  },
  {
    name: "Agoda",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Agoda_logo_2019.svg",
  },
  {
    name: "Vrbo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Vrbo.svg",
  },
];

export default function EasyStayPartners() {
  return (
    <Container>
    <section className="relative flex  flex-col items-center justify-center overflow-hidden py-24 sm:py-12 md:py-16 ">
      {/* Heading */}
      <h2 className="mb-6 text-xl sm:text-3xl md:text-4xl font-bold text-black dark:text-neutral-300 p-5 text-center">
        Trusted by Leading <span className="text-blue-500">Travel Platforms</span>
      </h2>

      {/* Top Marquee */}
      <Marquee pauseOnHover className="[--duration:60s] sm:[--duration:45s] md:[--duration:35s]">
        {partners.map((p) => (
          <div
            key={p.name}
            className="mx-3 sm:mx-6 md:mx-8 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
          >
            <img
              src={p.logo}
              alt={p.name}
              className="h-6 xs:h-8 sm:h-10 md:h-12 lg:h-14 w-auto object-contain"
            />
          </div>
        ))}
      </Marquee>

      {/* Gradient Fade Effect for smoother edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/5 sm:w-1/6  "></div>
    </section>
    </Container>
    
  );
}
