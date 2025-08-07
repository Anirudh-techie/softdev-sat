// Author: Ani
// Date: 7 August 2025
// Description: Navbar component that displays the navigation bar with subjects and window controls

import { Maximize, Minus, X } from "lucide-react";
import { SUBJECT_NAMES, usePageStore, type PageStore } from "./page.store";

interface WindowControlsEvents {
  onMaximize: () => void;
  onMinimize: () => void;
  onClose: () => void;
}

// Navbar component that displays the navigation bar with subjects and window controls
export function Navbar(props: WindowControlsEvents) {
  const { subjects, page } = usePageStore();

  return (
    <nav className="w-full flex justify-between items-center p-3 bg-gradient-to-r from-zinc-800/90 to-zinc-700/90 backdrop-blur-sm text-white border-b border-zinc-600/30">
      <div className="w-20"></div>

      <div className="flex gap-2 flex-1 max-w-md">
        <NavbarItem page="home" isActive={page === "home"} />
        {subjects.map((subject) => (
          <NavbarItem
            key={subject}
            page={subject}
            isActive={page === subject}
          />
        ))}
      </div>

      <WindowControls {...props} />
    </nav>
  );
}

// NavbarItem component that renders each subject or home link in the navbar
function NavbarItem({
  page,
  isActive,
}: {
  page: PageStore["page"];
  isActive: boolean;
}) {
  const { setPage } = usePageStore();

  const handleClick = () => {
    setPage(page);
  };

  return (
    <div
      onClick={handleClick}
      className={`
        py-2 px-3 cursor-pointer text-xs rounded-lg flex-1 text-center transition-all duration-200 font-medium
        ${
          isActive
            ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-500/25"
            : "bg-gradient-to-br from-zinc-700/60 to-zinc-800/60 hover:from-zinc-600/60 hover:to-zinc-700/60 text-zinc-300 hover:text-white border border-zinc-600/30"
        }
      `}
    >
      {SUBJECT_NAMES[page]}
    </div>
  );
}

// WindowControls component that renders the window control buttons (maximize, minimize, close)
function WindowControls(props: WindowControlsEvents) {
  return (
    <div className="flex gap-2">
      <div className="cursor-pointer bg-emerald-500 hover:bg-emerald-400 w-4 h-4 rounded-full flex items-center justify-center group transition-all duration-200 hover:scale-110">
        <Maximize
          onClick={props.onMaximize}
          className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-white"
        />
      </div>
      <div className="cursor-pointer bg-amber-500 hover:bg-amber-400 w-4 h-4 rounded-full flex items-center justify-center group transition-all duration-200 hover:scale-110">
        <Minus
          onClick={props.onMinimize}
          className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-white"
        />
      </div>
      <div className="cursor-pointer bg-red-500 hover:bg-red-400 w-4 h-4 rounded-full flex items-center justify-center group transition-all duration-200 hover:scale-110">
        <X
          onClick={props.onClose}
          className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-white"
        />
      </div>
    </div>
  );
}
