// Author: Ani
// Date: 7 August 2025
// Description: Main App component that renders the Navbar and the current page based on the selected subject or home

import { Home } from "./pages/Home/Home";
import { Navbar } from "./Navbar";
import { usePageStore } from "./page.store";
import { AppWindow } from "lucide-react";
import { Subject } from "./pages/Subject/Subject";
import "./App.css";

// Main App component that renders the Navbar and the current page based on the selected subject or home
function App() {
  const { page, windowClosed, setWindowClosed } = usePageStore();

  return (
    <div className="relative">
      <div className="animate-moving-bg bg-zinc-900 text-white h-screen w-screen bg-[url(/src/assets/bg.jpg)] bg-repeat bg-fixed animate-moving-bg"></div>
      {/* if window closed then just show an icon to reopen it */}
      {windowClosed ? (
        <div
          onClick={() => setWindowClosed(false)}
          className="w-12 h-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer bg-gradient-to-br from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all duration-300 hover:scale-110 group"
        >
          <AppWindow className="text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 group-hover:scale-110 transition-transform" />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-300 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-zinc-900/95 to-zinc-800/95 backdrop-blur-md w-7xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[50rem] ring-1 ring-amber-400/50 shadow-2xl shadow-amber-950/50 rounded-2xl overflow-hidden">
          <Navbar
            onMaximize={() => setWindowClosed(false)}
            onMinimize={() => setWindowClosed(true)}
            onClose={() => setWindowClosed(true)}
          />

          <div className="h-[calc(100%-60px)] overflow-hidden">
            {page === "home" ? <Home /> : <Subject subject={page} />}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
