// Author: Ani
// Date: 7 August 2025
// Description: Page store for managing subjects, tasks, and application state

// Notice the use of Screaming Case, Pascal Case, and camelCase for different types of constants and variables
// This project uses 3 different naming conventions:
// 1. Screaming Case for constants (e.g., SUBJECT_NAMES)
// 2. Pascal Case for class names and Types (e.g., PageStore)
// 3. camelCase for variables and functions (e.g., setPage, addTask

import { create } from "zustand";

// GLOBAL TYPES AND CONSTANTS

export type Subject =
  | "methods"
  | "physics"
  | "chemistry"
  | "biology"
  | "spec"
  | "softdev"
  | "psych"
  | "history"
  | "genmath"
  | "english"
  | "englishlit"
  | "englishlang"
  | "foundation"
  | "media"
  | "legal"
  | "economics"
  | "business"
  | "languages";

export type Page = "home" | Subject;

const WORKLOAD_THRESHOLD = 2.2;

export const SUBJECT_NAMES: Record<Page, string> = {
  home: "Home",
  methods: "Methods",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
  spec: "Specialist",
  softdev: "Software Development",
  psych: "Psychology",
  history: "History",
  genmath: "General Mathematics",
  english: "English",
  englishlit: "English Literature",
  englishlang: "English Language",
  foundation: "Foundation Mathematics",
  media: "Media Studies",
  legal: "Legal Studies",
  economics: "Economics",
  business: "Business Studies",
  languages: "Languages",
};

export type Subjects = [Subject, Subject, Subject, Subject, Subject];

// The page store class that manages the application state
// It uses Zustand for state management and localStorage for persistence
// It provides methods to get tasks by date, calculate workload, and manage tasks
export class PageStore {
  // Constructor initializes the store and loads data from localStorage
  constructor(private _rerender: () => void) {
    this._loadFromLocalStorage();
  }

  // using string types as its readable and easy to understand for pages
  page: Page = "home";
  // using array of subjects to ensure it is always 5 subjects
  // using a dictionary would be more complex and less readable
  subjects: Subjects = ["methods", "physics", "chemistry", "biology", "spec"];

  // using a boolean to track if the window is closed as this is a global state
  windowClosed: boolean = false;
  // using a dictionary to store tasks for each subject
  // this allows for easy access to tasks by subject
  // using Record<Subject, Task[]> to ensure type safety and readability
  // being able to key off subjects directly makes it easier to manage tasks
  tasks: Record<Subject, Task[]> = {} as Record<Subject, Task[]>;

  // Load data from localStorage to initialize the store
  private _loadFromLocalStorage = () => {
    // using localStorage to persist the store state
    // Other data solutions require more setup like a database or server
    // This is a simple solution that works well for this application
    const storedData = localStorage.getItem("store");
    if (storedData) {
      const data = JSON.parse(storedData);

      this.page = data.page || this.page;
      this.subjects = data.subjects || this.subjects;
      this.windowClosed = data.windowClosed || this.windowClosed;
      this.tasks = data.tasks || this.tasks;

      const yesterday = new Date();
      yesterday.setHours(0, 0, 0, 0);

      Object.keys(this.tasks).forEach((k) => {
        const key = k as Subject;
        this.tasks[key] = this.tasks[key].filter((task) => {
          task.dueDate = new Date(task.dueDate);
          task.createdAt = new Date(task.createdAt);

          const taskDueDate = new Date(task.dueDate);
          taskDueDate.setHours(0, 0, 0, 0);

          if (taskDueDate.getTime() <= yesterday.getTime()) {
            if (task.completed) {
              return false;
            } else {
              task.dueDate = new Date();
            }
          }
          return true;
        });
      });
    }
  };

  // adding get and set modifiers for subjects to ensure it is always 5 subjects

  set _subjects(subjects: Subjects) {
    if (subjects.length !== 5) {
      throw new Error("Subjects must be an array of 5 subjects");
    }
    this.subjects = subjects;
  }

  // Methods to get tasks by date, calculate workload, and manage tasks
  setPage = (page: Page) => {
    this.page = page;
    this._rerender();
  };

  setWindowClosed = (closed: boolean) => {
    this.windowClosed = closed;
    this._rerender();
  };

  setTasks = (subject: Subject, tasks: Task[]) => {
    this.tasks[subject] = tasks;
    this._rerender();
  };
  addTask = (subject: Subject, task: Task) => {
    if (!this.tasks[subject]) {
      this.tasks[subject] = [];
    }
    this.tasks[subject].push(task);
    this._rerender();
  };

  markTaskAsDone = (subject: Subject, taskId: string) => {
    if (this.tasks[subject]) {
      this.tasks[subject] = this.tasks[subject].map((task) =>
        task.id === taskId ? { ...task, completed: true } : task
      );
    }
    this._rerender();
  };
  getAllTasks = (): Task[] => {
    return Object.values(this.tasks).flat();
  };
  getTasksBySubject = (subject: Subject): Task[] => {
    return this.tasks[subject] || [];
  };
  getTasksByDate = (date: Date, subject: Subject): Task[] => {
    const tasks = this.getTasksBySubject(subject);
    return tasks.filter(
      (task) => task.dueDate.toDateString() === date.toDateString()
    );
  };
  calculateWorkloadForDay = (date: Date, subject: Subject): number => {
    const tasks = this.getTasksByDate(date, subject);
    let sum = tasks.reduce(
      (total, task) =>
        total +
        (task.completed ? 0 : 1) *
          (task.priority === "high" ? 3 : task.priority === "medium" ? 2 : 1),
      0
    );
    let load = Math.pow(sum / WORKLOAD_THRESHOLD, 3);
    return load;
  };
  calculateWorkloadForSubject = (subject: Subject): number => {
    let load = 0;
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      load += this.calculateWorkloadForDay(date, subject) / 7;
    }
    return load;
  };
  calculateWorkload = (): number => {
    let totalLoad = 0;
    const subjects = this.subjects;
    subjects.forEach((subject) => {
      totalLoad += this.calculateWorkloadForSubject(subject);
    });
    return Math.min(totalLoad / subjects.length, 1);
  };

  chooseSubjects = (subjects: Subjects) => {
    this._subjects = subjects;
    this._rerender();
  };
}

// Type definition for a Task
export type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  subject: Subject;
  priority: "low" | "medium" | "high";
  createdAt: Date;
};

// Create the Zustand store using the PageStore class
// GLOBAL VARIABLE FOR THE ENTIRE APPLICATION
export var usePageStore = create<PageStore>((set) => {
  let rerender = () => {
    set({ ...pageStore });
  };
  const pageStore = new PageStore(rerender);
  return pageStore;
});

// Subscribe to changes in the store and save to localStorage
usePageStore.subscribe((state) => {
  localStorage.setItem("store", JSON.stringify(state));
});
