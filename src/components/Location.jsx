import React from "react";
import { MdCall } from "react-icons/md";
import BlueLocationIcon from "@/assets/commanImages/Blue.png";
import PinkLocationIcon from "@/assets/commanImages/Pink.png";
import YellowLocationIcon from "@/assets/commanImages/Yellow.png";
import OrangeLocationIcon from "@/assets/commanImages/Orange.png";
import GreenLocationIcon from "@/assets/commanImages/Green.png";
import PurpleLocationIcon from "@/assets/commanImages/Purple.png";
import { MapPin } from "lucide-react";
/* ===================== Locations Data ===================== */
// const locations = [
//   {
//     city: "Nerul,",
//     maincity: "Navi Mumbai",
//     iconColor: "text-purple-600",
//     titleColor: "text-purple-900",
//     icon: PurpleLocationIcon,
//     bg: "from-purple-50 to-pink-50",
//     description:
//       "Complete coverage across Delhi, Noida, Gurgaon, Ghaziabad, and Faridabad",
//     areas: ["Delhi", "Noida", "Gurgaon", "Ghaziabad"],
//   },
//   {
//     city: "CBD Belapur,",
//     maincity: "Navi Mumbai",
//     iconColor: "text-blue-600",
//     titleColor: "text-blue-900",
//     bg: "from-blue-50 to-purple-50",
//     description: "Serving Mumbai, Navi Mumbai, and Thane regions",
//     areas: ["Mumbai City", "Navi Mumbai", "Thane", "Kalyan"],
//   },
//   {
//     city: "Vashi,",
//     maincity: "Navi Mumbai",
//     iconColor: "text-green-600",
//     titleColor: "text-green-900",
//     bg: "from-green-50 to-blue-50",
//     description: "Full service availability across Bangalore city",
//     areas: ["Central Bangalore", "Whitefield", "Electronic City", "Hebbal"],
//   },
//   {
//     city: "Sanpada,",
//     maincity: "Navi Mumbai",
//     iconColor: "text-orange-600",
//     titleColor: "text-orange-900",
//     bg: "from-orange-50 to-red-50",
//     description: "Comprehensive services in Pune and Pimpri-Chinchwad",
//     areas: ["Pune City", "Hinjewadi", "Wakad", "Baner"],
//   },
//   {
//     city: "Kharghar,",
//     maincity: "Navi Mumbai",
//     iconColor: "text-pink-600",
//     titleColor: "text-pink-900",
//     bg: "from-pink-50 to-purple-50",
//     description: "Quality services across Hyderabad and Secunderabad",
//     areas: ["Hyderabad", "Secunderabad", "Gachibowli", "Madhapur"],
//   },
//   {
//     city: "Ghansoli,",
//     maincity: "Navi Mumbai",
//     iconColor: "text-yellow-600",
//     titleColor: "text-yellow-900",
//     bg: "from-yellow-50 to-orange-50",
//     description: "Reliable services throughout Chennai metropolitan area",
//     areas: ["Chennai City", "OMR", "Anna Nagar", "Velachery"],
//   },
//   {
//     city: "Koparkhairane,",
//     maincity: "Navi Mumbai",
//     iconColor: "text-purple-600",
//     titleColor: "text-yellow-900",
//     bg: "from-purple-50 to-pink-50",
//     description: "Reliable services throughout Chennai metropolitan area",
//     areas: ["Chennai City", "OMR", "Anna Nagar", "Velachery"],
//   },
//   {
//     city: "Kamothe,",
//     maincity: "Navi Mumbai",
//     iconColor: "text-blue-600",
//     titleColor: "text-yellow-900",
//     bg: "from-blue-50 to-purple-50",
//     description: "Reliable services throughout Chennai metropolitan area",
//     areas: ["Chennai City", "OMR", "Anna Nagar", "Velachery"],
//   },
//   {
//     city: "Panvel,",
//     maincity: "Navi Mumbai",
//     iconColor: "text-green-600",
//     titleColor: "text-yellow-900",
//     bg: "from-green-50 to-blue-50",
//     description: "Reliable services throughout Chennai metropolitan area",
//     areas: ["Chennai City", "OMR", "Anna Nagar", "Velachery"],
//   },
//   {
//     city: "Airoli,",
//     maincity: "Navi Mumbai",
//     iconColor: "text-orange-600",
//     titleColor: "text-yellow-900",
//     bg: "from-orange-50 to-red-50",
//     description: "Reliable services throughout Chennai metropolitan area",
//     areas: ["Chennai City", "OMR", "Anna Nagar", "Velachery"],
//   },
// ];

const locations = [
  {
    city: "Nerul,",
    maincity: "Navi Mumbai",
    icon: PinkLocationIcon,

    bg: "from-pink-200 to-pink-50",
  },
  {
    city: "Seawoods,",
    maincity: "Navi Mumbai",
    icon: YellowLocationIcon,
    bg: "from-yellow-200 to-yellow-50",
  },
  {
    city: "CBD Belapur,",
    maincity: "Navi Mumbai",
    icon: BlueLocationIcon,
    bg: "from-blue-200 to-blue-50",
  },
  {
    city: "Vashi,",
    maincity: "Navi Mumbai",
    icon: GreenLocationIcon,
    bg: "from-green-200 to-green-50",
  },
  {
    city: "Sanpada,",
    maincity: "Navi Mumbai",
    icon: OrangeLocationIcon,
    bg: "from-orange-200 to-orange-50",
  },
  {
    city: "Kharghar,",
    maincity: "Navi Mumbai",
    icon: PurpleLocationIcon,
    bg: "from-purple-200 to-purple-50",
  },
  {
    city: "Kopar Khairne",
    maincity: "Navi Mumbai",
    icon: PinkLocationIcon,

    bg: "from-pink-200 to-pink-50",
  },
  {
    city: "Ghansoli,",
    maincity: "Navi Mumbai",
    icon: YellowLocationIcon,
    bg: "from-yellow-200 to-yellow-50",
  },
];
const Locations = () => {
  return (
    <section id="location" className=" py-20 px-4 scroll-mt-12">
      <div className="mx-auto max-w-7xl">
        {/* ================= Section Heading ================= */}
        <h2 className="mb-4 lg:mb-8 text-center text-4xl md:text-5xl font-bold ">
          <span className=" text-black">Service Locations</span>
        </h2>

        {/* <p className="mb-16 text-center text-base md:text-xl text-gray-600">
          We operate across major cities in India
        </p> */}

        {/* ================= Locations Grid ================= */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:pt-12">
          {locations.map((loc) => (
            <div
              key={loc.city}
              className={`rounded-3xl bg-gradient-to-br ${loc.bg} p-8 transition hover:-translate-y-1 hover:shadow-2xl`}
            >
              {/* <i
                className={`fas fa-city mb-4 text-4xl md:text-5xl ${loc.iconColor}`}
              ></i> */}
              <div className="flex flex-col items-center  justify-center ">
                <img
                  src={loc.icon}
                  alt={loc.city}
                  className="h-12 w-12 object-contain"
                />
              </div>

              <h3 className={` text-xl mt-2 md:text-2xl font-bold `}>
                {loc.city}
              </h3>
              <p className={`mb-3 text-xl md:text-xl  font-semibold`}>
                {loc.maincity}
              </p>
              {/* 
              <p className="mb-4 text-gray-700">{loc.description}</p> */}
              {/* 
              <ul className="space-y-2 text-gray-600">
                {loc.areas.map((area) => (
                  <li key={area} className="flex items-center">
                    <i className="fas fa-check mr-2 text-black"></i>
                    {area}
                  </li>
                ))}
              </ul> */}
            </div>
          ))}
        </div>

        {/* ================= CTA ================= */}
        <div className="mt-12 text-center">
          <p className="mb-4 text-base md:text-lg text-gray-600">
            Don&apos;t see your city? We&apos;re expanding rapidly!
          </p>

          <a
            href="#contact"
            className="inline-block rounded-full bg-black px-8 py-4 text-lg font-semibold text-white transition hover:bg-purple-700"
          >
            Request Service in Your City
          </a>
        </div>
      </div>
    </section>
  );
};

export default Locations;

// import React from "react";

// /* ===================== Locations Data ===================== */
// const locations = [
//   {
//     city: "Delhi NCR",
//     iconColor: "text-purple-600",
//     titleColor: "text-purple-900",
//     bg: "from-purple-50 to-pink-50",
//     description:
//       "Complete coverage across Delhi, Noida, Gurgaon, Ghaziabad, and Faridabad",
//     areas: ["Delhi", "Noida", "Gurgaon", "Ghaziabad"],
//   },
//   {
//     city: "Mumbai",
//     iconColor: "text-blue-600",
//     titleColor: "text-blue-900",
//     bg: "from-blue-50 to-purple-50",
//     description: "Serving Mumbai, Navi Mumbai, and Thane regions",
//     areas: ["Mumbai City", "Navi Mumbai", "Thane", "Kalyan"],
//   },
//   {
//     city: "Bangalore",
//     iconColor: "text-green-600",
//     titleColor: "text-green-900",
//     bg: "from-green-50 to-blue-50",
//     description: "Full service availability across Bangalore city",
//     areas: ["Central Bangalore", "Whitefield", "Electronic City", "Hebbal"],
//   },
//   {
//     city: "Pune",
//     iconColor: "text-orange-600",
//     titleColor: "text-orange-900",
//     bg: "from-orange-50 to-red-50",
//     description: "Comprehensive services in Pune and Pimpri-Chinchwad",
//     areas: ["Pune City", "Hinjewadi", "Wakad", "Baner"],
//   },
//   {
//     city: "Hyderabad",
//     iconColor: "text-pink-600",
//     titleColor: "text-pink-900",
//     bg: "from-pink-50 to-purple-50",
//     description: "Quality services across Hyderabad and Secunderabad",
//     areas: ["Hyderabad", "Secunderabad", "Gachibowli", "Madhapur"],
//   },
//   {
//     city: "Chennai",
//     iconColor: "text-yellow-600",
//     titleColor: "text-yellow-900",
//     bg: "from-yellow-50 to-orange-50",
//     description: "Reliable services throughout Chennai metropolitan area",
//     areas: ["Chennai City", "OMR", "Anna Nagar", "Velachery"],
//   },
// ];

// const Locations = () => {
//   return (
//     <section id="location" className="bg-white py-20 px-4">
//       <div className="mx-auto max-w-7xl">
//         {/* ================= Section Heading ================= */}
//         <h2 className="mb-4 text-center text-4xl md:text-5xl font-bold">
//           <span className=" text-black">Service Locations</span>
//         </h2>

//         <p className="mb-16 text-center text-base md:text-xl text-gray-600">
//           We operate across major cities in India
//         </p>

//         {/* ================= Locations Grid ================= */}
//         <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
//           {locations.map((loc) => (
//             <div
//               key={loc.city}
//               className={`rounded-3xl bg-gradient-to-br ${loc.bg} p-8 transition hover:-translate-y-1 hover:shadow-2xl`}
//             >
//               <i
//                 className={`fas fa-city mb-4 text-4xl md:text-5xl ${loc.iconColor}`}
//               ></i>

//               <h3
//                 className={`mb-3 text-xl md:text-2xl font-bold ${loc.titleColor}`}
//               >
//                 {loc.city}
//               </h3>

//               <p className="mb-4 text-gray-700">{loc.description}</p>

//               <ul className="space-y-2 text-gray-600">
//                 {loc.areas.map((area) => (
//                   <li key={area} className="flex items-center">
//                     <i className="fas fa-check mr-2 text-green-600"></i>
//                     {area}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>

//         {/* ================= CTA ================= */}
//         <div className="mt-12 text-center">
//           <p className="mb-4 text-base md:text-lg text-gray-600">
//             Don&apos;t see your city? We&apos;re expanding rapidly!
//           </p>

//           <a
//             href="#contact"
//             className="inline-block rounded-full bg-purple-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-purple-700"
//           >
//             Request Service in Your City
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Locations;
