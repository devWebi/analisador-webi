import React from "react";

import { XCircleIcon, AlertTriangleIcon, CheckCircleIcon } from "../ui/Icons";

const InsightItem = ({ insight }) => {
  const borderColors = {
    error: "border-l-red-500",
    warning: "border-l-amber-500",
    success: "border-l-emerald-500",
  };

  const icons = {
    error: <XCircleIcon />,
    warning: <AlertTriangleIcon />,
    success: <CheckCircleIcon />,
  };

  return (
    <div
      className={`flex items-start p-4 bg-[var(--insight-bg)] rounded-lg border-l-4 ${
        borderColors[insight.type]
      }`}
    >
      <div className="flex-shrink-0 mr-4 mt-1">{icons[insight.type]}</div>

      <p className="text-[var(--text-primary)]">{insight.text}</p>
    </div>
  );
};

export default InsightItem;
