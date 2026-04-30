export default function ImageCard({ asset }: { asset: any }) {
  return (
    <div className="group relative rounded-xl overflow-hidden bg-gray-900">
      {/* ALWAYS USE PREVIEW URL HERE */}
      <img 
        src={asset.preview_url} 
        alt={asset.title}
        className="w-full h-auto object-cover"
        onContextMenu={(e) => e.preventDefault()} // Disable right-click save
      />
      
      <div className="p-4 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold">{asset.title}</h3>
          <p className="text-amber-500 font-bold">₹{asset.price}</p>
        </div>
        <button className="bg-amber-500 text-black p-2 rounded-md font-bold text-xs">
          Add to Cart
        </button>
      </div>
    </div>
  );
}