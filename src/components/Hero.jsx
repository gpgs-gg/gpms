// import deepImg from "@/assets/heroSectionImages/DeepCleaning.png";

// import plumbingImg from "@/assets/heroSectionImages/Plumbing.png";
// import electricalImg from "@/assets/heroSectionImages/ElectricalRepairs.png";
// import moversImg from "@/assets/heroSectionImages/Movers&Packers-1.png";
// import carMaintenanceImg from "@/assets/heroSectionImages/CarMaintenance.png";
// import carPentaryImg from "@/assets/heroSectionImages/Carpentry.png";
// import civilWorkImg from "@/assets/heroSectionImages/CivilWork&BrickWork.png";
// import societyManageImg from "@/assets/heroSectionImages/SocietyManagement.png";

// import tileworkImg from "@/assets/heroSectionImages/TileWork.png";
// import paintingImg from "@/assets/heroSectionImages/Painting.png";
// import wanterTankImg from "@/assets/heroSectionImages/WaterTankServices.png";
// import bhangarImg from "@/assets/heroSectionImages/Bhangarwala.png";
// import buildingImg from "@/assets/heroSectionImages/buildingmaintanance.png";
// import PropertyRenovationImg from "@/assets/heroSectionImages/PropertyRenovation.png";
// import WaterProofingImg from "@/assets/heroSectionImages/WaterProofing.png";

import h1 from "@/assets/heroSectionImages/h1.png";
import h2 from "@/assets/heroSectionImages/h2.png";
import h3 from "@/assets/heroSectionImages/h3.png";
import h4 from "@/assets/heroSectionImages/h4.png";
import h5 from "@/assets/heroSectionImages/h5.png";
import h6 from "@/assets/heroSectionImages/h6.png";
import h7 from "@/assets/heroSectionImages/h7.png";
import h8 from "@/assets/heroSectionImages/h8.png";
import h9 from "@/assets/heroSectionImages/h9.png";
import background1 from "@/assets/commanImages/1.png";

// import h1 from "@/assets/heroSectionImages/h1.jpeg";
// import h2 from "@/assets/heroSectionImages/h2.jpeg";
// import h3 from "@/assets/heroSectionImages/h3.jpeg";
// import h4 from "@/assets/heroSectionImages/h4.jpeg";
// import h5 from "@/assets/heroSectionImages/h5.jpeg";
// import h6 from "@/assets/heroSectionImages/h6.jpeg";
// import h7 from "@/assets/heroSectionImages/h7.jpeg";
// import h8 from "@/assets/heroSectionImages/h8.jpeg";
// import h9 from "@/assets/heroSectionImages/h9.jpeg";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import "./Hero.css";
// Right-side hero image (unchanged)
// import { heroImg } from "@/assets/images";
import HeroRightImage from "./HeroImageRight";

const rightImages = [h1, h2, h3, h4, h5, h6, h7];
// const rightImages = [
//   deepImg,
//   plumbingImg,
//   electricalImg,
//   moversImg,
//   carMaintenanceImg,
//   carPentaryImg,
//   civilWorkImg,
//   societyManageImg,
//   tileworkImg,
//   paintingImg,
//   wanterTankImg,
//   bhangarImg,
//   PropertyRenovationImg,
//   WaterProofingImg,
//   buildingImg,
// ];
// className="relative lg:h-screen md:h-[380px] w-full overflow-hidden bg-cover bg-center"
// style={{ backgroundImage: `url(${background1})` }}
export default function Hero() {
  return (
    <>
      <section className="relative  md:h-[500px] lg:h-[650px] w-full overflow-hidden ">
        {" "}
        <div className="relative z-10">
          <div
            className="  mx-auto max-w-7xl px-4 
        grid grid-cols-1 md:grid-cols-2 
         gap-8 lg:gap-12    
        pt-2 lg:pb-2   h-full"
          >
            {/* Left Content */}

            <section
              id="/"
              className=" md:mt-0 md:pb-8 md:pt-16 pt-4 lg:mt-2-12 px-4 sm:px-6  lg:pt-40   "
            >
              {/* Heading */}
              <h1 className=" text-black text-[26px] md:text-[28px]  lg:text-[40px] md:leading-[1.3]  lg:leading-[1.2] font-bold  md:mb-4 ">
                Transform Your Property With Our Quality Care & Services
              </h1>
              <br />
              {/* Subheading */}
              <p className="text-gray-400 text-base lg:text-[20px] leading-[1.25] sm:leading-[1.3] lg:leading-[1.5] lg:max-w-3xl sm:max-w-2xl mx-auto mb-8 italic">
                “Make Life Easier and More Comfortable with Trusted, Quality
                Services.”
              </p>

              {/* Buttons */}
              <div
                id="#services"
                className="flex whitespace-nowrap md:flex-row  gap-4 sm:gap-6"
              >
                <button className="w-full sm:w-auto px-6 md:px-2 lg:px-10 py-3 bg-black text-white lg:text-[18px] font-bold rounded-[68px] shadow-lg hover:bg-black-700 transition">
                  <a href="#services">Explore Services</a>
                </button>

                <button
                  onClick={(e) => {
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full sm:w-auto px-6 lg:px-10 py-3  text-black border-2 border-black  font-bold rounded-[68px] shadow-lg hover:bg-black-500 lg:text-[18px] transition"
                >
                  Get in Touch
                </button>
              </div>
            </section>

            {/* Right Image */}
            <div className="   ">
              <HeroRightImage rightImages={rightImages} />
            </div>

            {/* <div className="relative">
          <img
            src={heroImg}
            alt="Cleaning Team"
            className="w-full rounded-xl"
          />
        </div> */}
          </div>
        </div>
      </section>

      {/* mobile whastpp and call icon */}
      {/* Floating Buttons (Mobile Sticky) */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg z-50 py-3 px-8 md:hidden">
        <div className="flex gap-3">
          {/* Call Button */}
          <a
            href="tel:+919819636341"
            className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-xl font-semibold text-[16px]"
          >
            <FaPhoneAlt className="animate-ring" />
            Call Now
          </a>

          {/* WhatsApp Button */}
          <a
            href="https://wa.me/919819636341"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-semibold text-[16px]"
          >
            <FaWhatsapp className="animate-pulseZoom" />
            WhatsApp
          </a>
        </div>
      </div>
      {/* <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg z-50 py-3 px-8 md:hidden">
        <div className="flex gap-3">

          <a
            href="tel:+919819636341"
            className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-xl font-semibold text-[16px]"
          >
            <FaPhoneAlt />
            Call Now
          </a>

   
          <a
            href="https://wa.me/919819636341"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-semibold text-[16px]"
          >
            <FaWhatsapp />
            WhatsApp
          </a>
        </div>
      </div> */}

      {/* desktop Sticky 3D WhatsApp & Call icons */}
      <div
        className=" hidden md:flex fixed bottom-6 right-4 z-50  flex-col space-y-3 md:space-y-4"
        data-aos="fade-left"
      >
        <a
          href="https://wa.me/919819636341"
          target="_blank"
          rel="noopener noreferrer"
          className="
    flex items-center justify-center
    w-12 h-12            /* Mobile size */
    md:w-auto md:min-w-[20px] md:h-12  /* Desktop */
    bg-green-500 text-white
    rounded-full shadow-lg
    text-2xl md:text-2xl
    hover:scale-110 hover:-translate-y-1 hover:shadow-2xl
    active:shadow-md
  "
        >
          <FaWhatsapp className="text-2xl md:text-3xl" />
        </a>
        <a
          href="tel:919819636341"
          className="
    flex items-center justify-center
    w-12 h-12            /* Mobile */
    md:w-auto md:px-3 md:h-12  /* Desktop */
    bg-blue-500 text-white
    rounded-full shadow-lg
    text-2xl md:text-xl
    hover:scale-110 hover:-translate-y-1 hover:shadow-2xl
    active:scale-95 active:shadow-md
  "
        >
          <FaPhoneAlt className="text-xl md:text-2xl" />
        </a>
      </div>
    </>
  );
}

// import deepImg from "@/assets/heroSectionImages/DeepCleaning.png";

// import plumbingImg from "@/assets/heroSectionImages/Plumbing.png";
// import electricalImg from "@/assets/heroSectionImages/ElectricalRepairs.png";
// import moversImg from "@/assets/heroSectionImages/Movers&Packers-1.png";
// import carMaintenanceImg from "@/assets/heroSectionImages/CarMaintenance.png";
// import carPentaryImg from "@/assets/heroSectionImages/Carpentry.png";
// import civilWorkImg from "@/assets/heroSectionImages/CivilWork&BrickWork.png";
// import societyManageImg from "@/assets/heroSectionImages/SocietyManagement.png";

// import tileworkImg from "@/assets/heroSectionImages/TileWork.png";
// import paintingImg from "@/assets/heroSectionImages/Painting.png";
// import wanterTankImg from "@/assets/heroSectionImages/WaterTankServices.png";
// import bhangarImg from "@/assets/heroSectionImages/Bhangarwala.png";
// import buildingImg from "@/assets/heroSectionImages/buildingmaintanance.png";
// import PropertyRenovationImg from "@/assets/heroSectionImages/PropertyRenovation.png";
// import WaterProofingImg from "@/assets/heroSectionImages/WaterProofing.png";

// import h1 from "@/assets/heroSectionImages/h1.png";
// import h2 from "@/assets/heroSectionImages/h2.png";
// import h3 from "@/assets/heroSectionImages/h3.png";
// import h4 from "@/assets/heroSectionImages/h4.png";
// import h5 from "@/assets/heroSectionImages/h5.png";
// import h6 from "@/assets/heroSectionImages/h6.png";
// import h7 from "@/assets/heroSectionImages/h7.png";
// import h8 from "@/assets/heroSectionImages/h8.png";
// import h9 from "@/assets/heroSectionImages/h9.png";
// import background1 from "@/assets/commanImages/1.png";

// // import h1 from "@/assets/heroSectionImages/h1.jpeg";
// // import h2 from "@/assets/heroSectionImages/h2.jpeg";
// // import h3 from "@/assets/heroSectionImages/h3.jpeg";
// // import h4 from "@/assets/heroSectionImages/h4.jpeg";
// // import h5 from "@/assets/heroSectionImages/h5.jpeg";
// // import h6 from "@/assets/heroSectionImages/h6.jpeg";
// // import h7 from "@/assets/heroSectionImages/h7.jpeg";
// // import h8 from "@/assets/heroSectionImages/h8.jpeg";
// // import h9 from "@/assets/heroSectionImages/h9.jpeg";
// import { Link } from "react-router-dom";
// import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
// import "./Hero.css";
// // Right-side hero image (unchanged)
// import { heroImg } from "@/assets/images";
// import HeroRightImage from "./HeroImageRight";

// const rightImages = [h1, h2, h3, h4, h5, h6, h7];
// // const rightImages = [
// //   deepImg,
// //   plumbingImg,
// //   electricalImg,
// //   moversImg,
// //   carMaintenanceImg,
// //   carPentaryImg,
// //   civilWorkImg,
// //   societyManageImg,
// //   tileworkImg,
// //   paintingImg,
// //   wanterTankImg,
// //   bhangarImg,
// //   PropertyRenovationImg,
// //   WaterProofingImg,
// //   buildingImg,
// // ];

// export default function Hero() {
//   return (
//     <>
//       <section className=" relative   lg:h-screen md:h-[380px] w-full overflow-hidden ">
//         <div>
//           <div
//     className="  mx-auto max-w-7xl px-4
// grid grid-cols-1 md:grid-cols-2
//  gap-8 lg:gap-12
// py-2   h-full"
//           >
//             {/* Left Content */}

//             <section
//               id="/"
//               className=" md:mt-0 md:pb-8 md:pt-16 pt-4 lg:mt-2-12 px-4 sm:px-6  lg:pt-40   "
//             >
//               {/* Heading */}
//               <h1 className=" text-black text-[26px] md:text-[28px]  lg:text-[40px] md:leading-[1.3]  lg:leading-[1.2] font-bold  md:mb-4 ">
//                 Transform Your Property With Our Quality Care & Services
//               </h1>
//               <br />
//               {/* Subheading */}
//               <p className="text-gray-400 text-base lg:text-[20px] leading-[1.25] sm:leading-[1.3] lg:leading-[1.5] lg:max-w-3xl sm:max-w-2xl mx-auto mb-8 italic">
//                 “Make Life Easier and More Comfortable with Trusted, Quality
//                 Services.”
//               </p>

//               {/* Buttons */}
//               <div
//                 id="#services"
//                 className="flex whitespace-nowrap md:flex-row  gap-4 sm:gap-6"
//               >
//                 <button className="w-full sm:w-auto px-6 md:px-2 lg:px-10 py-3 bg-black text-white lg:text-[18px] font-bold rounded-[68px] shadow-lg hover:bg-black-700 transition">
//                   <a href="#services">Explore Services</a>
//                 </button>

//                 <button className="w-full sm:w-auto px-6 lg:px-10 py-3  text-black border-2 border-black  font-bold rounded-[68px] shadow-lg hover:bg-black-500 lg:text-[18px] transition">
//                   Get in Touch
//                 </button>
//                 {/* <button className="w-full sm:w-auto px-6 lg:px-10 py-3 bg-black text-white font-bold rounded-[68px] shadow-lg hover:bg-black-500 lg:text-[18px] transition">
//                   Get in Touch
//                 </button> */}
//                 {/* <button>
//                   <Link
//                     to="/contact"
//                     className="relative p-3 flex justify-center  items-center rounded-full  max-w-md  space-x-2 overflow-hidden group color-flow-bg"
//                   >
//                     <p className="whitespace-nowrap overflow-hidden lg:pl-10 pl-6 md:pl-8  text-ellipsis text-white capitalize text-base sm:text-md md:text-xl transition-all duration-700 group-hover:mr-6 z-10">
//                       Get in Touch
//                     </p>

//                     <span className="opacity-0 group-hover:opacity-100 text-white transition-opacity duration-300 z-10">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth="1.5"
//                         stroke="currentColor"
//                         className="w-6 h-6"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
//                         />
//                       </svg>
//                     </span>
//                   </Link>
//                 </button> */}
//               </div>
//               {/* <Link
//                 to="/contact"
//                 className="relative p-3 flex justify-center items-center rounded-full w-[100%] md:w-[80%] max-w-md mb-8 space-x-2 overflow-hidden group color-flow-bg"
//               >
//                 <p className="whitespace-nowrap overflow-hidden text-ellipsis text-white capitalize text-base sm:text-md md:text-xl transition-all duration-700 group-hover:mr-4 z-10">
//                   Book Your Stay with us today
//                 </p>

//                 <span className="opacity-0 group-hover:opacity-100 text-white transition-opacity duration-300 z-10">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth="1.5"
//                     stroke="currentColor"
//                     className="w-6 h-6"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
//                     />
//                   </svg>
//                 </span>
//               </Link> */}
//             </section>

//             {/* Right Image */}
//             <div className="   ">
//               <HeroRightImage rightImages={rightImages} />
//             </div>

//             {/* <div className="relative">
//           <img
//             src={heroImg}
//             alt="Cleaning Team"
//             className="w-full rounded-xl"
//           />
//         </div> */}
//           </div>
//         </div>
//       </section>
//       {/* Sticky 3D WhatsApp & Call icons */}
//       <div
//         className="fixed bottom-8 right-4 z-50 flex flex-col space-y-4"
//         data-aos="fade-left"
//       >
//         {/* WhatsApp Button */}
//         <a
//           href="https://wa.me/9326262292"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="w-auto min-w-[20px] h-8 lg:h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg text-white text-2xl
//      hover:scale-110 hover:-translate-y-1 hover:shadow-2xl
//      active:shadow-md animate-zoom"
//           title="Chat with us on WhatsApp"
//           aria-label="WhatsApp Chat"
//         >
//           <FaWhatsapp className="text-xl lg:text-4xl" />
//         </a>

//         {/* Call Button */}
//         <a
//           href="tel:9326262292"
//           className="w-auto min-w-[20px] px-3 h-8 lg:h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg text-white text-2xl
//      hover:scale-110 hover:-translate-y-1 hover:shadow-2xl
//     active:scale-95 active:shadow-md animate-zoom"
//           title="Call us"
//           aria-label="Call Us"
//         >
//           <FaPhoneAlt className="text-xl lg:text-2xl" />
//         </a>
//       </div>
//     </>
//   );
// }
