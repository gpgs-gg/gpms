import React, { useState } from "react";
import LeadsNavigation from "./LeadsNavigation";
import { useApp } from "../context/AppProvider";

function LeadsTab() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [activeLead, setActiveLead] = useState("BulkUploadLeads");
  const { setSelectedClient } = useApp(null);
  // const { setSelectedClient } = useApp();
  const tabClass = (tab) =>
    `
    flex items-center space-x-2 px-3 py-2 text-lg font-medium rounded-md
    sm:rounded-t-lg border-b-2 transition-colors
    text-left w-full sm:w-auto
    ${
      activeTab === tab
        ? "text-orange-600 border-orange-600 bg-orange-50"
        : "text-black border-transparent hover:text-gray-900 hover:border-gray-300"
    }
  `;

  return (
    <>
      <div className="relative mt-0 pt-2 px-4 sm:px-6 bg-[#F8F9FB] w-full border-gray-200 no-print overflow-hidden">
        {/* Background Text */}
        <div className="absolute inset-0 flex items-center justify-end pointer-events-none select-none pr-6">
          <h1 className="text-[50px] font-bold text-gray-500 opacity-20 whitespace-nowrap">
            GPMS Leads List
          </h1>
        </div>

        {/* Tabs */}
        <div
          className="
      relative
      grid grid-cols-2 gap-2
      sm:flex sm:flex-row sm:space-x-6 sm:space-y-0
      border-b
    "
        >
          <button
            className={tabClass("Dashboard")}
            onClick={() => setActiveTab("Dashboard")}
          >
            <span>
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </span>
          </button>

          <button
            className={tabClass("leadsList")}
            onClick={() => {
              setActiveTab("leadsList");
              setSelectedClient(null);
            }}
          >
            <span>
              {" "}
              <i className="fa-solid fa-table-list"></i> Leads List
            </span>
          </button>

          <button
            className={
              activeTab === "UpdateLead"
                ? tabClass("UpdateLead")
                : tabClass("CreateLead")
            }
            onClick={() => {
              setActiveTab("CreateLead");
              // setSelectedClient(null);
              // setActiveLead("BulkUploadLeads");
            }}
          >
            <span>
              {activeTab === "UpdateLead" ? (
                <i className="fas fa-edit"></i>
              ) : (
                <i className="fas fa-plus-circle"></i>
              )}{" "}
              {activeTab === "UpdateLead" ? "Update Lead" : "Create Leads"}
            </span>
          </button>
        </div>
      </div>
      <LeadsNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeLead={activeLead}
        setActiveLead={setActiveLead}
      />
    </>
  );
}

export default LeadsTab;
