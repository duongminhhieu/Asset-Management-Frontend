import { Route, Routes } from "react-router-dom";
import PublicRoute from "./layouts/public";
import LoginPage from "./pages/public/Login/LoginPage";
import UserRoute from "./layouts/user";
import HomePageUser from "./pages/user/Home/Home";
import AdminRoute from "./layouts/admin";
import AddAsset from "./pages/admin/AddAsset/AddAsset";
import ManageUser from "./pages/admin/ManageUser/ManageUserPage";
import ManageAssetPage from "./pages/admin/ManageAsset/ManageAssetPage";
import CreateUser from "./pages/admin/CreateUser/CreateUser";
import CreateAssignment from "./pages/admin/CreateAssignment/CreateAssignment";
import EditAssignment from "./pages/admin/EditAssignment/EditAssignment";
import ManageAssignmentPage from "./pages/admin/ManageAssignment/ManageAssignmentPage";
import ManageReturningRequestPage from "./pages/admin/ManageReturningRequest/ManageReturningRequest";

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
              <HomePageUser />
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
              <ManageAssetPage />
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

        <Route
          path="/admin/assignments"
          element={
            <AdminRoute>
              <ManageAssignmentPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/assignments/create-assignment"
          element={
            <AdminRoute>
              <CreateAssignment />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/assignments/edit-assignment/:id"
          element={
            <AdminRoute>
              <EditAssignment />
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
          path="/admin/users/createUser"
          element={
            <AdminRoute>
              <CreateUser />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/returning-requests"
          element={
            <AdminRoute>
              <ManageReturningRequestPage />
            </AdminRoute>
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
