import  { useState } from "react";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";
import Header from "../components/Header";
import type { AuthState, User } from "../types";

const Index = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });

  const handleLogin = (user: User) => {
    setAuthState({
      isAuthenticated: true,
      user,
    });
  };

  const handleLogout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
    });
  };

  if (!authState.isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={authState.user} onLogout={handleLogout} />
      <Dashboard />
    </div>
  );
};

export default Index;
