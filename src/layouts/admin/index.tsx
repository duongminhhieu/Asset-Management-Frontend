import { Layout } from "antd";
import { PropsWithChildren } from "react";
import FooterPublic from "../public/FooterPublic";
import HeaderAdmin from "./HeaderAdmin";
import SliderBarAdmin from "./SliderBarAdmin";
import { Navigate } from "react-router-dom";

type AdminRouteProps = PropsWithChildren;

function AdminRoute({ children }: AdminRouteProps) {
  // get user from local storage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // if user is not logged in redirect to login page
  if (!user?.id || user?.type !== "ADMIN") {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Layout className="min-h-screen">
        <HeaderAdmin />
        <Layout>
          <SliderBarAdmin />
          <Layout className="mt-16 mx-10">{children}</Layout>
        </Layout>
        <FooterPublic />
      </Layout>
    </>
  );
}

export default AdminRoute;
