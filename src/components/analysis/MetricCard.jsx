import React from "react";

const MetricCard = ({ label, value, unit = "" }) => (
  <div className="glass-pane p-4 rounded-2xl shadow text-center flex flex-col justify-center interactive-card">
    <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wider">
      {label}
    </p>
    <p className="text-3xl font-bold text-[var(--text-primary)]">
      {value}

      <span className="text-lg font-normal text-[var(--text-secondary)]">
        {unit}
      </span>
    </p>
  </div>
);

export default MetricCard;
