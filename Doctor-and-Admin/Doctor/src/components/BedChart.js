"use client";

export default function BedChart() {
  const bedData = [
    { type: "Occupied", count: 56, color: "bg-blue-500", percentage: 70 },
    { type: "Available", count: 24, color: "bg-green-500", percentage: 30 },
    { type: "Maintenance", count: 8, color: "bg-yellow-500", percentage: 10 }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Bed Status</h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          88 total
        </span>
      </div>

      {/* Compact Chart */}
      <div className="flex-1 space-y-3">
        {/* Mini Bar Chart */}
        <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
          <div className="flex h-full">
            <div 
              className="bg-blue-500 transition-all duration-300"
              style={{ width: '70%' }}
            ></div>
            <div 
              className="bg-green-500 transition-all duration-300"
              style={{ width: '30%' }}
            ></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          {bedData.map((bed, index) => (
            <div key={index} className="text-center p-2 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-center gap-1 mb-1">
                <div className={`w-2 h-2 rounded-full ${bed.color}`}></div>
                <span className="text-xs font-medium text-gray-700">{bed.type}</span>
              </div>
              <div className="text-sm font-bold text-gray-900">{bed.count}</div>
              <div className="text-xs text-gray-500">{bed.percentage}%</div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-blue-50 rounded-lg p-2">
            <div className="text-xs text-blue-600">Occupancy Rate</div>
            <div className="text-sm font-semibold text-blue-800">70%</div>
          </div>
          <div className="bg-green-50 rounded-lg p-2">
            <div className="text-xs text-green-600">Available Now</div>
            <div className="text-sm font-semibold text-green-800">24</div>
          </div>
        </div>
      </div>

      {/* Quick Action */}
      <button className="mt-3 w-full py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-150 text-sm font-medium border border-blue-200">
        Manage Beds
      </button>
    </div>
  );
}