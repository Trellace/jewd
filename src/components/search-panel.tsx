// src/components/SearchPanel.tsx
"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  DollarSign,
  BedDouble,
  Bath,
  Car,
  TrainFront,
  Bike,
  Footprints,
  TrendingUp,
} from "lucide-react";

type CommuteMode = "car" | "pt" | "bike" | "walk";

export const SearchPanel = () => {
  // ---- STATE ----
  const [location, setLocation] = useState("");
  const [maxBudget, setMaxBudget] = useState(1_000_000); // 0..2,000,000 (AU$)
  const [beds, setBeds] = useState(3);
  const [baths, setBaths] = useState(2);
  const [carspaces, setCarspaces] = useState(1);
  const [commuteMode, setCommuteMode] = useState<CommuteMode>("car");
  const [growth, setGrowth] = useState(40); // 0..100
  const [notes, setNotes] = useState("");

  // ---- CONFIG ----
  const BUDGET_MIN = 0;
  const BUDGET_MAX = 2_000_000;
  const BUDGET_STEP = 10_000;

  // ---- HELPERS ----
  const fmtAUD = (n: number) =>
    new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      maximumFractionDigits: 0,
    }).format(n);

  // simple hint for demo
  const avgMatchScore = useMemo(() => {
    const normalized = Math.max(0, Math.min(1, (maxBudget - 300_000) / 1_700_000));
    const base = 55 + 35 * (1 - Math.abs(0.65 - normalized)); // peak in the middle
    const commuteAdj = { car: 2, pt: 3, bike: 1, walk: 1 }[commuteMode];
    const growthAdj = ((growth - 50) / 50) * 4; // -4..+4
    return Math.round(Math.max(40, Math.min(98, base + commuteAdj + growthAdj)));
  }, [maxBudget, commuteMode, growth]);

  const Seg = ({
    active,
    onClick,
    children,
    title,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
    title?: string;
  }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`h-8 px-2 rounded-md border text-xs transition ${
        active
          ? "bg-gray-900 text-white border-gray-900"
          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );

  const Counter = ({
    label,
    value,
    setValue,
    Icon,
    min = 0,
  }: {
    label: string;
    value: number;
    setValue: (n: number) => void;
    Icon: React.ComponentType<any>;
    min?: number;
  }) => (
    <div className="flex items-center justify-between gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5">
      <div className="flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-gray-500" />
        <span className="text-xs text-gray-700">{label}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          className="h-7 w-7 p-0"
          onClick={() => setValue(Math.max(min, value - 1))}
        >
          –
        </Button>
        <span className="w-6 text-center text-sm font-medium">{value}</span>
        <Button
          type="button"
          variant="outline"
          className="h-7 w-7 p-0"
          onClick={() => setValue(value + 1)}
        >
          +
        </Button>
      </div>
    </div>
  );

  const handleSearch = () => {
    const payload = {
      location,
      budget: { max: maxBudget },
      size: { beds, baths, carspaces },
      commuteMode,
      growth,
      notes,
    };
    console.log("Searching with:", payload);
  };

  return (
    <div className="w-full flex items-center justify-center p-3">
      <Card className="w-full max-w-2xl shadow-lg border border-gray-100 rounded-xl bg-white/90">
        <CardContent className="p-4 flex flex-col gap-4">
          <h2 className="text-base font-semibold text-center text-gray-800">
            Find Your Next Home
          </h2>

          {/* Location */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              placeholder="Suburb or Postcode"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-9 text-sm pl-10 pr-3 bg-white border border-gray-200 focus-visible:ring-2 focus-visible:ring-gray-900/10"
            />
          </div>

          {/* Budget: single max slider */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-800">Max Budget</span>
              </div>
              <span className="text-[11px] text-gray-600">
                Avg match: <span className="font-semibold">{avgMatchScore}</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-700">
              <span>{fmtAUD(BUDGET_MIN)}</span>
              <span className="font-semibold">{fmtAUD(maxBudget)}</span>
              <span>{fmtAUD(BUDGET_MAX)}</span>
            </div>

            <input
              type="range"
              min={BUDGET_MIN}
              max={BUDGET_MAX}
              step={BUDGET_STEP}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="mt-2 w-full accent-gray-900"
              aria-label="Max budget"
            />
          </div>

          {/* Size */}
          <div>
            <div className="mb-1 text-sm font-medium text-gray-800">Size</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Counter label="Bedrooms" value={beds} setValue={setBeds} Icon={BedDouble} min={0} />
              <Counter label="Bathrooms" value={baths} setValue={setBaths} Icon={Bath} min={0} />
              <Counter label="Car spaces" value={carspaces} setValue={setCarspaces} Icon={Car} min={0} />
            </div>
          </div>

          {/* Commute */}
          <div>
            <div className="mb-1 text-sm font-medium text-gray-800">Commute</div>
            <div className="grid grid-cols-4 gap-1.5">
              <Seg active={commuteMode === "car"} onClick={() => setCommuteMode("car")} title="Car">
                <Car className="w-4 h-4" />
              </Seg>
              <Seg active={commuteMode === "pt"} onClick={() => setCommuteMode("pt")} title="Train / PT">
                <TrainFront className="w-4 h-4" />
              </Seg>
              <Seg active={commuteMode === "bike"} onClick={() => setCommuteMode("bike")} title="Bike">
                <Bike className="w-4 h-4" />
              </Seg>
              <Seg active={commuteMode === "walk"} onClick={() => setCommuteMode("walk")} title="Walk">
                <Footprints className="w-4 h-4" />
              </Seg>
            </div>
          </div>

          {/* Growth slider */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-800">Growth Potential</span>
              </div>
              <span className="text-[11px] text-gray-600">
                {growth <= 25 ? "Stable" : growth <= 60 ? "Balanced" : "High growth"}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={growth}
              onChange={(e) => setGrowth(Number(e.target.value))}
              className="w-full accent-gray-900"
              aria-label="Growth potential"
            />
            <div className="mt-1 flex items-center justify-between text-[10px] text-gray-600">
              <span>Stable</span>
              <span>High growth</span>
            </div>
          </div>

          {/* Wants & Needs */}
          <div>
            <div className="mb-1 text-sm font-medium text-gray-800">Wants & Needs</div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="e.g., North-facing living room, near tram line, pet-friendly, big backyard..."
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-gray-900/10"
            />
          </div>

          {/* Action */}
          <div className="flex justify-end">
            <Button
              onClick={handleSearch}
              className="h-9 text-sm bg-gray-900 hover:bg-gray-800 text-white rounded-md transition-all shadow-sm hover:shadow"
            >
              Search
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
