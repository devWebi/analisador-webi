import React from "react";
import { AlertTriangleIcon } from "./Icons";

/**
 * Um componente para exibir um único problema de acessibilidade.
 * @param {{issue: {title: string, description: string}}} props - As propriedades do componente.
 * @returns {JSX.Element}
 */
const AccessibilityIssue = ({ issue }) => {
  return (
    <div className="glass-pane p-4 rounded-lg flex items-start gap-4">
      <div className="pt-1">
        <AlertTriangleIcon className="w-5 h-5 text-amber-400" />
      </div>
      <div>
        <h4 className="font-bold text-[var(--text-primary)]">{issue.title}</h4>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          {issue.description}
        </p>
      </div>
    </div>
  );
};

export default AccessibilityIssue;
