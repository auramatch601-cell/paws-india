import { useParams, Link } from "react-router-dom";
import { MapPin, Calendar, Syringe, ShieldCheck, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import FloatingContact from "@/components/FloatingContact";
import Footer from "@/components/Footer";
import { MOCK_PETS } from "@/lib/data";

const PetDetails = () => {
  const { id } = useParams();
  const pet = MOCK_PETS.find((p) => p.id === id);

  if (!pet) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-[1400px] mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-3xl">Pet Not Found</h1>
          <Link to="/" className="mt-4 inline-flex items-center gap-2 text-primary hover:underline text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  const bgColor = pet.type === "dog" ? "from-amber-100 to-orange-50" : "from-blue-100 to-indigo-50";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">›</span>
          <Link to={`/${pet.type}s`} className="hover:text-foreground">{pet.type === "dog" ? "Dogs" : "Cats"}</Link>
          <span className="mx-2">›</span>
          <span className="text-foreground font-medium">{pet.breed}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image */}
          <div className={`aspect-square rounded-xl bg-gradient-to-br ${bgColor} flex items-center justify-center`}>
            <div className="text-9xl">{pet.type === "dog" ? "🐕" : "🐈"}</div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-4xl">{pet.breed}</h1>
              <p className="text-muted-foreground mt-2">{pet.name} · {pet.gender}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-badge text-badge-foreground text-xs font-semibold rounded-md">{pet.quality}</span>
              {pet.verified && (
                <span className="flex items-center gap-1 px-3 py-1.5 bg-badge text-badge-foreground text-xs font-semibold rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Breeder
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: MapPin, label: "Location", value: pet.location },
                { icon: Calendar, label: "Age", value: pet.age },
                { icon: Syringe, label: "Vaccination", value: pet.vaccination },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 bg-card rounded-lg border border-border p-4">
                  <item.icon className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{pet.description}</p>

            <div className="bg-card rounded-lg border border-border p-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="font-display text-3xl text-foreground">{formatPrice(pet.price)}</p>
              </div>
              <button className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
                Enquire Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <FloatingContact />
      <Footer />
    </div>
  );
};

export default PetDetails;
