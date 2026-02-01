import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Message from "./components/Message";
import Settings from "./components/Settings";
import Layout from "./pages/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes (redirect if logged in) */}
        <Route
          path="/"
          element={
            <ProtectedRoute redirectIfLoggedIn>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute redirectIfLoggedIn>
              <Register />
            </ProtectedRoute>
          }
        />

        {/* Protected sidebar routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/homepage" element={<Home />} />
          <Route path="/message/:conversationId" element={<Message />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
