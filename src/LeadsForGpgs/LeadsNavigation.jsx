import React from 'react'
import LeadsTable from './LeadsTable';
import ClientLeads from './ClientLeads';
import LeadsTab from './LeadsTab';
import Dashboard from './Dashboard';
// import Leads from './Leads';

function LeadsNavigation({activeTab, setActiveTab  , activeLead, setActiveLead}) {
    switch(activeTab) {
       case "Dashboard":
    // code block
    return <Dashboard setActiveTab={setActiveTab} activeLead={activeLead} setActiveLead={setActiveLead} />;
    
  case "leadsList":
    // code block
    return <LeadsTable setActiveTab={setActiveTab} activeLead={activeLead} setActiveLead={setActiveLead} />;
  case "CreateLead":
   return <ClientLeads activeLead={activeLead} setActiveLead={setActiveLead} setActiveTab={setActiveTab}/>;
  case "UpdateLead":
   return <ClientLeads activeLead={activeLead} setActiveLead={setActiveLead} setActiveTab={setActiveTab}/>;
  default:
    // code block
}
  return (
    <div className=" max-h-[800px] border border-gray-50 bg-[#F8F9FB]">
      <LeadsTab />
    </div>
  )
}

export default LeadsNavigation