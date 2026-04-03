import ServiceCardSkeleton from "./skelton/ServiceCardSkeleton";
import { useAuth } from "../context/AuthContext";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { useState } from "react";
import { Info } from "lucide-react";

import { useAllSubServices, useMainServices } from "./services/index";

// import plumbingImg from "@/assets/mainservicesimages/Plumbing.png";
import notFoundImg from "@/assets/commanImages/not-found.jpeg";

//! images
import MoversNPackers_image from "@/assets/servicesImages/Movers&Packers.png";
import DeepCleaning_image from "@/assets/servicesImages/DeepCleaning.png";
import Electrical_image from "@/assets/servicesImages/Electrical.png";
import Plumbing_image from "@/assets/servicesImages/Plumbing.png";
import WaterTank_image from "@/assets/servicesImages/WaterTank.png";
import Painting_image from "@/assets/servicesImages/Painting.png";
import Bhangarwala_image from "@/assets/servicesImages/Bhangarwala.png";
import PropertyRenovation_image from "@/assets/servicesImages/PropertyRenovation.png";
// import service9_image from "@/assets/servicesImages/Tile&GraniteWork.png";
import TileNGraniteWork_image from "@/assets/servicesImages/Tile&GraniteWork.png";
import CivilWork_image from "@/assets/servicesImages/CivilWork.png";
import CarpentrySharp_image from "@/assets/servicesImages/CarpentrySharp.png";
import CarMaintenance_image from "@/assets/servicesImages/CarMaintenance.png";
import BuildingMaintenance_image from "@/assets/servicesImages/BuildingMaintenance.png";
import SocietyManagemen_image from "@/assets/servicesImages/SocietyManagemen.png";
import WaterProofing_image from "@/assets/servicesImages/SocietyManagemen.png";
import Furnishing_image from "@/assets/servicesImages/Furnishing.png";
import GrillAndSlidingWork_image from "@/assets/servicesImages/Grill&SlidingWork.png";

//! icons

import MoversNPackers_icon from "@/assets/icons/Movers&Packers.png";

import DeepCleaning_icon from "@/assets/icons/DeepCleaning-Icon.png";
import Electrical_icon from "@/assets/icons/Electrical-Icon.png";
import Plumbing_icon from "@/assets/icons/Plumbing-Icon.png";
import WaterTank_icon from "@/assets/icons/WaterTank-Icon.png";
import Painting_icon from "@/assets/icons/Painting-Icon.png";
import Bhangarwala_icon from "@/assets/icons/Bhangarwala-Icon.png";
import WaterProofing_icon from "@/assets/icons/PropertyRenovation-Icon.png";
import PropertyRenovation_icon from "@/assets/icons/PropertyRenovation-Icon.png";
import TileNGraniteWork_icon from "@/assets/icons/Tile&GraniteWork-Icon.png";
import CivilWork_icon from "@/assets/icons/CivilWork-Icon.png";
import CarpentrySharp_icon from "@/assets/icons/Carpentry-Icon.png";
import CarMaintenance_icon from "@/assets/icons/CarMaintenance-Icon.png";
import BuildingMaintenance_icon from "@/assets/icons/BuildingMaintenance-Icon.png";
import SocietyManagemen_icon from "@/assets/icons/SocietyManagement-Icon.png";
import Furnishing_icon from "@/assets/icons/Furnishing-Icon.png";
import GrillAndSlidingWork_icon from "@/assets/icons/Grill&SlidingWork.png";

const fallbackImageMap = {
  "gpms-service-1": MoversNPackers_image,
  "gpms-service-2": DeepCleaning_image,
  "gpms-service-3": Electrical_image,
  "gpms-service-4": Plumbing_image,
  "gpms-service-5": WaterTank_image,
  "gpms-service-6": Painting_image,
  "gpms-service-7": Bhangarwala_image,
  "gpms-service-8": WaterProofing_image,
  "gpms-service-9": PropertyRenovation_image,
  "gpms-service-10": TileNGraniteWork_image,
  "gpms-service-11": CivilWork_image,
  "gpms-service-12": CarpentrySharp_image,
  "gpms-service-13": CarMaintenance_image,
  "gpms-service-14": BuildingMaintenance_image,
  "gpms-service-15": SocietyManagemen_image,
  "gpms-service-23": Furnishing_image,
  "gpms-service-24": GrillAndSlidingWork_image,
};
const serviceIconMap = {
  "gpms-service-1": MoversNPackers_icon,
  "gpms-service-2": DeepCleaning_icon,
  "gpms-service-3": Electrical_icon,
  "gpms-service-4": Plumbing_icon,
  "gpms-service-5": WaterTank_icon,
  "gpms-service-6": Painting_icon,
  "gpms-service-7": Bhangarwala_icon,
  "gpms-service-8": WaterProofing_icon,
  "gpms-service-9": PropertyRenovation_icon,
  "gpms-service-10": TileNGraniteWork_icon,
  "gpms-service-11": CivilWork_icon,
  "gpms-service-12": CarpentrySharp_icon,
  "gpms-service-13": CarMaintenance_icon,
  "gpms-service-14": BuildingMaintenance_icon,
  "gpms-service-15": SocietyManagemen_icon,
  "gpms-service-23": Furnishing_icon,
  "gpms-service-24": GrillAndSlidingWork_icon,
};
const IconWithFallback = ({ src, fallback }) => {
  const [iconSrc, setIconSrc] = useState(fallback);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;

    img.onload = () => setIconSrc(src);
  }, [src]);

  return <img src={iconSrc || fallback} alt="icon" className=" object-cover" />;
};
// const ImageWithFallback = ({ src, alt, fallback }) => {
//   const [imgSrc, setImgSrc] = useState(fallback);

//   useEffect(() => {
//     if (!src) return;

//     const img = new Image();
//     img.src = src;

//     img.onload = () => setImgSrc(src);
//   }, [src]);

//   return (
//     <img
//       src={imgSrc || fallback}
//       alt={alt}
//       loading="lazy"
//       className="w-full h-[340px] object-cover rounded-t-xl"
//     />
//   );
// };

const ImageWithFallback = ({ src, alt, fallback }) => {
  const [imgSrc, setImgSrc] = useState(src || fallback);
  // ⏱️ Timeout fallback
  useEffect(() => {
    const timer = setTimeout(() => {
      setImgSrc(fallback);
    }, 1000);

    return () => clearTimeout(timer);
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading="lazy"
      className="w-full h-[340px] object-cover rounded-t-xl"
      onError={() => {
        setImgSrc(fallback);
      }}
    />
  );
};
const scrollToSection = (id, resetSearch) => {
  if (resetSearch) {
    resetSearch("");

    // wait for DOM update after state change
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  } else {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }
};

const getDrivePreviewUrl = (url, pageNumber) => {
  if (!url) return null;

  const match = url.match(/\/d\/([^/]+)/);
  if (!match) return url;

  const baseUrl = `https://drive.google.com/file/d/${match[1]}/preview`;

  const page = Number(pageNumber);

  return page > 0 ? `${baseUrl}#page=${page}` : baseUrl;
};
// ! Service Card
const ServiceCard = ({ service, sectionBg, onViewDetails, mainId }) => {
  //! price validation
  const rawPrice = service.price;
  const cleanPrice = String(rawPrice).replace(/,/g, "");
  const price = Number(cleanPrice);

  const isValidPrice = rawPrice !== 0 && rawPrice !== "0";
  return (
    <div
      onClick={() => {
        if (service?.infoPdf) {
          onViewDetails({
            ...service,
            pdfUrl: service.infoPdf,
            title: service.title + " - Info",
          });
        } else if (service?.pdfUrl) {
          onViewDetails(service);
        }
      }}
      className={`group relative cursor-pointer rounded-2xl shadow-lg hover:shadow-xl transition duration-300
pl-4 pr-1 lg:pl-5 pt-4 lg:pt-4 

hover:-translate-y-1 
${sectionBg === "gray" ? "bg-white" : "bg-white"}`}
    >
      {/* Details */}
      <div className="flex space-x-2 mb-1 lg:mb-4 ">
        <h4
          className=" text-base lg:text-[18px] font-semibold text-gray-900 line-clamp-1 hover:bg"
          title={service.title}
        >
          {service.title}
        </h4>

        <button className="text-sm text-gray-500">
          {" "}
          <Info size={18} />
        </button>
      </div>

      <div className=" flex justify-between  pb-0">
        <div className="mt-3">
          {isValidPrice ? (
            <p className="text-sm md:text-[18px] text-black">
              ₹{!isNaN(price) ? price.toLocaleString("en-IN") : rawPrice}
              <span className="text-gray-500 font-normal text-[11px] md:text-[18px]">
                +<span></span>
              </span>
            </p>
          ) : (
            <p
              onClick={(e) => {
                e.stopPropagation();
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-1 text-sm md:text-[16px] text-gray-600 font-medium cursor-pointer"
            >
              <i className="fas fa-phone"></i>
              <span className="italic underline decoration-1 underline-offset-2">
                Get a Quote
              </span>
            </p>
          )}
        </div>

        <div className=" h-auto w-24 ">
          <IconWithFallback
            // src={service.icon}
            src={
              service.icon ||
              service.main_service_icon ||
              serviceIconMap[mainId] ||
              null
            }
            fallback={serviceIconMap[mainId] || plumbingImg}
            className=" object-cover"
          />
        </div>
      </div>
    </div>
  );
};
//! Service Section main service
const ServiceSection = ({ id, data, sectionBg, onViewDetails }) => {
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  // filter sub-services
  const trimmedSearch = search.trim().replace(/\s+/g, " ").toLowerCase();

  const filteredServices =
    trimmedSearch === ""
      ? data.services.filter((service) => service.status === "active")
      : data.services.filter(
          (service) =>
            service.status === "active" &&
            service.title.toLowerCase().includes(trimmedSearch),
        );
  // show only first 10 unless "View More" clicked
  const visibleServices = showAll
    ? filteredServices
    : filteredServices.slice(0, 10);

  return (
    <>
      <div id={id} className="space-y-6   lg:scroll-mt-24 scroll-mt-20 ">
        {/* Header */}
        <div className="flex flex-col pt-4  sm:flex-row sm:items-center justify-between">
          <h1 className="lg:text-2xl text-lg py-4 font-bold lg:text-[28px]">
            {data.mainTitle?.replace(/\(.*?\)/g, "").split(" - ")[0]}

            {data.mainTitle?.includes(" - ") && (
              <span className="text-gray-400 lg:text-[22px] text-[16px] font-normal italic">
                {" - "}
                {data.mainTitle?.replace(/\(.*?\)/g, "").split(" - ")[1]}
              </span>
            )}

            {data.mainTitle?.match(/\(([^()]*)\)[^()]*$/) && (
              <span className="font-normal text-gray-400 text-[10px] ml-1">
                {data.mainTitle.match(/\(([^()]*)\)[^()]*$/)[0]}
              </span>
            )}
          </h1>

          {/* Search  & rate card pdf */}
          <div className="flex items-center gap-2">
            {/* rate card pdf */}
            <div
              onClick={() => {
                if (data.rate_pdf) {
                  onViewDetails({
                    title: data.mainTitle + " - Rate Card",
                    pdfUrl: data.rate_pdf,
                    page: 1,
                  });
                }
              }}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-[16px] transition duration-300  hover:-translate-y-1 hover:shadow-xl
    ${
      data.rate_pdf
        ? "bg-black text-white cursor-pointer hover:scale-105"
        : "bg-black text-white cursor-not-allowed"
    }`}
            >
              <span className="text-[18px]"> ₹</span>
            </div>
            {/* {user?.Role === "admin" && (
              <div
                onClick={() => {
                  if (data.rate_pdf) {
                    onViewDetails({
                      title: data.mainTitle + " - Rate Card",
                      pdfUrl: data.rate_pdf,
                      page: 1,
                    });
                  }
                }}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-[16px] transition duration-300  hover:-translate-y-1 hover:shadow-xl
    ${
      data.rate_pdf
        ? "bg-black text-white cursor-pointer hover:scale-105"
        : "bg-black text-white cursor-not-allowed"
    }`}
              >
                <span className="text-[18px]"> ₹</span>
              </div>
            )} */}

            {/*  search */}
            <div className="relative w-full sm:w-[200px]">
              <input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowAll(false);
                }}
                className="w-full rounded-xl border border-gray-300 px-4 pr-10 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />

              {!search && (
                <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              )}

              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setShowAll(false);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              onClick={() => scrollToSection("services")}
              className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium  transition duration-300  hover:-translate-y-1 hover:shadow-xl bg-black text-white whitespace-nowrap"
            >
              ← Back to Services
            </button>
          </div>
        </div>
        {/* Services Grid */}
        {visibleServices.length > 0 ? (
          <>
            <div className="grid gap-6 grid-cols-2 lg:grid-cols-5 overflow-visible">
              {visibleServices.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  sectionBg={sectionBg}
                  onViewDetails={onViewDetails}
                  mainId={id}
                  // index={index}
                />
              ))}
            </div>

            {/* View More / View Less Button */}
            {filteredServices.length > 10 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="rounded-xl border border-black px-6 py-2 text-sm font-medium text-black transition hover:bg-black hover:text-white"
                >
                  {showAll ? "View Less" : "View More"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center bg-[#fbfbfb] justify-center py-12">
            <img
              src={notFoundImg}
              alt="No services found"
              className="w-64 h-64 md:w-72 md:h-72  object-contain opacity-90"
            />
            <p className="mt-4 text-gray-500 text-sm">No services found</p>
          </div>
        )}
      </div>
      <div className="flex justify-end py-4 mx-8 lg:mx-14">
        <p className="flex items-center  text-[11px] text-gray-500">
          {/* <i className="fa-solid fa-star text-[8px]" /> */}* Conditions
          apply
        </p>
      </div>
    </>
  );
};

//! Main Service Component
const Services = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  //! for managing scrolling
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  //! pdf view
  const handleViewDetails = (service) => {
    //  console.log("Clicked service:", service);
    const previewUrl = getDrivePreviewUrl(service.pdfUrl, service.page);

    setSelectedService(service);
    setActivePdf(previewUrl);
    setOpen(true);
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
    AOS.refresh();
  }, []);

  const [selectedService, setSelectedService] = useState(null);
  const [mainSearch, setMainSearch] = useState("");

  const [loaded, setLoaded] = useState(false);
  const [activePdf, setActivePdf] = useState(null);

  const { data: services = [], isLoading: loading } = useMainServices();
  const { data: allSubServices = {} } = useAllSubServices();
  const [flipped, setFlipped] = useState(null);
  //console.log(11111111, allSubServices);
  return (
    <section id="services" className="  lg:scroll-mt-16 scroll-mt-20">
      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60"
          onWheel={(e) => e.stopPropagation()}
        >
          <div className="relative w-[90%] max-w-4xl rounded-xl bg-white overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-sm font-semibold">
                {selectedService?.title || "Service Details"}
              </h3>

              <button
                onClick={() => {
                  setOpen(false);
                  setActivePdf(null);
                  setSelectedService(null);
                }}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            {/* PDF */}
            <div className="h-[75vh]">
              {activePdf ? (
                <iframe
                  src={activePdf}
                  className="h-full w-full"
                  title="Service PDF"
                  allow="autoplay"
                />
              ) : (
                <p className="p-4 text-center text-gray-500">
                  No document available
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      {/* main services */}
      <div className=" lg:pb-18 pt-4 md:pt-6 pb-4 md:pb-6 lg:pt-12 px-2">
        {/* for larg devices  */}
        <div className="  sm:px-6 lg:px-12">
          {/* title and serach  for larg devices */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-5  mb-8">
            {/* Center Heading */}
            <div className="lg:flex flex-col hidden  justify-center "></div>
            <div className="flex flex-col  justify-center items-center">
              <h2 className="text-black text-[22px] sm:text-[26px] lg:text-[38px] font-bold">
                Our Services
              </h2>
            </div>

            {/* Right Search */}
            <div className="ml-auto w-full max-w-md lg:pl-16  lg:ml-0">
              <div className="lg:pl-14 relative ">
                <input
                  type="text"
                  placeholder="Search services..."
                  value={mainSearch}
                  onChange={(e) => setMainSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-6 pr-10 py-2 mr-8 text-lg focus:outline-none focus:ring-1 focus:ring-black"
                />

                {/* Search icon (when empty) */}
                {!mainSearch && (
                  <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                )}

                {/* Clear icon (when typing) */}
                {mainSearch && (
                  <button
                    onClick={() => setMainSearch("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Title and Search for Mobile & Up */}
          <div className="grid md:hidden grid-cols-2 px-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-8">
            {/* Heading */}
            <div className="flex justify-between sm:justify-start items-center">
              <h2 className="text-black text-[22px] sm:text-[26px] lg:text-[38px] font-bold">
                Our Services
              </h2>
            </div>

            {/* Search */}
            <div className="w-full sm:col-span-1 lg:col-span-2">
              <div className="relative w-full max-w-md sm:max-w-full">
                <input
                  type="text"
                  placeholder="Search services"
                  value={mainSearch}
                  onChange={(e) => setMainSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-5 pr-2 py-2 text-base sm:text-lg focus:outline-none focus:ring-1 focus:ring-black"
                />

                {/* Search icon (when empty) */}
                {!mainSearch && (
                  <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                )}

                {/* Clear icon (when typing) */}
                {mainSearch && (
                  <button
                    onClick={() => setMainSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black text-sm sm:text-base"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Services Cards */}
          <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:px-2">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))
            ) : services.filter(
                (service) =>
                  (service.status === "active" ||
                    service.Status === "active") &&
                  service.title
                    .toLowerCase()
                    .includes(mainSearch.trim().toLowerCase()),
              ).length === 0 ? (
              <div className="col-span-full flex bg-[#fbfbfb] flex-col items-center justify-center py-12">
                <img
                  src={notFoundImg}
                  alt="No services found"
                  className="w-64 h-64 md:w-72 md:h-72  object-contain opacity-80"
                />
                <p className="mt-4 text-gray-500 text-lg">No services found</p>
              </div>
            ) : (
              services
                .filter(
                  (service) =>
                    (service.status === "active" ||
                      service.Status === "active") &&
                    service.title
                      .toLowerCase()
                      .includes(mainSearch.trim().toLowerCase()),
                )
                .map((service, index) => (
                  <div
                    key={service.title}
                    className="cursor-pointer perspective max-w-[400px]"
                  >
                    <div
                      className={`relative flip-card-inner transition-transform duration-700 ease-[cubic-bezier(0.4,0.2,0.2,1)] ${
                        flipped === service.id ? "rotate-y-180" : ""
                      }`}
                    >
                      {/* FRONT */}
                      <div
                        onClick={() => {
                          const hasSubServices =
                            allSubServices[service.id] &&
                            Object.values(allSubServices[service.id]).some(
                              (section) =>
                                section.services &&
                                section.services.some(
                                  (s) => s.status === "active",
                                ),
                            );

                          if (hasSubServices) {
                            scrollToSection(service.id, setMainSearch);
                          } else {
                            setFlipped(service.id);

                            // Auto flip back after 2 seconds
                            setTimeout(() => {
                              setFlipped(null);
                            }, 2000);
                          }
                        }}
                        className="backface-hidden bg-white rounded-md shadow-lg"
                      >
                        <ImageWithFallback
                          src={service.img}
                          alt={service.title}
                          fallback={fallbackImageMap[service.id] || notFoundImg}
                          // fallback={
                          //   fallbackImages[index % fallbackImages.length]
                          // }
                        />
                        <div className="px-4 py-4">
                          <h3 className="text-[18px] text-[#111D15]">
                            {service.title?.includes("(") ? (
                              <>
                                <span className="font-semibold">
                                  {service.title.split("(")[0].trim()}
                                </span>
                                <span className="text-gray-300 italic  font-normal">
                                  {" (" + service.title.split("(")[1]}
                                </span>
                              </>
                            ) : (
                              <span className="font-semibold">
                                {service.title}
                              </span>
                            )}
                          </h3>
                        </div>
                      </div>

                      {/* BACK */}
                      <div className="absolute inset-0 rotate-y-180 backface-hidden rounded-xl overflow-hidden">
                        {/* Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800"></div>

                        {/* Glow Overlay */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_60%)]"></div>

                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
                          {/* Animated Icon */}
                          <div className="mb-4 animate-pulse">
                            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                              🚀
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold tracking-wide">
                            Coming Soon
                          </h3>

                          {/* Subtitle */}
                          <p className="text-sm text-gray-300 mt-2">
                            This service will be available soon
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
      {/* <p className="border-b border-gray-300"></p> */}
      {/* all  servics */}

      <div>
        {(() => {
          let sectionIndex = 0;

          return Object.entries(allSubServices).flatMap(
            ([mainId, categories]) =>
              Object.entries(categories).map(([categoryId, section]) => {
                const isFirst = sectionIndex % 2 === 0; // first = true
                sectionIndex++;

                return (
                  <div
                    key={`${mainId}-${categoryId}`}
                    // className={` ${isFirst ? "bg-[#fbfbfb]" : "bg-white"} px-4 sm:px-6 lg:px-12`}
                    className={` ${isFirst ? "" : ""} px-4 sm:px-6 lg:px-12`}
                  >
                    <ServiceSection
                      id={mainId}
                      data={{
                        mainTitle: section.categoryTitle
                          ? `${section.mainTitle} - ${section.categoryTitle}`
                          : section.mainTitle,
                        services: section.services,
                        rate_pdf: section.main_service_rate_pdf,
                      }}
                      sectionBg={isFirst ? "gray" : "white"}
                      onViewDetails={handleViewDetails}
                    />
                    {/* <p className="border-b border-gray-500"></p> */}
                  </div>
                );
              }),
          );
        })()}
      </div>
    </section>
  );
};

export default Services;

// import ServiceCardSkeleton from "./skelton/ServiceCardSkeleton";
// import { Phone } from "lucide-react";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import { useEffect } from "react";
// import { useState } from "react";
// import { Info } from "lucide-react";
// import { useAllSubServices, useMainServices } from "./services/index";

// import plumbingImg from "@/assets/mainservicesimages/Plumbing.png";
// import notFoundImg from "@/assets/commanImages/not-found.jpeg";

// //! images
// import MoversNPackers_image from "@/assets/servicesImages/Movers&Packers.png";
// import DeepCleaning_image from "@/assets/servicesImages/DeepCleaning.png";
// import Electrical_image from "@/assets/servicesImages/Electrical.png";
// import Plumbing_image from "@/assets/servicesImages/Plumbing.png";
// import WaterTank_image from "@/assets/servicesImages/WaterTank.png";
// import Painting_image from "@/assets/servicesImages/Painting.png";
// import Bhangarwala_image from "@/assets/servicesImages/Bhangarwala.png";
// import PropertyRenovation_image from "@/assets/servicesImages/PropertyRenovation.png";
// // import service9_image from "@/assets/servicesImages/Tile&GraniteWork.png";
// import TileNGraniteWork_image from "@/assets/servicesImages/Tile&GraniteWork.png";
// import CivilWork_image from "@/assets/servicesImages/CivilWork.png";
// import CarpentrySharp_image from "@/assets/servicesImages/CarpentrySharp.png";
// import CarMaintenance_image from "@/assets/servicesImages/CarMaintenance.png";
// import BuildingMaintenance_image from "@/assets/servicesImages/BuildingMaintenance.png";
// import SocietyManagemen_image from "@/assets/servicesImages/SocietyManagemen.png";
// import WaterProofing_image from "@/assets/servicesImages/SocietyManagemen.png";
// import Furnishing_image from "@/assets/servicesImages/Furnishing.png";

// //! icons

// import service1_icon from "@/assets/icons/Movers&Packers.png";

// import service2_icon from "@/assets/icons/DeepCleaning-Icon.png";
// import service3_icon from "@/assets/icons/Electrical-Icon.png";
// import service4_icon from "@/assets/icons/Plumbing-Icon.png";
// import service5_icon from "@/assets/icons/WaterTank-Icon.png";
// import service6_icon from "@/assets/icons/Painting-Icon.png";
// import service7_icon from "@/assets/icons/Bhangarwala-Icon.png";
// import service8_icon from "@/assets/icons/PropertyRenovation-Icon.png";
// import service9_icon from "@/assets/icons/PropertyRenovation-Icon.png";
// import service10_icon from "@/assets/icons/Tile&GraniteWork-Icon.png";
// import service11_icon from "@/assets/icons/CivilWork-Icon.png";
// import service12_icon from "@/assets/icons/Carpentry-Icon.png";
// import service13_icon from "@/assets/icons/CarMaintenance-Icon.png";
// import service14_icon from "@/assets/icons/BuildingMaintenance-Icon.png";
// import service15_icon from "@/assets/icons/SocietyManagement-Icon.png";
// import service23_icon from "@/assets/servicesImages/Furnishing.png";

// const fallbackImages = [
//   DeepCleaning_image,
//   Electrical_image,
//   Plumbing_image,
//   Painting_image,
//   CarpentrySharp_image,
//   WaterTank_image,
//   TileNGraniteWork_image,
//   CivilWork_image,
//   // service9_image,
//   PropertyRenovation_image,
//   MoversNPackers_image,
//   CarMaintenance_image,
//   Bhangarwala_image,
//   BuildingMaintenance_image,
//   SocietyManagemen_image,
// ];

// const fallbackImageMap = {
//   "gpms-service-1": MoversNPackers_image,
//   "gpms-service-2": DeepCleaning_image,
//   "gpms-service-3": Electrical_image,
//   "gpms-service-4": Plumbing_image,
//   "gpms-service-5": WaterTank_image,
//   "gpms-service-6": Painting_image,
//   "gpms-service-7": Bhangarwala_image,
//   "gpms-service-8": WaterProofing_image,
//   "gpms-service-9": PropertyRenovation_image,
//   "gpms-service-10": TileNGraniteWork_image,
//   "gpms-service-11": CivilWork_image,
//   "gpms-service-12": CarpentrySharp_image,
//   "gpms-service-13": CarMaintenance_image,
//   "gpms-service-14": BuildingMaintenance_image,
//   "gpms-service-15": SocietyManagemen_image,
//   "gpms-service-23": Furnishing_image,
// };
// const serviceIconMap = {
//   "gpms-service-1": service1_icon,
//   "gpms-service-2": service2_icon,
//   "gpms-service-3": service3_icon,
//   "gpms-service-4": service4_icon,
//   "gpms-service-5": service5_icon,
//   "gpms-service-6": service6_icon,
//   "gpms-service-7": service7_icon,
//   "gpms-service-8": service8_icon,
//   "gpms-service-9": service9_icon,
//   "gpms-service-10": service10_icon,
//   "gpms-service-11": service11_icon,
//   "gpms-service-12": service12_icon,
//   "gpms-service-13": service13_icon,
//   "gpms-service-14": service14_icon,
//   "gpms-service-15": service15_icon,
//   "gpms-service-23": service23_icon,
// };
// const IconWithFallback = ({ src, fallback }) => {
//   const [iconSrc, setIconSrc] = useState(fallback);

//   useEffect(() => {
//     if (!src) return;

//     const img = new Image();
//     img.src = src;

//     img.onload = () => setIconSrc(src);
//   }, [src]);

//   return <img src={iconSrc || fallback} alt="icon" className=" object-cover" />;
// };
// const ImageWithFallback = ({ src, alt, fallback }) => {
//   const [imgSrc, setImgSrc] = useState(fallback);

//   useEffect(() => {
//     if (!src) return;

//     const img = new Image();
//     img.src = src;

//     img.onload = () => setImgSrc(src);
//   }, [src]);

//   return (
//     <img
//       src={imgSrc || fallback}
//       alt={alt}
//       loading="lazy"
//       className="w-full h-[340px] object-cover rounded-t-xl"
//     />
//   );
// };

// // const scrollToSection = (id) => {
// //   const element = document.getElementById(id);
// //   if (element) {
// //     element.scrollIntoView({
// //       behavior: "smooth",
// //       block: "start",
// //     });
// //   }
// // };

// const scrollToSection = (id, resetSearch) => {
//   if (resetSearch) {
//     resetSearch("");

//     // wait for DOM update after state change
//     setTimeout(() => {
//       const element = document.getElementById(id);
//       if (element) {
//         element.scrollIntoView({
//           behavior: "smooth",
//           block: "start",
//         });
//       }
//     }, 100);
//   } else {
//     const element = document.getElementById(id);
//     if (element) {
//       element.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     }
//   }
// };

// const getDrivePreviewUrl = (url, pageNumber) => {
//   if (!url) return null;

//   const match = url.match(/\/d\/([^/]+)/);
//   if (!match) return url;

//   const baseUrl = `https://drive.google.com/file/d/${match[1]}/preview`;

//   const page = Number(pageNumber);

//   return page > 0 ? `${baseUrl}#page=${page}` : baseUrl;
// };

// const ServiceCard = ({ service, sectionBg, onViewDetails, mainId }) => {
//   //console.log(11111, service.main_service_icon);
//   //console.log(2222, service.icon);
//   //! price validation
//   const rawPrice = service.price;
//   const cleanPrice = String(rawPrice).replace(/,/g, "");
//   const price = Number(cleanPrice);

//   const isValidPrice = rawPrice !== 0 && rawPrice !== "0";
//   return (
//     <div
//       onClick={() => service?.pdfUrl && onViewDetails(service)}
//       //     className="group relative rounded-2xl border border-gray-300
//       // pl-4 pr-1 lg:pl-5 pt-4 lg:pt-4
//       // shadow-sm transition-all duration-300
//       // hover:-translate-y-1 hover:shadow-md
//       // bg-white"
//       className={`group relative cursor-pointer rounded-2xl shadow-lg hover:shadow-xl transition duration-300
// pl-4 pr-1 lg:pl-5 pt-4 lg:pt-4

// hover:-translate-y-1
// ${sectionBg === "gray" ? "bg-white" : "bg-[#fbfbfb]"}`}
//     >
//       {/* Details */}
//       <div className="flex space-x-2 mb-1 lg:mb-4 ">
//         {/* <h4
//           className="text-base lg:text-[18px] font-semibold text-gray-900 line-clamp-1"
//           title={service.title}
//         >
//           {service.title?.includes("-") ? (
//             <>
//               <span>{service.title.split("-")[0]}</span>
//               <span className="text-gray-500 italic font-normal text-[16px]">
//                 {" - " + service.title.split("-").slice(1).join("-")}
//               </span>
//             </>
//           ) : (
//             service.title
//           )}
//         </h4>  */}
//         {/* <h4
//           className="text-base lg:text-[18px] font-semibold line-clamp-1"
//           title={service.title}
//         >
//           {service.title?.includes("-") ? (
//             <>
//               <span className="text-gray-900">
//                 {service.title.split("-")[0]}
//               </span>
//               <span className="text-gray-400">
//                 {" - " + service.title.split("-").slice(1).join("-")}
//               </span>
//             </>
//           ) : (
//             <span className="text-gray-500">{service.title}</span>
//           )}
//         </h4> */}
//         <h4
//           className=" text-base lg:text-[18px] font-semibold text-gray-900 line-clamp-1 hover:bg"
//           title={service.title}
//         >
//           {service.title}
//         </h4>
//         {/* <div className="relative group w-fit">
//           <h4 className="text-base lg:text-[18px] font-semibold text-gray-900 line-clamp-1 cursor-pointer">
//             {service.title}
//           </h4>

//           <div
//             className="absolute top-1/2 left-full ml-7 -translate-y-1/2
//                px-3 py-2 text-sm text-white bg-gray-900
//                rounded-lg shadow-xl whitespace-nowrap
//                opacity-0 translate-x-2
//                transition-all duration-300
//                group-hover:opacity-100
//                group-hover:translate-x-0
//                z-[150]"
//           >
//             {service.title}
//           </div>
//         </div> */}
//         <button className="text-sm text-gray-500">
//           {" "}
//           <Info size={18} />
//         </button>
//       </div>

//       <div className=" flex justify-between  pb-0">
//         <div className="mt-3">
//           {isValidPrice ? (
//             <p className="text-sm md:text-[18px] text-black">
//               ₹ {!isNaN(price) ? price.toLocaleString("en-IN") : rawPrice}
//               <span className="text-gray-500 italic text-[11px] md:text-[14px]">
//                 {" "}
//                 onwards <span>*</span>
//               </span>
//             </p>
//           ) : (
//             <p className="flex  items-center gap-2 text-sm md:text-[16px] text-gray-600 font-medium">
//               <i className="fas fa-phone"></i>
//               <span className="italic underline decoration-1 underline-offset-2">
//                 Get a Quote
//               </span>
//             </p>
//             // <p className="flex items-center gap-2 text-sm md:text-[16px] text-gray-600 font-medium">
//             //   <span>Get a Quote</span>
//             //   <Phone size={18} />
//             // </p>
//           )}
//         </div>
//         {/* <div className=" mt-2">
//           <p className="text-sm md:text-[18px]  text-black">
//             ₹ {service.price}{" "}
//             <span className="text-gray-500 italic text-[11px] md:text-[14px]">
//               onwards <span className=" text-[11px] md:text-[14px]">*</span>
//             </span>
//           </p>
//         </div> */}
//         <div className=" h-auto w-24 ">
//           <IconWithFallback
//             // src={service.icon}
//             src={
//               service.icon ||
//               service.main_service_icon ||
//               serviceIconMap[mainId] ||
//               null
//             }
//             fallback={serviceIconMap[mainId] || plumbingImg}
//             className=" object-cover"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };
// const ServiceSection = ({ id, data, sectionBg, onViewDetails }) => {
//   const [search, setSearch] = useState("");
//   const [showAll, setShowAll] = useState(false);

//   // filter sub-services
//   const trimmedSearch = search.trim().replace(/\s+/g, " ").toLowerCase();

//   const filteredServices =
//     trimmedSearch === ""
//       ? data.services.filter((service) => service.status === "active")
//       : data.services.filter(
//           (service) =>
//             service.status === "active" &&
//             service.title.toLowerCase().includes(trimmedSearch),
//         );
//   // show only first 10 unless "View More" clicked
//   const visibleServices = showAll
//     ? filteredServices
//     : filteredServices.slice(0, 10);

//   return (
//     <>
//       <div id={id} className="space-y-6   lg:scroll-mt-24 scroll-mt-20 ">
//         {/* Header */}
//         <div className="flex flex-col pt-4  sm:flex-row sm:items-center justify-between">
//           <h1 className="lg:text-2xl text-lg py-4 font-bold lg:text-[28px]">
//             {data.mainTitle?.replace(/\(.*?\)/g, "").split(" - ")[0]}

//             {data.mainTitle?.includes(" - ") && (
//               <span className="text-gray-400 lg:text-[22px] text-[16px] font-normal italic">
//                 {" - "}
//                 {data.mainTitle?.replace(/\(.*?\)/g, "").split(" - ")[1]}
//               </span>
//             )}

//             {data.mainTitle?.match(/\(([^()]*)\)[^()]*$/) && (
//               <span className="font-normal text-gray-400 text-[10px] ml-1">
//                 {data.mainTitle.match(/\(([^()]*)\)[^()]*$/)[0]}
//               </span>
//             )}
//           </h1>
//           {/* <h1 className="lg:text-2xl text-lg py-4 font-bold lg:text-[28px]">
//             {data.mainTitle?.split(" - ")[0]}
//             {data.mainTitle?.includes(" - ") && (
//               <span className="text-gray-500 lg:text-[22px] text-[16px]  font-normal italic">
//                 {" - "}
//                 {data.mainTitle.split(" - ")[1]}
//               </span>
//             )}
//           </h1> */}

//           {/* Search */}
//           <div className="flex items-center gap-2">
//             {/* <div className="relative w-full sm:w-[280px]">
//               <input
//                 type="text"
//                 placeholder="Search services..."
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setShowAll(false);
//                 }}
//                 className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
//               />
//               <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
//             </div> */}
//             <div
//               onClick={() => {
//                 if (data.rate_pdf) {
//                   onViewDetails({
//                     title: data.mainTitle + " - Rate Card",
//                     pdfUrl: data.rate_pdf,
//                     page: 1,
//                   });
//                 }
//               }}
//               className={`w-8 h-8 flex items-center justify-center rounded-full text-[16px] transition duration-300  hover:-translate-y-1 hover:shadow-xl
//     ${
//       data.rate_pdf
//         ? "bg-black text-white cursor-pointer hover:scale-105"
//         : "bg-black text-white cursor-not-allowed"
//     }`}
//             >
//               ₹
//             </div>
//             <div className="relative w-full sm:w-[200px]">
//               <input
//                 type="text"
//                 placeholder="Search services..."
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setShowAll(false);
//                 }}
//                 className="w-full rounded-xl border border-gray-300 px-4 pr-10 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
//               />

//               {!search && (
//                 <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
//               )}

//               {search && (
//                 <button
//                   onClick={() => {
//                     setSearch("");
//                     setShowAll(false);
//                   }}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
//                 >
//                   ✕
//                 </button>
//               )}
//             </div>
//             <button
//               onClick={() => scrollToSection("services")}
//               className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium  transition duration-300  hover:-translate-y-1 hover:shadow-xl bg-black text-white whitespace-nowrap"
//             >
//               ← Back to Services
//             </button>
//           </div>
//         </div>
//         {/* Services Grid */}
//         {visibleServices.length > 0 ? (
//           <>
//             <div className="grid gap-6 grid-cols-2 lg:grid-cols-5 overflow-visible">
//               {visibleServices.map((service, index) => (
//                 <ServiceCard
//                   key={service.title + index}
//                   service={service}
//                   sectionBg={sectionBg}
//                   onViewDetails={onViewDetails}
//                   mainId={id}
//                   // index={index}
//                 />
//               ))}
//             </div>

//             {/* View More / View Less Button */}
//             {filteredServices.length > 10 && (
//               <div className="flex justify-center mt-6">
//                 <button
//                   onClick={() => setShowAll(!showAll)}
//                   className="rounded-xl border border-black px-6 py-2 text-sm font-medium text-black transition hover:bg-black hover:text-white"
//                 >
//                   {showAll ? "View Less" : "View More"}
//                 </button>
//               </div>
//             )}
//           </>
//         ) : (
//           <div className="flex flex-col items-center bg-[#fbfbfb] justify-center py-12">
//             <img
//               src={notFoundImg}
//               alt="No services found"
//               className="w-64 h-64 md:w-72 md:h-72  object-contain opacity-90"
//             />
//             <p className="mt-4 text-gray-500 text-sm">No services found</p>
//           </div>
//         )}
//       </div>
//       <div className="flex justify-end py-4 mx-8 lg:mx-14">
//         <p className="flex items-center  text-[11px] text-gray-500">
//           {/* <i className="fa-solid fa-star text-[8px]" /> */}* Conditions
//           apply
//         </p>
//       </div>
//     </>
//   );
// };

// const Services = () => {
//   const [open, setOpen] = useState(false);
//   //! for managing scrolling
//   useEffect(() => {
//     if (open) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }

//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, [open]);

//   const handleViewDetails = (service) => {
//     //  console.log("Clicked service:", service);
//     const previewUrl = getDrivePreviewUrl(service.pdfUrl, service.page);

//     setSelectedService(service);
//     setActivePdf(previewUrl);
//     setOpen(true);
//   };

//   useEffect(() => {
//     AOS.init({
//       duration: 1000,
//       once: false,
//     });
//     AOS.refresh();
//   }, []);

//   const [selectedService, setSelectedService] = useState(null);
//   const [mainSearch, setMainSearch] = useState("");

//   const [loaded, setLoaded] = useState(false);
//   const [activePdf, setActivePdf] = useState(null);

//   const { data: services = [], isLoading: loading } = useMainServices();
//   const { data: allSubServices = {} } = useAllSubServices();
//   const [flipped, setFlipped] = useState(null);
//   //console.log(11111111, allSubServices);
//   return (
//     <section id="services" className="  lg:scroll-mt-16 scroll-mt-20">
//       {open && (
//         <div
//           className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60"
//           onWheel={(e) => e.stopPropagation()}
//         >
//           <div className="relative w-[90%] max-w-4xl rounded-xl bg-white overflow-hidden">
//             {/* Header */}
//             <div className="flex items-center justify-between border-b px-4 py-3">
//               <h3 className="text-sm font-semibold">
//                 {selectedService?.title || "Service Details"}
//               </h3>

//               <button
//                 onClick={() => {
//                   setOpen(false);
//                   setActivePdf(null);
//                   setSelectedService(null);
//                 }}
//                 className="text-gray-500 hover:text-black"
//               >
//                 ✕
//               </button>
//             </div>

//             {/* PDF */}
//             <div className="h-[75vh]">
//               {activePdf ? (
//                 <iframe
//                   src={activePdf}
//                   className="h-full w-full"
//                   title="Service PDF"
//                   allow="autoplay"
//                 />
//               ) : (
//                 <p className="p-4 text-center text-gray-500">
//                   No document available
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//       {/* main services */}
//       <div className=" lg:pb-18 pt-4 md:pt-6 pb-4 md:pb-6 lg:pt-12 px-2">
//         <div className=" sm:px-6 lg:px-12">
//           <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-5  mb-8">
//             {/* Center Heading */}
//             <div className="lg:flex flex-col hidden  justify-center "></div>
//             <div className="flex flex-col  justify-center items-center">
//               <h2 className="text-black text-[22px] sm:text-[26px] lg:text-[38px] font-bold">
//                 Our Services
//               </h2>
//             </div>

//             {/* Right Search */}
//             <div className="ml-auto w-full max-w-md lg:pl-16  lg:ml-0">
//               {/* <div className="relative">
//                 <div className=" lg:pl-12">
//                   <input
//                     type="text"
//                     placeholder="Search services..."
//                     value={mainSearch}
//                     onChange={(e) => setMainSearch(e.target.value)}
//                     className="w-full rounded-xl border border-gray-300 px-6 py-2 text-lg focus:outline-none focus:ring-1 focus:ring-black"
//                   />
//                   <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
//                 </div>
//               </div> */}
//               <div className="lg:pl-14 relative ">
//                 <input
//                   type="text"
//                   placeholder="Search services..."
//                   value={mainSearch}
//                   onChange={(e) => setMainSearch(e.target.value)}
//                   className="w-full rounded-xl border border-gray-300 px-6 pr-10 py-2 mr-8 text-lg focus:outline-none focus:ring-1 focus:ring-black"
//                 />

//                 {/* Search icon (when empty) */}
//                 {!mainSearch && (
//                   <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
//                 )}

//                 {/* Clear icon (when typing) */}
//                 {mainSearch && (
//                   <button
//                     onClick={() => setMainSearch("")}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
//                   >
//                     ✕
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Main Services Cards */}
//           <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:px-2">
//             {/* {loading
//               ? Array.from({ length: 8 }).map((_, i) => (
//                   <ServiceCardSkeleton key={i} />
//                 ))
//               : services
//                   .filter(
//                     (service) =>
//                       (service.status === "active" ||
//                         service.Status === "active") &&
//                       service.title
//                         .toLowerCase()
//                         .includes(mainSearch.trim().toLowerCase()),
//                   )
//                   .map((service, index) => (
//                     <div
//                       id={`#${service.id}`}
//                       key={service.title}
//                       onClick={() => scrollToSection(service.id)}
//                       className="cursor-pointer rounded-md flex flex-col gap-4 scroll-mt-40 lg:scroll-mt-0 transition hover:-translate-y-1 group max-w-[400px] shadow-lg"
//                     >

//                       <ImageWithFallback
//                         src={service.img}
//                         alt={service.title}
//                         fallback={fallbackImages[index % fallbackImages.length]}
//                       />

//                       <div className="px-4 pb-4 ">
//                         <h3 className="font-semibold text-[18px] text-[#111D15]">
//                           {service.title}
//                         </h3>

//                       </div>
//                     </div>
//                   ))} */}
//             {loading ? (
//               Array.from({ length: 8 }).map((_, i) => (
//                 <ServiceCardSkeleton key={i} />
//               ))
//             ) : services.filter(
//                 (service) =>
//                   (service.status === "active" ||
//                     service.Status === "active") &&
//                   service.title
//                     .toLowerCase()
//                     .includes(mainSearch.trim().toLowerCase()),
//               ).length === 0 ? (
//               <div className="col-span-full flex bg-[#fbfbfb] flex-col items-center justify-center py-12">
//                 <img
//                   src={notFoundImg}
//                   alt="No services found"
//                   className="w-64 h-64 md:w-72 md:h-72  object-contain opacity-80"
//                 />
//                 <p className="mt-4 text-gray-500 text-lg">No services found</p>
//               </div>
//             ) : (
//               services
//                 .filter(
//                   (service) =>
//                     (service.status === "active" ||
//                       service.Status === "active") &&
//                     service.title
//                       .toLowerCase()
//                       .includes(mainSearch.trim().toLowerCase()),
//                 )
//                 .map((service, index) => (
//                   <div
//                     key={service.title}
//                     className="cursor-pointer perspective max-w-[400px]"
//                   >
//                     <div
//                       className={`relative flip-card-inner transition-transform duration-700 ease-[cubic-bezier(0.4,0.2,0.2,1)] ${
//                         flipped === service.id ? "rotate-y-180" : ""
//                       }`}
//                     >
//                       {/* FRONT */}
//                       <div
//                         onClick={() => {
//                           const hasSubServices =
//                             allSubServices[service.id] &&
//                             Object.values(allSubServices[service.id]).some(
//                               (section) =>
//                                 section.services &&
//                                 section.services.some(
//                                   (s) => s.status === "active",
//                                 ),
//                             );

//                           if (hasSubServices) {
//                             scrollToSection(service.id, setMainSearch);
//                           } else {
//                             setFlipped(service.id);

//                             // Auto flip back after 2 seconds
//                             setTimeout(() => {
//                               setFlipped(null);
//                             }, 2000);
//                           }
//                         }}
//                         className="backface-hidden bg-white rounded-md shadow-lg"
//                       >
//                         <ImageWithFallback
//                           src={service.img}
//                           alt={service.title}
//                           fallback={fallbackImageMap[service.id] || notFoundImg}
//                           // fallback={
//                           //   fallbackImages[index % fallbackImages.length]
//                           // }
//                         />
//                         <div className="px-4 py-4">
//                           <h3 className="text-[18px] text-[#111D15]">
//                             {service.title?.includes("(") ? (
//                               <>
//                                 <span className="font-semibold">
//                                   {service.title.split("(")[0].trim()}
//                                 </span>
//                                 <span className="text-gray-300 italic  font-normal">
//                                   {" (" + service.title.split("(")[1]}
//                                 </span>
//                               </>
//                             ) : (
//                               <span className="font-semibold">
//                                 {service.title}
//                               </span>
//                             )}
//                           </h3>
//                           {/* <h3 className="font-semibold text-[18px] text-[#111D15]">
//                             {service.title}
//                           </h3> */}
//                         </div>
//                       </div>

//                       {/* BACK */}
//                       <div className="absolute inset-0 rotate-y-180 backface-hidden rounded-xl overflow-hidden">
//                         {/* Gradient Background */}
//                         <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800"></div>

//                         {/* Glow Overlay */}
//                         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_60%)]"></div>

//                         {/* Content */}
//                         <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
//                           {/* Animated Icon */}
//                           <div className="mb-4 animate-pulse">
//                             <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
//                               🚀
//                             </div>
//                           </div>

//                           {/* Title */}
//                           <h3 className="text-xl font-bold tracking-wide">
//                             Coming Soon
//                           </h3>

//                           {/* Subtitle */}
//                           <p className="text-sm text-gray-300 mt-2">
//                             This service will be available shortly
//                           </p>
//                         </div>
//                       </div>
//                       {/* <div className="absolute inset-0 rotate-y-180 backface-hidden bg-black text-white rounded-md flex items-center justify-center">
//                         <p className="text-lg font-semibold tracking-wide">
//                           🚀 Coming Soon
//                         </p>
//                       </div> */}
//                     </div>
//                   </div>
//                 ))
//             )}
//           </div>
//         </div>
//       </div>
//       <p className="border-b border-gray-300"></p>
//       {/* all  servics */}

//       <div>
//         {(() => {
//           let sectionIndex = 0;

//           return Object.entries(allSubServices).flatMap(
//             ([mainId, categories]) =>
//               Object.entries(categories).map(([categoryId, section]) => {
//                 const isFirst = sectionIndex % 2 === 0; // first = true
//                 sectionIndex++;

//                 return (
//                   <div
//                     key={`${mainId}-${categoryId}`}
//                     className={` ${isFirst ? "bg-[#fbfbfb]" : "bg-white"} px-4 sm:px-6 lg:px-12`}
//                   >
//                     <ServiceSection
//                       id={mainId}
//                       data={{
//                         mainTitle: section.categoryTitle
//                           ? `${section.mainTitle} - ${section.categoryTitle}`
//                           : section.mainTitle,
//                         services: section.services,
//                         rate_pdf: section.main_service_rate_pdf,
//                       }}
//                       sectionBg={isFirst ? "gray" : "white"}
//                       onViewDetails={handleViewDetails}
//                     />
//                     {/* <p className="border-b border-gray-500"></p> */}
//                   </div>
//                 );
//               }),
//           );
//         })()}
//         {/* {Object.entries(allSubServices).map(([mainId, categories], index) =>
//           Object.entries(categories).map(([categoryId, section], idx) => {
//             const isGray = (index + idx) % 2 === 0;

//             return (
//               <div
//                 key={`${mainId}-${categoryId}`}
//                 className="lg:py-6 py-4 md:py-6 "
//               >
//                 <ServiceSection
//                   id={mainId}
//                   data={{
//                     mainTitle: section.categoryTitle
//                       ? `${section.mainTitle} - ${section.categoryTitle}`
//                       : section.mainTitle,
//                     services: section.services,
//                   }}
//                   sectionBg={isGray ? "white" : "gray"}
//                   onViewDetails={handleViewDetails}
//                 />
//               </div>
//             );
//           }),
//         )} */}
//       </div>
//     </section>
//   );
// };

// export default Services;
