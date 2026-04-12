import { Tags, LayoutGrid } from "lucide-react";

const MainServiceCard = ({
  service,
  onEdit,
  onToggleStatus,
  updatingId,
  setZoomImage,
  setOpenPdf,
  onOpenCategories,
  onOpenSubServices,
}) => {
  return (
    <div className="bg-white border rounded-lg shadow p-3 text-sm">
      {/* ===== TOP ROW ===== */}
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-orange-600">{service.title}</span>

        <div className="flex gap-3 text-lg items-center">
          {/* CATEGORY */}
          <button
            onClick={() => onOpenCategories(service)}
            className="t"
            title="Categories"
          >
            <Tags size={18} />
          </button>

          {/* SUB SERVICES */}
          <button
            onClick={() => onOpenSubServices(service)}
            className=""
            title="Sub Services"
          >
            <LayoutGrid size={18} />
          </button>
          {/* EDIT */}
          <button onClick={() => onEdit(service)} className="text-green-500">
            <i className="fas fa-edit"></i>
          </button>

          {/* VIEW */}
          <button onClick={() => onEdit(service)} className="text-red-500">
            <i className="fa fa-eye"></i>
          </button>
        </div>
      </div>

      {/* ===== DETAILS ===== */}
      <div className="space-y-1 text-gray-700">
        <div className="flex justify-between my-4">
          <p className="flex items-center gap-2">
            <b>Image:</b>
            <img
              src={service.img}
              onClick={() => setZoomImage(service.img)}
              className="h-10 w-10 object-cover rounded cursor-pointer"
            />
          </p>

          <p className="flex items-center gap-2">
            <b>Icon:</b>
            <img
              src={service.Icon || service.icon}
              onClick={() => setZoomImage(service.Icon || service.icon)}
              className="h-10 w-10 object-contain cursor-pointer"
            />
          </p>

          <p>
            <b>Status:</b>
            <button
              disabled={updatingId === (service.id || service.Id)}
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

        <div className="flex justify-between">
          <p>
            <b>Rate Card PDF:</b>{" "}
            {service?.Pdf ? (
              <i
                className="fa-solid fa-file-pdf text-red-600 cursor-pointer"
                onClick={() => setOpenPdf(service.Pdf)}
              ></i>
            ) : (
              "N/A"
            )}
          </p>

          <p>
            <b>Information PDF:</b>{" "}
            {service?.InformationPdf ? (
              <i
                className="fa-solid fa-file-pdf text-red-600 cursor-pointer"
                onClick={() => setOpenPdf(service.InformationPdf)}
              ></i>
            ) : (
              "N/A"
            )}
          </p>
        </div>
      </div>

      {/* ===== WORKLOG ===== */}
      <div className="mt-3 bg-gray-50 p-2 rounded text-xs max-h-[150px] overflow-y-auto">
        <b>WorkLogs:</b>

        {service.workLogs ? (
          service.workLogs.split(/\n(?=\[)/).map((log, index) => {
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
  );
};

export default MainServiceCard;