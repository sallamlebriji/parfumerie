import { Toaster } from "react-hot-toast";
import { AppRoutes } from "./routes/AppRoutes";

const App = () => {
  return (
    <div className="min-h-screen bg-brand-ivory">
      <Toaster position="top-right" toastOptions={{ style: { borderRadius: "18px", border: "1px solid rgba(201,162,39,.22)", background: "#0B0B0B", color: "#fff" } }} />
      <AppRoutes />
    </div>
  );
};

export default App;
