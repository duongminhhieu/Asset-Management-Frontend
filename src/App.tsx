import { Route, Routes } from "react-router-dom";
import PublicRoute from "./layouts/public";
import LoginPage from "./pages/public/Login";
import UserRoute from "./layouts/user";
import HomePageUser from "./pages/user/Home";
import AdminRoute from "./layouts/admin";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Admin Route */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <div> Hello Admin</div>
            </AdminRoute>
          }
        />

        {/* User Route */}
        <Route
          path="/"
          element={
            <UserRoute>
              <HomePageUser />
            </UserRoute>
          }
        />

        <Route
          path="/*"
          element={
            <div>
              <h1>404 Not Found</h1>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;
