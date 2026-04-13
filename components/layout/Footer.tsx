import { siteConfig } from "@/data/site";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="text-white/70"
      style={{
        background:
          "linear-gradient(135deg, #0D5C58 0%, #062E2C 50%, #0D5C58 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-baseline gap-1 mb-4">
              <span
                className="text-3xl text-pink"
                style={{ fontFamily: "var(--font-breathing)" }}
              >
                Casa
              </span>
              <span
                className="text-lg text-white uppercase tracking-[0.15em]"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                Mexicana
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Authentic Mexican cuisine in the heart of Kathmandu since{" "}
              {siteConfig.since}. {siteConfig.tagline}.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-playfair text-white text-lg font-bold mb-4">
              Contact
            </h3>
            <div className="space-y-3 text-sm">
              <a
                href={siteConfig.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-pink transition-colors"
              >
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-pink" />
                {siteConfig.address}
              </a>
              <a
                href={`tel:${siteConfig.phone}`}
                className="flex items-center gap-3 hover:text-pink transition-colors"
              >
                <Phone size={16} className="flex-shrink-0 text-pink" />
                {siteConfig.phoneDisplay}
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-3 hover:text-pink transition-colors"
              >
                <Mail size={16} className="flex-shrink-0 text-pink" />
                {siteConfig.email}
              </a>
            </div>
          </div>

          {/* Hours & Socials */}
          <div>
            <h3 className="font-playfair text-white text-lg font-bold mb-4">
              Hours
            </h3>
            <p className="text-sm mb-6">{siteConfig.hours}</p>

            <h3 className="font-playfair text-white text-lg font-bold mb-3">
              Follow Us
            </h3>
            <div className="flex items-center gap-4">
              <a
                href={siteConfig.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink transition-colors text-sm"
                aria-label="Facebook"
              >
                Facebook
              </a>
              <span className="text-white/20">|</span>
              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink transition-colors text-sm"
                aria-label="Instagram"
              >
                Instagram
              </a>
              <span className="text-white/20">|</span>
              <a
                href={siteConfig.socials.tripAdvisor}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink transition-colors text-sm"
                aria-label="TripAdvisor"
              >
                TripAdvisor
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-white/40">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
