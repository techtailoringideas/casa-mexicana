"use client";

import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react";
import { siteConfig } from "@/data/site";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function LocationMap() {
  return (
    <section id="location" className="py-16 sm:py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="font-caveat text-pink text-xl">Visit Us</span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-earth-dark mt-1">
              Find Us
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Map */}
          <ScrollReveal direction="left">
            <div className="rounded-2xl overflow-hidden shadow-lg aspect-[4/3] bg-gray-100">
              <iframe
                src={siteConfig.googleMapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "350px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Casa Mexicana Location"
              />
            </div>
          </ScrollReveal>

          {/* Info */}
          <ScrollReveal direction="right">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              {/* Get Directions — THE primary CTA */}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(siteConfig.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 bg-pink text-white font-semibold rounded-full hover:bg-pink-dark transition-colors mb-8 text-base"
              >
                <Navigation size={20} />
                Get Directions
              </a>

              <div className="space-y-5">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-pink/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-pink" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-earth-dark">
                      Address
                    </p>
                    <p className="text-sm text-muted mt-0.5">
                      {siteConfig.address}
                    </p>
                  </div>
                </div>

                {/* Phone — one tap to call */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-pink/10 flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-pink" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-earth-dark">Phone</p>
                    <a
                      href={`tel:${siteConfig.phone}`}
                      className="text-sm text-pink hover:text-pink-dark transition-colors mt-0.5 block"
                    >
                      {siteConfig.phoneDisplay}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-pink/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-pink" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-earth-dark">Email</p>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-sm text-pink hover:text-pink-dark transition-colors mt-0.5 block"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-pink/10 flex items-center justify-center flex-shrink-0">
                    <Clock size={18} className="text-pink" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-earth-dark">Hours</p>
                    <p className="text-sm text-muted mt-0.5">
                      {siteConfig.hours}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
