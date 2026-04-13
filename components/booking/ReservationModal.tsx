"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Users, Clock, MessageCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { buildReservationWhatsAppUrl } from "@/lib/whatsapp";

const reservationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(7, "Phone number is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  guests: z.coerce.number().min(1, "At least 1 guest").max(20),
  notes: z.string().optional(),
});

type ReservationForm = z.infer<typeof reservationSchema>;

export default function ReservationModal() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ReservationForm>({
    resolver: zodResolver(reservationSchema),
    mode: "onChange",
    defaultValues: { guests: 2 },
  });

  const onSubmit = (data: ReservationForm) => {
    const url = buildReservationWhatsAppUrl(data);
    window.open(url, "_blank");
    reset();
    setIsOpen(false);
  };

  // Today's date for min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      {/* Trigger — can be called from Hero or anywhere via id="book" */}
      <button
        id="open-reservation"
        onClick={() => setIsOpen(true)}
        className="hidden"
      />

      {/* Floating Book button — mobile thumb zone */}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Modal — full screen on mobile, centered on desktop */}
            <motion.div
              className="fixed z-50 bg-white
                inset-0 sm:inset-auto
                sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2
                sm:w-full sm:max-w-md sm:rounded-2xl sm:max-h-[90vh]
                flex flex-col overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div>
                  <h2 className="font-playfair text-xl font-bold text-earth-dark">
                    Book a Table
                  </h2>
                  <p className="text-xs text-muted mt-0.5">
                    Reservation via WhatsApp
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <div className="flex-1 overflow-y-auto p-5">
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="text-sm font-medium text-earth-dark mb-1.5 block">
                      Name
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      placeholder="Your full name"
                      className="w-full px-4 py-3 bg-cream rounded-xl text-sm text-earth-dark placeholder:text-muted/50 outline-none focus:ring-2 focus:ring-pink/30"
                      style={{ fontSize: "16px" }}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-sm font-medium text-earth-dark mb-1.5 block">
                      Phone
                    </label>
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="+977 98..."
                      className="w-full px-4 py-3 bg-cream rounded-xl text-sm text-earth-dark placeholder:text-muted/50 outline-none focus:ring-2 focus:ring-pink/30"
                      style={{ fontSize: "16px" }}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-earth-dark mb-1.5 flex items-center gap-1.5">
                        <Calendar size={14} className="text-pink" /> Date
                      </label>
                      <input
                        {...register("date")}
                        type="date"
                        min={today}
                        className="w-full px-4 py-3 bg-cream rounded-xl text-sm text-earth-dark outline-none focus:ring-2 focus:ring-pink/30"
                        style={{ fontSize: "16px" }}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-earth-dark mb-1.5 flex items-center gap-1.5">
                        <Clock size={14} className="text-pink" /> Time
                      </label>
                      <input
                        {...register("time")}
                        type="time"
                        className="w-full px-4 py-3 bg-cream rounded-xl text-sm text-earth-dark outline-none focus:ring-2 focus:ring-pink/30"
                        style={{ fontSize: "16px" }}
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="text-sm font-medium text-earth-dark mb-1.5 flex items-center gap-1.5">
                      <Users size={14} className="text-pink" /> Guests
                    </label>
                    <input
                      {...register("guests")}
                      type="number"
                      min={1}
                      max={20}
                      className="w-full px-4 py-3 bg-cream rounded-xl text-sm text-earth-dark outline-none focus:ring-2 focus:ring-pink/30"
                      style={{ fontSize: "16px" }}
                    />
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="text-sm font-medium text-earth-dark mb-1.5 block">
                      Special Requests{" "}
                      <span className="text-muted font-normal">(optional)</span>
                    </label>
                    <textarea
                      {...register("notes")}
                      rows={3}
                      placeholder="Birthday, allergies, seating preference..."
                      className="w-full px-4 py-3 bg-cream rounded-xl text-sm text-earth-dark placeholder:text-muted/50 outline-none focus:ring-2 focus:ring-pink/30 resize-none"
                      style={{ fontSize: "16px" }}
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="p-5 border-t border-gray-100">
                <button
                  onClick={handleSubmit(onSubmit)}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors text-base disabled:opacity-40"
                >
                  <MessageCircle size={20} />
                  Confirm Reservation
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
