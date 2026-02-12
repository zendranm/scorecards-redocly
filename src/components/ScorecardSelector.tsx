"use client";

interface Scorecard {
  id: string;
  name: string;
  baseName: string;
  repository: string;
  active: boolean;
}

interface ScorecardSelectorProps {
  scorecards: Scorecard[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  showInactive: boolean;
  onShowInactiveChange: (show: boolean) => void;
}

export const ScorecardSelector = ({
  scorecards,
  selectedId,
  onSelect,
  showInactive,
  onShowInactiveChange,
}: ScorecardSelectorProps) => {
  const groupedScorecards = scorecards.reduce((acc, scorecard) => {
    if (!acc[scorecard.baseName]) {
      acc[scorecard.baseName] = [];
    }
    acc[scorecard.baseName].push(scorecard);
    return acc;
  }, {} as Record<string, Scorecard[]>);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Select Scorecard
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => onShowInactiveChange(e.target.checked)}
            className="rounded"
          />
          Show all versions
        </label>
      </div>
      <select
        value={selectedId || ""}
        onChange={(e) => onSelect(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
      >
        <option value="">Choose a scorecard...</option>
        {Object.entries(groupedScorecards).map(([baseName, versions]) => (
          <optgroup key={baseName} label={baseName}>
            {versions.map((scorecard) => (
              <option key={scorecard.id} value={scorecard.id}>
                {scorecard.name}
                {scorecard.active ? " (Active)" : " (Inactive)"}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
};
