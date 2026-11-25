import Home from "./Home";
import Dashboard from "./Dashboard";

export default function App() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  if (path === "/dashboard") return <Dashboard />;
  return <Home />;
}
