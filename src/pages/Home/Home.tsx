// Author: Ani
// Date: 7 August 2025
// Description: Home component to display the main dashboard and workload overview

import { useState } from "react";
import { Header } from "../../components";
import { SUBJECT_NAMES, usePageStore } from "../../page.store";
import { WorkloadBar } from "../Subject/Subject";
import { Onboard } from "./Onboard";

// Home component to display the main dashboard and workload overview
export function Home() {
  const { calculateWorkload, subjects } = usePageStore();
  const [page, setPage] = useState<"home" | "chooseSubjects">("home");

  return (
    <div className="h-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6">
      <div className="max-w-2xl mx-auto h-full flex flex-col justify-center">
        <div className="text-center">
          <Header className="text-2xl">Study Planly</Header>
        </div>
        {page === "home" ? (
          // Display the main dashboard with workload overview
          <div>
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                <span>Your Subjects</span>
                <div className="flex-1 h-px bg-gradient-to-r from-zinc-600 to-transparent"></div>
              </h2>

              <div className="grid grid-cols-1 gap-3 text-md">
                {subjects.map((subject) => (
                  // Display each subject
                  <div
                    key={subject}
                    className="bg-gradient-to-br from-zinc-800/60 to-zinc-900/60 backdrop-blur-sm rounded-xl p-2 border border-zinc-700/50 hover:from-zinc-700/60 hover:to-zinc-800/60 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">
                        {SUBJECT_NAMES[subject]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setPage("chooseSubjects")}
                className={`
                mt-3 py-2 px-3 cursor-pointer text-md rounded-lg flex-1 text-center transition-all duration-200 font-medium
                 bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-500/25 
                 hover:contrast-120
              `}
              >
                Change Subjects
              </button>
            </div>

            <div className="bg-gradient-to-br from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-2xl p-6 border border-zinc-700/50 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Overall Workload
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-zinc-600 to-transparent"></div>
              </div>

              <WorkloadBar workload={calculateWorkload()} />

              <div className="mt-4 text-center">
                <p className="text-zinc-400 text-sm">
                  {/* Display workload message based on current workload */}
                  {calculateWorkload() < 0.3
                    ? "Light workload - you're doing great!"
                    : calculateWorkload() < 0.7
                    ? "Moderate workload - stay focused!"
                    : "Heavy workload - take breaks when needed!"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Display the onboarding component to choose subjects
          <Onboard exitPage={() => setPage("home")} />
        )}
      </div>
    </div>
  );
}
