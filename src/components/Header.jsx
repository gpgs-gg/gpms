import { useState, useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import logo from "@/assets/commanImages/GPMS-Logo.jpeg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// const navLinks = [
//   { label: "Home", href: "/" },
//   { label: "Services", href: "#services" },
//   { label: "About Us", href: "#about" },
//   { label: "Location", href: "#location" },
//   { label: "Contact Us", href: "#contact" },
// ];
const navLinks = [
  { label: "Services", section: "services" },
  { label: "About Us", section: "about" },
  { label: "Location", section: "location" },
  { label: "Contact Us", section: "contact" },
];

const Header = () => {
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleNavigation = (section) => {
    if (location.pathname !== "/") {
      navigate("/");

      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 200);
    } else {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };
  const handleLogout = () => {
    logout();
    localStorage.clear();
    window.location.reload();
  };
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
    AOS.refresh();
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  return (
    <header
      className={`w-full  sticky top-0 z-[100] transition-all duration-300 ${
        scrolled ? "bg-white shadow-lg" : "bg-white shadow-lg"
      }`}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 ">
        {/* TEXT */}
        <div className="flex gap-2 lg:gap-4 items-center justify-center py-2">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img
              src={logo}
              alt="Company Logo"
              className="h-20 lg:h-20 w-auto object-contain"
            />
          </a>
          <h1 className="text-black text-[20px] uppercase md:text-[28px]  lg:text-[30px] md:leading-[1.3]  lg:leading-[1.2] font-bold">
            Property <span className="">Maintenance</span> Services
          </h1>
        </div>
        {/* ================= Desktop Navigation (md and up) ================= */}
        <nav className="hidden lg:flex items-center space-x-4 lg:space-x-6 xl:space-x-8 flex-shrink-0">
          {/* {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-black font-semibold text-[16px] lg:text-[18px] hover:text-black-600 transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          ))} */}
          <button className="text-black font-semibold text-[16px] lg:text-[18px]">
            <a href="/">Home</a>
          </button>
          {navLinks.map((link) =>
            link.section ? (
              <button
                key={link.label}
                onClick={() => handleNavigation(link.section)}
                className="text-black font-semibold text-[16px] lg:text-[18px]"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.label}
                to={link.path}
                className="text-black font-semibold text-[16px] lg:text-[18px]"
              >
                {link.label}
              </Link>
            ),
          )}

          {/* my account login register */}
          <div className="relative" ref={dropdownRef}>
            {!isAuthenticated ? (
              <Link
                to="/my-account"
                className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                My Account
              </Link>
            ) : (
              <>
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  My Account ▾
                </button>

                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-48 lg:w-54 bg-white shadow-lg rounded-lg py-2 z-50">
                    {/* <button
                      onClick={() => {
                        navigate("/profile");
                        setAccountOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Profile
                    </button> */}

                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setAccountOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Services Dashboard
                    </button>

                    <button
                      onClick={() => {
                        navigate("/gpms-leads");
                        setAccountOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Leads
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        localStorage.removeItem("token");
                        navigate("/", { replace: true });
                      }}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* <Link
            to="/my-account"
            className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            My Account
          </Link> */}
          {/* Cart */}
          {/* <button className="relative flex items-center gap-2 rounded-xl bg-black px-3 lg:px-4 py-1.5 lg:py-2 text-sm font-semibold text-white transition hover:bg-black-700 whitespace-nowrap">
            <i className="fas fa-cart-plus text-white shrink-0" />
            <span>Cart</span>
            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              1
            </span>
          </button> */}
        </nav>

        {/* ================= Mobile Menu Button (md and below) ================= */}
        <button
          className="lg:hidden text-black"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-7 w-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-7 w-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* ================= Mobile Navigation (md and below) ================= */}
      {menuOpen && (
        <div
          data-aos="flip-down"
          data-aos-easing="ease-out-cubic"
          data-aos-duration="600"
          className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg"
        >
          <nav className="flex flex-col space-y-4 px-4 py-6">
            {/* {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-black font-semibold text-[16px] hover:text-black-600 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))} */}
            <button className="text-left font-semibold">
              <a href="/">Home</a>
            </button>
            {navLinks.map((link) =>
              link.section ? (
                <button
                  key={link.label}
                  onClick={() => {
                    handleNavigation(link.section);
                    setMenuOpen(false);
                  }}
                  className="text-left font-semibold"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className="text-left font-semibold"
                >
                  {link.label}
                </Link>
              ),
            )}
            {!isAuthenticated ? (
              <Link
                to="/my-account"
                className="w-fit rounded-xl bg-black px-6 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                onClick={() => setMenuOpen(false)}
              >
                My Account
              </Link>
            ) : (
              <>
                {/* <button
                  onClick={() => navigate("/profile")}
                  className="text-left font-semibold"
                >
                  Profile
                </button> */}

                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-left font-semibold"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    navigate("/gpms-leads");
                    setAccountOpen(false);
                  }}
                  className="text-left font-semibold"
                >
                  Leads
                </button>

                <button
                  onClick={() => {
                    logout();
                    navigate("/", { replace: true });
                  }}
                  className="text-left font-semibold text-red-500"
                >
                  Logout
                </button>
              </>
            )}

            {/* <Link
              to="/my-account"
              className="w-fit rounded-xl bg-black px-6 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
              onClick={() => setMenuOpen(false)}
            >
              My Account
            </Link> */}

            {/* Cart */}
            {/* <button className="relative w-fit flex items-center gap-2 rounded-xl bg-black px-6 py-2 text-sm font-semibold text-white transition hover:bg-black-700">
              <i className="fas fa-cart-plus text-white shrink-0" />
              <span>Cart</span>
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                1
              </span>
            </button> */}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

// import React, { useState } from "react";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import { useEffect } from "react";
// import logo from "../assets/all_icons/GPMS-Logo.png";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const navLinks = [
//   { label: "Home", href: "/" },
//   { label: "Services", href: "#services" },
//   { label: "About Us", href: "#about" },
//   { label: "Location", href: "#location" },
//   { label: "Contact Us", href: "#contact" },
// ];

// const Header = () => {
//   const handleLogout = () => {
//     logout();
//     localStorage.clear();
//     window.location.reload();
//   };
//   useEffect(() => {
//     AOS.init({
//       duration: 1000,
//       once: false,
//     });
//     AOS.refresh();
//   }, []);
//   const { isAuthenticated, logout } = useAuth();
//   const navigate = useNavigate();
//   const [accountOpen, setAccountOpen] = useState(false);

//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <header className="w-full font-nunito bg-white shadow-lg sticky top-0 z-[100]">
//       <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-1">
//         {/* Logo */}
//         <a href="/" className="flex items-center">
//           <img
//             src={logo}
//             alt="Company Logo"
//             className="h-20 lg:h-24 w-auto object-contain"
//           />
//         </a>

//         {/* ================= Desktop Navigation (md and up) ================= */}
//         <nav className="hidden lg:flex items-center space-x-4 lg:space-x-6 xl:space-x-8 flex-shrink-0">
//           {navLinks.map((link) => (
//             <a
//               key={link.label}
//               href={link.href}
//               className="text-black font-semibold text-[16px] lg:text-[18px] hover:text-black-600 transition-colors whitespace-nowrap"
//             >
//               {link.label}
//             </a>
//           ))}

//           {/* my account login register */}
//           <div className="relative">
//             {!isAuthenticated ? (
//               <Link
//                 to="/my-account"
//                 className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
//               >
//                 My Account
//               </Link>
//             ) : (
//               <>
//                 <button
//                   onClick={() => setAccountOpen(!accountOpen)}
//                   className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
//                 >
//                   My Account ▾
//                 </button>

//                 {accountOpen && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
//                     {/* <button
//                       onClick={() => {
//                         navigate("/profile");
//                         setAccountOpen(false);
//                       }}
//                       className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                     >
//                       Profile
//                     </button> */}

//                     <button
//                       onClick={() => {
//                         navigate("/dashboard");
//                         setAccountOpen(false);
//                       }}
//                       className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                     >
//                       Dashboard
//                     </button>

//                     <button
//                       onClick={() => {
//                         logout();
//                         localStorage.removeItem("token");
//                         navigate("/", { replace: true });
//                       }}
//                       className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>

//           {/* <Link
//             to="/my-account"
//             className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
//           >
//             My Account
//           </Link> */}
//           {/* Cart */}
//           {/* <button className="relative flex items-center gap-2 rounded-xl bg-black px-3 lg:px-4 py-1.5 lg:py-2 text-sm font-semibold text-white transition hover:bg-black-700 whitespace-nowrap">
//             <i className="fas fa-cart-plus text-white shrink-0" />
//             <span>Cart</span>
//             <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
//               1
//             </span>
//           </button> */}
//         </nav>

//         {/* ================= Mobile Menu Button (md and below) ================= */}
//         <button
//           className="lg:hidden text-black"
//           onClick={() => setMenuOpen(!menuOpen)}
//           aria-label="Toggle Menu"
//         >
//           {menuOpen ? (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={2}
//               stroke="currentColor"
//               className="h-7 w-7"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           ) : (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={2}
//               stroke="currentColor"
//               className="h-7 w-7"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M4 6h16M4 12h16M4 18h16"
//               />
//             </svg>
//           )}
//         </button>
//       </div>

//       {/* ================= Mobile Navigation (md and below) ================= */}
//       {menuOpen && (
//         <div
//           data-aos="flip-down"
//           data-aos-easing="ease-out-cubic"
//           data-aos-duration="600"
//           className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg"
//         >
//           <nav className="flex flex-col space-y-4 px-4 py-6">
//             {navLinks.map((link) => (
//               <a
//                 key={link.label}
//                 href={link.href}
//                 className="text-black font-semibold text-[16px] hover:text-black-600 transition-colors"
//                 onClick={() => setMenuOpen(false)}
//               >
//                 {link.label}
//               </a>
//             ))}
//             {!isAuthenticated ? (
//               <Link
//                 to="/my-account"
//                 className="w-fit rounded-xl bg-black px-6 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
//                 onClick={() => setMenuOpen(false)}
//               >
//                 My Account
//               </Link>
//             ) : (
//               <>
//                 <button
//                   onClick={() => navigate("/profile")}
//                   className="text-left font-semibold"
//                 >
//                   Profile
//                 </button>

//                 <button
//                   onClick={() => navigate("/dashboard")}
//                   className="text-left font-semibold"
//                 >
//                   Dashboard
//                 </button>

//                 <button
//                   onClick={() => {
//                     logout();
//                     navigate("/", { replace: true });
//                   }}
//                   className="text-left font-semibold text-red-500"
//                 >
//                   Logout
//                 </button>
//               </>
//             )}

//             {/* <Link
//               to="/my-account"
//               className="w-fit rounded-xl bg-black px-6 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
//               onClick={() => setMenuOpen(false)}
//             >
//               My Account
//             </Link> */}

//             {/* Cart */}
//             {/* <button className="relative w-fit flex items-center gap-2 rounded-xl bg-black px-6 py-2 text-sm font-semibold text-white transition hover:bg-black-700">
//               <i className="fas fa-cart-plus text-white shrink-0" />
//               <span>Cart</span>
//               <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
//                 1
//               </span>
//             </button> */}
//           </nav>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;
