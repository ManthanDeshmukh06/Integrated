"use client";

export default function PriorityBadge({ priority }) {
  const getPriorityConfig = (priority) => {
    const configs = {
      urgent: {
        label: "URGENT",
        color: "bg-red-100 text-red-700 border-red-200",
        icon: "bi bi-exclamation-triangle"
      },
      high: {
        label: "HIGH",
        color: "bg-orange-100 text-orange-700 border-orange-200",
        icon: "bi bi-arrow-up"
      },
      medium: {
        label: "MEDIUM",
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        icon: "bi bi-dash"
      },
      routine: {
        label: "ROUTINE",
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: "bi bi-arrow-down"
      }
    };
    
    return configs[priority] || configs.routine;
  };

  const config = getPriorityConfig(priority);

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      <i className={`${config.icon} text-xs`}></i>
      {config.label}
    </span>
  );
}