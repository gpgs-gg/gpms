import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PiCalendarCheckThin } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import { LayoutDashboard, Users } from "lucide-react";
const Gpmsaction = () => {
  const [activePopup, setActivePopup] = useState(null);

  const cardClasses =
    "bg-white shadow-lg rounded-xl p-5 hover:shadow-2xl transition duration-300 flex flex-col items-center text-center cursor-pointer";

  const iconClasses =
    "h-14 w-14 flex items-center justify-center rounded-full mb-4";

  const titleClasses =
    "text-xl font-semibold text-gray-800 mb-4 uppercase tracking-wide";

  const btnClasses =
    "w-full text-white py-2 px-3 rounded-md font-medium transition";

  const subBtnClasses =
    "py-2 px-4 rounded-md text-sm bg-white text-black w-full hover:bg-gray-100";

  return (
    <>
      <section className="py-4 lg:py-20 lg:h-[550px] px-4 md:px-6 flex items-center justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
          {/* TICKETS */}
          <Link to="/gpms-actions/main-services">
            <div className={cardClasses}>
              <div className={`${iconClasses} bg-green-100 text-green-600`}>
                <LayoutDashboard size={28} />
              </div>
              <h3 className={titleClasses}>Service Dashboard</h3>
              <button className={`${btnClasses} bg-green-600`}>
                Service Dashboard
              </button>
            </div>
          </Link>
          {/* TICKETS */}
          <Link to="/gpms-actions/gpms-leads">
            <div className={cardClasses}>
              <div className={`${iconClasses} bg-green-100 text-indigo-600`}>
                <Users size={28} />
              </div>
              <h3 className={titleClasses}>Leads</h3>
              <button className={`${btnClasses} bg-indigo-600`}>Leads</button>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Gpmsaction;