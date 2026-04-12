import { Trash2 } from "lucide-react";

const MobileSubServiceCard = ({
  service,
  onEdit,
  onDelete,
  onToggleStatus,
  updatingId,
  setZoomImage,
  setOpenPdf,
}) => {
  return (
    <div className="bg-white border rounded-lg shadow p-3 text-sm">
      {/* ===== TOP ROW ===== */}
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-orange-600">{service.title}</span>

        <div className="flex gap-3 text-lg items-center">
          {/* EDIT */}
          <button onClick={() => onEdit(service)} className="text-green-500">
            <i className="fas fa-edit"></i>
          </button>

          {/* DELETE */}
          <button onClick={() => onDelete(service)} className="text-red-500">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* ===== DETAILS ===== */}
      <div className="space-y-1 text-gray-700">
        <div className="flex justify-between my-4 flex-wrap gap-3">
          {/* ICON */}
          <p className="flex items-center gap-2">
            <b>Icon:</b>
            {service.icon ? (
              <img
                src={service.icon}
                onClick={() => setZoomImage(service.icon)}
                className="h-10 w-10 object-contain cursor-pointer"
              />
            ) : (
              "N/A"
            )}
          </p>

          {/* PRICE */}
          <p>
            <b>Price:</b> ₹{service.price}
          </p>

          {/* STATUS */}
          <p>
            <b>Status:</b>
            <button
              disabled={updatingId === service.sub_service_id}
              onClick={() => onToggleStatus(service)}
              className={`ml-2 inline-flex h-5 w-10 items-center rounded-full ${
                service.status === "active" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              <span
                className={`inline-block h-3 w-3 bg-white rounded-full transition ${
                  service.status === "active"
                    ? "translate-x-5"
                    : "translate-x-1"
                }`}
              />
            </button>
          </p>
        </div>

        {/* PDF */}
        <div className="flex justify-between flex-wrap gap-3">
          <p>
            <b>PDF:</b>{" "}
            {service.pdfUrl ? (
              <i
                className="fa-solid fa-file-pdf text-red-600 cursor-pointer"
                onClick={() => setOpenPdf(service.pdfUrl)}
              ></i>
            ) : (
              "N/A"
            )}
          </p>
        </div>
        {/* ===== WORKLOG ===== */}
        <div className="mt-3 bg-gray-50 p-2 rounded text-xs max-h-[150px] overflow-y-auto">
          <b>WorkLogs:</b>

          {service.WorkLogs ? (
            service.WorkLogs.split(/\n(?=\[)/).map((log, index) => {
              const lines = log.split("\n").filter(Boolean);
              if (!lines.length) return null;

              const meta = lines[0];
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
    </div>
  );
};

export default MobileSubServiceCard;