export const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;
const normalize = (value) => {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);

  return String(value).trim();
};

const formatDateTime = () => {
  const now = new Date();
  return now.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
export const generateWorklog = (oldData, newData, userName, empId) => {
  let changes = [];

  Object.keys(newData).forEach((key) => {
    const oldValue = normalize(oldData?.[key]);
    const newValue = normalize(newData?.[key]);

    if (oldValue !== newValue) {
      changes.push(`${key} changed from ${oldValue} to ${newValue}`);
    }
  });

  if (changes.length === 0) return oldData?.WorkLogs || "";

  const logHeader = `[${formatDateTime()} - (${empId}) ${userName}]`;

  return `${logHeader}\n${changes.join("\n")}\n\n${oldData?.WorkLogs || ""}`;
};

export const generateCreateWorklog = (data, userName, empId) => {
  const changes = [];

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (value !== undefined && value !== null && value !== "") {
      changes.push(`${key} set to ${value}`);
    }
  });

  const logHeader = `[${formatDateTime()} - (${empId}) ${userName}]`;

  return `${logHeader}\nCreated new record\n${changes.join("\n")}`;
};