import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const NotFound = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-gray p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-[#00922F] mb-4">404</h1>
        <h2 className="text-2xl mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate(`/${user?.role}/dashboard`)}
          className="bg-[#00922F] hover:bg-[#00922F]/10 text-white hover:text-[#00922F] font-medium py-2 px-6 rounded"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;
