import Link from "next/link";


const StayCard = ({ property }) => {
  return (
    <div className="border rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow">
      <img
        src={property.image_url}
        alt={property.title}
        className="w-full h-40 object-cover rounded-md"
        loading="lazy"
      />
      <div className="mt-2">
        <h3 className="text-base font-bold truncate">{property.title}</h3>
        <p className="text-sm"><span className="font-bold">City:</span> {property.city}</p>
        <p className="text-sm "><span className="font-bold">Room Type:</span> {property.room_type.split(' ')[0]}</p>
        <p className="text-lg font-semibold text-primary">${property.price_per_night}/night</p>
        <Link href={`/stays/${property._id}`}>
          <button className="mt-2 w-full hover:scale-103 bg-primary text-white text-sm py-1.5 rounded-md duration-200 transition-all">
            Details
          </button>
        </Link>
      </div>
    </div>

  );
};

export default StayCard;