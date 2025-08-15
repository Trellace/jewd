"use client";

import MapComponent from "@/components/MapComponent";
import { SearchPanel } from "@/components/search-panel";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

// THIS IS THE LANDING PAGE - default route
export default function Home() {
  return (
    <div className="bg-main h-screen w-screen">
        <div className="absolute top-0 w-full p-3 flex flex-row justify-between">
            <h1 className="text-3xl font-semibold text-">Site Name</h1>
            <Link href={'/auth'}>
              <Button>Sign In</Button>
            </Link>
        </div>

        {/* <div className="w-screen h-screen">
          <SearchPanel/>
        </div> */}
    </div>
  );
}
