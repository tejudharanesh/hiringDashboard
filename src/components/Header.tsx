import React from "react";
import type { User } from "../types";

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const handleLogout = () => {
    onLogout();
  };

   return (
    <header className="shadow-sm border-b sticky top-0 z-10 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Hiring Dashboard</h1>
              {user && (
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">{user.companyName}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user && (
              <>
                <span className="text-xs sm:text-sm text-gray-700 hidden sm:inline">Welcome, {user.username}</span>
                <button 
                  onClick={handleLogout}
                  className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm border border-gray-300 rounded-md hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

