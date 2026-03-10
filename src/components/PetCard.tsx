import { MapPin, Calendar, Syringe, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { Pet } from "@/lib/data";
import PetDetailExpanded from "./PetDetailExpanded";

interface PetCardProps {
  pet: Pet;
  index: number;
}

const PetCard = ({ pet, index }: PetCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  // Generate a placeholder gradient based on pet type
  const bgColor = pet.type === "dog"
    ? "from-amber-100 to-orange-50"
    : "from-blue-100 to-indigo-50";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="col-span-1"
    >
      <div className="bg-card rounded-lg border border-border shadow-card hover:shadow-card-hover transition-shadow duration-300 overflow-hidden">
        {/* Image */}
        <div className={`relative aspect-[4/3] bg-gradient-to-br ${bgColor} flex items-center justify-center`}>
          <div className="text-5xl">{pet.type === "dog" ? "🐕" : "🐈"}</div>

          {/* Quality Badge */}
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-badge text-badge-foreground text-[11px] font-semibold rounded-md">
            {pet.quality}
          </span>

          {/* Verified Badge */}
          {pet.verified && (
            <span className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-badge text-badge-foreground text-[11px] font-semibold rounded-md">
              <ShieldCheck className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-display text-lg leading-tight">{pet.breed}</h3>
            <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-xs">{pet.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {pet.age}
            </span>
            <span className="flex items-center gap-1">
              <Syringe className="w-3.5 h-3.5" />
              {pet.vaccination}
            </span>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {pet.description}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="font-display text-lg text-foreground">{formatPrice(pet.price)}</span>
            <button
              onClick={() => setExpanded(!expanded)}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              {expanded ? "Close" : "View Details"}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Detail (Signature Moment) */}
      <AnimatePresence>
        {expanded && (
          <PetDetailExpanded pet={pet} onClose={() => setExpanded(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PetCard;
