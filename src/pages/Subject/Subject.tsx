// Author: Ani
// Date: 7 August 2025
// Description: Subject component to display tasks for a specific subject

import { useEffect, useState } from "react";
import { AddTask } from "./AddTask";
import { SUBJECT_NAMES, usePageStore, type Subject } from "../../page.store";
import { Header } from "../../components";
import { TaskCard } from "../../components";

// Subject component to display tasks for a specific subject
export function Subject(props: { subject: Subject }) {
  const { subject } = props;

  const { getTasksByDate, calculateWorkloadForSubject, markTaskAsDone } =
    usePageStore();
  const todayTasks = getTasksByDate(new Date(), subject);

  const [page, setPage] = useState("tasks" as "tasks" | "addTask");

  // if subject tab changes then reset the page to tasks
  useEffect(() => {
    setPage("tasks");
  }, [subject]);

  if (page === "addTask")
    return <AddTask exitPage={() => setPage("tasks")} subject={subject} />;

  return (
    <div className="p-4 h-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 overflow-y-auto">
      <Header className="text-3xl">{SUBJECT_NAMES[subject]}</Header>

      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-xl font-semibold text-white">Today</h3>
        <div className="flex-1 h-px bg-gradient-to-r from-zinc-600 to-transparent"></div>
      </div>
      <div className="mb-8 h-[30%] overflow-y-auto">
        {todayTasks.filter((x) => !x.completed).length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-emerald-500 rounded-full opacity-60"></div>
            </div>
            <p className="text-zinc-400 text-lg">Nothing to do today</p>
            <p className="text-zinc-500 text-sm">Time to relax ✨</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Task cards for today that has not been completed */}
            {todayTasks.map((task) =>
              task.completed ? null : (
                <TaskCard
                  key={task.id}
                  priority={task.priority}
                  title={task.title}
                  onClick={() => markTaskAsDone(subject, task.id)}
                />
              )
            )}
          </div>
        )}
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-xl font-semibold text-white">Upcoming</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-zinc-600 to-transparent"></div>
        </div>

        <div className="flex gap-3 pb-2 justify-center">
          {/* Display upcoming tasks for the next 6 days */}
          {Array.from({ length: 6 }).map((_, i) => {
            const nextDate = new Date();
            nextDate.setDate(nextDate.getDate() + i + 1);
            return <DayCard key={i} date={nextDate} subject={subject} />;
          })}
        </div>
      </div>

      <div className="mb-6 text-center">
        <button
          onClick={() => setPage("addTask")}
          className={`
                py-3 px-8 cursor-pointer text-md rounded-lg flex-1 text-center transition-all duration-200 font-medium
                 bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-500/25 
                 hover:contrast-120
              `}
        >
          Add Task
        </button>
      </div>

      <WorkloadBar workload={calculateWorkloadForSubject(subject)} />
    </div>
  );
}

// Rusable component to display a day card with tasks

function DayCard({ date, subject }: { date: Date; subject: Subject }) {
  const { getTasksByDate, markTaskAsDone } = usePageStore();
  const tasks = getTasksByDate(date, subject).filter((task) => !task.completed);
  const [showPopup, setShowPopup] = useState(false);

  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
  const dayNumber = date.getDate();

  const priorityColors = {
    low: "bg-emerald-500",
    medium: "bg-amber-500",
    high: "bg-red-500",
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowPopup(true)}
      onMouseLeave={() => setShowPopup(false)}
    >
      <div className="flex-1 w-25 h-30 bg-gradient-to-br from-zinc-800/60 to-zinc-900/60 backdrop-blur-sm rounded-xl border border-zinc-700/50 p-3 hover:from-zinc-700/60 hover:to-zinc-800/60 transition-all duration-200 cursor-pointer group">
        <div className="text-center">
          <div className="text-md text-zinc-400 font-medium mb-1">
            {dayName}
          </div>
          <div className="text-base font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
            {dayNumber}
          </div>

          <div className="flex justify-center gap-1 flex-wrap max-w-full">
            {/* Display task priority dots */}
            {tasks.slice(0, 6).map((task, _) => (
              <div
                key={task.id}
                className={`w-1.5 h-1.5 rounded-full ${
                  priorityColors[task.priority]
                } shadow-sm`}
              ></div>
            ))}
            {tasks.length > 6 && (
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 relative">
                <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs text-zinc-400">
                  +{tasks.length - 6}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popup to show tasks on hover */}
      {showPopup && tasks.length > 0 && (
        <div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-[9999999]"
          onMouseEnter={() => setShowPopup(true)}
          onMouseLeave={() => setShowPopup(false)}
        >
          <div className="bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-md rounded-xl p-4 border border-zinc-700/50 shadow-2xl shadow-black/50 min-w-72 max-w-80">
            <div className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <span>
                {date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-zinc-600 to-transparent"></div>
              <span className="text-xs text-zinc-400">
                {tasks.length} task{tasks.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {tasks.map((task) => (
                // Task card for each task
                <div
                  key={task.id}
                  className="flex items-cener gap-3 p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full cursor-pointer ${
                      priorityColors[task.priority]
                    } flex-shrink-0`}
                    onClick={() => markTaskAsDone(subject, task.id)}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {task.title}
                    </p>
                  </div>
                  <div className="text-xs text-zinc-500 capitalize flex-shrink-0">
                    {task.priority}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 border-r border-b border-zinc-700/50 rotate-45"></div>
        </div>
      )}
    </div>
  );
}

// Component to display the overall workload for a subject
export function WorkloadBar({ workload }: { workload: number }) {
  const width = Math.min(workload * 100, 100);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-zinc-300">Workload</span>
        <span className="text-sm text-zinc-400">{Math.round(width)}%</span>
      </div>

      <div className="relative h-3 bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-full overflow-hidden border border-zinc-600/50">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 rounded-full transition-all duration-500 ease-out shadow-lg"
          style={{ width: `${width}%` }}
        >
          <div className="h-full bg-gradient-to-t from-white/20 to-transparent rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
