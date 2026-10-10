import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Home Page */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* Student Register */}

        <Route
          path="/register"
          element={<Register />}
        />


        {/* Student Login */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* Common Dashboard */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* Unknown URL */}

        <Route
          path="*"
          element={<Navigate to="/" />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;