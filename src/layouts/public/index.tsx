import { Layout } from "antd";
import { PropsWithChildren } from "react";
import HeaderPublic from "./HeaderPublic";
import FooterPublic from "./FooterPublic";
import { Navigate } from "react-router-dom";

type PublicRouteProps = PropsWithChildren;

export default function PublicRoute({ children }: PublicRouteProps) {
  // get user from local storage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // if user logged in redirect to home page
  if (user?.id && user?.role?.name === "USER") {
    return <Navigate to="/" />;
  }

  // if user logged in redirect to admin page
  if (user?.id && user?.role?.name === "ADMIN") {
    return <Navigate to="/admin" />;
  }

  return (
    <>
      <Layout className="min-h-screen">
        <HeaderPublic />
        <Layout>
          <Layout className="mt-4 mx-10 ">{children}</Layout>
        </Layout>
        <FooterPublic />
      </Layout>
    </>
  );
}
