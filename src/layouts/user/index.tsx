import { Layout } from "antd";
import { PropsWithChildren } from "react";
import FooterPublic from "../public/FooterPublic";
import HeaderUser from "./HeaderUser";
import { Navigate } from "react-router-dom";
import SliderBarUser from "./SliderBarUser";

type UserRouteProps = PropsWithChildren;

function UserRoute({ children }: UserRouteProps) {
  // get user from local storage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // if user is not logged in redirect to login page
  if (!user?.id || user?.type !== "USER") {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Layout className="min-h-screen">
        <HeaderUser />
        <Layout>
          <SliderBarUser />
          <Layout className="mt-16 mx-10 ">{children}</Layout>
        </Layout>
        <FooterPublic />
      </Layout>
    </>
  );
}

export default UserRoute;
