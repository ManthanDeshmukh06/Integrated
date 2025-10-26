"use client";

export default function DashboardCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendPositive, 
  color = "green",
  onClick 
}) {
  const colorStyles = {
    green: {
      iconBg: "from-green-50 to-green-100",
      iconColor: "text-green-600",
      progress: "from-green-400 to-green-500"
    },
    blue: {
      iconBg: "from-blue-50 to-blue-100",
      iconColor: "text-blue-600",
      progress: "from-blue-400 to-blue-500"
    },
    purple: {
      iconBg: "from-purple-50 to-purple-100",
      iconColor: "text-purple-600",
      progress: "from-purple-400 to-purple-500"
    },
    orange: {
      iconBg: "from-orange-50 to-orange-100",
      iconColor: "text-orange-600",
      progress: "from-orange-400 to-orange-500"
    }
  };

  const styles = colorStyles[color];

  return (
    <div 
      onClick={onClick}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 p-4 lg:p-6 hover:shadow-md transition-all duration-300 group hover:scale-[1.02] cursor-pointer"
    >
      {/* Icon and Trend */}
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${styles.iconBg} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
          <i className={`${icon} ${styles.iconColor} text-xl lg:text-2xl`}></i>
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trendPositive 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            <i className={`bi bi-${trendPositive ? 'arrow-up' : 'arrow-down'}-right mr-1`}></i>
            {trend}
          </span>
        )}
      </div>
      
      {/* Content */}
      <div className="space-y-1">
        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">{title}</h3>
        <div className="flex items-end gap-2">
          <p className="text-2xl lg:text-3xl font-bold text-gray-800">{value}</p>
          {subtitle && (
            <span className="text-sm text-gray-500 mb-1">{subtitle}</span>
          )}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-4 w-full bg-gray-200/60 rounded-full h-1.5 shadow-inner">
        <div 
          className={`h-1.5 rounded-full bg-gradient-to-r ${styles.progress} transition-all duration-500 ease-out`}
          style={{ width: trendPositive ? '75%' : '40%' }}
        ></div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-green-200/50 transition-all duration-300 pointer-events-none"></div>
    </div>
  );
}