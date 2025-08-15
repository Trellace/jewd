"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function Page() {
    const [formData, setFormData] = useState({
        location: "",
        budget: "",
        bedrooms: "",
        bathrooms: "",
        carSpaces: "",
        description: "",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
 
    const FetchGPT = async () => {
        const userPrompt = `
            find houses for sale in the region of ${formData.location}, Australia that fit the conditions set below.

            Each property should have ${formData.bedrooms} bedrooms, ${formData.bathrooms} bathrooms and ${formData.carSpaces} car spaces and be within 5% of ${formData.budget}. The client has this as a description of their wants and needs: ${formData.description}.
        `;
        
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [
                        { role: "user", content: userPrompt }
                    ]
                }),
            });
            
            
            if (!res.ok) {
                throw new Error(`Request failed: ${res.status}`);
            }
            
            const data = await res.json();
            console.log(data);
            setMessage(JSON.stringify(data.output, null, 2));
        } catch (err) {
            console.error(err);
            setMessage("Error fetching GPT response.");
        }
    };

    const Field = ({
        label,
        name,
        type = "text",
        placeholder,
        isTextArea = false,
    }: {
        label: string;
        name: string;
        type?: string;
        placeholder: string;
        isTextArea?: boolean;
    }) => (
        <div className="flex flex-col gap-1">
            <Label htmlFor={name} className="text-gray-800">{label}</Label>
            {isTextArea ? (
                <Textarea
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    value={(formData as any)[name]}
                    onChange={handleChange}
                    className="bg-white border border-gray-200 focus-visible:ring-2 focus-visible:ring-purple-300"
                />
            ) : (
                <Input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={(formData as any)[name]}
                    onChange={handleChange}
                    className="bg-white border border-gray-200 focus-visible:ring-2 focus-visible:ring-purple-300"
                />
            )}
        </div>
    );

    return (
        <div className="bg-main h-screen w-screen overflow-auto flex items-center justify-center p-6">
            <Card className="w-full max-w-2xl shadow-lg rounded-2xl">
                <CardContent className="p-6 flex flex-col gap-4">
                    <h2 className="text-xl font-semibold text-gray-900 text-center">Property Search</h2>

                    <Field label="Location (Suburb or Postcode)" name="location" placeholder="e.g., Sydney NSW 2000" />
                    <Field label="Budget ($)" name="budget" type="number" placeholder="e.g., 750000" />
                    <div className="grid grid-cols-3 gap-4">
                        <Field label="Bedrooms" name="bedrooms" type="number" placeholder="e.g., 3" />
                        <Field label="Bathrooms" name="bathrooms" type="number" placeholder="e.g., 2" />
                        <Field label="Car Spaces" name="carSpaces" type="number" placeholder="e.g., 1" />
                    </div>
                    <Field
                        label="Description of Wants/Needs"
                        name="description"
                        placeholder="Describe what you want in the property..."
                        isTextArea
                    />

                    <Button onClick={FetchGPT} className="bg-purple-500 cursor-pointer hover:bg-purple-600 mt-2">
                        Send to GPT
                    </Button>

                    <pre className="text-sm border border-gray-200 rounded-md p-3 h-40 overflow-auto whitespace-pre-wrap">
                        {message}
                    </pre>
                </CardContent>
            </Card>
        </div>
    );
}