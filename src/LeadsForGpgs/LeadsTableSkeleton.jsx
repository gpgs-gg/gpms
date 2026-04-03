export const LeadsTableSkeleton = () => {
  return (
    <div className="max-w-full mx-auto mt-3 p-2 bg-gray-50 rounded-lg shadow-md animate-pulse">

      {/* ===== FILTER BAR SKELETON ===== */}
      <div className="flex flex-wrap gap-3 mb-4 justify-center">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-32 bg-gray-200 rounded-xl"
          />
        ))}
      </div>

      {/* ===== TABLE SKELETON ===== */}
      <div className="overflow-hidden bg-white rounded-lg shadow">
        <table className="min-w-full border">
          <thead className="bg-black text-gray-200">
            <tr>
              {Array.from({ length: 12 }).map((_, i) => (
                <th key={i} className="p-4">
                  <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 8 }).map((_, row) => (
              <tr key={row} className="border-b">
                {Array.from({ length: 12 }).map((_, col) => (
                  <td key={col} className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== PAGINATION SKELETON ===== */}
      <div className="flex justify-center gap-4 mt-5">
        <div className="h-8 w-24 bg-gray-200 rounded" />
        <div className="h-8 w-24 bg-gray-200 rounded" />
      </div>
    </div>
  );
};


export const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-100 p-4 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <div>
          <div className="h-6 w-48 bg-slate-300 rounded mb-2"></div>
          <div className="h-4 w-64 bg-slate-200 rounded"></div>
        </div>

        <div className="flex gap-2 bg-white border h-9 px-3 py-1 rounded-xl shadow">
          <div className="h-5 w-20 bg-slate-200 rounded"></div>
          <div className="h-5 w-20 bg-slate-200 rounded"></div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2 mb-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg p-3 shadow-sm"
          >
            <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
            <div className="h-6 w-16 bg-slate-300 rounded"></div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-5 border-b">
          <div className="h-5 w-32 bg-slate-300 rounded"></div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody>
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-t">
                  {Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 w-full bg-slate-200 rounded"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
