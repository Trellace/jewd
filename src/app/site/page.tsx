
// THIS IS THE HOME/MAP PAGE - route is /site
import MapComponent from "@/components/MapComponent";
import BrowsingCarousel from "@/components/BrowsingCarousel";

export default function Page() {
  return (
    <div className="bg-main h-screen w-screen overflow-hidden">
      {/* Map Background */}
       
      <div className="absolute inset-0">
        <MapComponent />
      </div>

      {/* Search Bar + Filters Top Right */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-4">
        <BrowsingCarousel />
      </div>

      {/* Property Scroll On Bottom Of Screen */}
      <div>
        
      </div>

    </div>
  );
}