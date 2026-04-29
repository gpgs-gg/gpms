import h1 from "@/assets/heroSectionImages/h1.webp";
import h2 from "@/assets/heroSectionImages/h2.webp";
import h3 from "@/assets/heroSectionImages/h3.webp";
import h4 from "@/assets/heroSectionImages/h4.webp";
import h5 from "@/assets/heroSectionImages/h5.webp";
import h6 from "@/assets/heroSectionImages/h6.webp";
import h7 from "@/assets/heroSectionImages/h7.webp";

import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import "./Hero.css";

import HeroRightImage from "./HeroImageRight";

const rightImages = [h1, h2, h3, h4, h5, h6, h7];

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
            href="tel:+917738441024"
            className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-xl font-semibold text-[16px]"
          >
            <FaPhoneAlt className="animate-ring" />
            Call Now
          </a>

          {/* WhatsApp Button */}
          <a
            href="https://wa.me/917738441024"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-semibold text-[16px]"
          >
            <FaWhatsapp className="animate-pulseZoom" />
            WhatsApp
          </a>
        </div>
      </div>

      {/* desktop Sticky 3D WhatsApp & Call icons */}
      <div
        className=" hidden md:flex fixed bottom-6 right-4 z-50  flex-col space-y-3 md:space-y-4"
        data-aos="fade-left"
      >
        <a
          href="https://wa.me/917738441024"
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
          href="tel:917738441024"
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


// // import deepImg from "@/assets/heroSectionImages/DeepCleaning.png";

// // import plumbingImg from "@/assets/heroSectionImages/Plumbing.png";
// // import electricalImg from "@/assets/heroSectionImages/ElectricalRepairs.png";
// // import moversImg from "@/assets/heroSectionImages/Movers&Packers-1.png";
// // import carMaintenanceImg from "@/assets/heroSectionImages/CarMaintenance.png";
// // import carPentaryImg from "@/assets/heroSectionImages/Carpentry.png";
// // import civilWorkImg from "@/assets/heroSectionImages/CivilWork&BrickWork.png";
// // import societyManageImg from "@/assets/heroSectionImages/SocietyManagement.png";

// // import tileworkImg from "@/assets/heroSectionImages/TileWork.png";
// // import paintingImg from "@/assets/heroSectionImages/Painting.png";
// // import wanterTankImg from "@/assets/heroSectionImages/WaterTankServices.png";
// // import bhangarImg from "@/assets/heroSectionImages/Bhangarwala.png";
// // import buildingImg from "@/assets/heroSectionImages/buildingmaintanance.png";
// // import PropertyRenovationImg from "@/assets/heroSectionImages/PropertyRenovation.png";
// // import WaterProofingImg from "@/assets/heroSectionImages/WaterProofing.png";

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
// // import { heroImg } from "@/assets/images";
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
// // className="relative lg:h-screen md:h-[380px] w-full overflow-hidden bg-cover bg-center"
// // style={{ backgroundImage: `url(${background1})` }}
// export default function Hero() {
//   return (
//     <>
//       <section className="relative  md:h-[500px] lg:h-[650px] w-full overflow-hidden ">
//         {" "}
//         <div className="relative z-10">
//           <div
//             className="  mx-auto max-w-7xl px-4 
//         grid grid-cols-1 md:grid-cols-2 
//          gap-8 lg:gap-12    
//         pt-2 lg:pb-2   h-full"
//           >
//             {/* Left Content */}

//             <section
//               id="/"
//               className=" md:mt-0 md:pb-8 md:pt-16 pt-4 lg:mt-2-12 px-4 sm:px-6  lg:pt-40   "
//             >
//               {/* Heading */}
//               <h1 className=" text-black text-[26px] md:text-[28px]  lg:text-[40px] md:leading-[1.3]  lg:leading-[1.2] font-bold  md:mb-4 ">
//                Transform Your Property with Quality Care & Professional Services
//               </h1>
//               <br />
//               {/* Subheading */}
//               <p className="text-gray-400 text-base lg:text-[20px] leading-[1.25] sm:leading-[1.3] lg:leading-[1.5] lg:max-w-3xl sm:max-w-2xl mx-auto mb-8 italic">
//                Make life easier and more comfortable with trusted, high-quality services.
//               </p>

//               {/* Buttons */}
//               <div
//                 id="#services"
//                 className="flex whitespace-nowrap md:flex-row  gap-4 sm:gap-6"
//               >
//                 <button className="w-full sm:w-auto px-6 md:px-2 lg:px-10 py-3 bg-black text-white lg:text-[18px] font-bold rounded-[68px] shadow-lg hover:bg-black-700 transition">
//                   <a href="#services">Explore Services</a>
//                 </button>

//                 <button
//                   onClick={(e) => {
//                     document
//                       .getElementById("contact")
//                       ?.scrollIntoView({ behavior: "smooth" });
//                   }}
//                   className="w-full sm:w-auto px-6 lg:px-10 py-3  text-black border-2 border-black  font-bold rounded-[68px] shadow-lg hover:bg-black-500 lg:text-[18px] transition"
//                 >
//                   Get in Touch
//                 </button>
//               </div>
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

//       {/* mobile whastpp and call icon */}
//       {/* Floating Buttons (Mobile Sticky) */}
//       <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg z-50 py-3 px-8 md:hidden">
//         <div className="flex gap-3">
//           {/* Call Button */}
//           <a
//             href="tel:+919819636341"
//             className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-xl font-semibold text-[16px]"
//           >
//             <FaPhoneAlt className="animate-ring" />
//             Call Now
//           </a>

//           {/* WhatsApp Button */}
//           <a
//             href="https://wa.me/919819636341"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-semibold text-[16px]"
//           >
//             <FaWhatsapp className="animate-pulseZoom" />
//             WhatsApp
//           </a>
//         </div>
//       </div>
//       {/* <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg z-50 py-3 px-8 md:hidden">
//         <div className="flex gap-3">

//           <a
//             href="tel:+919819636341"
//             className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-xl font-semibold text-[16px]"
//           >
//             <FaPhoneAlt />
//             Call Now
//           </a>

   
//           <a
//             href="https://wa.me/919819636341"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-semibold text-[16px]"
//           >
//             <FaWhatsapp />
//             WhatsApp
//           </a>
//         </div>
//       </div> */}

//       {/* desktop Sticky 3D WhatsApp & Call icons */}
//       <div
//         className=" hidden md:flex fixed bottom-6 right-4 z-50  flex-col space-y-3 md:space-y-4"
//         data-aos="fade-left"
//       >
//         <a
//           href="https://wa.me/919819636341"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="
//     flex items-center justify-center
//     w-12 h-12            /* Mobile size */
//     md:w-auto md:min-w-[20px] md:h-12  /* Desktop */
//     bg-green-500 text-white
//     rounded-full shadow-lg
//     text-2xl md:text-2xl
//     hover:scale-110 hover:-translate-y-1 hover:shadow-2xl
//     active:shadow-md
//   "
//         >
//           <FaWhatsapp className="text-2xl md:text-3xl" />
//         </a>
//         <a
//           href="tel:919819636341"
//           className="
//     flex items-center justify-center
//     w-12 h-12            /* Mobile */
//     md:w-auto md:px-3 md:h-12  /* Desktop */
//     bg-blue-500 text-white
//     rounded-full shadow-lg
//     text-2xl md:text-xl
//     hover:scale-110 hover:-translate-y-1 hover:shadow-2xl
//     active:scale-95 active:shadow-md
//   "
//         >
//           <FaPhoneAlt className="text-xl md:text-2xl" />
//         </a>
//       </div>
//     </>
//   );
// }

