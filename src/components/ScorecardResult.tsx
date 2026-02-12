"use client";

import { ScorecardResult as ScorecardResultType } from "@/types/scorecard";

interface ScorecardResultProps {
  result: ScorecardResultType;
}

const formatDateTime = (date: Date) => {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const ScorecardResult = ({ result }: ScorecardResultProps) => {
  const startDate = new Date(result.timeWindow.start);
  const endDate = new Date(result.timeWindow.end);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {result.scorecardName}
          </h2>
          <p className="text-sm text-gray-600">{result.repository}</p>
        </div>
        <div
          className={`px-4 py-2 rounded-full font-semibold ${
            result.passed
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {result.passed ? "PASSED" : "FAILED"}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Time Window</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDateTime(startDate)}
            </p>
            <p className="text-sm font-medium text-gray-900">
              to {formatDateTime(endDate)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Deployments</p>
            <p className="text-sm font-medium text-gray-600">
              {result.deploymentCount}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Rules</h3>
        {result.ruleResults.map((rule) => (
          <div
            key={rule.ruleId}
            className={`p-4 rounded-lg border ${
              rule.passed
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{rule.message}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Actual: {rule.actual} | Threshold: {rule.threshold}
                </p>
              </div>
              <span
                className={`text-2xl ${
                  rule.passed ? "text-green-600" : "text-red-600"
                }`}
              >
                {rule.passed ? "✓" : "✗"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-gray-500 text-right">
        Calculated at: {new Date(result.calculatedAt).toLocaleString()}
      </div>
    </div>
  );
};
