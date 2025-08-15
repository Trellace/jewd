"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Ruler, DollarSign, BedDouble, Bath } from "lucide-react";

export const SearchPanel = () => {
    const [formData, setFormData] = useState({
        location: "",
        plotSize: "",
        borrowCapacity: "",
        beds: "",
        baths: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSearch = () => {
        console.log("Searching with:", formData);
    };

    const Field = ({
        icon: Icon,
        name,
        placeholder,
        type = "text"
    }: {
        icon: any;
        name: string;
        placeholder: string;
        type?: string;
    }) => (
        <div className="relative">
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
                name={name}
                type={type}
                placeholder={placeholder}
                value={(formData as any)[name]}
                onChange={handleChange}
                className="pl-10 pr-3 bg-white border border-gray-200 focus-visible:ring-2 focus-visible:ring-secondary/40 transition-all"
            />
        </div>
    );

    return (
        <div className="absolute inset-0 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg shadow-xl border border-gray-100 rounded-2xl backdrop-blur-sm bg-white/90">
                <CardContent className="p-6 flex flex-col gap-4">
                    <h2 className="text-lg font-semibold text-center text-gray-800">
                        Find Your Next Home
                    </h2>
                    <Field icon={MapPin} name="location" placeholder="Suburb or Postcode" />
                    <Field icon={Ruler} name="plotSize" placeholder="Plot Size (m²)" />
                    <Field icon={DollarSign} name="borrowCapacity" placeholder="Max Borrow Capacity ($)" type="number" />
                    <div className="grid grid-cols-2 gap-4">
                        <Field icon={BedDouble} name="beds" placeholder="0" type="number" />
                        <Field icon={Bath} name="baths" placeholder="0" type="number" />
                    </div>
                    <Button
                        onClick={handleSearch}
                        className="mt-2 bg-secondary hover:bg-secondary/90 text-white rounded-lg h-11 transition-all shadow-sm hover:shadow-md"
                    >
                        Search
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};