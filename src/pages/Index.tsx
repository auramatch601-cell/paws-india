import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Dog, Cat, ShieldCheck, Truck, Heart, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import SearchPanel from "@/components/SearchPanel";
import FloatingContact from "@/components/FloatingContact";
import Footer from "@/components/Footer";
import { MOCK_PETS } from "@/lib/data";
import PetCard from "@/components/PetCard";

const Index = () => {
  const featuredPets = MOCK_PETS.filter((p) => p.status === "approved").slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SearchPanel />

      {/* Hero */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight"
          >
            Find Your Perfect Companion
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-5 text-lg text-muted-foreground leading-relaxed"
          >
            India's most trusted pet marketplace. Every pet is verified, healthy, and ready to become part of your family.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              to="/dogs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <Dog className="w-4 h-4" />
              Browse Dogs
            </Link>
            <Link
              to="/cats"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-card border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors"
            >
              <Cat className="w-4 h-4" />
              Browse Cats
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-card border-y border-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: "Verified Breeders", desc: "Every breeder is carefully vetted and verified for quality assurance." },
              { icon: Heart, title: "Health Guarantee", desc: "All pets come with vaccination records and health certification." },
              { icon: Truck, title: "Pan-India Delivery", desc: "Safe and comfortable pet delivery across all major cities in India." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4"
              >
                <div className="w-12 h-12 rounded-lg bg-sidebar-accent flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-base">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pets */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl">Featured Pets</h2>
            <p className="mt-2 text-sm text-muted-foreground">Hand-picked companions looking for loving homes</p>
          </div>
          <Link
            to="/dogs"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            View All
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPets.map((pet, i) => (
            <PetCard key={pet.id} pet={pet} index={i} />
          ))}
        </div>
      </section>

      <FloatingContact />
      <Footer />
    </div>
  );
};

export default Index;
