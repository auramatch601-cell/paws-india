import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { INDIAN_STATES } from "@/lib/data";

const SearchPanel = () => {
  const navigate = useNavigate();
  const [petType, setPetType] = useState("dog");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (state && state !== "All States") params.set("state", state);
    if (city) params.set("city", city);
    navigate(`/${petType}s?${params.toString()}`);
  };

  return (
    <div className="bg-intention shadow-intention">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            value={petType}
            onChange={(e) => setPetType(e.target.value)}
            className="flex-1 sm:flex-none sm:w-40 h-11 rounded-lg border border-border bg-card px-4 text-sm text-foreground font-body shadow-card focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="dog">Dogs</option>
            <option value="cat">Cats</option>
          </select>

          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="flex-1 sm:flex-none sm:w-48 h-11 rounded-lg border border-border bg-card px-4 text-sm text-foreground font-body shadow-card focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Enter City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 h-11 rounded-lg border border-border bg-card px-4 text-sm text-foreground font-body shadow-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          <button
            onClick={handleSearch}
            className="h-11 px-8 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
