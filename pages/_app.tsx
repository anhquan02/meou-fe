import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "../redux/store";
import AdminLayout from "../components/layout/admin";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { isExpired } from "react-jwt";

function MyApp({
  Component,
  pageProps,
  ...props
}: {
  Component: any;
  pageProps: any;
}) {
  const router = useRouter();
  // check if user is logged in
  // if not, redirect to login page
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("token") || "";
      if (!token) {
        router.push("/auth/login");
      }
      if (isExpired(token)) {
        sessionStorage.removeItem("token");
      }
    }
  }, []);

  return (
    <Provider store={store}>
      {!router.pathname.includes("auth") ? (
        <AdminLayout {...props}>
          <Component {...pageProps} />
        </AdminLayout>
      ) : (
        <Component {...pageProps} />
      )}
    </Provider>
  );
}

export default MyApp;
