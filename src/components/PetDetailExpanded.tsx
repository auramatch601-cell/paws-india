import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Syringe, ShieldCheck, ArrowRight } from "lucide-react";
import type { Pet } from "@/lib/data";

interface PetDetailExpandedProps {
  pet: Pet;
  onClose: () => void;
}

const PetDetailExpanded = ({ pet, onClose }: PetDetailExpandedProps) => {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  const bgColor = pet.type === "dog"
    ? "from-amber-100 to-orange-50"
    : "from-blue-100 to-indigo-50";

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="overflow-hidden mt-3"
    >
      <div className="bg-card rounded-lg border border-border shadow-card-hover p-5">
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Image */}
          <div className={`w-full sm:w-48 h-48 rounded-lg bg-gradient-to-br ${bgColor} flex items-center justify-center shrink-0`}>
            <div className="text-6xl">{pet.type === "dog" ? "🐕" : "🐈"}</div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="font-display text-2xl">{pet.breed}</h3>
              <p className="text-sm text-muted-foreground mt-1">{pet.name} · {pet.gender}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                {pet.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                {pet.age}
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Syringe className="w-4 h-4 text-muted-foreground" />
                {pet.vaccination}
              </div>
              {pet.verified && (
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                  Verified Breeder
                </div>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {pet.description}
            </p>

            <div className="flex items-center gap-4 pt-2">
              <span className="font-display text-2xl text-foreground">{formatPrice(pet.price)}</span>
              <button className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                Enquire Now
              </button>
            </div>

            <Link
              to={`/pet/${pet.id}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              See Full Profile
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PetDetailExpanded;
