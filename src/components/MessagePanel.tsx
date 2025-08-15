import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

export const MessagePanel = () => {
  return (
    <div className="absolute left-0 right-0 mx-auto w-2/3 bottom-10 flex items-center bg-white border border-gray-200 rounded-2xl h-14 p-2">
      <Input
        placeholder="Type a message..."
        className="flex-1 border-none focus:ring-0 focus:outline-none shadow-none"
      />
      <Separator orientation="vertical" className=""/>
      <Button variant={"ghost"} className="ml-2 p-2 hover:scale-110 shdow-md duration-200 transition-all cursor-pointer">
        <ArrowRight size={20} />
      </Button>
      <Button className="ml-2 p-2 bg-purple-500 hover:scale-110 shdow-md duration-200 transition-all hover:bg-purple-400 cursor-pointer">
        <ArrowRight size={20} />
      </Button>
    </div>
  );
};