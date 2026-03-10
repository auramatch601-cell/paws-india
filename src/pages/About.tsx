import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShieldCheck, Heart, Truck, Users } from "lucide-react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl sm:text-5xl">About PawTrust</h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            PawTrust is India's most trusted pet marketplace, built with a single mission: to connect loving families with healthy, verified pets from responsible breeders across the country.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            We personally verify every breeder and pet listing to ensure the highest standards of animal welfare and customer trust. Our platform eliminates the uncertainty of buying a pet online by acting as the trusted intermediary between breeders and pet parents.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {[
            { icon: ShieldCheck, title: "Verified Breeders", desc: "Rigorous vetting process for all breeders" },
            { icon: Heart, title: "Health First", desc: "Vaccination records and health guarantees" },
            { icon: Truck, title: "Safe Delivery", desc: "Professional pet transport across India" },
            { icon: Users, title: "24/7 Support", desc: "Dedicated support for buyers and sellers" },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-lg border border-border p-6 shadow-card"
            >
              <div className="w-10 h-10 rounded-lg bg-sidebar-accent flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-base">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
