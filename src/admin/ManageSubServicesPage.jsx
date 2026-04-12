import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, MoveLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
// import axios from "axios";
import { generateWorklog, generateCreateWorklog } from "../../Config";
import MobileSubServiceCard from "./MobileSubServiceCard.jsx";
import {
  useAdminSubServices,
  useCategories,
  useCreateSubService,
  useUpdateSubService,
  useDeleteSubService,
  useUpdateSubServiceStatus,
} from "../components/services/index";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ManageSubServicesPage = ({ mainServiceId, mainServiceTitle, onBack }) => {
  const WorkLogTooltip = ({ value }) => {
    const [show, setShow] = useState(false);

    if (!value) return null;

    // Split logs correctly (based on your format)
    const blocks = value.split(/(?=\[\d{1,2} .*?\])/g);

    return (
      <div
        className="relative w-full"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {/* Truncated cell */}
        <div className="truncate overflow-hidden text-ellipsis cursor-pointer text-sm max-w-[180px]">
          {value}
        </div>

        {/* Tooltip */}
        {show && (
          <div
            className="absolute top-0 right-full mr-2 z-[200] w-[350px]
                        bg-white border border-gray-300 rounded-lg shadow-xl
                        p-3 text-xs break-words max-h-[250px] overflow-y-auto"
          >
            <div className="space-y-3 whitespace-pre-wrap">
              {blocks.map((block, index) => {
                const match = block.match(/^\[(.*?)\]/);
                const header = match ? `[${match[1]}]` : "";
                const message = block.replace(/^\[(.*?)\]\s*/, "");

                return (
                  <div key={index}>
                    <div className="text-gray-600">{header}</div>
                    <div className="font-semibold mt-1">{message}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const {
    data: subServices = [],
    isLoading,
    refetch,
  } = useAdminSubServices(mainServiceId);
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories(mainServiceId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const username = user?.Name;
  const userEmpId = user?.EmployeeID;
  const name = username ? username : "Unknown";
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [iconPreview, setIconPreview] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [subServiceToToggle, setSubServiceToToggle] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const updateSubServiceStatus = useUpdateSubServiceStatus();
  const [pdfPreview, setPdfPreview] = useState(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [removePdf, setRemovePdf] = useState(false);
  const [editingSubService, setEditingSubService] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    icon: null,
    pdf: null,
  });
  const createSubService = useCreateSubService();
  const updateSubService = useUpdateSubService();
  const deleteSubService = useDeleteSubService();
  //Format date and time
  const formatLogDateTime = (date = new Date()) => {
    return date
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", "")
      .replace(/\bam\b/, "AM")
      .replace(/\bpm\b/, "PM");
  };
  const filteredSubServices = selectedCategory
    ? subServices.filter(
        (service) =>
          String(service.category_id) === String(selectedCategory.category_id),
      )
    : subServices;
  useEffect(() => {
    //  console.log(111, categories);
    // console.log("MAIN SERVICE ID:", mainServiceId);
    // console.log("SUB SERVICES:", subServices);
  }, [mainServiceId, subServices]);

  const confirmStatusToggle = async () => {
    if (!subServiceToToggle) return;

    try {
      setUpdatingStatusId(subServiceToToggle.sub_service_id);

      await updateSubServiceStatus.mutateAsync({
        id: subServiceToToggle.sub_service_id,
        status: subServiceToToggle.status === "active" ? "inactive" : "active",
        mainServiceId, // IMPORTANT for refetch
      });

      toast.success("Status updated successfully");

      setIsStatusModalOpen(false);
      setSubServiceToToggle(null);
    } catch (error) {
      toast.error("Status update failed");
    } finally {
      setUpdatingStatusId(null);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let finalWorkLog = "";

    const form = new FormData();
    form.append("main_service_id", mainServiceId);
    form.append("main_service_title", mainServiceTitle);
    form.append("title", formData.title);
    form.append("price", formData.price);
    form.append("category_id", selectedCategory?.category_id || "");

    if (formData.icon) {
      form.append("icon", formData.icon);
    }
    if (formData.pdf) {
      form.append("pdf", formData.pdf);
    }

    if (removePdf) {
      form.append("removePdf", "true");
    }

    if (editingId) {
      const oldData = {
        Title: editingSubService?.title || "",
        Description: editingSubService?.price || "", // ✅ map price → Description
      };

      const newData = {
        Title: formData.title, // ✅ FIXED
        Description: formData.price, // ✅ FIXED
      };

      finalWorkLog = generateWorklog(oldData, newData, name, userEmpId);
    } else {
      // 🔥 CREATE should NOT use generateWorklog
      const newData = {
        Title: formData.title,
        Price: formData.price,
      };

      finalWorkLog = generateCreateWorklog(newData, name, userEmpId);
    }

    try {
      if (editingId) {
        form.append("id", editingId);
        // Append worklog
        form.append("WorkLogs", finalWorkLog);
        await updateSubService.mutateAsync(form);
        toast.success("Sub service updated successfully");
        setEditingSubService(null); // ✅ ADD THIS
      } else {
        await createSubService.mutateAsync(form);
        toast.success("Sub service created successfully");
      }

      // reset form only
      setFormData({ title: "", price: "", icon: null, pdf: null });
      setIconPreview(null);
      setPdfPreview(null);
      setRemovePdf(false);
      setEditingId(null);
      setIsModalOpen(false);

      // ❌ DO NOT reset selectedCategory here
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   // Safely get old subservice data
  //   const oldSub = editingSubService || {};

  //   // 1️⃣ Create worklog entry
  //   const worklogEntry = {
  //     action: editingId ? "UPDATE" : "CREATE",
  //     timestamp: new Date().toISOString(),
  //     userId: name || "current_user_id",
  //     serviceId: editingId || null,
  //     changes: {},
  //   };

  //   if (editingId) {
  //     const oldTitle = oldSub.title || "";
  //     const oldPrice = oldSub.price || "";

  //     if (oldTitle !== formData.title) {
  //       worklogEntry.changes.title = { from: oldTitle, to: formData.title };
  //     }

  //     if (oldPrice !== formData.price) {
  //       worklogEntry.changes.price = { from: oldPrice, to: formData.price };
  //     }
  //   } else {
  //     // For new subservice
  //     worklogEntry.changes.title = { from: null, to: formData.title };
  //     worklogEntry.changes.price = { from: null, to: formData.price };
  //   }

  //   // 2️⃣ Convert worklog to readable string
  //   let workLogString = "";
  //   if (worklogEntry.action === "UPDATE") {
  //     const changes = [];
  //     if (worklogEntry.changes.title) {
  //       changes.push(
  //         `Title: "${worklogEntry.changes.title.from}" → "${worklogEntry.changes.title.to}"`,
  //       );
  //     }
  //     if (worklogEntry.changes.price) {
  //       changes.push(
  //         `Price: "${worklogEntry.changes.price.from}" → "${worklogEntry.changes.price.to}"`,
  //       );
  //     }
  //     workLogString = changes.join("; ");
  //   } else {
  //     workLogString = `Created new subservice: Title="${worklogEntry.changes.title.to}", Price="${worklogEntry.changes.price.to}"`;
  //   }

  //   const finalWorkLog = `[${formatLogDateTime()} - ${name || "current_user"}] ${workLogString}`;
  //   console.log("📝 WORKLOG:", finalWorkLog);
  //   const form = new FormData();
  //   form.append("main_service_id", mainServiceId);
  //   form.append("main_service_title", mainServiceTitle);
  //   form.append("title", formData.title);
  //   form.append("price", formData.price);
  //   form.append("category_id", selectedCategory?.category_id || "");

  //   if (formData.icon) {
  //     form.append("icon", formData.icon);
  //   }
  //   if (formData.pdf) {
  //     form.append("pdf", formData.pdf);
  //   }

  //   if (removePdf) {
  //     form.append("removePdf", "true");
  //   }
  //   // Append worklog
  //   form.append("WorkLogs", finalWorkLog);
  //   try {
  //     if (editingId) {
  //       form.append("id", editingId);
  //       await updateSubService.mutateAsync(form);
  //       toast.success("Sub service updated successfully");
  //       setEditingSubService(null); // ✅ ADD THIS
  //     } else {
  //       await createSubService.mutateAsync(form);
  //       toast.success("Sub service created successfully");
  //     }

  //     // reset form only
  //     setFormData({ title: "", price: "", icon: null, pdf: null });
  //     setIconPreview(null);
  //     setPdfPreview(null);
  //     setRemovePdf(false);
  //     setEditingId(null);
  //     setIsModalOpen(false);

  //     // ❌ DO NOT reset selectedCategory here
  //   } catch (error) {
  //     toast.error("Something went wrong");
  //   }
  // };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const form = new FormData();
  //   form.append("main_service_id", mainServiceId);
  //   form.append("main_service_title", mainServiceTitle);
  //   form.append("title", formData.title);
  //   form.append("price", formData.price);
  //   form.append("category_id", selectedCategory?.category_id || "");

  //   if (formData.icon) {
  //     form.append("icon", formData.icon);
  //   }
  //   if (formData.pdf) {
  //     form.append("pdf", formData.pdf);
  //   }

  //   if (removePdf) {
  //     form.append("removePdf", "true");
  //   }
  //   try {
  //     if (editingId) {
  //       form.append("id", editingId);
  //       await updateSubService.mutateAsync(form);
  //       toast.success("Sub service updated successfully");
  //     } else {
  //       await createSubService.mutateAsync(form);
  //       toast.success("Sub service created successfully");
  //     }

  //     // reset form only
  //     setFormData({ title: "", price: "", icon: null, pdf: null });
  //     setIconPreview(null);
  //     setPdfPreview(null);
  //     setRemovePdf(false);
  //     setEditingId(null);
  //     setIsModalOpen(false);

  //     // ❌ DO NOT reset selectedCategory here
  //   } catch (error) {
  //     toast.error("Something went wrong");
  //   }
  // };
  // ================= DELETE =================

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteSubService.mutateAsync({
        id: deleteId,
        mainServiceId,
      });

      toast.success("Sub service deleted successfully");
      setDeleteModalOpen(false);
      setDeleteId(null);
    } catch (error) {
      toast.error("Delete failed");
    }
  };
  // const handleDelete = async () => {
  //   if (!deleteId) return;

  //   setIsDeleting(true);

  //   try {
  //     await axios.post(`${import.meta.env.VITE_BASE_URL}/sub-services/delete`, {
  //       id: deleteId,
  //     });

  //     toast.success("Sub service deleted successfully");
  //     setDeleteModalOpen(false);
  //     setDeleteId(null);
  //     refetch();
  //   } catch (error) {
  //     console.error("Delete failed", error);
  //     toast.error("Delete failed");
  //   } finally {
  //     setIsDeleting(false);
  //   }
  // };
  const handleEdit = (service) => {
    setEditingSubService(service);
    setFormData({
      title: service.title,
      price: service.price,
      icon: null,
      pdf: null,
      categoryId: service.category_id || "",
    });
    setIconPreview(service.icon || null);
    setPdfPreview(service.pdfUrl || null);
    setRemovePdf(false);

    // Find and set category object based on category_id from list
    const categoryObj =
      categories.find((cat) => cat.category_id === service.category_id) || null;
    setSelectedCategory(categoryObj);

    setEditingId(service.sub_service_id);
    setIsModalOpen(true);
  };

  return (
    <div className=" py-1 ">
      {/* HEADER */}
      <div className="flex flex-col gap-4 mb-6 shadow-sm lg:flex-row lg:justify-between lg:items-center lg:mb-10">
        {/* categories */}
        <div className="flex flex-col gap-3 w-full lg:w-auto">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {/* ALL */}
            <button
              onClick={() => setSelectedCategory(null)}
              className={`whitespace-nowrap px-4 py-2 flex items-center gap-2 text-sm font-medium rounded-md border-b-2 transition ${
                !selectedCategory
                  ? "text-orange-600 border-orange-600 bg-orange-50"
                  : "text-black border-transparent hover:border-gray-300"
              }`}
            >
              {" "}
              <i className="fa-solid fa-border-all"></i> All
            </button>

            {/* FIRST 4 CATEGORIES */}
            {categories.slice(0, 2).map((cat) => (
              <button
                key={cat.category_id}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-md border-b-2 transition ${
                  selectedCategory?.category_id === cat.category_id
                    ? "text-orange-600 border-orange-600 bg-orange-50"
                    : "text-black border-transparent hover:border-gray-300"
                }`}
              >
                {cat.category_name}
              </button>
            ))}
          </div>

          {/* VIEW ALL BUTTON (FULL WIDTH ON MOBILE) */}
          {categories.length > 2 && (
            <div className="relative w-full lg:w-auto">
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="w-full lg:w-auto flex justify-between items-center gap-2 px-4 py-2 bg-gray-100 rounded-md text-sm"
              >
                {" "}
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-layer-group text-gray-600"></i>
                  View All Categories
                </span>
                <i className="fa-solid fa-chevron-down text-xs"></i>
              </button>

              {showAllCategories && (
                <div className="absolute left-0 mt-2 w-full lg:w-64 bg-white border rounded-lg shadow-lg z-[250] max-h-60 overflow-y-auto">
                  {categories.map((cat) => (
                    <div
                      key={cat.category_id}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowAllCategories(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      {cat.category_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* <div>
          {(categoriesLoading || categories.length > 0) && (
            <div className="flex gap-3  flex-wrap">
              {categoriesLoading ? (
                [...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-20 rounded-lg bg-gray-300 animate-pulse"
                  />
                ))
              ) : (
                <>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`flex items-center space-x-2 px-6 py-2 text-md sm:text-lg font-medium
    rounded-md sm:rounded-t-lg border-b-2 transition-colors ${
      !selectedCategory
        ? "text-orange-600 border-orange-600 bg-orange-50"
        : "text-black border-transparent hover:text-gray-900 hover:border-gray-300"
    }`}
                  >
                    All
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.category_id}
                      onClick={() => setSelectedCategory(cat)}
                      className={` flex items-center space-x-2 px-4 py-2 text-md sm:text-lg font-medium
    rounded-md sm:rounded-t-lg border-b-2 transition-colors ${
      selectedCategory?.category_id === cat.category_id
        ? "text-orange-600 border-orange-600 bg-orange-50"
        : "text-black border-transparent hover:text-gray-900 hover:border-gray-300"
    }`}
                    >
                      {cat.category_name}
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div> */}
        {/* title */}
        <div className="flex flex-wrap items-center gap-2">
          <h1 className=" text-lg md:text-2xl font-bold">Sub Services</h1>
          <h2 className="text-gray-500 text-lg md:text-xl italic">
            - {mainServiceTitle}
          </h2>
        </div>

        <div className="flex flex-wrap gap-2 text-[13px] md:text-[16px]">
          <button
            onClick={onBack}
            className="px-4 flex items-center gap-2  py-1 border rounded-lg"
          >
            <MoveLeft className="w-5" /> Back
          </button>

          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                title: "",
                price: "",
                categoryId: "",
              });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg"
          >
            <Plus size={18} />
            Add Sub Service
          </button>
        </div>
      </div>
      {/* mobile responsive */}

      {/* ✅ MOBILE: CARD VIEW */}
      <div className="block lg:hidden">
        {isLoading ? (
          <div className="grid gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : filteredSubServices.length === 0 ? (
          <div className="text-center text-gray-500 py-6">
            No sub services found
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredSubServices.map((service) => (
              <MobileSubServiceCard
                key={service.sub_service_id}
                service={service}
                onEdit={handleEdit}
                onDelete={(s) => {
                  setDeleteId(s.sub_service_id);
                  setDeleteModalOpen(true);
                }}
                onToggleStatus={(s) => {
                  setSubServiceToToggle(s);
                  setIsStatusModalOpen(true);
                }}
                updatingId={updatingStatusId}
                setZoomImage={(img) => window.open(img, "_blank")}
                setOpenPdf={(pdf) => window.open(pdf, "_blank")}
              />
            ))}
          </div>
        )}
      </div>
      {/* TABLE */}

      <div className="hidden lg:block bg-white shadow  border z-20 pb-2">
        <div className=" max-h-[400px] overflow-y-auto overflow-x-auto ">
          {/* CATEGORY TABS */}

          <table className="w-full text-left ">
            <thead className="bg-black text-white text-xl">
              <tr>
                <th className="p-4 w-1/5 top-0 left-0 z-50 bg-black sticky">
                  Title
                </th>
                <th className="p-4 top-0 w-1/5 left-0 z-50 bg-black sticky">
                  Icon
                </th>
                <th className="p-4 top-0 w-1/5 left-0 z-50 bg-black sticky">
                  Price
                </th>
                <th className="p-4 top-0 w-1/5 left-0 sticky z-50 bg-black ">
                  Status
                </th>
                <th className="p-4 top-0 w-1/5 left-0 z-50 bg-black sticky">
                  Actions
                </th>
                <th className="p-4 top-0 w-1/5 left-0 z-50 bg-black sticky">
                  PDF
                </th>
                <th className="p-4 bg-black sticky top-0 z-30">Worklogs</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-4">
                      <div className="h-4 bg-gray-300 rounded  animate-pulse"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-10 w-10 bg-gray-300 rounded animate-pulse"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-gray-300 rounded  animate-pulse"></div>
                    </td>
                    <td className="p-4 flex gap-3">
                      <div className="h-6 w-6 bg-gray-300 rounded animate-pulse"></div>

                      <div className="h-6 w-6 bg-gray-300 rounded animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : filteredSubServices.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center p-6 text-gray-500">
                    No sub services found
                  </td>
                </tr>
              ) : (
                filteredSubServices.map((service) => (
                  <tr
                    key={service.sub_service_id}
                    className="border-t hover:bg-gray-50"
                  >
                    {/* Title */}
                    <td className="p-4 font-medium">{service.title}</td>

                    {/* Icon */}
                    <td className="p-4">
                      {service.icon ? (
                        <img
                          src={service.icon}
                          alt={service.title}
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded" />
                      )}
                    </td>

                    {/* Price */}
                    <td className="p-4">₹{service.price} onwards</td>
                    {/* Status */}
                    <td className="p-4 ">
                      <button
                        disabled={updatingStatusId === service.sub_service_id}
                        onClick={() => {
                          setSubServiceToToggle(service);
                          setIsStatusModalOpen(true);
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                          service.status === "active"
                            ? "bg-green-500"
                            : "bg-red-500"
                        } ${
                          updatingStatusId === service.sub_service_id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {updatingStatusId === service.sub_service_id ? (
                          <span className="bw-loader-small"></span>
                        ) : (
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              service.status === "active"
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        )}
                      </button>
                    </td>

                    <td className="p-4 flex gap-3">
                      <button
                        onClick={() => handleEdit(service)}
                        className="text-orange-500 hover:text-orange-700 transition-colors"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(service.sub_service_id);
                          setDeleteModalOpen(true);
                        }}
                        className="text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                      {/* 
                      // <button
                      //   onClick={() => {
                      //     setDeleteId(service.sub_service_id);
                      //     setDeleteModalOpen(true);
                      //   }}
                      //   className="text-red-500"
                      // >
                      //   <Trash2 size={18} />
                      // </button> */}
                    </td>
                    <td className="p-4">
                      {service.pdfUrl ? (
                        <button
                          onClick={() => window.open(service.pdfUrl, "_blank")}
                          className="text-red-600 text-xl"
                        >
                          <i className="fas fa-file-pdf"></i>
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                    {/* worklog  */}
                    <td className="p-4">
                      <WorkLogTooltip value={service.WorkLogs} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 md:bg-black/40 z-50 flex justify-center items-start md:items-center">
          <div
            className="  bg-white w-full h-full md:h-auto pt-28 sm:pt-0
        md:w-[420px] lg:w-[540px]
        p-4 md:p-6
        rounded-none md:rounded-xl
        shadow-none md:shadow-xl
        overflow-y-auto"
          >
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? "Edit Sub Service" : "Add Sub Service"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* <select
                value={selectedCategory?.category_id || ""}
                onChange={(e) => {
                  const selectedCat = categories.find(
                    (cat) => cat.category_id === e.target.value,
                  );
                  setSelectedCategory(selectedCat || null);
                }}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Category (optional)</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select> */}
              <input
                type="text"
                required
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                    categoryId: selectedCategory?.id || "",
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                type="string"
                required
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />

              <div className="flex gap-4 justify-between">
                {/* ICON */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Upload Icon
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFormData({ ...formData, icon: file });
                        setIconPreview(URL.createObjectURL(file));
                      }
                    }}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                {/* PDF */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Upload PDF
                  </label>

                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFormData({ ...formData, pdf: file });
                        setPdfPreview(URL.createObjectURL(file));
                        setRemovePdf(false);
                      }
                    }}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              {(iconPreview || pdfPreview) && (
                <div className="mt-4 grid grid-cols-2 gap-6 mx-4 items-start">
                  {/* ICON PREVIEW */}
                  {iconPreview && (
                    <div className="relative h-20 w-20">
                      <img
                        src={iconPreview}
                        alt="Icon Preview"
                        className="h-20 w-20 object-contain border rounded-lg"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          setIconPreview(null);
                          setFormData({ ...formData, icon: null });
                        }}
                        className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-800"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* PDF PREVIEW */}
                  {pdfPreview && (
                    <div className="relative h-20 w-20">
                      <div className="h-20 w-20 border flex items-center justify-center bg-white rounded-lg">
                        <i className="fa-solid fa-file-pdf text-red-600 text-4xl"></i>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setPdfPreview(null);
                          setFormData({ ...formData, pdf: null });
                          setRemovePdf(true);
                        }}
                        className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-800"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              )}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  // onClick={() => setIsModalOpen(false)}
                  onClick={() => {
                    setIsModalOpen(false);
                    setIconPreview(null);
                  }}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    createSubService.isPending || updateSubService.isPending
                  }
                  className="px-4 py-2 bg-black text-white rounded-lg flex items-center justify-center gap-2 min-w-[90px]"
                >
                  {createSubService.isPending || updateSubService.isPending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Saving
                    </>
                  ) : (
                    "Save"
                  )}
                </button>
                {/* <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-black text-white rounded-lg"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button> */}
              </div>
            </form>
          </div>
        </div>
      )}
      {(createSubService.isPending || updateSubService.isPending) && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-xl">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {/* delete confirmation modal */}
      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl w-[400px] shadow-2xl">
            <h2 className="text-xl font-semibold mb-2">Delete Sub Service</h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this sub service? This action
              cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeleteId(null);
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* STATUS CONFIRMATION MODAL */}
      {isStatusModalOpen && subServiceToToggle && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl w-[400px] shadow-2xl">
            <h2 className="text-xl font-semibold mb-2">
              {subServiceToToggle.status === "active"
                ? "Deactivate Sub Service"
                : "Activate Sub Service"}
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to{" "}
              <span className="font-semibold">
                {subServiceToToggle.status === "active"
                  ? "deactivate"
                  : "activate"}
              </span>{" "}
              this sub service?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsStatusModalOpen(false);
                  setSubServiceToToggle(null);
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmStatusToggle}
                disabled={
                  updatingStatusId === subServiceToToggle.sub_service_id
                }
                className={`px-4 py-2 text-white rounded-lg transition ${
                  subServiceToToggle.status === "active"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {updatingStatusId === subServiceToToggle.sub_service_id
                  ? "Updating..."
                  : subServiceToToggle.status === "active"
                    ? "Deactivate"
                    : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSubServicesPage;

// import { useState, useEffect } from "react";
// import { Plus, Edit, Trash2, MoveLeft } from "lucide-react";
// // import axios from "axios";
// import {
//   useAdminSubServices,
//   useCategories,
//   useCreateSubService,
//   useUpdateSubService,
//   useDeleteSubService,
//   useUpdateSubServiceStatus,
// } from "../components/services/index";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// const ManageSubServicesPage = ({ mainServiceId, mainServiceTitle, onBack }) => {
//   const {
//     data: subServices = [],
//     isLoading,
//     refetch,
//   } = useAdminSubServices(mainServiceId);
//   const { data: categories = [], isLoading: categoriesLoading } =
//     useCategories(mainServiceId);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [iconPreview, setIconPreview] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
//   const [subServiceToToggle, setSubServiceToToggle] = useState(null);
//   const [updatingStatusId, setUpdatingStatusId] = useState(null);
//   const updateSubServiceStatus = useUpdateSubServiceStatus();
//   const [pdfPreview, setPdfPreview] = useState(null);
//   const [showAllCategories, setShowAllCategories] = useState(false);
//   const [removePdf, setRemovePdf] = useState(false);
//   const [formData, setFormData] = useState({
//     title: "",
//     price: "",
//     icon: null,
//     pdf: null,
//   });
//   const createSubService = useCreateSubService();
//   const updateSubService = useUpdateSubService();
//   const deleteSubService = useDeleteSubService();

//   const filteredSubServices = selectedCategory
//     ? subServices.filter(
//         (service) =>
//           String(service.category_id) === String(selectedCategory.category_id),
//       )
//     : subServices;
//   useEffect(() => {
//     //  console.log(111, categories);
//     // console.log("MAIN SERVICE ID:", mainServiceId);
//     // console.log("SUB SERVICES:", subServices);
//   }, [mainServiceId, subServices]);

//   const confirmStatusToggle = async () => {
//     if (!subServiceToToggle) return;

//     try {
//       setUpdatingStatusId(subServiceToToggle.sub_service_id);

//       await updateSubServiceStatus.mutateAsync({
//         id: subServiceToToggle.sub_service_id,
//         status: subServiceToToggle.status === "active" ? "inactive" : "active",
//         mainServiceId, // IMPORTANT for refetch
//       });

//       toast.success("Status updated successfully");

//       setIsStatusModalOpen(false);
//       setSubServiceToToggle(null);
//     } catch (error) {
//       toast.error("Status update failed");
//     } finally {
//       setUpdatingStatusId(null);
//     }
//   };
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const form = new FormData();
//     form.append("main_service_id", mainServiceId);
//     form.append("main_service_title", mainServiceTitle);
//     form.append("title", formData.title);
//     form.append("price", formData.price);
//     form.append("category_id", selectedCategory?.category_id || "");

//     if (formData.icon) {
//       form.append("icon", formData.icon);
//     }
//     if (formData.pdf) {
//       form.append("pdf", formData.pdf);
//     }

//     if (removePdf) {
//       form.append("removePdf", "true");
//     }
//     try {
//       if (editingId) {
//         form.append("id", editingId);
//         await updateSubService.mutateAsync(form);
//         toast.success("Sub service updated successfully");
//       } else {
//         await createSubService.mutateAsync(form);
//         toast.success("Sub service created successfully");
//       }

//       // reset form only
//       setFormData({ title: "", price: "", icon: null, pdf: null });
//       setIconPreview(null);
//       setPdfPreview(null);
//       setRemovePdf(false);
//       setEditingId(null);
//       setIsModalOpen(false);

//       // ❌ DO NOT reset selectedCategory here
//     } catch (error) {
//       toast.error("Something went wrong");
//     }
//   };
//   // ================= DELETE =================
//   const handleDelete = async () => {
//     if (!deleteId) return;

//     try {
//       await deleteSubService.mutateAsync({
//         id: deleteId,
//         mainServiceId,
//       });

//       toast.success("Sub service deleted successfully");
//       setDeleteModalOpen(false);
//       setDeleteId(null);
//     } catch (error) {
//       toast.error("Delete failed");
//     }
//   };
//   // const handleDelete = async () => {
//   //   if (!deleteId) return;

//   //   setIsDeleting(true);

//   //   try {
//   //     await axios.post(`${import.meta.env.VITE_BASE_URL}/sub-services/delete`, {
//   //       id: deleteId,
//   //     });

//   //     toast.success("Sub service deleted successfully");
//   //     setDeleteModalOpen(false);
//   //     setDeleteId(null);
//   //     refetch();
//   //   } catch (error) {
//   //     console.error("Delete failed", error);
//   //     toast.error("Delete failed");
//   //   } finally {
//   //     setIsDeleting(false);
//   //   }
//   // };
//   const handleEdit = (service) => {
//     setFormData({
//       title: service.title,
//       price: service.price,
//       icon: null,
//       pdf: null,
//       categoryId: service.category_id || "",
//     });
//     setIconPreview(service.icon || null);
//     setPdfPreview(service.pdfUrl || null);
//     setRemovePdf(false);

//     // Find and set category object based on category_id from list
//     const categoryObj =
//       categories.find((cat) => cat.category_id === service.category_id) || null;
//     setSelectedCategory(categoryObj);

//     setEditingId(service.sub_service_id);
//     setIsModalOpen(true);
//   };

//   return (
//     <div className=" py-1 ">
//       {/* HEADER */}
//       <div
//         className="flex justify-between  gap-2
//         mb-6 shadow-sm lg:mb-10"
//       >
//         {/* categories */}
//         <div className="flex items-center gap-3 relative">
//           {/* Category Tabs */}
//           <div className="flex gap-3 overflow-hidden">
//             {/* ALL */}
//             <button
//               onClick={() => setSelectedCategory(null)}
//               className={`px-5 py-2 flex items-center gap-2 text-md font-medium rounded-md border-b-2 transition ${
//                 !selectedCategory
//                   ? "text-orange-600 border-orange-600 bg-orange-50"
//                   : "text-black border-transparent hover:border-gray-300"
//               }`}
//             >
//               {" "}
//               <i className="fa-solid fa-border-all"></i> All
//             </button>

//             {/* FIRST 4 CATEGORIES */}
//             {categories.slice(0, 2).map((cat) => (
//               <button
//                 key={cat.category_id}
//                 onClick={() => setSelectedCategory(cat)}
//                 className={`px-4 py-2 text-md font-medium rounded-md border-b-2 transition ${
//                   selectedCategory?.category_id === cat.category_id
//                     ? "text-orange-600 border-orange-600 bg-orange-50"
//                     : "text-black border-transparent hover:border-gray-300"
//                 }`}
//               >
//                 {cat.category_name}
//               </button>
//             ))}
//           </div>

//           {/* VIEW ALL DROPDOWN */}
//           {categories.length > 4 && (
//             <div className="relative">
//               <button
//                 onClick={() => setShowAllCategories(!showAllCategories)}
//                 className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md"
//               >
//                 {" "}
//                 <i className="fa-solid fa-layer-group text-gray-600"></i>
//                 View All Categories
//                 <i className="fa-solid fa-chevron-down text-xs"></i>
//               </button>

//               {showAllCategories && (
//                 <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-[250] max-h-60 overflow-y-auto">
//                   {categories.map((cat) => (
//                     <div
//                       key={cat.category_id}
//                       onClick={() => {
//                         setSelectedCategory(cat);
//                         setShowAllCategories(false);
//                       }}
//                       className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
//                     >
//                       {cat.category_name}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* <div>
//           {(categoriesLoading || categories.length > 0) && (
//             <div className="flex gap-3  flex-wrap">
//               {categoriesLoading ? (
//                 [...Array(4)].map((_, i) => (
//                   <div
//                     key={i}
//                     className="h-8 w-20 rounded-lg bg-gray-300 animate-pulse"
//                   />
//                 ))
//               ) : (
//                 <>
//                   <button
//                     onClick={() => setSelectedCategory(null)}
//                     className={`flex items-center space-x-2 px-6 py-2 text-md sm:text-lg font-medium
//     rounded-md sm:rounded-t-lg border-b-2 transition-colors ${
//       !selectedCategory
//         ? "text-orange-600 border-orange-600 bg-orange-50"
//         : "text-black border-transparent hover:text-gray-900 hover:border-gray-300"
//     }`}
//                   >
//                     All
//                   </button>

//                   {categories.map((cat) => (
//                     <button
//                       key={cat.category_id}
//                       onClick={() => setSelectedCategory(cat)}
//                       className={` flex items-center space-x-2 px-4 py-2 text-md sm:text-lg font-medium
//     rounded-md sm:rounded-t-lg border-b-2 transition-colors ${
//       selectedCategory?.category_id === cat.category_id
//         ? "text-orange-600 border-orange-600 bg-orange-50"
//         : "text-black border-transparent hover:text-gray-900 hover:border-gray-300"
//     }`}
//                     >
//                       {cat.category_name}
//                     </button>
//                   ))}
//                 </>
//               )}
//             </div>
//           )}
//         </div> */}
//         {/* title */}
//         <div className="flex gap-x-4 ">
//           <h1 className="text-2xl font-bold">Sub Services</h1>
//           <h2 className="text-gray-500 text-xl italic">- {mainServiceTitle}</h2>
//         </div>

//         <div className="flex gap-3">
//           <button
//             onClick={onBack}
//             className="px-4 flex items-center gap-2  py-2 border rounded-lg"
//           >
//             <MoveLeft className="w-5" /> Back
//           </button>

//           <button
//             onClick={() => {
//               setEditingId(null);
//               setFormData({
//                 title: "",
//                 price: "",
//                 categoryId: "",
//               });
//               setIsModalOpen(true);
//             }}
//             className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg"
//           >
//             <Plus size={18} />
//             Add Sub Service
//           </button>
//         </div>
//       </div>

//       {/* TABLE */}

//       <div className="bg-white shadow  border z-20 pb-2">
//         <div className="max-h-[400px] overflow-y-auto overflow-x-auto ">
//           {/* CATEGORY TABS */}

//           <table className="w-full text-left ">
//             <thead className="bg-black text-white text-xl">
//               <tr>
//                 <th className="p-4 w-1/5 top-0 left-0 z-50 bg-black sticky">
//                   Title
//                 </th>
//                 <th className="p-4 top-0 w-1/5 left-0 z-50 bg-black sticky">
//                   Icon
//                 </th>
//                 <th className="p-4 top-0 w-1/5 left-0 z-50 bg-black sticky">
//                   Price
//                 </th>
//                 <th className="p-4 top-0 w-1/5 left-0 sticky z-50 bg-black ">
//                   Status
//                 </th>
//                 <th className="p-4 top-0 w-1/5 left-0 z-50 bg-black sticky">
//                   Actions
//                 </th>
//                 <th className="p-4 top-0 w-1/5 left-0 z-50 bg-black sticky">
//                   PDF
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {isLoading ? (
//                 [...Array(5)].map((_, i) => (
//                   <tr key={i} className="border-t">
//                     <td className="p-4">
//                       <div className="h-4 bg-gray-300 rounded  animate-pulse"></div>
//                     </td>
//                     <td className="p-4">
//                       <div className="h-10 w-10 bg-gray-300 rounded animate-pulse"></div>
//                     </td>
//                     <td className="p-4">
//                       <div className="h-4 bg-gray-300 rounded  animate-pulse"></div>
//                     </td>
//                     <td className="p-4 flex gap-3">
//                       <div className="h-6 w-6 bg-gray-300 rounded animate-pulse"></div>

//                       <div className="h-6 w-6 bg-gray-300 rounded animate-pulse"></div>
//                     </td>
//                   </tr>
//                 ))
//               ) : filteredSubServices.length === 0 ? (
//                 <tr>
//                   <td colSpan="3" className="text-center p-6 text-gray-500">
//                     No sub services found
//                   </td>
//                 </tr>
//               ) : (
//                 filteredSubServices.map((service) => (
//                   <tr
//                     key={service.sub_service_id}
//                     className="border-t hover:bg-gray-50"
//                   >
//                     {/* Title */}
//                     <td className="p-4 font-medium">{service.title}</td>

//                     {/* Icon */}
//                     <td className="p-4">
//                       {service.icon ? (
//                         <img
//                           src={service.icon}
//                           alt={service.title}
//                           className="w-10 h-10 object-contain"
//                         />
//                       ) : (
//                         <div className="w-10 h-10 bg-gray-200 rounded" />
//                       )}
//                     </td>

//                     {/* Price */}
//                     <td className="p-4">₹{service.price} onwards</td>
//                     {/* Status */}
//                     <td className="p-4 ">
//                       <button
//                         disabled={updatingStatusId === service.sub_service_id}
//                         onClick={() => {
//                           setSubServiceToToggle(service);
//                           setIsStatusModalOpen(true);
//                         }}
//                         className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
//                           service.status === "active"
//                             ? "bg-green-500"
//                             : "bg-red-500"
//                         } ${
//                           updatingStatusId === service.sub_service_id
//                             ? "opacity-50 cursor-not-allowed"
//                             : ""
//                         }`}
//                       >
//                         {updatingStatusId === service.sub_service_id ? (
//                           <span className="bw-loader-small"></span>
//                         ) : (
//                           <span
//                             className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
//                               service.status === "active"
//                                 ? "translate-x-6"
//                                 : "translate-x-1"
//                             }`}
//                           />
//                         )}
//                       </button>
//                     </td>

//                     <td className="p-4 flex gap-3">
//                       <button
//                         onClick={() => handleEdit(service)}
//                         className="text-orange-500 hover:text-orange-700 transition-colors"
//                       >
//                         <i className="fas fa-edit"></i>
//                       </button>
//                       <button
//                         onClick={() => {
//                           setDeleteId(service.sub_service_id);
//                           setDeleteModalOpen(true);
//                         }}
//                         className="text-red-500"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                       {/* 
//                       // <button
//                       //   onClick={() => {
//                       //     setDeleteId(service.sub_service_id);
//                       //     setDeleteModalOpen(true);
//                       //   }}
//                       //   className="text-red-500"
//                       // >
//                       //   <Trash2 size={18} />
//                       // </button> */}
//                     </td>
//                     <td className="p-4">
//                       {service.pdfUrl ? (
//                         <button
//                           onClick={() => window.open(service.pdfUrl, "_blank")}
//                           className="text-red-600 text-xl"
//                         >
//                           <i className="fas fa-file-pdf"></i>
//                         </button>
//                       ) : (
//                         "-"
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* MODAL */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-xl w-[420px] lg:w-[540px] shadow-xl">
//             <h2 className="text-lg font-semibold mb-4">
//               {editingId ? "Edit Sub Service" : "Add Sub Service"}
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* <select
//                 value={selectedCategory?.category_id || ""}
//                 onChange={(e) => {
//                   const selectedCat = categories.find(
//                     (cat) => cat.category_id === e.target.value,
//                   );
//                   setSelectedCategory(selectedCat || null);
//                 }}
//                 className="w-full border rounded-lg px-3 py-2"
//               >
//                 <option value="">Select Category (optional)</option>
//                 {categories.map((cat) => (
//                   <option key={cat.category_id} value={cat.category_id}>
//                     {cat.category_name}
//                   </option>
//                 ))}
//               </select> */}
//               <input
//                 type="text"
//                 required
//                 placeholder="Title"
//                 value={formData.title}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     title: e.target.value,
//                     categoryId: selectedCategory?.id || "",
//                   })
//                 }
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//               <input
//                 type="string"
//                 required
//                 placeholder="Price"
//                 value={formData.price}
//                 onChange={(e) =>
//                   setFormData({ ...formData, price: e.target.value })
//                 }
//                 className="w-full border rounded-lg px-3 py-2"
//               />

//               <div className="flex gap-4 justify-between">
//                 {/* ICON */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Upload Icon
//                   </label>

//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => {
//                       const file = e.target.files[0];
//                       if (file) {
//                         setFormData({ ...formData, icon: file });
//                         setIconPreview(URL.createObjectURL(file));
//                       }
//                     }}
//                     className="w-full border rounded-lg px-3 py-2"
//                   />
//                 </div>

//                 {/* PDF */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Upload PDF
//                   </label>

//                   <input
//                     type="file"
//                     accept="application/pdf"
//                     onChange={(e) => {
//                       const file = e.target.files[0];
//                       if (file) {
//                         setFormData({ ...formData, pdf: file });
//                         setPdfPreview(URL.createObjectURL(file));
//                         setRemovePdf(false);
//                       }
//                     }}
//                     className="w-full border rounded-lg px-3 py-2"
//                   />
//                 </div>
//               </div>
//               {(iconPreview || pdfPreview) && (
//                 <div className="mt-4 grid grid-cols-2 gap-6 mx-4 items-start">
//                   {/* ICON PREVIEW */}
//                   {iconPreview && (
//                     <div className="relative h-20 w-20">
//                       <img
//                         src={iconPreview}
//                         alt="Icon Preview"
//                         className="h-20 w-20 object-contain border rounded-lg"
//                       />

//                       <button
//                         type="button"
//                         onClick={() => {
//                           setIconPreview(null);
//                           setFormData({ ...formData, icon: null });
//                         }}
//                         className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-800"
//                       >
//                         ✕
//                       </button>
//                     </div>
//                   )}

//                   {/* PDF PREVIEW */}
//                   {pdfPreview && (
//                     <div className="relative h-20 w-20">
//                       <div className="h-20 w-20 border flex items-center justify-center bg-white rounded-lg">
//                         <i className="fa-solid fa-file-pdf text-red-600 text-4xl"></i>
//                       </div>

//                       <button
//                         type="button"
//                         onClick={() => {
//                           setPdfPreview(null);
//                           setFormData({ ...formData, pdf: null });
//                           setRemovePdf(true);
//                         }}
//                         className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-800"
//                       >
//                         ✕
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//               <div className="flex justify-end gap-3">
//                 <button
//                   type="button"
//                   // onClick={() => setIsModalOpen(false)}
//                   onClick={() => {
//                     setIsModalOpen(false);
//                     setIconPreview(null);
//                   }}
//                   className="px-4 py-2 border rounded-lg"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={
//                     createSubService.isPending || updateSubService.isPending
//                   }
//                   className="px-4 py-2 bg-black text-white rounded-lg flex items-center justify-center gap-2 min-w-[90px]"
//                 >
//                   {createSubService.isPending || updateSubService.isPending ? (
//                     <>
//                       <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                       Saving
//                     </>
//                   ) : (
//                     "Save"
//                   )}
//                 </button>
//                 {/* <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="px-4 py-2 bg-black text-white rounded-lg"
//                 >
//                   {isSubmitting ? "Saving..." : "Save"}
//                 </button> */}
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//       {(createSubService.isPending || updateSubService.isPending) && (
//         <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-xl">
//           <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       )}
//       {/* delete confirmation modal */}
//       {/* DELETE CONFIRMATION MODAL */}
//       {deleteModalOpen && (
//         <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-2xl w-[400px] shadow-2xl">
//             <h2 className="text-xl font-semibold mb-2">Delete Sub Service</h2>

//             <p className="text-gray-600 mb-6">
//               Are you sure you want to delete this sub service? This action
//               cannot be undone.
//             </p>

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => {
//                   setDeleteModalOpen(false);
//                   setDeleteId(null);
//                 }}
//                 className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleDelete}
//                 disabled={isDeleting}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
//               >
//                 {isDeleting ? "Deleting..." : "Delete"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* STATUS CONFIRMATION MODAL */}
//       {isStatusModalOpen && subServiceToToggle && (
//         <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-2xl w-[400px] shadow-2xl">
//             <h2 className="text-xl font-semibold mb-2">
//               {subServiceToToggle.status === "active"
//                 ? "Deactivate Sub Service"
//                 : "Activate Sub Service"}
//             </h2>

//             <p className="text-gray-600 mb-6">
//               Are you sure you want to{" "}
//               <span className="font-semibold">
//                 {subServiceToToggle.status === "active"
//                   ? "deactivate"
//                   : "activate"}
//               </span>{" "}
//               this sub service?
//             </p>

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => {
//                   setIsStatusModalOpen(false);
//                   setSubServiceToToggle(null);
//                 }}
//                 className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={confirmStatusToggle}
//                 disabled={
//                   updatingStatusId === subServiceToToggle.sub_service_id
//                 }
//                 className={`px-4 py-2 text-white rounded-lg transition ${
//                   subServiceToToggle.status === "active"
//                     ? "bg-red-600 hover:bg-red-700"
//                     : "bg-green-600 hover:bg-green-700"
//                 }`}
//               >
//                 {updatingStatusId === subServiceToToggle.sub_service_id
//                   ? "Updating..."
//                   : subServiceToToggle.status === "active"
//                     ? "Deactivate"
//                     : "Activate"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManageSubServicesPage;

