// import React from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import {useLeadsDetails} from './services'


// const recentLeads = [
//   {
//     name: "Ankit Das",
//     gender: "Male",
//     profession: "IT Professional",
//     source: "Magicbricks",
//     status: "Connected",
//   },
//   {
//     name: "Ritu",
//     gender: "Female",
//     profession: "Teacher",
//     source: "Magicbricks",
//     status: "Connected",
//   },
//   {
//     name: "Dipesh Naida",
//     gender: "Male",
//     profession: "Business Owner",
//     source: "KK Sir Ref",
//     status: "Ringing",
//   },
//   {
//     name: "Neha",
//     gender: "Female",
//     profession: "HR Executive",
//     source: "Just Dial",
//     status: "Connected",
//   },
//   {
//     name: "Tejaswini",
//     gender: "Female",
//     profession: "Student",
//     source: "Just Dial",
//     status: "Ringing",
//   },
// ];

// const statusStyles = {
//   Connected: "bg-green-50 text-green-700 border border-green-200",
//   Ringing: "bg-yellow-50 text-yellow-700 border border-yellow-200",
// };

// const Dashboard = () => {

//   const { data } = useLeadsDetails();
//   const leadsDetails = data?.data || [];
// const stats = [
//   { title: "Total Leads", value: leadsDetails.length, accent: "border-blue-500 whitespace-nowrap" },
//   { title: "Booking Done", value: leadsDetails.filter(lead => lead.LeadStatus === "Booking Done").length, accent: "border-green-500 whitespace-nowrap" },
//   { title: "WhatsApp Not Done", value: leadsDetails.filter(lead => lead.WhatsAppMsgs === "Not Done").length, accent: "border-red-500 whitespace-nowrap" },
//   { title: "Calling Not Done", value: leadsDetails.filter(lead => lead.PhoneCalls === "Not Done").length, accent: "border-red-500 whitespace-nowrap" },
//   { title: "Visited Not Done", value: leadsDetails.filter(lead => lead.Visited === "No").length, accent: "border-red-500 whitespace-nowrap" },
//   { title: "Intrested But Depalyed", value: leadsDetails.filter(lead => lead.LeadStatus === "Intrested but Delayed ").length, accent: "border-yellow-500 whitespace-nowrap" },
//   { title: "Not Intrested", value: leadsDetails.filter(lead => lead.LeadStatus === "Not Intrested").length, accent: "border-cyan-500" },
//   // { title: "Female Leads", value: 20, accent: "border-pink-500" },
// ];

// const last7DaysLeads = leadsDetails?.filter((lead) => {
//   if (!lead?.Date) return false;

//   // "24 Jan 2026" → Date object
//   const leadDate = new Date(lead.Date);

//   const today = new Date();
//   const oneWeekAgo = new Date();
//   oneWeekAgo.setDate(today.getDate() - 7);

//   return leadDate >= oneWeekAgo && leadDate <= today;
// });


//   return (
//     <div className="min-h-screen bg-slate-100 p-4">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
//         <div className="mb-2">
//           <h1 className="text-2xl font-semibold text-slate-800">
//             Leads Dashboard
//           </h1>
//           <p className="text-sm text-slate-500">
//             {/* Overview of sales team performance and recent activity */}
//             Overview of sales team performance
//           </p>
//         </div>
//         <div className="flex items-center gap-2 bg-white border h-9 border-orange-400 px-3 py-1 rounded-xl shadow z-30">
//           <span className="text-sm text-orange-600 font-medium">From</span>

//           <DatePicker
//             // selected={dateRange.from}
//             // onChange={(date) =>
//             //   setDateRange((p) => ({ ...p, from: date }))
//             // }
//             // selectsStart
//             // startDate={dateRange.from}
//             // endDate={dateRange.to}
//             dateFormat="dd MMM yyyy"
//             placeholderText="From Date"
//             className="w-28 h-8 leading-8 text-center outline-none text-sm"
//           />

//           <span className="text-sm text-orange-600 font-medium">To</span>

//           <DatePicker
//             // selected={dateRange.to}
//             // onChange={(date) =>
//             //   setDateRange((p) => ({ ...p, to: date }))
//             // }
//             selectsEnd
//             // startDate={dateRange.from}
//             // endDate={dateRange.to}
//             // minDate={dateRange.from}
//             dateFormat="dd MMM yyyy"
//             placeholderText="To Date"
//             className="w-28 h-8 leading-8 text-center outline-none text-sm"
//           />
//         </div>


//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2 mb-2">
//         {stats.map((item, index) => (
//           <div
//             key={index}
//             className={`bg-white rounded-lg p-2 shadow-sm border-l-4 ${item.accent}`}
//           >
//             <p className="text-sm text-black font-bold">{item.title}</p>
//             <h2 className="text-2xl font-semibold text-slate-800 mt-1">
//               {item.value}
//             </h2>
//           </div>
//         ))}
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow-sm">
//         <div className="p-5 border-b">
//           <h2 className="text-lg font-semibold text-slate-800">
//             Recent Leads
//           </h2>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-slate-50 text-slate-600">
//               <tr>
//                 <th className="px-5 py-3 text-left font-medium">Name</th>
//                 <th className="px-5 py-3 text-left font-medium">Date</th>
//                 <th className="px-5 py-3 text-left font-medium">Calling No</th>
//                 <th className="px-5 py-3 text-left font-medium">WhatsApp No</th>
//                 <th className="px-5 py-3 text-left font-medium">Lead Source</th>
//                 <th className="px-5 py-3 text-left font-medium">Lead Status</th>
//               </tr>
//             </thead>

//             <tbody>
//               {last7DaysLeads?.map((lead, index) => (
//                 <tr
//                   key={index}
//                   className="border-t hover:bg-slate-50 transition"
//                 >
//                   <td className="px-5 py-4 font-medium text-slate-800">
//                     {lead.ClientName}
//                   </td>
//                   <td className="px-5 py-4 font-medium text-slate-800">
//                     {lead.Date}
//                   </td>
//                   <td className="px-5 py-4 text-slate-600">
//                     {lead.CallingNo}
//                   </td>
//                   <td className="px-5 py-4 text-slate-600">
//                     {lead.WhatsAppNo}
//                   </td>
//                   <td className="px-5 py-4 text-slate-600">
//                     {lead.LeadSource}
//                   </td>
//                   <td className="px-5 py-4">
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[lead.status]}`}
//                     >
//                       {lead.LeadStatus}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;







import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useLeadsDetails} from './services'
import { DashboardSkeleton } from "./LeadsTableSkeleton";



const statusStyles = {
  Connected: "bg-green-50 text-green-700 border border-green-200",
  Ringing: "bg-yellow-50 text-yellow-700 border border-yellow-200",
};

const DashboardLeads = () => {

  const { data , isPending } = useLeadsDetails();
  const leadsDetails = data?.data || [];
  const [dateRange, setDateRange] = React.useState({
    from: null,
    to: null,
  });
// const stats = [
//   { title: "Total Leads", value: leadsDetails.length, accent: "border-blue-500 whitespace-nowrap" },
//   { title: "Booking Done", value: leadsDetails.filter(lead => lead.LeadStatus === "Booking Done").length, accent: "border-green-500 whitespace-nowrap" },
//   { title: "WhatsApp Not Done", value: leadsDetails.filter(lead => lead.WhatsAppMsgs === "Not Done").length, accent: "border-red-500 whitespace-nowrap" },
//   { title: "Calling Not Done", value: leadsDetails.filter(lead => lead.PhoneCalls === "Not Done").length, accent: "border-red-500 whitespace-nowrap" },
//   { title: "Visited Not Done", value: leadsDetails.filter(lead => lead.Visited === "No").length, accent: "border-red-500 whitespace-nowrap" },
//   { title: "Intrested But Depalyed", value: leadsDetails.filter(lead => lead.LeadStatus === "Intrested but Delayed ").length, accent: "border-yellow-500 whitespace-nowrap" },
//   { title: "Not Intrested", value: leadsDetails.filter(lead => lead.LeadStatus === "Not Intrested").length, accent: "border-cyan-500" },
//   // { title: "Female Leads", value: 20, accent: "border-pink-500" },
// ];




const parseLeadDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr);
};
const finalLeads = leadsDetails.filter((lead) => {
  const leadDate = parseLeadDate(lead.Date);
  if (!leadDate) return false;

  // 👉 If user selected date range → apply that
  if (dateRange.from && dateRange.to) {
    const from = new Date(dateRange.from);
    from.setHours(0, 0, 0, 0);

    const to = new Date(dateRange.to);
    to.setHours(23, 59, 59, 999);

    return leadDate >= from && leadDate <= to;
  }

  // 👉 Else default = last 7 days
  const today = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);

  return leadDate >= oneWeekAgo && leadDate <= today;
});


const stats = [
  { title: "Total Leads", value: finalLeads.length, accent: "border-blue-500 whitespace-nowrap" },
  { title: "Booking Done", value: finalLeads.filter(l => l.LeadStatus === "Booked").length, accent: "border-green-500 whitespace-nowrap" },
  { title: "Follow Up", value: finalLeads.filter(l => l.LeadStatus === "Follow Up").length, accent: "border-red-500 whitespace-nowrap" },
  { title: "Ringing", value: finalLeads.filter(l => l.LeadStatus === "Ringing").length, accent: "border-red-500 whitespace-nowrap" },
  { title: "Visit Schedule", value: finalLeads.filter(l => l.Reason === "Visit Schedule").length, accent: "border-red-500 whitespace-nowrap" },
  // { title: "Intrested But Depalyed", value: finalLeads.filter(l => l.LeadStatus === "Intrested but Delayed ").length, accent: "border-yellow-500 whitespace-nowrap" },
  { title: "Lost", value: finalLeads.filter(l => l.LeadStatus === "Lost").length, accent: "border-cyan-500" },
];
// const last7DaysLeads = leadsDetails?.filter((lead) => {
//   if (!lead?.Date) return false;

//   // "24 Jan 2026" → Date object
//   const leadDate = new Date(lead.Date);

//   const today = new Date();
//   const oneWeekAgo = new Date();
//   oneWeekAgo.setDate(today.getDate() - 7);

//   return leadDate >= oneWeekAgo && leadDate <= today;
// });
if(isPending){
  return <>
  <DashboardSkeleton/>
  </>
}

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <div className="mb-2">
          <h1 className="text-2xl font-semibold text-slate-800">
            Leads Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            {/* Overview of sales team performance and recent activity */}
            Overview of sales team performance
          </p>
        </div>
        <div className="flex items-center md:mr-10 gap-2 bg-white border h-9 border-orange-400 px-3 py-1 rounded-xl shadow z-30">
          <span className="text-sm text-orange-600 font-medium">From</span>

          <DatePicker
            selected={dateRange.from}
            onChange={(date) =>
              setDateRange((p) => ({ ...p, from: date }))
            }
            selectsStart
            startDate={dateRange.from}
            endDate={dateRange.to}
            isClearable
            dateFormat="dd MMM yyyy"
            placeholderText="From Date"
            className="w-28 h-8 leading-8 text-center outline-none text-sm"
          />

          <span className="text-sm text-orange-600 font-medium">To</span>

          <DatePicker
            selected={dateRange.to}
            onChange={(date) =>
              setDateRange((p) => ({ ...p, to: date }))
            }
            selectsEnd
            startDate={dateRange.from}
            endDate={dateRange.to}
            minDate={dateRange.from}
            isClearable   
            dateFormat="dd MMM yyyy"
            placeholderText="To Date"
            className="w-28 h-8 leading-8 text-center outline-none text-sm"
          />
        </div>


      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2 mb-2">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg p-2 shadow-sm border-l-4 ${item.accent}`}
          >
            <p className="text-sm text-black font-bold">{item.title}</p>
            <h2 className="text-2xl font-semibold text-slate-800 mt-1">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-5 border-b">
          <h2 className="text-lg font-semibold text-slate-800">
            Recent Leads
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Name</th>
                <th className="px-5 py-3 text-left font-medium">Date</th>
                <th className="px-5 py-3 text-left font-medium">Calling No</th>
                <th className="px-5 py-3 text-left font-medium">WhatsApp No</th>
                <th className="px-5 py-3 text-left font-medium">Lead Source</th>
                <th className="px-5 py-3 text-left font-medium">Lead Status</th>
              </tr>
            </thead>

            <tbody>
              {finalLeads?.map((lead, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-slate-50 transition"
                >
                  <td className="px-5 py-4 font-medium text-slate-800">
                    {lead.ClientName}
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-800">
                    {lead.Date}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {lead.CallingNo}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {lead.WhatsAppNo}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {lead.LeadSource}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[lead.status]}`}
                    >
                      {lead.LeadStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardLeads;