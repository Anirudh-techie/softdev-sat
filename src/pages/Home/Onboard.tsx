// Author: Ani
// Date: 7 August 2025
// Description: Onboard component to choose subjects for the user

import { useState } from "react";
import {
  SUBJECT_NAMES,
  usePageStore,
  type Subject,
  type Subjects,
} from "../../page.store";

// Onboard component to choose subjects for the user
export function Onboard(props: { exitPage: () => void }) {
  const { chooseSubjects, subjects } = usePageStore();
  const [selectedSubjects, setSelectedSubjects] = useState(subjects);

  function getSubjectList(i: number) {
    console.log("Called Subject list");
    let arr = Object.entries(SUBJECT_NAMES);
    console.log("Subjects array: ", arr);

    let newSubjectList = selectedSubjects.filter(
      (x) => x != selectedSubjects[i]
    );

    console.log("Selected Subjects Without Current Subject: ", newSubjectList);

    let finalList = arr.filter(
      ([key]) => !newSubjectList.includes(key as Subject) && key !== "home"
    );

    console.log("Final Subject List: ", finalList);

    return finalList;
  }

  return (
    <div className="mb-12 text-white">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
        <span>Your Subjects</span>
        <div className="flex-1 h-px bg-gradient-to-r from-zinc-600 to-transparent"></div>
      </h2>

      <p>Choose 5</p>
      <div className="grid grid-cols-1 gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            chooseSubjects(selectedSubjects);
            props.exitPage();
          }}
        >
          {/* Subject selection dropdowns */}
          {[...Array(5)].map((_, i) => (
            <p key={i}>
              Subject {i + 1}:{" "}
              <select
                onChange={(e) => {
                  // Update the selected subject for the dropdown
                  const updated = [...selectedSubjects];
                  updated[i] = e.target.value as Subject;
                  setSelectedSubjects(updated as Subjects);
                }}
                value={selectedSubjects[i]}
              >
                {getSubjectList(i).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </p>
          ))}

          <button
            type="submit"
            className="mt-3 py-2 px-3 cursor-pointer text-md rounded-lg flex-1 text-center transition-all duration-200 font-medium bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-500/25 hover:contrast-120"
          >
            Save Subjects
          </button>
        </form>
      </div>
    </div>
  );
}
