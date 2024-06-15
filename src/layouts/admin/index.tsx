import { Layout } from "antd";
import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import FooterPublic from "../public/FooterPublic";
import HeaderAdmin from "./HeaderAdmin";

type AdminRouteProps = PropsWithChildren;

function AdminRoute({ children }: AdminRouteProps) {
  // get user from local storage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // if user is not logged in redirect to login page
  if (!user?.id || !user?.role?.name) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Layout className="min-h-screen">
        <HeaderAdmin />
        <Layout>
          <Layout className="mt-4 mx-10 ">{children}</Layout>
        </Layout>
        <FooterPublic />
      </Layout>
    </>
  );
}

export default AdminRoute;
