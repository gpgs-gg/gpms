import { FaBed } from "react-icons/fa";
import { MdHomeRepairService, MdOutlineRealEstateAgent } from "react-icons/md";
import { HiLightBulb } from "react-icons/hi";
import { GiHouse } from "react-icons/gi";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-white px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* Column 1 */}
        <div className=" sm:text-left">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">
            Gopal's Property Maintenance Services
          </h2>
          <p className="text-sm sm:text-base">
            Your Property, Our Responsibility
          </p>

          {/* Social Icons */}
          <div className="flex  sm:justify-start gap-4 mt-4 text-lg">
            <FaFacebookF className="hover:text-blue-500 cursor-pointer" />
            <FaInstagram className="hover:text-pink-500 cursor-pointer" />
            <FaTwitter className="hover:text-sky-500 cursor-pointer" />
            <FaYoutube className="hover:text-red-600 cursor-pointer" />
          </div>
        </div>

        {/* Column 2 */}
        <div className="">
          <ul className="space-y-2 text-sm sm:text-base">
            <li>
              <a href="/" className="hover:text-gray-300">
                Home
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-gray-300">
                Services
              </a>
            </li>
            <li>
              <a href="#location" className="hover:text-gray-300">
                Locations
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-gray-300">
                About Us
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-gray-300">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className=" sm:text-left">
          <h3 className="text-lg sm:text-xl font-semibold mb-3">
            Gopal’s Group Ventures
          </h3>

          <ul className="space-y-2 text-sm sm:text-base">
            <li className="flex  sm:justify-start gap-2">
              <FaBed /> Gopal's Paying Guest Services
            </li>
            <li className="flex r sm:justify-start gap-2">
              <MdHomeRepairService /> Gopal's Property Maintenance Services
            </li>
            <li className="flex  sm:justify-start gap-2">
              <HiLightBulb /> Gopal's Innovative Tech Solutions
            </li>
            <li className="flex  sm:justify-start gap-2">
              <GiHouse /> Gopal's Homestay Services
            </li>
            <li className="flex sm:justify-start gap-2">
              <MdOutlineRealEstateAgent /> Gopal's Realty Consultancy Services
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-neutral-700 mt-10 pt-4 pb-12 md:text-center md:text-lg text-white">
        &copy; {currentYear} Gopal's Property Maintenance Servicess
        <span className="text-[12px] p-5">
          {" "}
          Developed by : Gopal's Innovative Tech Solutions
        </span>
      </div>
      {/* <div className="border-t border-neutral-700 mt-10 pt-4  text-xs  lg: text-center sm:text-sm">
        © {currentYear} Gopal's Property Maintenance Services
        <div className="mt-1">
          Developed by: Gopal's Innovative Tech Solutions
        </div>
      </div> */}
    </footer>
  );
};

export default Footer;    