import { Route, Routes } from "react-router-dom";
import PublicRoute from "./layouts/routes/public";
import LoginPage from "./pages/public/Login";
import UserRoute from "./layouts/routes/user";
import HomePageUser from "./pages/user/Home";

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
        <Route path="/admin" element={<div> Hello Admin</div>} />

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
