import { useEffect } from "react";
import { useAuth } from "../context/FakeAuthContext";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigation("/");
  }, [isAuthenticated, navigation]);

  return isAuthenticated ? children : null;
}

export default ProtectedRoute;
