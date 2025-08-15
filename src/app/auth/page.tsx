import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// THIS IS THE AUTH PAGE - /auth route
export default function Page() {
  return (
    <div className="h-screen w-screen p-4 flex items-center justify-center">
        <Link href={'/'}>
            <Button variant={'ghost'} className="absolute left-4 top-4"><ArrowLeft/></Button>
        </Link>

        <h1 className="font-bold text-2xl">Auth page placeholder</h1>

    </div>
  );
}