import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import SearchPanel from "@/components/SearchPanel";
import ListingSidebar from "@/components/ListingSidebar";
import PetCard from "@/components/PetCard";
import FloatingContact from "@/components/FloatingContact";
import Footer from "@/components/Footer";
import { MOCK_PETS } from "@/lib/data";
import type { FilterState } from "@/lib/data";

interface ListingPageProps {
  petType: "dog" | "cat";
}

const ListingPage = ({ petType }: ListingPageProps) => {
  const [searchParams] = useSearchParams();
  const label = petType === "dog" ? "Dogs" : "Cats";

  const [filters, setFilters] = useState<FilterState>({
    petType,
    breed: "",
    priceRange: [0, 0],
    age: "",
    gender: "",
    state: searchParams.get("state") || "",
    city: searchParams.get("city") || "",
    purpose: "buying",
  });

  const handleFilterChange = (partial: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const filteredPets = useMemo(() => {
    return MOCK_PETS.filter((pet) => {
      if (pet.type !== petType) return false;
      if (pet.status !== "approved") return false;
      if (filters.breed && pet.breed !== filters.breed) return false;
      if (filters.gender && pet.gender !== filters.gender) return false;
      if (filters.state && pet.state !== filters.state) return false;
      if (filters.priceRange[0] && pet.price < filters.priceRange[0]) return false;
      if (filters.priceRange[1] && pet.price > filters.priceRange[1]) return false;
      return true;
    });
  }, [petType, filters]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SearchPanel />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6">
          <span className="hover:text-foreground cursor-pointer">Home</span>
          <span className="mx-2">›</span>
          <span className="text-foreground font-medium">{label} for Sale</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          <ListingSidebar filters={filters} onFilterChange={handleFilterChange} />

          <main className="flex-1">
            <div className="mb-6">
              <h1 className="font-display text-3xl">{label} For Sale</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Showing {filteredPets.length} verified {label.toLowerCase()} available across India
              </p>
            </div>

            {filteredPets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPets.map((pet, i) => (
                  <PetCard key={pet.id} pet={pet} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-lg text-muted-foreground">No {label.toLowerCase()} found matching your criteria.</p>
                <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      <FloatingContact />
      <Footer />
    </div>
  );
};

export default ListingPage;
