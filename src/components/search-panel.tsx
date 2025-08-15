// src/components/SearchPanel.tsx
"use client";

import { useState } from "react";
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
type GrowthPref = "stable" | "balanced" | "high";

export const SearchPanel = () => {
  const [formData, setFormData] = useState({
    location: "",
    budgetMin: "",
    budgetMax: "",
    beds: "",
    baths: "",
    commuteAddress: "",
    commuteMode: "car" as CommuteMode,
    growth: "balanced" as GrowthPref,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setCommuteMode = (mode: CommuteMode) =>
    setFormData((s) => ({ ...s, commuteMode: mode }));

  const setGrowth = (g: GrowthPref) =>
    setFormData((s) => ({ ...s, growth: g }));

  const handleSearch = () => {
    console.log("Searching with:", formData);
  };

  // Reusable input field with left icon
  const Field = ({
    icon: Icon,
    name,
    placeholder,
    type = "text",
  }: {
    icon: any;
    name: keyof typeof formData | string;
    placeholder: string;
    type?: string;
  }) => (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        name={name as string}
        type={type}
        placeholder={placeholder}
        value={(formData as any)[name] ?? ""}
        onChange={handleChange}
        className="pl-10 pr-3 bg-white border border-gray-200 focus-visible:ring-2 focus-visible:ring-secondary/40 transition-all"
      />
    </div>
  );

  // Simple segmented button
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
      className={`h-10 px-3 rounded-lg border text-sm transition ${
        active
          ? "bg-gray-900 text-white border-gray-900"
          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      {/* Tip: Tailwind doesn’t have `max-w-1/2`; use max-w-xl/2xl/3xl etc. */}
      <Card className="w-full max-w-3xl shadow-xl border border-gray-100 rounded-2xl backdrop-blur-sm bg-white/90">
        <CardContent className="p-6 flex flex-col gap-5">
          <h2 className="text-lg font-semibold text-center text-gray-800">
            Find Your Next Home
          </h2>

          {/* Location */}
          <div>
            <Field icon={MapPin} name="location" placeholder="Suburb or Postcode" />
          </div>

          {/* Budget */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-800">Budget</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field
                icon={DollarSign}
                name="budgetMin"
                placeholder="Min ($)"
                type="number"
              />
              <Field
                icon={DollarSign}
                name="budgetMax"
                placeholder="Max ($)"
                type="number"
              />
            </div>
          </div>

          {/* Size (under Budget) */}
          <div>
            <div className="mb-2 text-sm font-medium text-gray-800">Size</div>
            <div className="grid grid-cols-2 gap-4">
              <Field icon={BedDouble} name="beds" placeholder="Beds (e.g., 3)" type="number" />
              <Field icon={Bath} name="baths" placeholder="Baths (e.g., 2)" type="number" />
            </div>
          </div>

          {/* Commute */}
          <div>
            <div className="mb-2 text-sm font-medium text-gray-800">Commute</div>
            <div className="grid grid-cols-1 gap-3">
              <Field
                icon={MapPin}
                name="commuteAddress"
                placeholder="Work/School address"
              />
              <div className="grid grid-cols-4 gap-2">
                <Seg
                  active={formData.commuteMode === "car"}
                  onClick={() => setCommuteMode("car")}
                  title="Car"
                >
                  <Car className="w-4 h-4" />
                </Seg>
                <Seg
                  active={formData.commuteMode === "pt"}
                  onClick={() => setCommuteMode("pt")}
                  title="Public Transport"
                >
                  <TrainFront className="w-4 h-4" />
                </Seg>
                <Seg
                  active={formData.commuteMode === "bike"}
                  onClick={() => setCommuteMode("bike")}
                  title="Bike"
                >
                  <Bike className="w-4 h-4" />
                </Seg>
                <Seg
                  active={formData.commuteMode === "walk"}
                  onClick={() => setCommuteMode("walk")}
                  title="Walk"
                >
                  <Footprints className="w-4 h-4" />
                </Seg>
              </div>
            </div>
          </div>

          {/* Growth (under Commute) */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-800">
                Growth Potential
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Seg active={formData.growth === "stable"} onClick={() => setGrowth("stable")}>
                Stable
              </Seg>
              <Seg active={formData.growth === "balanced"} onClick={() => setGrowth("balanced")}>
                Balanced
              </Seg>
              <Seg active={formData.growth === "high"} onClick={() => setGrowth("high")}>
                High growth
              </Seg>
            </div>
          </div>

          {/* Action */}
          <div className="flex justify-end">
            <Button
              onClick={handleSearch}
              className="mt-1 bg-gray-900 hover:bg-gray-800 text-white rounded-lg h-11 transition-all shadow-sm hover:shadow-md"
            >
              Search
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
