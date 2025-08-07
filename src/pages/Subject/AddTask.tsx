// Author: Ani
// Date: 7 August 2025
// Description: Add Task component to allow users to add new tasks for a specific subject

import { useState } from "react";
import { usePageStore, type Subject } from "../../page.store";
import { InputField } from "../../components";

// Add Task component to allow users to add new tasks for a specific subject
export function AddTask(props: { subject: Subject; exitPage: () => void }) {
  const { subject } = props;
  const { addTask } = usePageStore();

  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [taskNameError, setTaskNameError] = useState("");
  const [dueDateError, setDueDateError] = useState("");

  // Handle form submission to add a new task
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDueDateError("");
    setTaskNameError("");

    // Validation
    // existence
    if (!taskName.trim()) {
      setTaskNameError("Task name is required");
      return;
    }
    // type
    if (typeof taskName !== "string") {
      setTaskNameError("Task name must be a string");
      return;
    }
    // range
    if (taskName.length < 3 || taskName.length > 100) {
      setTaskNameError("Task name must be between 3 and 100 characters");
      return;
    }

    // existance & type & range together
    if (
      dueDate.getDate() < new Date().getDate() ||
      isNaN(dueDate.getTime()) ||
      !dueDate
    ) {
      setDueDateError("Due date is invalid");
      return;
    }

    const newTask = {
      id: crypto.randomUUID(),
      dueDate: dueDate,
      priority: priority,
      completed: false,
      createdAt: new Date(),
      subject: subject,
      description: "",
      title: taskName.trim(),
    };

    addTask(subject, newTask);
    props.exitPage();
  };

  const priorityOptions = [
    { value: "low", label: "Low", color: "text-emerald-500" },
    { value: "medium", label: "Medium", color: "text-amber-500" },
    { value: "high", label: "High", color: "text-red-500" },
  ];

  // Render the form for adding a new task
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/90 p-6 rounded-xl border border-zinc-700 backdrop-blur-sm max-w-md mx-auto mt-10 shadow-xl"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
          Add New Task
        </h3>
      </div>

      <InputField
        label="Task Name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="What needs to be done?"
        error={taskNameError}
      />

      <InputField
        label="Due Date"
        type="date"
        value={dueDate.toISOString().split("T")[0]}
        onChange={(e) => setDueDate(new Date(e.target.value))}
        error={dueDateError}
      />

      <InputField
        label="Priority"
        type="select"
        value={priority}
        onChange={(e) =>
          setPriority(e.target.value as "low" | "medium" | "high")
        }
      >
        {priorityOptions.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className={`${option.color} bg-zinc-800`}
          >
            {option.label}
          </option>
        ))}
      </InputField>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          className={`
                py-2 px-3 cursor-pointer text-md rounded-lg flex-1 text-center transition-all duration-200 font-medium
                 bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-500/25 
                 hover:contrast-120

              `}
        >
          Add Task
        </button>
        <button
          type="button"
          onClick={props.exitPage}
          className={`
                py-2 px-3 cursor-pointer text-md rounded-lg flex-1 text-center transition-all duration-200 font-medium
                 bg-gradient-to-br from-zinc-700/60 to-zinc-800/60 hover:from-zinc-600/60 hover:to-zinc-700/60 text-zinc-300 hover:text-white border border-zinc-600/30
              `}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
