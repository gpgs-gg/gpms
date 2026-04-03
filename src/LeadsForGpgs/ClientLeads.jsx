import * as yup from "yup";
import { useEffect, useMemo, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { useWatch } from "react-hook-form"; // import Select from "react-select";
import { toast } from "react-toastify";
import { usePostClientDeatails, useUpdateClientDetails } from "./services";
import LoaderPage from "../components/LoaderPage";
import LeadsTable from "./LeadsTable";
import { useDynamicDetails, useEmployeeDetails } from "./services/index";
import { useApp } from "../context/AppProvider";
import { useNavigate } from "react-router-dom";
import { sl } from "date-fns/locale";
import DatePicker from "react-datepicker";

// ✅ Validation schema

function ClientLeads({
  activeLead,
  setActiveLead,
  setActiveTab,
  modalType,
  setModalType,
}) {
  const schema = yup.object().shape({
    ...(activeLead === "CreateSingleLead" && {
      CallingNo: yup.string().required("Calling No is required"),
    }),
    ...(activeLead === "CreateSingleLead" && {
      WhatsAppNo: yup.string().required("WhatsApp No is required"),
    }),
    ...(activeLead === "CreateSingleLead" && {
      Assignee: yup.object().nullable().required("Assignee is required"),
    }),
    ...(activeLead === "BulkUploadLeads" && {
      BulkAssignee: yup.object().nullable().required("Assignee is required"),
    }),
    ...(activeLead === "BulkUploadLeads" && {
      BulkCallingNo: yup.string().required("Calling No is required"),
    }),
    ...(activeLead === "BulkUploadLeads" && {
      BulkLeadSource: yup
        .object()
        .nullable()
        .required("Lead Source is required"),
    }),
    ...(activeLead === "CreateSingleLead" && {
      Email: yup
        .string()
        .email("Enter a valid email") // validates format if entered
        .nullable() // allows null
        .notRequired(), // not required
    }),

    //  ...(activeLead === "CreateSingleLead" && {
    //      LeadStatus: yup
    //   .object()
    //   .nullable()
    //   .required("Lead Status is required"),
    //   }),
    Reason: yup
      .object()
      .nullable()
      .test(
        "reason-required",
        "Reason is required when Lead Status is selected",
        function (value) {
          const { LeadStatus } = this.parent;

          // Agar LeadStatus Booked ya New nahi hai
          if (
            LeadStatus?.value !== "Booked" &&
            LeadStatus?.value !== "New" &&
            LeadStatus?.value !== undefined
          ) {
            // Check object properly
            if (!value || !value.value || !value.value.trim()) {
              return this.createError({
                message: `Reason is required when Lead Status is ${LeadStatus?.value}`,
              });
            }
          }

          return true;
        },
      ),
  });

  const selectOptionBulkData = [
    { value: "CallingNo", label: "Calling No" },
    { value: "ClientName", label: "Client Name" },
  ];

  const { selectedClient, setSelectedClient, decryptedUser } = useApp();
  const { data: EmployeeDetails } = useEmployeeDetails();

  const {
    control,
    handleSubmit,
    setValue,
    register,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    key: activeLead,
    resolver: yupResolver(schema, {
      context: { activeLead },

      // ✅ THIS IS IMPORTANT
    }),

    mode: "onSubmit", // ❗ required
    reValidateMode: "onChange",
    shouldUnregister: true,
    defaultValues: {
      ClientName: "",
      Email: "",
      Gender: null,
      CallingNo: "",
      WhatsAppNo: "",
      BulkCallingNo: "",
      BulkWhatsAppNo: "",
      LeadSource: null,
      BulkLeadSource: null,
      BulkAssignee: null,
      FollowupDate: "",
      Assignee: null,
      FieldMember: null,
      // PhoneCalls: null,
      // interestedLocation: null,
      LeadStatus: null,
      visited: null,
      Comments: "",
      WorkLogs: "",
      BulkOptions: selectOptionBulkData[0],
    },
  });

  const ManagerOptions = useMemo(() => {
    return (
      EmployeeDetails?.data
        ?.filter(
          (emp) => emp?.Name && emp?.Department && emp.Department === "Sales",
        )
        .map((emp) => ({
          value: emp.Name,
          label: emp.Name,
        })) || []
    );
  }, [EmployeeDetails]);

  useEffect(() => {
    reset({}, { keepErrors: false });
  }, [activeLead, reset]);

  // ===================== ✅ API Hooks =====================
  const { data: dynamicData } = useDynamicDetails();
  const { mutateAsync: createClient } = usePostClientDeatails();
  const { mutateAsync: updateClient } = useUpdateClientDetails();
  // const navigate = useNavigate()
  // const [selectedClient, setSelectedClient] = useState(null);

  const BulkLabeValue = watch("BulkOptions");
  //====================== ✅ Dropdown Options================================
  const selectOptionGender = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  const selectOptionLeadSource =
    Array.from(
      new Set(
        dynamicData?.data?.map((item) => item.LeadSource).filter(Boolean),
      ),
    ).map((value) => ({ value, label: value })) || [];

  const selectOptioninterestedLocation =
    Array.from(
      new Set(dynamicData?.data?.map((item) => item.Location).filter(Boolean)),
    ).map((value) => ({ value, label: value })) || [];

  const selectOptionReason =
    Array.from(
      new Set(dynamicData?.data?.map((item) => item.Reason).filter(Boolean)),
    ).map((value) => ({ value, label: value })) || [];

  const selectOptionPhoneCallCommunication =
    Array.from(
      new Set(
        dynamicData?.data?.map((item) => item.CallStatus).filter(Boolean),
      ),
    ).map((value) => ({ value, label: value })) || [];

  const selectOptionYesNo = [
    { value: "Done", label: "Done" },
    { value: "NotDone", label: "Not Done" },
  ];
  // const selectOptionBookingStatus = [
  //   { value: "Done", label: "Done" },
  //   { value: "NotDone", label: "Not Done" },
  // ];

  const selectOptionBookingStatus =
    Array.from(
      new Set(
        dynamicData?.data?.map((item) => item.LeadStatus).filter(Boolean),
      ),
    ).map((value) => ({ value, label: value })) || [];

  const employeeSelectStyles = {
    control: (base, state) => ({
      ...base,

      padding: "0.14rem 0.5rem",
      marginTop: "0.09rem",
      borderWidth: "1px",
      borderColor: state.isFocused ? "#fb923c" : "#f97316",
      borderRadius: "0.375rem",
      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(251,146,60,0.5)"
        : "0 1px 2px rgba(0,0,0,0.05)",
      backgroundColor: "white",
      minHeight: "40px",
      "&:hover": { borderColor: "#fb923c" },
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "white" : "#fb923c",
      backgroundColor: state.isSelected ? "#fb923c" : "white",
      "&:hover": { backgroundColor: "#fed7aa" },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  ///////////////// Akash Code //////////////////////

  const formatLogDate = () => {
    return new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getChangeText = (oldVal, newVal, label) => {
    if ((oldVal || "") !== (newVal || "")) {
      return `${label} changed from ${oldVal || "N/A"} to ${newVal || "N/A"}`;
    }
    return null;
  };

  const formatFollowupDate = (date) => {
    if (!date) return "";

    let parsedDate;

    // ✅ Already Date object
    if (date instanceof Date) {
      parsedDate = date;
    }
    // ✅ ISO / string date
    else {
      parsedDate = new Date(date);
    }

    // ❌ Invalid date protection
    if (isNaN(parsedDate)) return "";

    return parsedDate.toLocaleDateString("en-GB", {
      day: "numeric", // 1
      month: "short", // Jan
      year: "numeric", // 2026
    });
  };

  const onSubmit = async (data) => {
    /* ===================== UPDATE ===================== */
    if (selectedClient) {
      /* ---------- 1️⃣ Detect ALL normal field changes ---------- */
      const hasAnyFieldChanged =
        selectedClient.ClientName !== data.ClientName ||
        selectedClient.CallingNo !== data.CallingNo ||
        selectedClient.Email !== data.Email || // optional
        selectedClient.WhatsAppNo !== data.WhatsAppNo ||
        selectedClient.Gender !== data?.Gender?.value ||
        selectedClient.Location !== data?.Location?.value ||
        selectedClient.LeadSource !== data?.LeadSource?.value;

      /* ---------- 2️⃣ Detect ONLY worklog-related changes ---------- */
      const changes = [];

      const phoneChange = getChangeText(
        selectedClient.FieldMember,
        data?.FieldMember?.value,
        "Field Member",
      );

      const whatsappChange = getChangeText(
        selectedClient.Reason,
        data?.Reason?.value,
        "Reason",
      );

      const visitedChange = getChangeText(
        selectedClient.Assignee,
        data?.Assignee?.value,
        "Assignee",
      );

      const bookingStatusChange = getChangeText(
        selectedClient.LeadStatus,
        data?.LeadStatus?.value,
        "Lead Status",
      );

      if (phoneChange) changes.push(phoneChange);
      if (whatsappChange) changes.push(whatsappChange);
      if (visitedChange) changes.push(visitedChange);
      if (bookingStatusChange) changes.push(bookingStatusChange);

      /* ---------- 3️⃣ Block update if NOTHING changed ---------- */
      if (!hasAnyFieldChanged && !changes.length && !data?.Comments?.trim()) {
        toast.warn("No changes to update");
        return;
      }

      /* ---------- 4️⃣ Prepare WorkLogs (ONLY when needed) ---------- */
      let finalComments = selectedClient.WorkLogs || "";
      let log = "";
      if (changes.length || data?.Comments?.trim()) {
        const comment = data?.Comments?.trim();

        const changeText = changes
          .map((c) => c.trim()) // 👈 removes \n and extra spaces
          .join("\n"); // 👈 comma separated

        log = `[${formatLogDate()} - (${decryptedUser?.employee?.EmployeeID}) ${decryptedUser?.employee?.Name}]
${changeText}${comment ? `\n${comment}` : ""}`;

        finalComments = finalComments ? `${finalComments}` : log;
      }

      // ❌ Nothing changed
      if (!log && !hasAnyFieldChanged) return;

      /* =========================
         🔥 NEW LOG TOP, OLD BOTTOM
      ========================= */
      const finalWorkLog = log
        ? `${log}${finalComments ? "\n\n" + finalComments : ""}`
        : finalComments;

      const formattedFollowupDate = formatFollowupDate(data.FollowupDate);
      /* ---------- 5️⃣ Final UPDATE payload ---------- */
      const updatedData = {
        ClientName: data.ClientName,
        Email: data.Email || "", // optional
        CallingNo: data.CallingNo,
        WhatsAppNo: data.WhatsAppNo,
        Gender: data?.Gender?.value || "",
        Location: data?.Location?.value || "",
        LeadSource: data?.LeadSource?.value || "",
        FollowupDate: formattedFollowupDate || "",
        Assignee: data?.Assignee?.value || "",
        Reason: data?.Reason?.value,
        FieldMember: data?.FieldMember?.value || "",

        // PhoneCalls: data?.PhoneCalls?.value || "",
        // WhatsAppMsgs: data?.WhatsAppMsgs?.value || "",
        // Visited: data?.visited?.value || "",
        LeadStatus: data?.LeadStatus?.value || "",
        LeadNo: selectedClient.LeadNo,
        WorkLogs: finalWorkLog,
      };

      await updateClient({ data: updatedData });

      toast.success("Lead updated successfully!");
      setSelectedClient(null);
      reset();
      setActiveTab("leadsList");
      return;
    }

    /* ===================== CREATE ===================== */

    if (
      activeLead === "CreateSingleLead" &&
      (!data.CallingNo || !data.WhatsAppNo)
    ) {
      return;
    }

    if (
      activeLead === "BulkUploadLeads" &&
      (!data.BulkOptions || !data.BulkCallingNo)
    ) {
      return;
    }

    /* ---------- BULK CREATE ---------- */
    if (activeLead === "BulkUploadLeads") {
      const bulkPayload = {
        [data.BulkOptions.value]: data.BulkCallingNo,
        Assignee: data?.BulkAssignee?.value || "",
        LeadSource: data?.BulkLeadSource?.value || "",

        WorkLogs: `[${formatLogDate()} -(${decryptedUser?.employee?.EmployeeID}) ${decryptedUser?.employee?.Name}]
Bulk Created`,
        LeadStatus: "New",
        // PhoneCalls: "Not Done",
        // WhatsAppMsgs: "Not Done",
        // visited: "Not Done",
      };

      await createClient(bulkPayload);
      toast.success("Bulk leads added successfully!");
    } else {
      /* ---------- SINGLE CREATE ---------- */
      const createdData = {
        ClientName: data.ClientName,
        Email: data.Email || "",
        CallingNo: data.CallingNo,
        WhatsAppNo: data.WhatsAppNo,
        Gender: data?.Gender?.value || "",
        Location: data?.Location?.value || "",
        LeadSource: data?.LeadSource?.value || "",
        Assignee: data?.Assignee?.value || "",
        FieldMember: data?.FieldMember?.value || "",
        FollowupDate: formatFollowupDate(data.FollowupDate) || "",
        // PhoneCalls: data?.PhoneCalls?.value || "",
        // WhatsAppMsgs: data?.WhatsAppMsgs?.value || "",
        // Visited: data?.visited?.value || "",
        LeadStatus: data?.LeadStatus?.value || "New",
        WorkLogs: `[${formatLogDate()} - (${decryptedUser?.employee?.EmployeeID}) ${decryptedUser?.employee?.Name}]
Created by${data.Comments}`,
      };

      await createClient(createdData);
      toast.success("Lead added successfully!");
    }

    reset();
    setActiveTab("leadsList");
  };

  //  Auto-fill when editing
  useEffect(() => {
    if (!selectedClient) {
      reset();
      return;
    }

    reset({
      ClientName: selectedClient.ClientName || "",
      Email: selectedClient.Email || "", // optional
      CallingNo: selectedClient.CallingNo || "",
      WhatsAppNo: selectedClient.WhatsAppNo || "",
      // Comments: selectedClient.Comments || "",
    });

    const findOption = (options, val) => {
      if (!options || !val) return null;
      if (typeof val === "object" && val.value) return val;
      return (
        options.find(
          (o) =>
            String(o.value).toLowerCase() === String(val).toLowerCase() ||
            String(o.label).toLowerCase() === String(val).toLowerCase(),
        ) || { value: val, label: val }
      );
    };

    setValue("Gender", findOption(selectOptionGender, selectedClient.Gender));
    setValue("FollowupDate", selectedClient.FollowupDate);
    setValue("Assignee", findOption(ManagerOptions, selectedClient.Assignee));
    setValue(
      "FieldMember",
      findOption(ManagerOptions, selectedClient.FieldMember),
    );
    setValue(
      "LeadSource",
      findOption(
        selectOptionLeadSource,
        selectedClient.LeadSource || selectedClient.LeadSourcee,
      ),
    );
    setValue(
      "Location",
      findOption(
        selectOptioninterestedLocation,
        selectedClient.Location || selectedClient.Location,
      ),
    );
    setValue(
      "visited",
      findOption(
        selectOptionYesNo,
        selectedClient.Visited || selectedClient.visited,
      ),
    );
    // setValue("WhatsAppMsgs", findOption(selectOptionWhatsAppCommunication, selectedClient.WhatsAppMsgs));
    setValue("Reason", findOption(selectOptionReason, selectedClient.Reason));
    setValue(
      "PhoneCalls",
      findOption(selectOptionPhoneCallCommunication, selectedClient.PhoneCalls),
    );
    setValue(
      "LeadStatus",
      findOption(
        selectOptionYesNo,
        selectedClient.LeadStatus || selectedClient.LeadStatus,
      ),
    );
    setValue("WorkLogs", selectedClient.WorkLogs || "");
  }, [selectedClient, reset, setValue]);

  const handleCancel = () => {
    setSelectedClient(null);
    setActiveTab("leadsList");
    setActiveLead("BulkUploadLeads");
    reset();
  };

  //================== Tab Css ==============================================
  const TabColor = (tab) =>
    `py-2 px-4 rounded-md text-center cursor-pointer font-semibold text-lg md:w-96 w-full
${activeLead === tab ? "bg-orange-500 " : "text-gray-50 bg-orange-400 hover:bg-orange-400"}`;
  // =============================================================================================

  return (
    <div className="max-w-7xl mx-auto my-5 bg-white shadow-sm">
      <div className="rounded-xl p-2 border-2">
        {/* Buttons to switch activeLead */}
        <div className="md:flex md:justify-center grid grid-cols-1 text-xl font-semibold  gap-4 px-3 py-4 rounded-md text-white mb-4">
          {selectedClient === null && (
            <div
              className={`${TabColor("BulkUploadLeads")} ${
                selectedClient
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : ""
              }`}
              onClick={() => {
                if (!selectedClient) {
                  setActiveLead("BulkUploadLeads");
                }
              }}
            >
              <h2>Bulk Upload Leads</h2>
            </div>
          )}

          <div
            className={TabColor("CreateSingleLead")}
            onClick={() => setActiveLead("CreateSingleLead")}
          >
            <h2 className="cursor-pointer">
              {selectedClient ? "Update Single Lead" : "Add Single Lead"}
            </h2>
          </div>
        </div>

        {/* Conditional Rendering using if-else */}
        {activeLead === "BulkUploadLeads" ? (
          <div className="max-w-7xl mx-auto my-5 w-">
            <form className="mt-4 sm:p-1 p-3" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-5">
                {/* ================= BulkOptions (NARROW WIDTH) ================= */}
                <div className="grid md:grid-cols-5 grid-cols-1">
                  <div className="max-w-[220px]">
                    <label className="text-sm text-gray-700">
                      Create Bulk Leads
                    </label>
                    <Controller
                      name="BulkOptions"
                      control={control}
                      defaultValue={selectOptionBulkData[0]}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Select"
                          isClearable
                          styles={employeeSelectStyles}
                          options={selectOptionBulkData}
                        />
                      )}
                    />
                    {errors.BulkOptions && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.BulkOptions.message}
                      </p>
                    )}
                  </div>
                  <div className="max-w-[220px]">
                    <label className="text-sm text-gray-700">Lead Source</label>
                    <Controller
                      name="BulkLeadSource"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Select"
                          isClearable
                          styles={employeeSelectStyles}
                          options={selectOptionLeadSource}
                        />
                      )}
                    />
                    {errors.BulkLeadSource && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.BulkLeadSource.message}
                      </p>
                    )}
                  </div>
                  <div className="max-w-[220px]">
                    <label className="text-sm text-gray-700">Assignee</label>
                    <Controller
                      name="BulkAssignee"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Select"
                          isClearable
                          styles={employeeSelectStyles}
                          options={ManagerOptions}
                        />
                      )}
                    />
                    {errors.BulkAssignee && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.BulkAssignee.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* ================= Calling No  ================= */}
                <div>
                  <label className="text-sm text-gray-700">
                    <span className="relative after:content-['*'] after:ml-1 after:text-red-500">
                      {BulkLabeValue ? BulkLabeValue.label : "Chooese labe"}
                    </span>
                  </label>
                  <textarea
                    disabled={BulkLabeValue ? false : true}
                    placeholder="Enter Bulk Data"
                    className="w-full px-3 py-[8px] border outline-none border-orange-400 rounded-md focus:ring-2 focus:ring-orange-300"
                    {...register("BulkCallingNo")}
                  />
                  {errors.BulkCallingNo && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.BulkCallingNo.message}
                    </p>
                  )}
                </div>
              </div>

              {/* ================= ACTION BUTTONS ================= */}
              <div className="flex justify-center items-center gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`mt-5 px-4 py-2 rounded-md text-[16px] text-white ${
                    isSubmitting
                      ? "bg-orange-300 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex gap-2">
                      <LoaderPage />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    "Submit"
                  )}
                </button>

                <p
                  onClick={handleCancel}
                  className="mt-5 px-4 py-2 rounded-md text-[16px] cursor-pointer text-black"
                >
                  Cancel
                </p>
              </div>
            </form>
          </div>
        ) : // ========================================================== Single Upload Leads =============================================================================================

        activeLead === "CreateSingleLead" ? (
          <form className="mt-4 sm:p-1 p-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
              {/* Client Name */}
              <div>
                <label className="text-sm text-gray-700">
                  Client Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter full Client Name"
                  className="w-full px-3 py-[8px] border border-orange-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500 shadow-sm hover:border-orange-400"
                  {...register("ClientName")}
                />
              </div>
              {/* Email */}
              <div>
                <label className="text-sm text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="w-full px-3 py-[8px] border border-orange-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                  {...register("Email")}
                />
                {errors.Email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.Email.message}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="text-sm text-gray-700">Gender</label>
                <Controller
                  name="Gender"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Select Gender"
                      isClearable
                      styles={employeeSelectStyles}
                      options={selectOptionGender}
                    />
                  )}
                />
              </div>

              {/* Calling No */}
              <div>
                <label className="text-sm text-gray-700">
                  <span className="relative after:content-['*'] after:ml-1 after:text-red-500">
                    Calling No
                  </span>
                </label>
                <input
                  placeholder="Enter Phone No"
                  className="w-full px-3 py-[8px] border outline-none border-orange-400 rounded-md focus:ring-2 focus:ring-orange-300"
                  {...register("CallingNo")}
                />
                {errors.CallingNo && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.CallingNo.message}
                  </p>
                )}
              </div>

              {/* WhatsApp No */}
              <div>
                <label className="text-sm text-gray-700">
                  <span className="relative after:content-['*'] after:ml-1 after:text-red-500">
                    WhatsApp No
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter WhatsApp No"
                  className="w-full px-3 py-[8px] border outline-none border-orange-400 rounded-md focus:ring-2 focus:ring-orange-300"
                  {...register("WhatsAppNo")}
                />
                {errors.WhatsAppNo && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.WhatsAppNo.message}
                  </p>
                )}
              </div>

              {/* Lead Source */}
              <div>
                <label className="text-sm text-gray-700">Lead Source</label>
                <Controller
                  name="LeadSource"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Select Lead Source"
                      isClearable
                      styles={employeeSelectStyles}
                      options={selectOptionLeadSource}
                    />
                  )}
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Assignee</label>
                <Controller
                  name="Assignee"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Select"
                      isClearable
                      styles={employeeSelectStyles}
                      options={ManagerOptions}
                    />
                  )}
                />
                {errors.Assignee && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.Assignee.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-700">Field Member</label>
                <Controller
                  name="FieldMember"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Select"
                      isClearable
                      styles={employeeSelectStyles}
                      options={ManagerOptions}
                    />
                  )}
                />
              </div>

              {/* {selectedClient && ( */}
              <div className="">
                <label className="text-sm text-gray-700">Followup Date</label>
                <div className="w-full">
                  <Controller
                    control={control}
                    name="FollowupDate"
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        placeholderText="Select Followup Date"
                        dateFormat="d MMM yyyy"
                        isClearable
                        className="w-full px-3 py-[8px] border outline-none border-orange-400 rounded-md focus:ring-2 focus:ring-orange-300"
                      />
                    )}
                  />
                </div>
              </div>

              {/* Booking Status */}
              <div>
                <label className="text-sm text-gray-700">Lead Status</label>
                <Controller
                  name="LeadStatus"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Lead Status"
                      isClearable
                      styles={employeeSelectStyles}
                      options={selectOptionBookingStatus}
                    />
                  )}
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Reason</label>

                <Controller
                  name="Reason"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Select Reason"
                      isClearable
                      styles={employeeSelectStyles}
                      options={selectOptionReason}
                      // isDisabled={!effectiveLeadStatus}
                    />
                  )}
                />
                {errors.Reason && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.Reason.message}
                  </p>
                )}
              </div>
              {/* Comments */}
              <div>
                <label
                  className={`text-sm text-gray-700 ${selectedClient ? "relative after:content-['*'] after:ml-1 after:text-red-500" : ""}`}
                >
                  Comments
                </label>
                <textarea
                  className="w-full px-3 py-[8px] border outline-none border-orange-400 rounded-md focus:ring-2 focus:ring-orange-300"
                  {...register("Comments")}
                />
                {errors.Comments && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.Comments.message}
                  </p>
                )}
              </div>

              {selectedClient && (
                <div className="md:col-span-3 sm:col-span-2 col-span-1">
                  <label className="text-sm text-gray-700">Work Logs</label>
                  <textarea
                    disabled
                    className="w-full px-3 py-[8px] border outline-none rounded-md focus:ring-2 focus:ring-orange-300"
                    {...register("WorkLogs")}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-center items-center gap-5">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`mt-5 px-4 py-2 rounded-md text-[16px] text-white ${isSubmitting ? "bg-orange-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"}`}
              >
                {isSubmitting ? (
                  <div className="flex justify-center items-center gap-2">
                    <LoaderPage />
                    {selectedClient ? "Updating..." : "Submitting..."}
                  </div>
                ) : selectedClient ? (
                  "Update"
                ) : (
                  "Submit"
                )}
              </button>

              <p
                onClick={handleCancel}
                className="mt-5 border px-4 py-2 rounded-md text-[16px] cursor-pointer text-black"
              >
                Cancel
              </p>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
}

export default ClientLeads;
