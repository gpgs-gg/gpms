import { pdfjs } from "react-pdf";

import {
  useMainServices,
  useCreateMainService,
  useUpdateMainService,
  useDeleteMainService,
  useUpdateMainServiceStatus,
} from "../components/services/index";
import { MoreVertical, Pencil, Tags, Plus, LayoutGrid } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManageSubServicesPage from "./ManageSubServicesPage.jsx";
import ManageCategoriesPage from "./ManageCategoriesPage.jsx";
import { useApp } from "../context/AppProvider.jsx";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();
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
const MainServicesPage = () => {
  const { username } = useApp();
  const name = username ? username : "Unknown";
  // console.log(11111111, name);
  const { data: services = [], isLoading } = useMainServices();
  const statusMutation = useUpdateMainServiceStatus();
  const createMutation = useCreateMainService();
  const updateMutation = useUpdateMainService();
  const deleteMutation = useDeleteMainService();
  const [zoomImage, setZoomImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedPdfFile, setSelectedPdfFile] = useState(null);
  const [previewPdf, setPreviewPdf] = useState(null);
  const [removePdf, setRemovePdf] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedIconFile, setSelectedIconFile] = useState(null);
  const [previewIcon, setPreviewIcon] = useState(null);
  const [removeIcon, setRemoveIcon] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [viewMode, setViewMode] = useState("main");
  const [open, setOpen] = useState(false);
  const [activePdf, setActivePdf] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [categories, setCategories] = useState([]);

  const [removeImage, setRemoveImage] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [serviceToToggle, setServiceToToggle] = useState(null);

  const [selectedInfoPdfFile, setSelectedInfoPdfFile] = useState(null);
  const [previewInfoPdf, setPreviewInfoPdf] = useState(null);
  const [removeInfoPdf, setRemoveInfoPdf] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  // const { decryptedUser } = useApp();
  // const LOGGED_IN_USER = `${decryptedUser?.employee?.Name}` || "Unknow User";
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    img: "",
    sectionId: "",
  });
  //! confirmation box for upating status
  // const confirmStatusToggle = () => {
  //   if (!serviceToToggle) return;
  //   setUpdatingId(id);
  //   statusMutation.mutate(
  //     {
  //       Id: serviceToToggle.id,
  //       Status: serviceToToggle.status === "active" ? "inactive" : "active",
  //     },
  //     {
  //       onSuccess: () => {
  //         toast.success("Status updated successfully");
  //         setIsStatusModalOpen(false);
  //         setServiceToToggle(null);
  //       },
  //       onError: () => {
  //         toast.error("Failed to update status");
  //       },
  //     },
  //   );
  // };

  const confirmStatusToggle = () => {
    if (!serviceToToggle) return;

    const id = serviceToToggle.id || serviceToToggle.Id;

    setUpdatingId(id); // 👈 mark this row as updating

    statusMutation.mutate(
      {
        Id: id,
        Status: serviceToToggle.status === "active" ? "inactive" : "active",
        updatedBy: name,
      },
      {
        onSuccess: () => {
          toast.success("Status updated successfully");
        },
        onError: () => {
          toast.error("Failed to update status");
        },
        onSettled: () => {
          setUpdatingId(null); // 👈 re-enable switch
          setIsStatusModalOpen(false);
          setServiceToToggle(null);
        },
      },
    );
  };
  const resetAll = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setRemoveImage(false);
    setSelectedFile(null);
    setPreviewImage(null);
    setSelectedIconFile(null);
    setPreviewIcon(null);
    setRemoveIcon(false);
    setSelectedPdfFile(null);
    setPreviewPdf(null);
    setRemovePdf(false);
    setRemoveInfoPdf(false);
    setFormData({
      title: "",
      desc: "",
      img: "",
      sectionId: "",
    });
  };

  //! pdf view
  const getDrivePreviewUrl = (url, pageNumber) => {
    if (!url) return null;

    const match = url.match(/\/d\/([^/]+)/);
    if (!match) return url;

    const baseUrl = `https://drive.google.com/file/d/${match[1]}/preview`;

    const page = Number(pageNumber);

    return page > 0 ? `${baseUrl}#page=${page}` : baseUrl;
  };
  const handleFinalSubmit = () => {
    const formDataToSend = new FormData();

    formDataToSend.append("Title", formData.title);
    formDataToSend.append("Description", formData.desc);
    formDataToSend.append("updatedBy", name);

    if (selectedFile) {
      formDataToSend.append("image", selectedFile);
    }
    if (selectedIconFile) {
      formDataToSend.append("icon", selectedIconFile);
    }
    if (selectedPdfFile) {
      formDataToSend.append("pdf", selectedPdfFile);
    }
    if (selectedInfoPdfFile) {
      formDataToSend.append("informationPdf", selectedInfoPdfFile);
    }

    if (removeInfoPdf) {
      formDataToSend.append("removeInformationPdf", "true");
    }
    if (removePdf) {
      formDataToSend.append("removePdf", "true");
    }
    if (removeImage) {
      formDataToSend.append("removeImage", "true");
    }
    if (removeIcon) {
      formDataToSend.append("removeIcon", "true");
    }
    // Optional Category
    if (categories.length > 0) {
      formDataToSend.append("Category", JSON.stringify(categories));
    }

    if (editingService) {
      formDataToSend.append("Id", editingService.Id || editingService.id);

      updateMutation.mutate(formDataToSend, {
        onSuccess: () => {
          toast.success("Service updated successfully");
          resetAll();
        },
        onError: () => {
          toast.error("Failed to update service");
        },
      });
    } else {
      createMutation.mutate(formDataToSend, {
        onSuccess: () => {
          toast.success("Service created successfully");
          resetAll();
        },
        onError: () => {
          toast.error("Failed to create service");
        },
      });
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setRemoveInfoPdf(false); // ✅ ADD THIS
    setFormData({
      title: service.Title || service.title,
      desc: service.Description || service.desc,
      img: service.Image || service.img,
      sectionId: service["Section ID"] || service.sectionId,
    });
    setPreviewIcon(service.Icon || service.icon);
    setPreviewImage(service.Image || service.img);
    setPreviewPdf(service.Pdf || service.pdf);
    setPreviewInfoPdf(service.InformationPdf);
    setIsModalOpen(true);
  };
  const handleDelete = (service) => {
    setServiceToDelete(service);
    setIsDeleteModalOpen(true);
  };
  const confirmDelete = () => {
    if (!serviceToDelete) return;

    deleteMutation.mutate(serviceToDelete.id, {
      onSuccess: () => {
        toast.success("Service deleted successfully");
        setIsDeleteModalOpen(false);
        setServiceToDelete(null);
      },
      onError: () => {
        toast.error("Failed to delete service");
      },
    });
  };

  const closeModal = () => {
    setEditingService(null);
    setSelectedFile(null);
    setPreviewImage(null);
    setFormData({
      title: "",
      desc: "",
      img: "",
      sectionId: "",
    });
    setIsModalOpen(false);
  };

  return (
    <div className="px-4 py-1 ">
      <div className="flex justify-between items-center mb-4 ">
        <div className="text-2xl font-bold text-gray-900">
          {viewMode === "main" && (
            <h1 className="text-2xl font-bold text-gray-900 mt-3">
              Main Services
            </h1>
          )}
        </div>

        {viewMode === "main" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg"
          >
            <Plus size={18} />
            Add Service
          </button>
        )}
      </div>
      {/* ================= IMAGE ZOOM MODAL ================= */}
      {zoomImage && (
        <div
          className="fixed inset-0 bg-black/70 z-[999] flex items-center justify-center"
          onClick={() => setZoomImage(null)}
        >
          <div
            className="relative max-w-[90%] max-h-[90%]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={zoomImage}
              alt="Zoomed"
              className="rounded-xl shadow-2xl max-h-[80vh] object-contain"
            />

            {/* Close Button */}
            <button
              onClick={() => setZoomImage(null)}
              className="absolute -top-3 -right-3 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="bg-white shadow rounded-xl border p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      ) : viewMode === "main" ? (
        <div className="bg-white shadow rounded-xl border z-20 pb-2">
          <div className="max-h-[480px] overflow-y-auto  overflow-x-auto ">
            <table className="w-full text-left min-w-[600px] ">
              <thead className="bg-black text-white text-xl">
                <tr>
                  <th className="p-4 bg-black sticky top-0 left-0 z-50">
                    Title
                  </th>
                  <th className="p-4 bg-black sticky top-0 z-30">Image</th>
                  <th className="p-4 bg-black sticky top-0 z-30">Icon</th>

                  <th className="p-4 bg-black sticky top-0 z-30">Status</th>
                  <th className="p-4 bg-black sticky top-0 z-30">
                    {" "}
                    Rate Card PDF
                  </th>
                  <th className="p-4 bg-black sticky top-0 z-30">
                    {" "}
                    Information PDF
                  </th>
                  <th className="p-4 bg-black sticky top-0 z-30">Actions</th>

                  <th className="p-4 bg-black sticky top-0 z-30">Worklogs</th>
                </tr>
              </thead>

              <tbody className="h-16">
                {services.map((service, index) => (
                  <tr
                    key={service.Id || service.id || index}
                    className="border-t"
                  >
                    <td
                      className="p-4 font-medium sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)]
"
                    >
                      {service.title}
                    </td>
                    <td className="p-4">
                      <img
                        src={service.img}
                        alt={service.title}
                        onClick={() => setZoomImage(service.img)}
                        onError={(e) => (e.target.src = "/no-image.png")}
                        className="h-10 w-10 object-cover rounded cursor-pointer hover:scale-110 transition"
                      />
                    </td>
                    <td className="p-4">
                      <img
                        onClick={() =>
                          setZoomImage(service.Icon || service.icon)
                        }
                        className="h-8 w-8 object-contain rounded cursor-pointer hover:scale-110 transition"
                        src={service.Icon || service.icon}
                        alt="icon"
                        onError={(e) => (e.target.src = "/no-image.png")}
                      />
                    </td>

                    {/* toggle button for the status */}

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {/* <button
                          disabled={updatingId === (service.id || service.Id)}
                          onClick={() => {
                            setServiceToToggle(service);
                            setIsStatusModalOpen(true);
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                            service.status === "active"
                              ? "bg-green-500"
                              : "bg-red-500"
                          } ${
                            updatingId === (service.id || service.Id)
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        ></button> */}
                        <button
                          disabled={updatingId === (service.id || service.Id)}
                          onClick={() => {
                            setServiceToToggle(service);
                            setIsStatusModalOpen(true);
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                            service.status === "active"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }${
                            updatingId === (service.id || service.Id)
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              service.status === "active"
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                    {/* pdf */}
                    <td className="p-1">
                      {service?.Pdf && (
                        <div
                          onClick={() => {
                            const previewUrl = getDrivePreviewUrl(
                              service.Pdf,
                              service.page,
                            );

                            setSelectedService(service);
                            setActivePdf(previewUrl);
                            setOpen(true);
                          }}
                          className="group relative rounded-2xl  hover:shadow-xl transition duration-300
pl-4 pr-1 lg:pl-5 pt-4 lg:pt-4

hover:-translate-y-1 "
                          title="Open PDF"
                        >
                          <i className="fa-solid fa-file-pdf text-red-600 text-3xl"></i>
                        </div>
                      )}
                    </td>
                    {/* information pdf */}
                    <td className="p-1">
                      {service?.InformationPdf && (
                        <div
                          onClick={() => {
                            const previewUrl = getDrivePreviewUrl(
                              service.InformationPdf,
                              service.page,
                            );

                            setSelectedService(service);
                            setActivePdf(previewUrl);
                            setOpen(true);
                          }}
                          className="group relative rounded-2xl  hover:shadow-xl transition duration-300
pl-4 pr-1 lg:pl-5 pt-4 lg:pt-4

hover:-translate-y-1 "
                          title="Open PDF"
                        >
                          <i className="fa-solid fa-file-pdf text-red-600 text-3xl"></i>
                        </div>
                      )}
                    </td>
                    <td className="p-4 relative">
                      <button
                        onClick={() =>
                          setOpenMenu(
                            openMenu === service.id ? null : service.id,
                          )
                        }
                        className="p-2 font-bold  rounded hover:bg-gray-100"
                      >
                        <MoreVertical size={22} />
                      </button>

                      {/* Dropdown */}
                      {openMenu === service.id && (
                        <div className="absolute right-6 mt-2 w-44 bg-white border rounded-lg shadow-lg z-50">
                          {/* Edit */}
                          <button
                            onClick={() => {
                              handleEdit(service);
                              setOpenMenu(null);
                            }}
                            className="flex items-center text-orange-500 gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm"
                          >
                            <Pencil size={16} /> Edit
                          </button>

                          {/* Categories */}
                          <button
                            onClick={() => {
                              setSelectedParent(service);
                              setViewMode("categories");
                              setOpenMenu(null);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm"
                          >
                            <Tags size={16} /> Categories
                          </button>

                          {/* Sub Services */}
                          <button
                            onClick={() => {
                              setSelectedParent(service);
                              setViewMode("sub");
                              setOpenMenu(null);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm"
                          >
                            <LayoutGrid size={16} /> Sub Services
                          </button>
                        </div>
                      )}
                    </td>
                    {/* worklob */}
                    <td className="p-4">
                      <WorkLogTooltip value={service.workLogs} />
                    </td>
                    {/* <td className="p-4">
                      {service.workLogs ? (
                        <div className="max-h-32 h-16 overflow-y-auto bg-gray-50 border rounded-lg p-3 text-sm whitespace-pre-line shadow-inner">
                          {service.workLogs}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm italic"></span>
                      )}
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : viewMode === "categories" ? (
        <ManageCategoriesPage
          parent={selectedParent}
          onBack={() => {
            setViewMode("main");
            setSelectedParent(null);
          }}
        />
      ) : (
        <>
          <ManageSubServicesPage
            mainServiceId={selectedParent?.id || selectedParent?.Id}
            mainServiceTitle={selectedParent?.title}
            onBack={() => {
              setViewMode("main");
              setSelectedParent(null);
            }}
          />
        </>
      )}

      {/* pdf view */}
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
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
      {/* STATUS UPATION CONFIRMATION MODAL */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[420px] p-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-900">
              Change Service Status
            </h2>

            <p className="text-gray-600 mt-3">
              Are you sure you want to{" "}
              <span className="font-semibold text-black">
                {serviceToToggle?.status === "active"
                  ? "Deactivate"
                  : "Activate"}
              </span>{" "}
              <span className="font-semibold">{serviceToToggle?.title}</span>?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsStatusModalOpen(false);
                  setServiceToToggle(null);
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmStatusToggle}
                disabled={statusMutation.isPending}
                className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${
                  statusMutation.isPending
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"
                }`}
              >
                {statusMutation.isPending ? (
                  <>
                    <span className="bw-loader"></span>
                    Updating...
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ================= Modal ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-[500] flex justify-center items-center">
          <div className="bg-white p-6  rounded-xl w-[400px] lg:w-[700px] shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              {editingService ? "Edit Service" : "Add Service"}
            </h2>

            <form className="space-y-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Service Title
              </label>
              <input
                type="text"
                placeholder="Service Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
                required
              />

              <label className="block text-sm font-medium text-gray-600 mb-1">
                Description
              </label>
              <input
                type="text"
                placeholder="Description"
                value={formData.desc}
                onChange={(e) =>
                  setFormData({ ...formData, desc: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
                required
              />

              <div className=" grid grid-cols-4 gap-6 mx-4 items-start">
                {/* img */}
                <div className="">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setSelectedFile(file);
                        setPreviewImage(URL.createObjectURL(file)); // ✅ show new preview
                      }
                    }}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                {/* icon */}
                <div className="">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Upload Icon
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setSelectedIconFile(file);
                        setPreviewIcon(URL.createObjectURL(file));
                      }
                    }}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                {/* rate card pdf */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Rate Card PDF
                  </label>

                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setSelectedPdfFile(file);
                        setPreviewPdf(URL.createObjectURL(file));
                      }
                    }}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                {/* information pdf */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Information PDF
                  </label>

                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setSelectedInfoPdfFile(file);
                        setPreviewInfoPdf(URL.createObjectURL(file));
                        setRemoveInfoPdf(false);
                      }
                    }}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              {(previewIcon ||
                previewImage ||
                previewPdf ||
                previewInfoPdf) && (
                <div className="mt-4 grid grid-cols-4 gap-6 mx-4 items-start">
                  {/* IMAGE SLOT */}
                  <div className="relative h-20 w-20">
                    {previewImage && (
                      <>
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="h-20 w-20 object-cover border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewImage(null);
                            setSelectedFile(null);
                            setRemoveImage(true);
                          }}
                          className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 text-xs"
                        >
                          ✕
                        </button>
                      </>
                    )}
                  </div>

                  {/* ICON SLOT */}
                  <div className="relative h-20 w-20">
                    {previewIcon && (
                      <>
                        <img
                          src={previewIcon}
                          alt="Icon Preview"
                          className="h-20 w-20 object-contain border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewIcon(null);
                            setSelectedIconFile(null);
                            setRemoveIcon(true);
                          }}
                          className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 text-xs"
                        >
                          ✕
                        </button>
                      </>
                    )}
                  </div>

                  {/* PDF SLOT */}
                  <div className="relative h-20 w-20">
                    {(previewPdf || selectedPdfFile) && (
                      <>
                        <div className="h-20 w-20 border flex items-center justify-center bg-white">
                          <i className="fa-solid fa-file-pdf text-red-600 text-4xl"></i>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewPdf(null);
                            setSelectedPdfFile(null);
                            setRemovePdf(true);
                          }}
                          className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 text-xs"
                        >
                          ✕
                        </button>
                      </>
                    )}
                  </div>

                  {/* INFO PDF SLOT */}
                  <div className="relative h-20 w-20">
                    {(previewInfoPdf || selectedInfoPdfFile) && (
                      <>
                        <div className="h-20 w-20 border flex items-center justify-center bg-white">
                          <i className="fa-solid fa-file-pdf text-red-600 text-4xl"></i>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewInfoPdf(null);
                            setSelectedInfoPdfFile(null);
                            setRemoveInfoPdf(true);
                          }}
                          className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 text-xs"
                        >
                          ✕
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
              {/* {(previewIcon ||
                previewImage ||
                previewPdf ||
                previewInfoPdf) && (
                <div className="mt-4 grid grid-cols-4 gap-6 mx-4 items-start">
               
                  {previewImage && (
                    <div className="relative h-20 w-20">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="h-20 w-20 object-cover border"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImage(null);
                          setSelectedFile(null);
                          setRemoveImage(true);
                        }}
                        className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-800"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                 
                  {previewIcon && (
                    <div className="relative h-20 w-20">
                      <img
                        src={previewIcon}
                        alt="Icon Preview"
                        className="h-20 w-20 object-contain border"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          setPreviewIcon(null);
                          setSelectedIconFile(null);
                          setRemoveIcon(true);
                        }}
                        className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-800"
                      >
                        ✕
                      </button>
                    </div>
                  )}

               
                  {(previewPdf || selectedPdfFile) && (
                    <div className="relative h-20 w-20">
                      <div className="h-20 w-20 border flex items-center justify-center bg-white">
                        <i className="fa-solid fa-file-pdf text-red-600 text-4xl"></i>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setPreviewPdf(null);
                          setSelectedPdfFile(null);
                          setRemovePdf(true);
                        }}
                        className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-800"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                 
                  {(previewInfoPdf || selectedInfoPdfFile) && (
                    <div className="relative h-20 w-20">
                      <div className="h-20 w-20 border flex items-center justify-center bg-white">
                        <i className="fa-solid fa-file-pdf text-red-600 text-4xl"></i>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setPreviewInfoPdf(null);
                          setSelectedInfoPdfFile(null);
                          setRemoveInfoPdf(true);
                        }}
                        className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6"
                      >
                        ✕
                      </button>
                    </div>
                  )}
              
                </div>
              )} */}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="px-4 py-2 bg-black text-white rounded-lg flex items-center gap-2"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <span className="bw-loader"></span>
                      Saving...
                    </>
                  ) : editingService ? (
                    "Update"
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </form>
          </div>
          <style>{`
  .bw-loader {
    border: 3px solid #e5e5e5;
    border-top: 3px solid #000;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: spin 0.6s linear infinite;
  }
    .bw-loader-small {
  border: 2px solid #fff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  animation: spin 0.6s linear infinite;
}

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`}</style>
        </div>
      )}
      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[400px] p-6 animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-900">
              Delete Service
            </h2>

            <p className="text-gray-600 mt-2">
              Are you sure you want to delete{" "}
              <span className="font-medium text-black">
                {serviceToDelete?.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setServiceToDelete(null);
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                  deleteMutation.isPending
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {deleteMutation.isPending ? (
                  <>
                    <span className="bw-loader"></span> Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
          <style>{`
  .bw-loader {
    border: 3px solid #e5e5e5;
    border-top: 3px solid #000;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .animate-fadeIn {
    animation: fadeIn 0.2s ease-in-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
`}</style>
        </div>
      )}

      {/* ================= SUB SERVICE MODAL ================= */}
    </div>
  );
};

export default MainServicesPage;

// import { useState } from "react";
// import { Plus } from "lucide-react";
// import { pdfjs } from "react-pdf";

// import {
//   useMainServices,
//   useCreateMainService,
//   useUpdateMainService,
//   useDeleteMainService,
//   useUpdateMainServiceStatus,
// } from "../components/services/index";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import ManageSubServicesPage from "./ManageSubServicesPage.jsx";
// import ManageCategoriesPage from "./ManageCategoriesPage.jsx";
// import { useApp } from "../context/AppProvider.jsx";
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.mjs",
//   import.meta.url,
// ).toString();
// const WorkLogTooltip = ({ value }) => {
//   const [show, setShow] = useState(false);

//   if (!value) return null;

//   // Split logs correctly (based on your format)
//   const blocks = value.split(/(?=\[\d{1,2} .*?\])/g);

//   return (
//     <div
//       className="relative w-full"
//       onMouseEnter={() => setShow(true)}
//       onMouseLeave={() => setShow(false)}
//     >
//       {/* Truncated cell */}
//       <div className="truncate overflow-hidden text-ellipsis cursor-pointer text-sm max-w-[180px]">
//         {value}
//       </div>

//       {/* Tooltip */}
//       {show && (
//         <div
//           className="absolute top-0 right-full mr-2 z-[200] w-[350px]
//                         bg-white border border-gray-300 rounded-lg shadow-xl
//                         p-3 text-xs break-words max-h-[250px] overflow-y-auto"
//         >
//           <div className="space-y-3 whitespace-pre-wrap">
//             {blocks.map((block, index) => {
//               const match = block.match(/^\[(.*?)\]/);
//               const header = match ? `[${match[1]}]` : "";
//               const message = block.replace(/^\[(.*?)\]\s*/, "");

//               return (
//                 <div key={index}>
//                   <div className="text-gray-600">{header}</div>
//                   <div className="font-semibold mt-1">{message}</div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
// const MainServicesPage = () => {
//   const { username } = useApp();
//   const name = username ? username : "Unknown";
//   // console.log(11111111, name);
//   const { data: services = [], isLoading } = useMainServices();
//   const statusMutation = useUpdateMainServiceStatus();
//   const createMutation = useCreateMainService();
//   const updateMutation = useUpdateMainService();
//   const deleteMutation = useDeleteMainService();
//   const [zoomImage, setZoomImage] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingService, setEditingService] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [updatingId, setUpdatingId] = useState(null);
//   const [selectedPdfFile, setSelectedPdfFile] = useState(null);
//   const [previewPdf, setPreviewPdf] = useState(null);
//   const [removePdf, setRemovePdf] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [serviceToDelete, setServiceToDelete] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);
//   const [selectedIconFile, setSelectedIconFile] = useState(null);
//   const [previewIcon, setPreviewIcon] = useState(null);
//   const [removeIcon, setRemoveIcon] = useState(false);
//   const [selectedParent, setSelectedParent] = useState(null);
//   const [viewMode, setViewMode] = useState("main");
//   const [open, setOpen] = useState(false);
//   const [activePdf, setActivePdf] = useState(null);
//   const [selectedService, setSelectedService] = useState(null);
//   const [categories, setCategories] = useState([]);

//   const [removeImage, setRemoveImage] = useState(false);
//   const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
//   const [serviceToToggle, setServiceToToggle] = useState(null);

//   const [selectedInfoPdfFile, setSelectedInfoPdfFile] = useState(null);
//   const [previewInfoPdf, setPreviewInfoPdf] = useState(null);
//   const [removeInfoPdf, setRemoveInfoPdf] = useState(false);
//   // const { decryptedUser } = useApp();
//   // const LOGGED_IN_USER = `${decryptedUser?.employee?.Name}` || "Unknow User";
//   const [formData, setFormData] = useState({
//     title: "",
//     desc: "",
//     img: "",
//     sectionId: "",
//   });
//   //! confirmation box for upating status
//   // const confirmStatusToggle = () => {
//   //   if (!serviceToToggle) return;
//   //   setUpdatingId(id);
//   //   statusMutation.mutate(
//   //     {
//   //       Id: serviceToToggle.id,
//   //       Status: serviceToToggle.status === "active" ? "inactive" : "active",
//   //     },
//   //     {
//   //       onSuccess: () => {
//   //         toast.success("Status updated successfully");
//   //         setIsStatusModalOpen(false);
//   //         setServiceToToggle(null);
//   //       },
//   //       onError: () => {
//   //         toast.error("Failed to update status");
//   //       },
//   //     },
//   //   );
//   // };

//   const confirmStatusToggle = () => {
//     if (!serviceToToggle) return;

//     const id = serviceToToggle.id || serviceToToggle.Id;

//     setUpdatingId(id); // 👈 mark this row as updating

//     statusMutation.mutate(
//       {
//         Id: id,
//         Status: serviceToToggle.status === "active" ? "inactive" : "active",
//         updatedBy: name,
//       },
//       {
//         onSuccess: () => {
//           toast.success("Status updated successfully");
//         },
//         onError: () => {
//           toast.error("Failed to update status");
//         },
//         onSettled: () => {
//           setUpdatingId(null); // 👈 re-enable switch
//           setIsStatusModalOpen(false);
//           setServiceToToggle(null);
//         },
//       },
//     );
//   };
//   const resetAll = () => {
//     setIsModalOpen(false);
//     setEditingService(null);
//     setRemoveImage(false);
//     setSelectedFile(null);
//     setPreviewImage(null);
//     setSelectedIconFile(null);
//     setPreviewIcon(null);
//     setRemoveIcon(false);
//     setSelectedPdfFile(null);
//     setPreviewPdf(null);
//     setRemovePdf(false);
//     setRemoveInfoPdf(false);
//     setFormData({
//       title: "",
//       desc: "",
//       img: "",
//       sectionId: "",
//     });
//   };

//   //! pdf view
//   const getDrivePreviewUrl = (url, pageNumber) => {
//     if (!url) return null;

//     const match = url.match(/\/d\/([^/]+)/);
//     if (!match) return url;

//     const baseUrl = `https://drive.google.com/file/d/${match[1]}/preview`;

//     const page = Number(pageNumber);

//     return page > 0 ? `${baseUrl}#page=${page}` : baseUrl;
//   };
//   const handleFinalSubmit = () => {
//     const formDataToSend = new FormData();

//     formDataToSend.append("Title", formData.title);
//     formDataToSend.append("Description", formData.desc);
//     formDataToSend.append("updatedBy", name);

//     if (selectedFile) {
//       formDataToSend.append("image", selectedFile);
//     }
//     if (selectedIconFile) {
//       formDataToSend.append("icon", selectedIconFile);
//     }
//     if (selectedPdfFile) {
//       formDataToSend.append("pdf", selectedPdfFile);
//     }
//     if (selectedInfoPdfFile) {
//       formDataToSend.append("informationPdf", selectedInfoPdfFile);
//     }

//     if (removeInfoPdf) {
//       formDataToSend.append("removeInformationPdf", "true");
//     }
//     if (removePdf) {
//       formDataToSend.append("removePdf", "true");
//     }
//     if (removeImage) {
//       formDataToSend.append("removeImage", "true");
//     }
//     if (removeIcon) {
//       formDataToSend.append("removeIcon", "true");
//     }
//     // Optional Category
//     if (categories.length > 0) {
//       formDataToSend.append("Category", JSON.stringify(categories));
//     }

//     if (editingService) {
//       formDataToSend.append("Id", editingService.Id || editingService.id);

//       updateMutation.mutate(formDataToSend, {
//         onSuccess: () => {
//           toast.success("Service updated successfully");
//           resetAll();
//         },
//         onError: () => {
//           toast.error("Failed to update service");
//         },
//       });
//     } else {
//       createMutation.mutate(formDataToSend, {
//         onSuccess: () => {
//           toast.success("Service created successfully");
//           resetAll();
//         },
//         onError: () => {
//           toast.error("Failed to create service");
//         },
//       });
//     }
//   };

//   const handleEdit = (service) => {
//     setEditingService(service);
//     setRemoveInfoPdf(false); // ✅ ADD THIS
//     setFormData({
//       title: service.Title || service.title,
//       desc: service.Description || service.desc,
//       img: service.Image || service.img,
//       sectionId: service["Section ID"] || service.sectionId,
//     });
//     setPreviewIcon(service.Icon || service.icon);
//     setPreviewImage(service.Image || service.img);
//     setPreviewPdf(service.Pdf || service.pdf);
//     setPreviewInfoPdf(service.InformationPdf);
//     setIsModalOpen(true);
//   };
//   const handleDelete = (service) => {
//     setServiceToDelete(service);
//     setIsDeleteModalOpen(true);
//   };
//   const confirmDelete = () => {
//     if (!serviceToDelete) return;

//     deleteMutation.mutate(serviceToDelete.id, {
//       onSuccess: () => {
//         toast.success("Service deleted successfully");
//         setIsDeleteModalOpen(false);
//         setServiceToDelete(null);
//       },
//       onError: () => {
//         toast.error("Failed to delete service");
//       },
//     });
//   };

//   const closeModal = () => {
//     setEditingService(null);
//     setSelectedFile(null);
//     setPreviewImage(null);
//     setFormData({
//       title: "",
//       desc: "",
//       img: "",
//       sectionId: "",
//     });
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="px-4 py-1 ">
//       <div className="flex justify-between items-center mb-4 ">
//         <div className="text-2xl font-bold text-gray-900">
//           {viewMode === "main" && (
//             <h1 className="text-2xl font-bold text-gray-900 mt-3">
//               Main Services
//             </h1>
//           )}
//         </div>

//         {viewMode === "main" && (
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg"
//           >
//             <Plus size={18} />
//             Add Service
//           </button>
//         )}
//       </div>
//       {/* ================= IMAGE ZOOM MODAL ================= */}
//       {zoomImage && (
//         <div
//           className="fixed inset-0 bg-black/70 z-[999] flex items-center justify-center"
//           onClick={() => setZoomImage(null)}
//         >
//           <div
//             className="relative max-w-[90%] max-h-[90%]"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <img
//               src={zoomImage}
//               alt="Zoomed"
//               className="rounded-xl shadow-2xl max-h-[80vh] object-contain"
//             />

//             {/* Close Button */}
//             <button
//               onClick={() => setZoomImage(null)}
//               className="absolute -top-3 -right-3 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-gray-200"
//             >
//               ✕
//             </button>
//           </div>
//         </div>
//       )}

//       {isLoading ? (
//         <div className="bg-white shadow rounded-xl border p-4 space-y-3">
//           {[...Array(5)].map((_, i) => (
//             <div
//               key={i}
//               className="h-12 bg-gray-200 rounded-lg animate-pulse"
//             ></div>
//           ))}
//         </div>
//       ) : viewMode === "main" ? (
//         <div className="bg-white shadow rounded-xl border z-20 pb-2">
//           <div className="max-h-[480px] overflow-y-auto  overflow-x-auto ">
//             <table className="w-full text-left min-w-[600px] ">
//               <thead className="bg-black text-white text-xl">
//                 <tr>
//                   <th className="p-4 bg-black sticky top-0 left-0 z-50">
//                     Title
//                   </th>
//                   <th className="p-4 bg-black sticky top-0 z-30">Image</th>
//                   <th className="p-4 bg-black sticky top-0 z-30">Icon</th>

//                   <th className="p-4 bg-black sticky top-0 z-30">Actions</th>
//                   <th className="p-4 bg-black sticky top-0 z-30">Status</th>
//                   <th className="p-4 bg-black sticky top-0 z-30">
//                     {" "}
//                     Rate Card PDF
//                   </th>
//                   <th className="p-4 bg-black sticky top-0 z-30">
//                     {" "}
//                     Information PDF
//                   </th>
//                   <th className="p-4 bg-black sticky top-0 z-30">Categories</th>
//                   <th className="p-4 bg-black sticky top-0 z-30">
//                     Sub Services
//                   </th>
//                   <th className="p-4 bg-black sticky top-0 z-30">Worklogs</th>
//                 </tr>
//               </thead>

//               <tbody className="h-16">
//                 {services.map((service, index) => (
//                   <tr
//                     key={service.Id || service.id || index}
//                     className="border-t"
//                   >
//                     <td
//                       className="p-4 font-medium sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)]
// "
//                     >
//                       {service.title}
//                     </td>
//                     <td className="p-4">
//                       <img
//                         src={service.img}
//                         alt={service.title}
//                         onClick={() => setZoomImage(service.img)}
//                         onError={(e) => (e.target.src = "/no-image.png")}
//                         className="h-10 w-10 object-cover rounded cursor-pointer hover:scale-110 transition"
//                       />
//                     </td>
//                     <td className="p-4">
//                       <img
//                         onClick={() =>
//                           setZoomImage(service.Icon || service.icon)
//                         }
//                         className="h-8 w-8 object-contain rounded cursor-pointer hover:scale-110 transition"
//                         src={service.Icon || service.icon}
//                         alt="icon"
//                         onError={(e) => (e.target.src = "/no-image.png")}
//                       />
//                     </td>

//                     <td className="p-4">
//                       <button
//                         onClick={() => handleEdit(service)}
//                         className="text-orange-500 hover:orange-blue-700 px-3 py-1"
//                       >
//                         <i className="fas fa-edit"></i>
//                       </button>

//                       {/* <button
//                         onClick={() => handleDelete(service)}
//                         disabled={deleteMutation.isPending}
//                         className={`text-red-500 hover:text-red-700 ${
//                           deleteMutation.isPending
//                             ? "opacity-50 cursor-not-allowed"
//                             : ""
//                         }`}
//                       >
//                         {deleteMutation.isPending ? (
//                           <span className="bw-loader"></span>
//                         ) : (
//                           <Trash2 size={18} />
//                         )}
//                       </button> */}
//                     </td>
//                     {/* toggle button for the status */}

//                     <td className="p-4">
//                       <div className="flex items-center gap-3">
//                         {/* <button
//                           disabled={updatingId === (service.id || service.Id)}
//                           onClick={() => {
//                             setServiceToToggle(service);
//                             setIsStatusModalOpen(true);
//                           }}
//                           className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
//                             service.status === "active"
//                               ? "bg-green-500"
//                               : "bg-red-500"
//                           } ${
//                             updatingId === (service.id || service.Id)
//                               ? "opacity-50 cursor-not-allowed"
//                               : ""
//                           }`}
//                         ></button> */}
//                         <button
//                           disabled={updatingId === (service.id || service.Id)}
//                           onClick={() => {
//                             setServiceToToggle(service);
//                             setIsStatusModalOpen(true);
//                           }}
//                           className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
//                             service.status === "active"
//                               ? "bg-green-500"
//                               : "bg-red-500"
//                           }${
//                             updatingId === (service.id || service.Id)
//                               ? "opacity-50 cursor-not-allowed"
//                               : ""
//                           }`}
//                         >
//                           <span
//                             className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
//                               service.status === "active"
//                                 ? "translate-x-6"
//                                 : "translate-x-1"
//                             }`}
//                           />
//                         </button>
//                       </div>
//                     </td>
//                     {/* pdf */}
//                     <td className="p-1">
//                       {service?.Pdf && (
//                         <div
//                           onClick={() => {
//                             const previewUrl = getDrivePreviewUrl(
//                               service.Pdf,
//                               service.page,
//                             );

//                             setSelectedService(service);
//                             setActivePdf(previewUrl);
//                             setOpen(true);
//                           }}
//                           className="group relative rounded-2xl  hover:shadow-xl transition duration-300
// pl-4 pr-1 lg:pl-5 pt-4 lg:pt-4

// hover:-translate-y-1 "
//                           title="Open PDF"
//                         >
//                           <i className="fa-solid fa-file-pdf text-red-600 text-3xl"></i>
//                         </div>
//                       )}
//                     </td>
//                     {/* information pdf */}
//                     <td className="p-1">
//                       {service?.InformationPdf && (
//                         <div
//                           onClick={() => {
//                             const previewUrl = getDrivePreviewUrl(
//                               service.InformationPdf,
//                               service.page,
//                             );

//                             setSelectedService(service);
//                             setActivePdf(previewUrl);
//                             setOpen(true);
//                           }}
//                           className="group relative rounded-2xl  hover:shadow-xl transition duration-300
// pl-4 pr-1 lg:pl-5 pt-4 lg:pt-4

// hover:-translate-y-1 "
//                           title="Open PDF"
//                         >
//                           <i className="fa-solid fa-file-pdf text-red-600 text-3xl"></i>
//                         </div>
//                       )}
//                     </td>
//                     <td className="p-4 ">
//                       <button
//                         onClick={() => {
//                           setSelectedParent(service);
//                           setViewMode("categories");
//                         }}
//                         className="text-orange-500 hover:orange-blue-700 px-3 py-1"
//                       >
//                         <i className="fas fa-edit"></i>
//                       </button>
//                     </td>
//                     <td className="p-4">
//                       <button
//                         onClick={() => {
//                           setSelectedParent(service);
//                           setViewMode("sub");
//                         }}
//                         className="text-orange-500 hover:orange-blue-700 px-3 py-1"
//                       >
//                         <i className="fas fa-edit"></i>
//                       </button>
//                     </td>
//                     {/* worklob */}
//                     <td className="p-4">
//                       <WorkLogTooltip value={service.workLogs} />
//                     </td>
//                     {/* <td className="p-4">
//                       {service.workLogs ? (
//                         <div className="max-h-32 h-16 overflow-y-auto bg-gray-50 border rounded-lg p-3 text-sm whitespace-pre-line shadow-inner">
//                           {service.workLogs}
//                         </div>
//                       ) : (
//                         <span className="text-gray-400 text-sm italic"></span>
//                       )}
//                     </td> */}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : viewMode === "categories" ? (
//         <ManageCategoriesPage
//           parent={selectedParent}
//           onBack={() => {
//             setViewMode("main");
//             setSelectedParent(null);
//           }}
//         />
//       ) : (
//         <>
//           <ManageSubServicesPage
//             mainServiceId={selectedParent?.id || selectedParent?.Id}
//             mainServiceTitle={selectedParent?.title}
//             onBack={() => {
//               setViewMode("main");
//               setSelectedParent(null);
//             }}
//           />
//         </>
//       )}

//       {/* pdf view */}
//       {open && (
//         <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
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
//       {/* STATUS UPATION CONFIRMATION MODAL */}
//       {isStatusModalOpen && (
//         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-2xl shadow-2xl w-[420px] p-6 animate-fadeIn">
//             <h2 className="text-xl font-semibold text-gray-900">
//               Change Service Status
//             </h2>

//             <p className="text-gray-600 mt-3">
//               Are you sure you want to{" "}
//               <span className="font-semibold text-black">
//                 {serviceToToggle?.status === "active"
//                   ? "Deactivate"
//                   : "Activate"}
//               </span>{" "}
//               <span className="font-semibold">{serviceToToggle?.title}</span>?
//             </p>

//             <div className="flex justify-end gap-3 mt-6">
//               <button
//                 onClick={() => {
//                   setIsStatusModalOpen(false);
//                   setServiceToToggle(null);
//                 }}
//                 className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={confirmStatusToggle}
//                 disabled={statusMutation.isPending}
//                 className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${
//                   statusMutation.isPending
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-black hover:bg-gray-800"
//                 }`}
//               >
//                 {statusMutation.isPending ? (
//                   <>
//                     <span className="bw-loader"></span>
//                     Updating...
//                   </>
//                 ) : (
//                   "Confirm"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* ================= Modal ================= */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/40 z-[500] flex justify-center items-center">
//           <div className="bg-white p-6  rounded-xl w-[400px] lg:w-[700px] shadow-lg">
//             <h2 className="text-lg font-semibold mb-4">
//               {editingService ? "Edit Service" : "Add Service"}
//             </h2>

//             <form className="space-y-4">
//               <label className="block text-sm font-medium text-gray-600 mb-1">
//                 Service Title
//               </label>
//               <input
//                 type="text"
//                 placeholder="Service Title"
//                 value={formData.title}
//                 onChange={(e) =>
//                   setFormData({ ...formData, title: e.target.value })
//                 }
//                 className="w-full border rounded-lg px-3 py-2"
//                 required
//               />

//               <label className="block text-sm font-medium text-gray-600 mb-1">
//                 Description
//               </label>
//               <input
//                 type="text"
//                 placeholder="Description"
//                 value={formData.desc}
//                 onChange={(e) =>
//                   setFormData({ ...formData, desc: e.target.value })
//                 }
//                 className="w-full border rounded-lg px-3 py-2"
//                 required
//               />

//               <div className=" grid grid-cols-4 gap-6 mx-4 items-start">
//                 {/* img */}
//                 <div className="">
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Upload Image
//                   </label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => {
//                       const file = e.target.files[0];
//                       if (file) {
//                         setSelectedFile(file);
//                         setPreviewImage(URL.createObjectURL(file)); // ✅ show new preview
//                       }
//                     }}
//                     className="w-full border rounded-lg px-3 py-2"
//                   />
//                 </div>
//                 {/* icon */}
//                 <div className="">
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Upload Icon
//                   </label>

//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => {
//                       const file = e.target.files[0];
//                       if (file) {
//                         setSelectedIconFile(file);
//                         setPreviewIcon(URL.createObjectURL(file));
//                       }
//                     }}
//                     className="w-full border rounded-lg px-3 py-2"
//                   />
//                 </div>
//                 {/* rate card pdf */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Rate Card PDF
//                   </label>

//                   <input
//                     type="file"
//                     accept="application/pdf"
//                     onChange={(e) => {
//                       const file = e.target.files[0];
//                       if (file) {
//                         setSelectedPdfFile(file);
//                         setPreviewPdf(URL.createObjectURL(file));
//                       }
//                     }}
//                     className="w-full border rounded-lg px-3 py-2"
//                   />
//                 </div>
//                 {/* information pdf */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Information PDF
//                   </label>

//                   <input
//                     type="file"
//                     accept="application/pdf"
//                     onChange={(e) => {
//                       const file = e.target.files[0];
//                       if (file) {
//                         setSelectedInfoPdfFile(file);
//                         setPreviewInfoPdf(URL.createObjectURL(file));
//                         setRemoveInfoPdf(false);
//                       }
//                     }}
//                     className="w-full border rounded-lg px-3 py-2"
//                   />
//                 </div>
//               </div>
//               {(previewIcon ||
//                 previewImage ||
//                 previewPdf ||
//                 previewInfoPdf) && (
//                 <div className="mt-4 grid grid-cols-4 gap-6 mx-4 items-start">
//                   {/* IMAGE SLOT */}
//                   <div className="relative h-20 w-20">
//                     {previewImage && (
//                       <>
//                         <img
//                           src={previewImage}
//                           alt="Preview"
//                           className="h-20 w-20 object-cover border"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => {
//                             setPreviewImage(null);
//                             setSelectedFile(null);
//                             setRemoveImage(true);
//                           }}
//                           className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 text-xs"
//                         >
//                           ✕
//                         </button>
//                       </>
//                     )}
//                   </div>

//                   {/* ICON SLOT */}
//                   <div className="relative h-20 w-20">
//                     {previewIcon && (
//                       <>
//                         <img
//                           src={previewIcon}
//                           alt="Icon Preview"
//                           className="h-20 w-20 object-contain border"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => {
//                             setPreviewIcon(null);
//                             setSelectedIconFile(null);
//                             setRemoveIcon(true);
//                           }}
//                           className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 text-xs"
//                         >
//                           ✕
//                         </button>
//                       </>
//                     )}
//                   </div>

//                   {/* PDF SLOT */}
//                   <div className="relative h-20 w-20">
//                     {(previewPdf || selectedPdfFile) && (
//                       <>
//                         <div className="h-20 w-20 border flex items-center justify-center bg-white">
//                           <i className="fa-solid fa-file-pdf text-red-600 text-4xl"></i>
//                         </div>
//                         <button
//                           type="button"
//                           onClick={() => {
//                             setPreviewPdf(null);
//                             setSelectedPdfFile(null);
//                             setRemovePdf(true);
//                           }}
//                           className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 text-xs"
//                         >
//                           ✕
//                         </button>
//                       </>
//                     )}
//                   </div>

//                   {/* INFO PDF SLOT */}
//                   <div className="relative h-20 w-20">
//                     {(previewInfoPdf || selectedInfoPdfFile) && (
//                       <>
//                         <div className="h-20 w-20 border flex items-center justify-center bg-white">
//                           <i className="fa-solid fa-file-pdf text-red-600 text-4xl"></i>
//                         </div>
//                         <button
//                           type="button"
//                           onClick={() => {
//                             setPreviewInfoPdf(null);
//                             setSelectedInfoPdfFile(null);
//                             setRemoveInfoPdf(true);
//                           }}
//                           className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 text-xs"
//                         >
//                           ✕
//                         </button>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               )}
//               {/* {(previewIcon ||
//                 previewImage ||
//                 previewPdf ||
//                 previewInfoPdf) && (
//                 <div className="mt-4 grid grid-cols-4 gap-6 mx-4 items-start">

//                   {previewImage && (
//                     <div className="relative h-20 w-20">
//                       <img
//                         src={previewImage}
//                         alt="Preview"
//                         className="h-20 w-20 object-cover border"
//                       />

//                       <button
//                         type="button"
//                         onClick={() => {
//                           setPreviewImage(null);
//                           setSelectedFile(null);
//                           setRemoveImage(true);
//                         }}
//                         className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-800"
//                       >
//                         ✕
//                       </button>
//                     </div>
//                   )}

//                   {previewIcon && (
//                     <div className="relative h-20 w-20">
//                       <img
//                         src={previewIcon}
//                         alt="Icon Preview"
//                         className="h-20 w-20 object-contain border"
//                       />

//                       <button
//                         type="button"
//                         onClick={() => {
//                           setPreviewIcon(null);
//                           setSelectedIconFile(null);
//                           setRemoveIcon(true);
//                         }}
//                         className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-800"
//                       >
//                         ✕
//                       </button>
//                     </div>
//                   )}

//                   {(previewPdf || selectedPdfFile) && (
//                     <div className="relative h-20 w-20">
//                       <div className="h-20 w-20 border flex items-center justify-center bg-white">
//                         <i className="fa-solid fa-file-pdf text-red-600 text-4xl"></i>
//                       </div>

//                       <button
//                         type="button"
//                         onClick={() => {
//                           setPreviewPdf(null);
//                           setSelectedPdfFile(null);
//                           setRemovePdf(true);
//                         }}
//                         className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-800"
//                       >
//                         ✕
//                       </button>
//                     </div>
//                   )}

//                   {(previewInfoPdf || selectedInfoPdfFile) && (
//                     <div className="relative h-20 w-20">
//                       <div className="h-20 w-20 border flex items-center justify-center bg-white">
//                         <i className="fa-solid fa-file-pdf text-red-600 text-4xl"></i>
//                       </div>

//                       <button
//                         type="button"
//                         onClick={() => {
//                           setPreviewInfoPdf(null);
//                           setSelectedInfoPdfFile(null);
//                           setRemoveInfoPdf(true);
//                         }}
//                         className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6"
//                       >
//                         ✕
//                       </button>
//                     </div>
//                   )}

//                 </div>
//               )} */}

//               <div className="flex justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   className="px-4 py-2 border rounded-lg"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleFinalSubmit}
//                   disabled={
//                     createMutation.isPending || updateMutation.isPending
//                   }
//                   className="px-4 py-2 bg-black text-white rounded-lg flex items-center gap-2"
//                 >
//                   {createMutation.isPending || updateMutation.isPending ? (
//                     <>
//                       <span className="bw-loader"></span>
//                       Saving...
//                     </>
//                   ) : editingService ? (
//                     "Update"
//                   ) : (
//                     "Save"
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//           <style>{`
//   .bw-loader {
//     border: 3px solid #e5e5e5;
//     border-top: 3px solid #000;
//     border-radius: 50%;
//     width: 16px;
//     height: 16px;
//     animation: spin 0.6s linear infinite;
//   }
//     .bw-loader-small {
//   border: 2px solid #fff;
//   border-top: 2px solid transparent;
//   border-radius: 50%;
//   width: 14px;
//   height: 14px;
//   animation: spin 0.6s linear infinite;
// }

//   @keyframes spin {
//     0% { transform: rotate(0deg); }
//     100% { transform: rotate(360deg); }
//   }
// `}</style>
//         </div>
//       )}
//       {/* ================= DELETE CONFIRMATION MODAL ================= */}
//       {isDeleteModalOpen && (
//         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-xl shadow-xl w-[400px] p-6 animate-fadeIn">
//             <h2 className="text-lg font-semibold text-gray-900">
//               Delete Service
//             </h2>

//             <p className="text-gray-600 mt-2">
//               Are you sure you want to delete{" "}
//               <span className="font-medium text-black">
//                 {serviceToDelete?.title}
//               </span>
//               ? This action cannot be undone.
//             </p>

//             <div className="flex justify-end gap-3 mt-6">
//               <button
//                 onClick={() => {
//                   setIsDeleteModalOpen(false);
//                   setServiceToDelete(null);
//                 }}
//                 className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={confirmDelete}
//                 disabled={deleteMutation.isPending}
//                 className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
//                   deleteMutation.isPending
//                     ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                     : "bg-black text-white hover:bg-gray-800"
//                 }`}
//               >
//                 {deleteMutation.isPending ? (
//                   <>
//                     <span className="bw-loader"></span> Deleting...
//                   </>
//                 ) : (
//                   "Delete"
//                 )}
//               </button>
//             </div>
//           </div>
//           <style>{`
//   .bw-loader {
//     border: 3px solid #e5e5e5;
//     border-top: 3px solid #000;
//     border-radius: 50%;
//     width: 16px;
//     height: 16px;
//     animation: spin 0.6s linear infinite;
//   }

//   @keyframes spin {
//     0% { transform: rotate(0deg); }
//     100% { transform: rotate(360deg); }
//   }

//   .animate-fadeIn {
//     animation: fadeIn 0.2s ease-in-out;
//   }

//   @keyframes fadeIn {
//     from { opacity: 0; transform: scale(0.95); }
//     to { opacity: 1; transform: scale(1); }
//   }
// `}</style>
//         </div>
//       )}

//       {/* ================= SUB SERVICE MODAL ================= */}
//     </div>
//   );
// };

// export default MainServicesPage;
