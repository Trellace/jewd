
// THIS IS THE HOME/MAP PAGE - route is /site
import MapComponent from "@/components/MapComponent";
import BrowsingCarousel from "@/components/BrowsingCarousel";

export default function Page() {
  return (
    <div className="bg-main flex flex-col justify-end items-center h-screen w-screen overflow-hidden">
      {/* Map Background */}
       
      <div className="absolute inset-0">
        <MapComponent />
      </div>

      {/* Search Bar + Filters Top Right */}
      <div className="">
        <BrowsingCarousel/>
      </div>

      {/* Property Scroll On Bottom Of Screen */}
      <div>
        
      </div>

    </div>
  );
}