import { Route, Routes } from "react-router-dom";
import PublicRoute from "./layouts/public";
import LoginPage from "./pages/public/Login/LoginPage";
import UserRoute from "./layouts/user";
import HomePageUser from "./pages/user/Home";
import AdminRoute from "./layouts/admin";
import HomePageAdmin from "./pages/admin/Home";
import AddAsset from "./pages/admin/AddAsset/AddAsset";
import ManageUser from "./pages/admin/ManageUser/ManageUserPage";

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
              <HomePageAdmin />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <ManageUser />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/assets"
          element={
            <AdminRoute>
              <div>ManageAsset</div>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/assets/create-asset"
          element={
            <AdminRoute>
              <AddAsset />
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
