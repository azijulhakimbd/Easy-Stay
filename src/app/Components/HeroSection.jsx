"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { motion } from "framer-motion"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Link from "next/link"
import Container from "./Container/Container"

export default function HeroSection() {
  const plugin = React.useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
    })
  )

  const slides = [

  {
    id: 1,
    title: "Find Your Perfect Stay",
    subtitle: "Browse hundreds of short-term rentals worldwide",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format",
  },
  {
    id: 2,
    title: "Host Your Property",
    subtitle: "Earn by sharing your space with travelers",
    image:
      "https://i.postimg.cc/FRQFwZp0/frames-for-your-heart-2d4l-AQAlb-DA-unsplash.jpg",
  },
  {
    id: 3,
    title: "Travel with Confidence",
    subtitle: "Trusted reviews, secure payments, 24/7 support",
    image:
      "https://i.postimg.cc/wBx3BFLH/anete-lusina-r-FKBUw-Lg-WQ-unsplash.jpg",
  },
  {
    id: 4,
    title: "Book Anytime, Anywhere",
    subtitle: "Seamless booking experience from mobile or desktop",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1400&auto=format",
  },
  {
    id: 5,
    title: "Experience Local Culture",
    subtitle: "Stay close to authentic destinations and live like a local",
    image:
      "https://i.postimg.cc/fbHySXfd/sorasak-UIN-p-Ff-J7c-unsplash.jpg",
  },
]

  

  return (
    
    <section className="relative w-full min-h-[70vh] md:min-h-[90vh] overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        className="h-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="h-full">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="h-full">
              <div
                className="relative h-[70vh] md:h-[90vh] w-full bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Content */}
                <motion.div
                  className="relative z-10 text-center text-white max-w-xl sm:max-w-2xl px-4 sm:px-6"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="text-3xl sm:text-4xl md:text-6xl font-heading font-bold mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-base sm:text-lg font-body md:text-xl mb-6">
                    {slide.subtitle}
                  </p>
                   <button className="bg-blue-500 text-white hover:text-black font-semibold px-4 font-heading sm:px-6 py-2 sm:py-3 rounded-2xl shadow-md hover:bg-gray-200 transition">
                   <Link href="/stays">Get Started</Link> 
                  </button>
                 
                </motion.div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>

    
  )
}
