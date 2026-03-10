import { Link, useLocation } from "react-router-dom";
import { Plus, ShoppingBag, Heart, Shuffle } from "lucide-react";
import { DOG_BREEDS, CAT_BREEDS, INDIAN_STATES } from "@/lib/data";
import type { FilterState } from "@/lib/data";

interface ListingSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
}

const ListingSidebar = ({ filters, onFilterChange }: ListingSidebarProps) => {
  const location = useLocation();
  const isDogs = location.pathname.includes("/dogs");
  const breeds = isDogs ? DOG_BREEDS : CAT_BREEDS;

  return (
    <aside className="w-full lg:w-[280px] lg:shrink-0">
      <div className="bg-card rounded-lg border border-border p-5 shadow-card space-y-6">
        {/* Quick Links */}
        <div className="space-y-1">
          <Link
            to="/seller/register"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-primary hover:bg-sidebar-accent transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Pet
          </Link>
          <Link
            to={isDogs ? "/dogs" : "/cats"}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            For Sale
          </Link>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors w-full text-left">
            <Heart className="w-4 h-4" />
            For Adoption
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors w-full text-left">
            <Shuffle className="w-4 h-4" />
            For Mating
          </button>
        </div>

        <div className="h-px bg-border" />

        {/* Filter Section */}
        <div>
          <h3 className="font-display text-lg mb-4">Filter</h3>

          {/* Purpose */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">I'm Looking</p>
            <div className="flex gap-2">
              <button
                onClick={() => onFilterChange({ purpose: "buying" })}
                className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors ${
                  filters.purpose === "buying"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                For Buying
              </button>
              <button
                onClick={() => onFilterChange({ purpose: "adoption" })}
                className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors ${
                  filters.purpose === "adoption"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                For Adoption
              </button>
            </div>
          </div>

          {/* Breed */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Breed</label>
            <select
              value={filters.breed}
              onChange={(e) => onFilterChange({ breed: e.target.value })}
              className="w-full h-9 rounded-md border border-border bg-card px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {breeds.map((b) => (
                <option key={b} value={b === "All Breeds" ? "" : b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Price Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceRange[0] || ""}
                onChange={(e) => onFilterChange({ priceRange: [Number(e.target.value), filters.priceRange[1]] })}
                className="w-full h-9 rounded-md border border-border bg-card px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.priceRange[1] || ""}
                onChange={(e) => onFilterChange({ priceRange: [filters.priceRange[0], Number(e.target.value)] })}
                className="w-full h-9 rounded-md border border-border bg-card px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Age */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Age</label>
            <select
              value={filters.age}
              onChange={(e) => onFilterChange({ age: e.target.value })}
              className="w-full h-9 rounded-md border border-border bg-card px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Any Age</option>
              <option value="0-3">0-3 months</option>
              <option value="3-6">3-6 months</option>
              <option value="6-12">6-12 months</option>
              <option value="12+">1+ year</option>
            </select>
          </div>

          {/* Gender */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Gender</label>
            <select
              value={filters.gender}
              onChange={(e) => onFilterChange({ gender: e.target.value })}
              className="w-full h-9 rounded-md border border-border bg-card px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Any</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Location</label>
            <select
              value={filters.state}
              onChange={(e) => onFilterChange({ state: e.target.value })}
              className="w-full h-9 rounded-md border border-border bg-card px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s === "All States" ? "" : s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ListingSidebar;
