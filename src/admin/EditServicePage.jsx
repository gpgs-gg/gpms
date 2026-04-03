import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DocumentEditor from "./DocumentEditor";
import {
  useMainServices,
  useUpdateMainService,
} from "../components/services/index";
import { toast } from "react-toastify";

const EditServicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: services = [] } = useMainServices();
  const updateMutation = useUpdateMainService();
  const [viewMode, setViewMode] = useState("html");

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedIconFile, setSelectedIconFile] = useState(null);
  const [selectedPdfFile, setSelectedPdfFile] = useState(null);

  const [previewImage, setPreviewImage] = useState(null);
  const [previewIcon, setPreviewIcon] = useState(null);
  const [previewPdf, setPreviewPdf] = useState(null);

  const [removeImage, setRemoveImage] = useState(false);
  const [removeIcon, setRemoveIcon] = useState(false);
  const [removePdf, setRemovePdf] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    document: "",
  });

  // 🔄 Load data
  useEffect(() => {
    const service = services.find((s) => (s.id || s.Id) == id);

    if (service) {
      setFormData({
        title: service.title || service.Title,
        desc: service.desc || service.Description,
        document: service.document || "",
      });

      setPreviewImage(service.img || service.Image);
      setPreviewIcon(service.icon || service.Icon);
      setPreviewPdf(service.pdf || service.Pdf);
    }
  }, [id, services]);

  // 💾 Submit
  const handleSubmit = () => {
    const formDataToSend = new FormData();

    formDataToSend.append("Id", id);
    formDataToSend.append("Title", formData.title);
    formDataToSend.append("Description", formData.desc);
    formDataToSend.append("Document", formData.document);

    if (selectedFile) formDataToSend.append("image", selectedFile);
    if (selectedIconFile) formDataToSend.append("icon", selectedIconFile);
    if (selectedPdfFile) formDataToSend.append("pdf", selectedPdfFile);

    if (removeImage) formDataToSend.append("removeImage", "true");
    if (removeIcon) formDataToSend.append("removeIcon", "true");
    if (removePdf) formDataToSend.append("removePdf", "true");

    updateMutation.mutate(formDataToSend, {
      onSuccess: () => {
        toast.success("Updated successfully");
        navigate(-1);
      },
      onError: () => {
        toast.error("Update failed");
      },
    });
  };

  return (
    <div className="p-2  ">
      <h1 className="text-2xl font-bold">Edit Service</h1>
      <div className="flex gap-1 w-full my-4">
        <div className="w-[25%]  bg-white p-4 rounded-xl shadow-md border space-y-4">
          {/* TITLE */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Service Title
            </label>
            <input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter title"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <input
              value={formData.desc}
              onChange={(e) =>
                setFormData({ ...formData, desc: e.target.value })
              }
              placeholder="Enter description"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* FILE UPLOADS */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Files
            </label>

            <div className="grid grid-cols-3 gap-3">
              {/* IMAGE */}
              <label className="cursor-pointer border rounded-lg p-2 text-center hover:bg-gray-50">
                <p className="text-xs text-gray-500">Image</p>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setSelectedFile(file);
                    setPreviewImage(URL.createObjectURL(file));
                  }}
                />
              </label>

              {/* ICON */}
              <label className="cursor-pointer border rounded-lg p-2 text-center hover:bg-gray-50">
                <p className="text-xs text-gray-500">Icon</p>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setSelectedIconFile(file);
                    setPreviewIcon(URL.createObjectURL(file));
                  }}
                />
              </label>

              {/* PDF */}
              <label className="cursor-pointer border rounded-lg p-2 text-center hover:bg-gray-50">
                <p className="text-xs text-gray-500">PDF</p>
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setSelectedPdfFile(file);
                    setPreviewPdf(URL.createObjectURL(file));
                  }}
                />
              </label>
            </div>
          </div>

          {/* PREVIEW */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Preview
            </label>

            <div className="flex gap-4 flex-wrap">
              {/* IMAGE */}
              {previewImage && (
                <div className="relative group">
                  <img
                    src={previewImage}
                    className="h-20 w-20 object-cover rounded-lg border"
                  />
                  <button
                    onClick={() => setRemoveImage(true)}
                    className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full hidden group-hover:flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* ICON */}
              {previewIcon && (
                <div className="relative group">
                  <img
                    src={previewIcon}
                    className="h-20 w-20 object-contain rounded-lg border bg-white"
                  />
                  <button
                    onClick={() => setRemoveIcon(true)}
                    className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full hidden group-hover:flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* PDF */}
              {previewPdf && (
                <div className="relative group flex items-center justify-center h-20 w-20 border rounded-lg bg-gray-50">
                  <span className="text-red-600 text-xl">📄</span>
                  <button
                    onClick={() => setRemovePdf(true)}
                    className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full hidden group-hover:flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* 🔥 DOCUMENT EDITOR */}
        <div className="w-[70%] my-2 bg-white p-4 rounded-xl shadow-md border">
          {/* document  */}
          <div className="flex justify-between gap-2">
            <div className="w-[50%]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Document
              </label>
              <DocumentEditor
                value={formData.document}
                onChange={(value) =>
                  setFormData({ ...formData, document: value })
                }
              />
            </div>
            {/* preview */}
            <div className="w-[50%]  bg-white p-4 rounded-xl shadow-md border space-y-4 overflow-auto">
              <div className="flex gap-2 mb-2">
                <button onClick={() => setViewMode("preview")}>Preview</button>
                <button onClick={() => setViewMode("html")}>HTML</button>
              </div>
              {viewMode === "preview" ? (
                <div dangerouslySetInnerHTML={{ __html: formData.document }} />
              ) : (
                <pre>{formData.document}</pre>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* 🔹 BASIC INFO */}

      {/* ACTIONS */}
      <div className="flex gap-4">
        <button
          onClick={handleSubmit}
          className="bg-black text-white px-6 py-2 rounded"
        >
          Save
        </button>

        <button
          onClick={() => navigate(-1)}
          className="border px-6 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditServicePage;
