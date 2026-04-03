import { useEffect, useMemo, useRef, useState } from "react";
import { useLeadsDetails, useUpdateClientDetails } from "./services";
import { addDays, startOfDay } from "date-fns";
import { useDynamicDetails, useEmployeeDetails } from "./services/index";
import LoaderPage from "../components/LoaderPage";
import { toast } from "react-toastify";
import { useApp } from "../context/AppProvider";
import { FaBed } from "react-icons/fa";
import Select from "react-select";
import { RxCross2 } from "react-icons/rx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { LeadsTableSkeleton } from "./LeadsTableSkeleton";

function LeadsTable({ setActiveTab, activeLead, setActiveLead }) {
  const { decryptedUser, selectedClient, setSelectedClient } = useApp();
  const { data, isPending } = useLeadsDetails();
  const { mutateAsync: updateClient, isPending: isUpdatePending } =
    useUpdateClientDetails();
  const { data: EmployeeDetails } = useEmployeeDetails();
  const { data: dynamicData } = useDynamicDetails();
  const clientList = data?.data || [];
  const menuOpenRef = useRef(false);
  const commentRef = useRef(null);
  const [rows, setRows] = useState([]);
  const [editedRows, setEditedRows] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDefaultMode, setIsDefaultMode] = useState(false);
  const [selectedLeadNos, setSelectedLeadNos] = useState([]);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAssignee, setTransferAssignee] = useState(null);
  /* ================= PAGINATION ================= */
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20; // you can change this
  const [FollowupDate, setFallowupDate] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchData, setSearchData] = useState("");

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
    const handler = setTimeout(() => {
      setSearchData(searchInput);
    }, 1000);

    // Cleanup previous timeout if searchInput changes before 1 second
    return () => clearTimeout(handler);
  }, [searchInput]);
  /* ================= FILTER STATES ================= */
  const [filters, setFilters] = useState({
    LeadStatus: [],
    Visited: [],
    PhoneCalls: [],
    Assignee: [],
    FollowupDate: [],
    Reason: [],
    search: [],
    FieldMember: [],
    LeadSource: [],
  });

  // decryptedUser?.employee?.Name ===
  useEffect(() => {
    if (!isDefaultMode) return;

    const empName = decryptedUser?.employee?.Name;

    if (!empName || !ManagerOptions.length) return;

    const isManager = ManagerOptions.some((opt) => opt.value === empName);

    if (isManager) {
      setFilters((prev) => ({
        ...prev,
        Assignee: [empName], // 👈 default active
      }));
    }
  }, [decryptedUser, ManagerOptions, isDefaultMode]);

  useEffect(() => {
    // if (!isDefaultMode || !FollowupDate) return;

    if (FollowupDate) {
      setFilters((prev) => ({
        ...prev,
        FollowupDate: [FollowupDate], // overwrite safely
        // OR use [...prev.FollowupDate, FollowupDate] to keep multiple
      }));
    }
  }, [FollowupDate, isDefaultMode]);

  useEffect(() => {
    if (searchData) {
      setFilters((prev) => ({
        ...prev,
        search: [searchData], // overwrite safely
        // OR use [...prev.FollowupDate, FollowupDate] to keep multiple
      }));
    }
  }, [searchData]);

  // useEffect(() => {
  //   setIsDefaultMode(true);
  // }, []);

  const [dateRange, setDateRange] = useState({
    from: null, // 👈 today
    to: null, // 👈 today
  });

  const handleAppliedDefalut = () => {
    const today = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    setFallowupDate(today);
    setDateRange({ from: today, to: today });
    setIsDefaultMode(true);
  };

  const [openFilter, setOpenFilter] = useState(null);

  /* ================= FILTER OPTIONS ================= */
  const phoneCallOptions =
    Array.from(
      new Set(dynamicData?.data?.map((i) => i.CallStatus).filter(Boolean)),
    ).map((v) => ({ value: v, label: v })) || [];

  const ReasonOptions =
    Array.from(
      new Set(dynamicData?.data?.map((i) => i.Reason).filter(Boolean)),
    ).map((v) => ({ value: v, label: v })) || [];

  const bookingStatusOptions =
    Array.from(
      new Set(dynamicData?.data?.map((i) => i.LeadStatus).filter(Boolean)),
    ).map((v) => ({ value: v, label: v })) || [];

  const visitedOptions =
    Array.from(
      new Set(dynamicData?.data?.map((i) => i.LeadSource).filter(Boolean)),
    ).map((v) => ({ value: v, label: v })) || [];
  const filterConfig = [
    { key: "Assignee", label: "Assignee", options: ManagerOptions },
    { key: "FieldMember", label: "Field Member", options: ManagerOptions },
    // { key: "PhoneCalls", label: "Phone Call", options: phoneCallOptions, icon: <PiPhoneCallFill /> },
    // { key: "Visited", label: "Visited", options: visitedOptions, icon: <MdLocationOn /> },
    { key: "LeadSource", label: "Lead Source", options: visitedOptions },
    { key: "LeadStatus", label: "Lead Status", options: bookingStatusOptions },
    { key: "Reason", label: "Reason", options: ReasonOptions },
  ];

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    if (!clientList.length) return;
    setRows(clientList);
    setEditedRows(JSON.parse(JSON.stringify(clientList)));
    setHasChanges(false);
  }, [clientList]);

  const parseFollowupDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr);
  };

  const isSameDay = (d1, d2) =>
    d1 &&
    d2 &&
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  /* ---------------- APPLY FILTER ---------------- */
  const today = new Date();

  const filteredRows = clientList?.filter((c) => {
    const rowDate = c.Date ? new Date(c.Date) : null;
    const rowFollowupDate = parseFollowupDate(c.FollowupDate);

    /* 🔍 SEARCH */
    const matchesSearch = searchData
      ? Object.values(c).some((v) =>
          String(v ?? "")
            .toLowerCase()
            .includes(searchData?.trim()?.toLowerCase()),
        )
      : true;

    /* 🎯 OTHER FILTERS */
    const matchesFilters =
      (filters.LeadStatus.length === 0 ||
        filters.LeadStatus.includes(c.LeadStatus)) &&
      (filters.Visited.length === 0 || filters.Visited.includes(c.Visited)) &&
      (filters.PhoneCalls.length === 0 ||
        filters.PhoneCalls.includes(c.PhoneCalls)) &&
      (filters.Assignee.length === 0 ||
        filters.Assignee.includes(c.Assignee)) &&
      (filters.Reason.length === 0 || filters.Reason.includes(c.Reason)) &&
      (filters.FieldMember.length === 0 ||
        filters.FieldMember.includes(c.FieldMember)) &&
      (filters.LeadSource.length === 0 ||
        filters.LeadSource.includes(c.LeadSource));

    /* 📅 DATE FLAGS */
    const isDateRangeSelected = !!(dateRange.from || dateRange.to);
    const isFollowupSelected = filters.FollowupDate?.length > 0;

    const isDateInRange =
      (!dateRange.from || (rowDate && rowDate >= dateRange.from)) &&
      (!dateRange.to || (rowDate && rowDate <= dateRange.to));

    const isFollowupMatch = isFollowupSelected
      ? filters.FollowupDate.some((fd) =>
          isSameDay(parseFollowupDate(fd), rowFollowupDate),
        )
      : false;

    const isTodayDate = rowDate && isSameDay(rowDate, today);
    const isTodayFollowup = isSameDay(rowFollowupDate, today);

    /* ✅ FINAL DATE LOGIC */
    let matchesDate;

    if (isDefaultMode) {
      // 🔥 only on first load
      matchesDate = isTodayDate || isTodayFollowup;
    } else if (isDateRangeSelected && isFollowupSelected) {
      matchesDate = isDateInRange || isFollowupMatch;
    } else if (isDateRangeSelected) {
      matchesDate = isDateInRange;
    } else if (isFollowupSelected) {
      matchesDate = isFollowupMatch;
    } else {
      // clear state → show everything
      matchesDate = true;
    }

    return matchesSearch && matchesFilters && matchesDate;
  });

  // ==================== Clear All Filter ======================================
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleClearAllFilters = () => {
    setFilters({
      LeadStatus: [],
      Visited: [],
      PhoneCalls: [],
      Assignee: [],
      FollowupDate: [],
      Reason: [],
      search: [],
      FieldMember: [],
      LeadSource: [],
    });
    setDateRange({ from: null, to: null });
    setFilters((prev) => ({ ...prev, FollowupDate: [] }));
    setIsDefaultMode(false); // 🔥 THIS IS THE FIX
    setSearchInput("");
    setFallowupDate();
  };

  const isAnyFilterApplied =
    Object.values(filters).some((arr) => arr.length > 0) ||
    dateRange.from !== null ||
    dateRange.to !== null;

  /* ---------------- EDIT CELL ---------------- */
  const handleCellEdit = (rowIndex, field, value) => {
    setEditedRows((prev) => {
      const updated = [...prev];
      updated[rowIndex] = { ...updated[rowIndex], [field]: value };
      return updated;
    });

    // 🔥 Check if anything changed including newWorkLog
    const original = rows[rowIndex];
    if (field === "newWorkLog" || value !== original[field]) {
      setHasChanges(true);
    }
  };
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
  /* ------------------- Handle Edit Client --------------------- */
  const handleEdit = (client) => {
    console.log(111, client);
    setSelectedClient(client);
    setActiveTab("UpdateLead");
    setActiveLead("CreateSingleLead");
  };

  const handleCheckboxChange = (leadNo) => {
    setSelectedLeadNos((prev) =>
      prev.includes(leadNo)
        ? prev.filter((no) => no !== leadNo)
        : [...prev, leadNo],
    );
  };

  const handleTransferSave = async () => {
    const comment = commentRef.current?.value?.trim();

    if (!comment) {
      toast.error("Comment is required to transfer the lead");
      commentRef.current?.focus();
      return;
    }
    try {
      const payload = [];

      rows.forEach((row) => {
        if (!selectedLeadNos.includes(row.LeadNo)) return;

        const oldAssignee = row.Assignee || "Unassigned";
        const newAssignee = transferAssignee.label;

        const newLog =
          `[${formatLogDate()} - (${decryptedUser?.employee?.EmployeeID}) ${decryptedUser?.employee?.Name}]\n` +
          `Lead transferred ${oldAssignee} to ${newAssignee}\n${comment}`;

        payload.push({
          LeadNo: row.LeadNo, // ✅ LeadNo based
          Assignee: transferAssignee.value, // or Assignee
          WorkLogs: newLog + (row.WorkLogs ? "\n\n" + row.WorkLogs : ""),
        });
      });

      if (!payload.length) {
        toast.warn("No leads selected");
        return;
      }

      await updateClient({ data: payload });

      toast.success("Leads transferred successfully");

      setSelectedLeadNos([]);
      setShowTransferModal(false);
      setTransferAssignee(null);
    } catch (err) {
      console.error(err);
      toast.error("Transfer failed");
    }
  };
  /* ---------------- SAVE ---------------- */
  //   const handleSave = async () => {
  //     setSaving(true);

  //     try {
  //       const payload = [];

  //       editedRows.forEach((edited, index) => {
  //         const original = rows[index];
  //         const changedFields = [];
  //         const updateData = {};

  //         const fieldLabels = {
  //           LeadStatus: "Lead Status",
  //           Gender: "Gender",
  //         };
  // let hasValidationError = false;

  // for (let i = 0; i < editedRows.length; i++) {
  //   const edited = editedRows[i];
  //   const original = rows[i];

  //   const leadStatus = edited?.LeadStatus ?? original?.LeadStatus;
  //   const reason = edited?.Reason ?? original?.Reason;

  //   if (leadStatus === "Not Interested" && !reason) {
  //     hasValidationError = true;
  //     console.log("Validation failed for LeadNo:", edited?.LeadNo);
  //     break; // ⛔ loop stop
  //   }
  // }

  // if (hasValidationError) {
  //   toast.dismiss();
  //   toast.error("Reason is required when Lead Status is Not Interested", {
  //     toastId: "reason-required", // 🔥 IMPORTANT
  //   });
  //   setSaving(false);
  //   return;
  // }

  //         Object.keys(edited).forEach((key) => {
  //           if (key === "newWorkLog") return;

  //           if (edited[key] !== original[key]) {
  //             updateData[key] = edited[key];

  //             if (fieldLabels[key]) {
  //               changedFields.push(
  //                 `${fieldLabels[key]} changed from ${original[key] || ""} to ${edited[key] || ""}`
  //               );
  //             }
  //           }
  //         });

  //         const oldLogs = original.WorkLogs || "";
  //         let newLogs = "";

  //         /* =========================
  //            🔹 AUTO FIELD CHANGE LOG
  //         ========================= */
  //         if (changedFields.length > 0) {
  //           newLogs +=
  //             `[${formatLogDate()} - (${decryptedUser?.employee?.EmployeeID}) ${decryptedUser?.employee?.Name}]\n` +
  //             changedFields.join("\n");
  //         }

  //         /* =========================
  //            🔹 MANUAL COMMENT LOG
  //         ========================= */
  //         if (edited.newWorkLog?.trim()) {
  //           newLogs +=
  //             `${newLogs ? "\n" : ""}` +
  //             `[${formatLogDate()} - (${decryptedUser?.employee?.EmployeeID}) ${decryptedUser?.employee?.Name}]\n` +
  //             edited.newWorkLog.trim();
  //         }

  //         // ❌ Nothing changed
  //         if (!newLogs && !Object.keys(updateData).length) return;

  //         /* =========================
  //            🔥 NEW LOG TOP, OLD BOTTOM
  //         ========================= */
  //         const finalWorkLog = newLogs
  //           ? `${newLogs}${oldLogs ? "\n\n" + oldLogs : ""}`
  //           : oldLogs;

  //         payload.push({
  //           LeadNo: edited.LeadNo,
  //           ...updateData,
  //           WorkLogs: finalWorkLog,
  //         });
  //       });

  //       if (!payload.length) {
  //         toast.warn("No changes found");
  //         return;
  //       }

  //       await updateClient({ data: payload });

  //       // reset comment box
  //       const updatedRows = editedRows.map((row) => ({
  //         ...row,
  //         newWorkLog: "",
  //       }));

  //       setRows(JSON.parse(JSON.stringify(updatedRows)));
  //       setEditedRows(JSON.parse(JSON.stringify(updatedRows)));
  //       setHasChanges(false);

  //       toast.success("Leads updated successfully");
  //     } catch (err) {
  //       toast.error("Update failed");
  //     } finally {
  //       setSaving(false);
  //     }
  //   };

  const handleSave = async () => {
    setSaving(true);

    try {
      /* =========================
         🔴 STEP 1: VALIDATION
         - Reason required for:
           ✔ Not Interested
           ✔ Follow Up
         - FollowupDate NOT required
      ========================= */

      /* =========================
         🔵 STEP 2: BUILD PAYLOAD
      ========================= */

      /* =========================
      🔵 STEP 2: BUILD PAYLOAD (SAFE VERSION)
   ========================= */

      const payload = [];

      const normalize = (v) => (v === undefined || v === null ? "" : v);

      editedRows.forEach((edited, index) => {
        const original = rows[index];
        if (!original) return;

        // 🔥 Skip row if completely identical (fast check)
        const isSame =
          JSON.stringify({ ...edited, newWorkLog: undefined }) ===
          JSON.stringify(original);

        if (isSame && !edited.newWorkLog?.trim()) {
          return; // 🚀 Skip untouched rows
        }

        const changedFields = [];
        const updateData = {};

        const fieldLabels = {
          LeadStatus: "Lead Status",
          Gender: "Gender",
          Reason: "Reason",
          FollowupDate: "Followup Date",
          FieldMember: "Field Member",
        };

        Object.keys(original).forEach((key) => {
          const oldVal = normalize(original[key]);
          const newVal = normalize(edited[key]);

          if (oldVal !== newVal) {
            updateData[key] = newVal;

            if (fieldLabels[key]) {
              changedFields.push(
                `${fieldLabels[key]} changed from ${
                  oldVal || "N/A"
                } to ${newVal || "N/A"}`,
              );
            }
          }
        });

        const oldLogs = original.WorkLogs || "";
        let newLogs = "";

        if (changedFields.length > 0) {
          newLogs +=
            `[${formatLogDate()} - (${decryptedUser?.employee?.EmployeeID}) ${decryptedUser?.employee?.Name}]\n` +
            changedFields.join("\n");
        }

        if (edited.newWorkLog?.trim()) {
          newLogs +=
            `${newLogs ? "\n" : ""}` +
            `[${formatLogDate()} - (${decryptedUser?.employee?.EmployeeID}) ${decryptedUser?.employee?.Name}]\n` +
            edited.newWorkLog.trim();
        }

        if (
          Object.keys(updateData).length === 0 &&
          !edited.newWorkLog?.trim()
        ) {
          return;
        }

        const finalWorkLog = newLogs
          ? `${newLogs}${oldLogs ? "\n\n" + oldLogs : ""}`
          : oldLogs;

        payload.push({
          LeadNo: edited.LeadNo,
          ...updateData,
          WorkLogs: finalWorkLog,
        });
      });

      /* =========================
         🟡 STEP 3: NO CHANGES CHECK
      ========================= */

      if (!payload.length) {
        toast.warn("No changes found");
        setSaving(false);
        return;
      }

      for (const row of payload) {
        const { LeadNo, LeadStatus, Reason, FollowupDate } = row;

        // 👉 Find original row
        const originalRow = rows.find((r) => r.LeadNo === LeadNo);

        const finalLeadStatus = LeadStatus ?? originalRow?.LeadStatus;

        const finalReason = Reason ?? originalRow?.Reason;

        const finalFollowupDate = FollowupDate ?? originalRow?.FollowupDate;

        // 🔴 Reason required except Booked & New
        if (
          finalLeadStatus?.trim() !== "Booked" &&
          finalLeadStatus?.trim() !== "New" &&
          !finalReason?.trim()
        ) {
          toast.dismiss();
          toast.error(
            `Reason is required when Lead Status is ${finalLeadStatus} (LeadNo: ${LeadNo})`,
            { toastId: `reason-${LeadNo}` },
          );
          setSaving(false);
          return;
        }

        // 🔴 Follow-up Date only for Follow Up
        if (finalLeadStatus === "Follow Up" && !finalFollowupDate) {
          toast.dismiss();
          toast.error(
            `Follow-up Date is required when Lead Status is Follow Up (LeadNo: ${LeadNo})`,
            { toastId: `followup-${LeadNo}` },
          );
          setSaving(false);
          return;
        }
      } /* =========================
         🟢 STEP 4: API CALL
      ========================= */

      await updateClient({ data: payload });

      const updatedRows = editedRows.map((row) => ({
        ...row,
        newWorkLog: "",
      }));

      setRows(JSON.parse(JSON.stringify(updatedRows)));
      setEditedRows(JSON.parse(JSON.stringify(updatedRows)));
      setHasChanges(false);

      toast.success("Leads updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const employeeSelectStyles = {
    control: (base, state) => ({
      ...base,
      padding: "0.14rem 0.5rem",
      borderWidth: "1px",
      // borderColor: state.isFocused ? "#fb923c" : "#f97316",
      border: "none",
      width: "100%",
      outline: "none",
      borderRadius: "0.375rem",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(251,146,60,0.4)" : "none",
      minHeight: "38px",
      cursor: "pointer",
    }),

    /* ✅ MOST IMPORTANT FIX */
    option: (base, state) => ({
      ...base,
      cursor: "pointer",
      Size: "10px",
      /* 🔥 arrow ने hover केल्यावर */
      backgroundColor: state.isFocused
        ? "#fed7aa" // light orange
        : state.isSelected
          ? "#fb923c" // selected
          : "white",

      color: state.isSelected ? "white" : "#f97316",

      fontWeight: state.isSelected ? "600" : "400",
    }),

    /* menu scroll fix */
    menuList: (base) => ({
      ...base,
      maxHeight: "200px",
      paddingTop: 0,
      paddingBottom: 0,
    }),

    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  /* ---------------- EDITABLE CELL WITH SHEETS STYLE NAVIGATION ---------------- */
  const EditableCell = ({ rowIndex, field }) => {
    const isEditing =
      editingCell?.rowIndex === rowIndex && editingCell?.field === field;

    const value = editedRows[rowIndex]?.[field] || "";

    const fieldOrder = [
      "ClientName",
      "Gender",
      "CallingNo",
      "WhatsAppNo",
      "FollowupDate",
      "LeadStatus",
      "Reason",
      "FieldMember",
      "newWorkLog",
    ];

    const selectFields = ["Gender", "LeadStatus", "Reason", "FieldMember"];

    const getOptions = (field) => {
      if (!dynamicData?.data) return [];

      const unique = (key) =>
        Array.from(
          new Set(dynamicData.data.map((i) => i[key]).filter(Boolean)),
        ).map((v) => ({ label: v, value: v }));

      switch (field) {
        case "Gender":
          return unique("Gender");

        case "Reason":
          return unique("Reason");

        case "LeadStatus":
          return unique("LeadStatus");

        case "FieldMember":
          return ManagerOptions; // 👈 HERE

        default:
          return [];
      }
    };

    const getNextCell = (rowIndex, field, direction = "right") => {
      const colIndex = fieldOrder.indexOf(field);
      let newRow = rowIndex;
      let newCol = colIndex;

      if (direction === "right") {
        newCol++;
        if (newCol >= fieldOrder.length) {
          newCol = 0;
          newRow++;
        }
      } else if (direction === "left") {
        newCol--;
        if (newCol < 0) {
          newCol = fieldOrder.length - 1;
          newRow--;
        }
      } else if (direction === "down") newRow++;
      else if (direction === "up") newRow--;

      if (newRow < 0) newRow = 0;
      if (newRow >= editedRows.length) newRow = editedRows.length - 1;

      return { rowIndex: newRow, field: fieldOrder[newCol] };
    };

    /* ---------- NORMAL CELL ---------- */
    if (!isEditing) {
      return (
        <td
          className="cursor-pointer px-5"
          onDoubleClick={() => setEditingCell({ rowIndex, field })}
        >
          {value || "-"}
        </td>
      );
    }

    //* ---------- SELECT CELL ---------- */
    if (selectFields.includes(field)) {
      const options = getOptions(field);

      const isReasonDisabled =
        field === "Reason" &&
        editedRows[rowIndex]?.LeadStatus !== "Not Interested" &&
        editedRows[rowIndex]?.LeadStatus !== "Follow Up";

      return (
        <td className="border relative text-center whitespace-nowrap">
          <Select
            autoFocus
            isClearable
            // isDisabled={isReasonDisabled}   // ✅ CORRECT
            value={options.find((o) => o.value === value) || null}
            options={options}
            styles={employeeSelectStyles}
            // menuPlacement="auto"
            menuShouldScrollIntoView
            backspaceRemovesValue={false}
            menuPlacement="bottom" // 👈 force upar
            menuPosition="fixed" // 👈 table se bahar calculate
            menuPortalTarget={document.body} // 👈 body me render
            onMenuOpen={() => {
              menuOpenRef.current = true;
            }}
            onMenuClose={() => {
              menuOpenRef.current = false;
            }}
            onKeyDown={(e) => {
              if (menuOpenRef.current) return;

              let next;
              switch (e.key) {
                case "Tab":
                  e.preventDefault();
                  setEditingCell(
                    getNextCell(rowIndex, field, e.shiftKey ? "left" : "right"),
                  );
                  break;

                case "ArrowRight":
                  e.preventDefault();
                  setEditingCell(getNextCell(rowIndex, field, "right"));
                  break;

                case "ArrowLeft":
                  e.preventDefault();
                  setEditingCell(getNextCell(rowIndex, field, "left"));
                  break;

                case "ArrowDown":
                  e.preventDefault();
                  setEditingCell(getNextCell(rowIndex, field, "down"));
                  break;

                case "ArrowUp":
                  e.preventDefault();
                  setEditingCell(getNextCell(rowIndex, field, "up"));
                  break;

                case "Escape":
                  setEditingCell(null);
                  break;
              }
            }}
            onChange={(selected) => {
              // if (isReasonDisabled) return;
              handleCellEdit(rowIndex, field, selected?.value || "");
            }}
          />
        </td>
      );
    }

    if (field === "FollowupDate") {
      return (
        <td className="border relative text-center whitespace-nowrap">
          <DatePicker
            selected={value ? new Date(value) : null}
            dateFormat="d MMM yyyy"
            placeholderText="Select date"
            className="w-full text-center bg-transparent outline-none  "
            shouldFocusOnRender
            isClearable
            minDate={addDays(startOfDay(new Date()), 1)}
            /* 🔥 IMPORTANT FIX */
            /* 🔥 MAIN FIX */
            popperPlacement="bottom-start"
            popperPositionFixed
            portalId="datepicker-portal"
            // 👈 table/scroll issue fix
            popperContainer={({ children }) => (
              <div style={{ zIndex: 99999 }}>{children}</div>
            )}
            onChange={(date) => {
              const formatted = date
                ? format(date, "d MMM yyyy") // 🔥 FIX
                : "";
              handleCellEdit(rowIndex, field, formatted);
            }}
            onKeyDown={(e) => {
              let next;
              switch (e.key) {
                case "Enter":
                case "Tab":
                  e.preventDefault();
                  next = getNextCell(
                    rowIndex,
                    field,
                    e.shiftKey ? "left" : "right",
                  );
                  setEditingCell(next);
                  break;

                case "ArrowRight":
                  e.preventDefault();
                  setEditingCell(getNextCell(rowIndex, field, "right"));
                  break;

                case "ArrowLeft":
                  e.preventDefault();
                  setEditingCell(getNextCell(rowIndex, field, "left"));
                  break;

                case "ArrowDown":
                  e.preventDefault();
                  setEditingCell(getNextCell(rowIndex, field, "down"));
                  break;

                case "ArrowUp":
                  e.preventDefault();
                  setEditingCell(getNextCell(rowIndex, field, "up"));
                  break;

                case "Escape":
                  setEditingCell(null);
                  break;
              }
            }}
            onBlur={() => setEditingCell(null)}
          />
        </td>
      );
    }
    /* ---------- INPUT CELL ---------- */
    return (
      <td className="border relative ">
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <input
            autoFocus
            defaultValue={value}
            className="h-full w-full bg-transparent border-2 text-center focus:outline-none"
            onBlur={(e) => {
              handleCellEdit(rowIndex, field, e.target.value);
              setEditingCell(null);
            }}
            onKeyDown={(e) => {
              let next;

              switch (e.key) {
                case "Enter":
                  e.preventDefault();
                  next = getNextCell(
                    rowIndex,
                    field,
                    e.shiftKey ? "down" : "right",
                  );
                  handleCellEdit(rowIndex, field, e.target.value);
                  setEditingCell(next);
                  break;

                case "Tab":
                  e.preventDefault();
                  next = getNextCell(
                    rowIndex,
                    field,
                    e.shiftKey ? "left" : "right",
                  );
                  handleCellEdit(rowIndex, field, e.target.value);
                  setEditingCell(next);
                  break;

                case "ArrowRight":
                  e.preventDefault();
                  next = getNextCell(rowIndex, field, "right");
                  handleCellEdit(rowIndex, field, e.target.value);
                  setEditingCell(next);
                  break;

                case "ArrowLeft":
                  e.preventDefault();
                  next = getNextCell(rowIndex, field, "left");
                  handleCellEdit(rowIndex, field, e.target.value);
                  setEditingCell(next);
                  break;

                case "ArrowDown":
                  e.preventDefault();
                  next = getNextCell(rowIndex, field, "down");
                  handleCellEdit(rowIndex, field, e.target.value);
                  setEditingCell(next);
                  break;

                case "ArrowUp":
                  e.preventDefault();
                  next = getNextCell(rowIndex, field, "up");
                  handleCellEdit(rowIndex, field, e.target.value);
                  setEditingCell(next);
                  break;

                case "Escape":
                  setEditingCell(null);
                  break;
              }
            }}
          />
        </div>
      </td>
    );
  };
  const isValidDate = (value) => {
    const dateRegex =
      /^(0?[1-9]|[12][0-9]|3[01]) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4}$/;
    return dateRegex.test(value);
  };

  if (isPending)
    return (
      // <div className="min-h-screen flex items-center justify-center">
      //   <LoaderPage />
      <LeadsTableSkeleton />
      // </div>
    );

  /* ---------------- UI ---------------- */
  return (
    <>
      <div className="max-w-full mx-auto mt-3 p-2  max-h-[600px] bg-gray-50 rounded-lg shadow-md">
        {/* ===== FILTER BAR ===== */}
        <div className="flex flex-wrap justify-center items-center gap-3 mb-3  relative">
          <div className="flex  flex-wrap gap-2 items-center mx-auto">
            <div className="flex items-center gap-2 bg-white border border-orange-400 px-3 py-1 rounded-xl z-30 shadow">
              <input
                type="text"
                value={searchInput}
                placeholder="Search"
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-28 text-center outline-none text-sm"
              />
            </div>

            <div className="flex items-center gap-2 bg-white border border-orange-400 px-3 py-1 rounded-xl  z-30 shadow">
              <span className="text-sm text-orange-600 font-medium">From</span>
              <DatePicker
                selected={dateRange.from}
                onChange={(date) => {
                  setDateRange((p) => ({ ...p, from: date }));
                  setIsDefaultMode(false); // 🔥 DEFAULT OFF HERE
                }}
                selectsStart
                startDate={dateRange.from}
                endDate={dateRange.to}
                dateFormat="dd MMM yyyy"
                placeholderText="Enter Date"
                // isClearable
                className="w-28 text-center outline-none text-sm "
              />

              <span className="text-sm text-orange-600 font-medium">To</span>

              <DatePicker
                selected={dateRange.to}
                onChange={(date) => {
                  setDateRange((p) => ({ ...p, to: date }));
                  setIsDefaultMode(false); // 🔥 DEFAULT OFF HERE
                }}
                selectsEnd
                startDate={dateRange.from}
                endDate={dateRange.to}
                minDate={dateRange.from}
                dateFormat="dd MMM yyyy"
                // isClearable
                placeholderText="Enter Date"
                className="w-28 text-center outline-none text-sm"
              />
            </div>

            <div className="flex items-center gap-2 bg-white border border-orange-400 px-3 py-1 rounded-xl z-20 md:z-30 shadow">
              <DatePicker
                selected={FollowupDate ? new Date(FollowupDate) : null} // Date object for picker
                onChange={(date) =>
                  setFallowupDate(
                    date
                      ? date.toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "",
                  )
                }
                dateFormat="d MMM yyyy"
                popperPlacement="right-start"
                placeholderText="FollowUp Date"
                className="w-28 text-center outline-none text-sm"
              />
            </div>

            {filterConfig.map((f) => (
              <div
                key={f.key}
                className="relative"
                onMouseEnter={() => setOpenFilter(f.key)}
                onMouseLeave={() => setOpenFilter(null)}
              >
                <button className="bg-white border border-orange-400 px-4 py-1 text-orange-400 rounded-xl shadow flex items-center gap-2 whitespace-nowrap">
                  {f.icon}
                  {f.label}
                  {filters[f.key].length > 0 && (
                    <span className="text-sm bg-orange-400 text-white px-2 rounded-full">
                      {filters[f.key].length}
                    </span>
                  )}
                </button>

                {openFilter === f.key && (
                  <div className="absolute right-0 w-52 sm:w-56 bg-white border rounded-xl shadow-xl z-50 p-5 border-orange-300">
                    <div className="flex gap-2 mb-2 flex-wrap">
                      <button
                        onClick={() =>
                          setFilters((p) => ({
                            ...p,
                            [f.key]: f.options.map((o) => o.value ?? o),
                          }))
                        }
                        className="bg-green-100 text-green-700 text-[13px] py-1 px-2 rounded"
                      >
                        Select All
                      </button>
                      <button
                        onClick={() =>
                          setFilters((p) => ({ ...p, [f.key]: [] }))
                        }
                        className="bg-red-100 text-red-600 px-2 text-[13px] rounded"
                      >
                        Clear
                      </button>
                    </div>

                    {f.options.map((opt) => {
                      const value = opt.value ?? opt;
                      return (
                        <label
                          key={value}
                          className="flex gap-2 text-md whitespace-nowrap items-center"
                        >
                          <input
                            type="checkbox"
                            checked={filters[f.key].includes(value)}
                            onChange={(e) =>
                              setFilters((p) => ({
                                ...p,
                                [f.key]: e.target.checked
                                  ? [...p[f.key], value]
                                  : p[f.key].filter((x) => x !== value),
                              }))
                            }
                          />
                          {opt.label ?? opt}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {isAnyFilterApplied && (
              <button className="flex items-center bg-red-500 justify-between h-8 sm:justify-center gap-2 px-4 py-1 border border-orange-500 text-orange-600 rounded-xl hover:bg-red-400 shadow-sm transition-all whitespace-nowrap">
                <span
                  onClick={handleClearAllFilters}
                  className="font-medium flex  text-white items-center gap-2"
                >
                  <RxCross2 /> Filter
                </span>
              </button>
            )}

            <button
              onClick={handleAppliedDefalut}
              className={`px-4 py-1 rounded flex items-center gap-2 transition
    ${isDefaultMode ? "bg-green-500 text-white" : "bg-black text-white"}
  `}
            >
              {isDefaultMode && <span>✔</span>}
              Default Filter
            </button>

            <div>
              <button
                onClick={handleSave}
                disabled={!hasChanges || saving}
                className="px-4 py-1 bg-black text-white rounded"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
            <div className="">
              Total:{" "}
              <span className="text-orange-500">
                ({isAnyFilterApplied ? filteredRows.length : rows.length})
              </span>
            </div>
          </div>

          {selectedLeadNos.length > 0 && (
            <button
              onClick={() => setShowTransferModal(true)}
              className="px-4 py-1 bg-orange-400 text-white rounded ml-3"
            >
              Transfer ({selectedLeadNos.length}){" "}
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          )}
        </div>

        {/* ===== TABLE ===== */}
        <div className="overflow-y-auto max-h-[450px] hidden md:block bg-white rounded-lg shadow">
          <table className="min-w-full border">
            <thead className="bg-black text-white px-10 sticky top-0 text-center z-20 whitespace-nowrap rounded">
              <tr>
                <th className="p-4 sticky left-0 z-20  bg-black text-white">
                  <input
                    type="checkbox"
                    className="w-10 scale-150 accent-orange-500"
                    checked={
                      selectedLeadNos.length === paginatedRows.length &&
                      paginatedRows.length > 0
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedLeadNos(paginatedRows.map((r) => r.LeadNo));
                      } else {
                        setSelectedLeadNos([]);
                      }
                    }}
                  />
                </th>

                {/* Lead Id */}
                <th className="p-4 sticky left-[60px] z-20 bg-black border text-white">
                  Lead Id
                </th>

                {/* Date */}
                <th className="px-7 sticky left-[140px] border z-20 bg-black text-white">
                  Date
                </th>
                <th className="px-7 border">Client Name</th>
                <th className="px-7 border">Gender</th>
                <th className="px-7 border">Calling No</th>
                <th className="px-7 border">WhatsApp No</th>
                <th className="px-7 border">Followup Date</th>
                <th className="px-7 border">Lead Status</th>
                <th className="px-7 border">Reason</th>
                <th className="px-7 border">Field Member</th>
                <th className="px-7 border">Comments</th>
                <th className="rounded-r px-7 border">WorkLogs</th>
                <th className="rounded-r px-7 border">Assignee</th>
                <th className="px-7 sticky right-0 bg-black text-white border z-50">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedRows.map((client) => {
                const index = editedRows.findIndex(
                  (r) => r.LeadNo === client.LeadNo,
                );

                return (
                  <tr
                    key={client.LeadNo}
                    className="text-center border whitespace-nowrap"
                  >
                    <td className="sticky left-0 z-10 bg-gray-100 ">
                      <input
                        type="checkbox"
                        className="w-10 scale-150 accent-orange-500"
                        checked={selectedLeadNos.includes(client.LeadNo)}
                        onChange={() => handleCheckboxChange(client.LeadNo)}
                      />
                    </td>

                    {/* Lead Id */}
                    <td className="sticky left-[60px] bg-gray-100 z-10 ">
                      {client.LeadNo}
                    </td>

                    {/* Date */}
                    <td className="sticky px-5 left-[140px] z-10 bg-gray-100  ">
                      {client.Date}
                    </td>

                    <EditableCell rowIndex={index} field="ClientName" />
                    <EditableCell rowIndex={index} field="Gender" />
                    <EditableCell rowIndex={index} field="CallingNo" />
                    <EditableCell rowIndex={index} field="WhatsAppNo" />
                    <EditableCell rowIndex={index} field="FollowupDate" />
                    <EditableCell rowIndex={index} field="LeadStatus" />
                    <EditableCell rowIndex={index} field="Reason" />
                    <EditableCell rowIndex={index} field="FieldMember" />
                    <EditableCell rowIndex={index} field="WorkLog" />

                    <td className="relative px-2 group">
                      {/* ===== Preview (Latest log only) ===== */}
                      <div className="text-xs text-gray-700 cursor-pointer whitespace-pre-wrap break-words">
                        {client.WorkLogs
                          ? client.WorkLogs.split("\n") // split logs
                              .filter(Boolean)[0] // TOP (latest log)
                              ?.substring(0, 28) // preview length
                          : "No WorkLogs"}
                      </div>

                      {/* ===== Full WorkLogs on Hover ===== */}
                      {client.WorkLogs && (
                        <div className="absolute z-50 hidden text-start group-hover:block bg-white border p-5 rounded-lg shadow-xl w-[480px] max-h-[250px] overflow-y-auto cursor-pointer right-12 whitespace-pre-wrap break-words text-sm">
                          {client.WorkLogs.split(/\n(?=\[)/) // split before every [
                            .map((log, index) => {
                              const lines = log.split("\n").filter(Boolean);
                              if (!lines.length) return null;

                              const meta = lines[0]; // [date - user]
                              const message = lines.slice(1).join("\n").trim(); // actual comment

                              if (!message || message === "undefined")
                                return null;

                              return (
                                <div key={index} className="mb-2">
                                  <div className="text-gray-500 text-xs">
                                    {meta}
                                  </div>
                                  <div className="font-semibold text-gray-800">
                                    {message}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </td>

                    <td className="whitespace-nowrap">
                      {client.Assignee?.slice(0, 8)}
                    </td>

                    <td className="flex justify-center items-center gap-5 sticky right-0  h-16  bg-gray-100">
                      <button
                        onClick={() => handleEdit(client)}
                        className="text-red-500 flex text-md items-center justify-center"
                      >
                        {/* <FaRegEdit size={20} /> */}
                        <i className="fa fa-eye"></i>
                      </button>
                      <button
                        onClick={() => handleEdit(client)}
                        className="text-green-500 flex text-xl items-center justify-center"
                      >
                        {/* <FaRegEdit size={20} /> */}
                        <i className="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* ===== PAGINATION ===== */}
        </div>
        <div className="block md:hidden space-y-3">
          {paginatedRows.map((client) => (
            <div
              key={client.LeadNo}
              className="bg-white border rounded-lg shadow p-3 text-sm"
            >
              {/* ===== TOP ROW ===== */}
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-5 scale-150 accent-orange-500 text-white"
                    checked={selectedLeadNos.includes(client.LeadNo)}
                    onChange={() => handleCheckboxChange(client.LeadNo)}
                  />
                  <span className="font-semibold text-orange-600">
                    {client.LeadNo}
                  </span>
                </div>

                <div className="flex gap-3 text-lg">
                  <button
                    onClick={() => handleEdit(client)}
                    className="text-red-500"
                  >
                    <i className="fa fa-eye"></i>
                  </button>

                  <button
                    onClick={() => handleEdit(client)}
                    className="text-green-500"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                </div>
              </div>

              {/* ===== DETAILS ===== */}
              <div className="space-y-1 text-gray-700">
                <p>
                  <b>Date:</b> {client.Date}
                </p>
                <p>
                  <b>Client:</b> {client.ClientName}
                </p>
                <p>
                  <b>Calling No:</b> {client.CallingNo}
                </p>
                <p>
                  <b>WhatsApp No:</b> {client.WhatsAppNo}
                </p>
                <p>
                  <b>Followup Date:</b> {client.FollowupDate || "N/A"}
                </p>
                <p>
                  <b>Status:</b> {client.LeadStatus}
                </p>
                <p>
                  <b>Reason:</b> {client.Reason || "—"}
                </p>
                <p>
                  <b>Field Member:</b> {client.FieldMember || "N/A"}
                </p>
              </div>

              {/* ===== WORKLOG PREVIEW ===== */}
              <div className="mt-3 bg-gray-50 p-2 rounded text-xs max-h-[150px] overflow-y-auto">
                <b>WorkLogs:</b>

                {client.WorkLogs ? (
                  client.WorkLogs.split(/\n(?=\[)/) // har log [ se split
                    .map((log, index) => {
                      const lines = log.split("\n").filter(Boolean);
                      if (!lines.length) return null;

                      const meta = lines[0]; // [date - user]
                      const message = lines.slice(1).join("\n").trim();

                      if (!message || message === "undefined") return null;

                      return (
                        <div key={index} className="mt-2">
                          <div className="text-gray-500">{meta}</div>
                          <div className="font-semibold text-gray-800 whitespace-pre-wrap">
                            {message}
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="mt-1">No WorkLogs</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* mobile  */}

        <div className="flex justify-center items-center gap-6 m-5">
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 bg-black  text-white rounded disabled:opacity-50"
          >
            <i className="fa-solid fa-arrow-left"></i> Previous
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
          >
            Next <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>

      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[350px] shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Transfer To</h2>

            <Select
              options={ManagerOptions}
              placeholder="Select Assignee"
              value={transferAssignee}
              onChange={setTransferAssignee}
              styles={employeeSelectStyles}
              className="border border-orange-400 rounded-md"
            />
            <div className="mt-3">
              <label className="text-sm text-gray-700 relative after:content-['*'] after:ml-1 after:text-red-500">
                Comments
              </label>

              <textarea
                ref={commentRef}
                className="w-full px-3 py-[8px] border border-orange-400 outline-none rounded-md focus:ring-2 focus:ring-orange-300"
                placeholder="Enter reason for transfer lead"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowTransferModal(false)}
                className="px-4 py-1 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleTransferSave}
                className="px-4 py-1 bg-orange-500 text-white rounded"
                // disabled={!transferAssignee}
              >
                {isUpdatePending ? (
                  <div className="flex justify-center items-center gap-2">
                    <LoaderPage /> Transferring...
                  </div>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LeadsTable;
