import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// THIS IS THE AUTH PAGE - /auth route
export default function Page() {
  return (
    <div className="h-screen w-screen p-4">
        <Link href={'/'}>
            <Button variant={'ghost'} className="absolute left-4 top-4"><ArrowLeft/></Button>
        </Link>

    </div>
  );
}