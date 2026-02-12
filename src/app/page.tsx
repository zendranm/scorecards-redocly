"use client";

import { useState, useEffect } from "react";
import { ScorecardSelector } from "@/components/ScorecardSelector";
import { ScorecardResult } from "@/components/ScorecardResult";
import { ScorecardResult as ScorecardResultType } from "@/types/scorecard";

interface Scorecard {
  id: string;
  name: string;
  baseName: string;
  repository: string;
  active: boolean;
}

// TODO: This page should be thoroughly refactored to be more modular
// TODO: Add historical results tracking

export default function Home() {
  const [scorecards, setScorecards] = useState<Scorecard[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [result, setResult] = useState<ScorecardResultType | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    fetchScorecards();
  }, [showInactive]);

  const fetchScorecards = async () => {
    try {
      const url = showInactive
        ? "/api/scorecards?includeInactive=true"
        : "/api/scorecards";
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setScorecards(data.data);
        if (data.data.length > 0 && !selectedId) {
          setSelectedId(data.data[0].id);
        }
      }
    } catch (err) {
      setError("Failed to load scorecards");
    }
  };

  const viewResults = async () => {
    if (!selectedId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/scorecards/${selectedId}/results`);
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setResult(null);
        setError("No results found for this scorecard");
      }
    } catch (err) {
      setResult(null);
      setError("Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  const calculateResults = async () => {
    if (!selectedId) return;

    setCalculating(true);
    setError(null);

    const selectedScorecard = scorecards.find((s) => s.id === selectedId);

    if (!selectedScorecard?.active) {
      setResult(null);
      setError("Cannot calculate new results for inactive scorecard versions");
      setCalculating(false);
      return;
    }

    try {
      const res = await fetch("/api/scorecards/calculate", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        const matchingResult = data.data.find(
          (r: ScorecardResultType) =>
            r.scorecardName === selectedScorecard?.name
        );
        if (matchingResult) {
          setResult(matchingResult);
        } else {
          setResult(null);
          setError("No results found for this scorecard");
        }
      } else {
        setResult(null);
        setError(data.error || "Failed to calculate");
      }
    } catch (err) {
      setResult(null);
      setError("Failed to calculate results");
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Deployment Scorecards
          </h1>

          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <ScorecardSelector
                scorecards={scorecards}
                selectedId={selectedId}
                onSelect={setSelectedId}
                showInactive={showInactive}
                onShowInactiveChange={setShowInactive}
              />
            </div>
            <button
              onClick={viewResults}
              disabled={!selectedId || loading || calculating}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Loading..." : "View Results"}
            </button>
            <button
              onClick={calculateResults}
              disabled={!selectedId || calculating || loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {calculating ? "Calculating..." : "Calculate New"}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </div>

        {result && (
          <div>
            <ScorecardResult result={result} />
          </div>
        )}

        {!result && !error && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            <p>Select a scorecard and click View Results to see latest data</p>
            <p className="text-sm mt-2">
              or Calculate New to generate fresh results
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
