import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "../redux/store";
import AdminLayout from "../components/layout/admin";
import { useRouter } from "next/router";
import { useEffect } from "react";
import {  isExpired } from "react-jwt";
import RootLayout from "../components/layout/client";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

function MyApp({
  Component,
  pageProps,
  ...props
}: {
  Component: any;
  pageProps: any;
}) {
  const router = useRouter();
  let persistor = persistStore(store);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("token") || "";
      if (!token && router.pathname.includes("manager")) {
        router.push("/auth/login");
      }
      if (isExpired(token)) {
        sessionStorage.removeItem("token");
      }
      const {auth} = store.getState();
      if (auth.token && isExpired(auth.token)) {
        sessionStorage.removeItem("token");
      }
      if(router.pathname.includes("manager") && auth.user.roleId !== 1) {
        router.push("/auth/login");
      }
    }
  }, []);

  const renderLayout = () => {
    if (router.pathname.includes("manager")) {
      return (
        <AdminLayout {...props}>
          <Component {...pageProps} />
        </AdminLayout>
      );
    }
    if (router.pathname.includes("auth")) {
      return <Component {...pageProps} />;
    }
    return (
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    );
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <title>Mèo Ú</title>
        {renderLayout()}
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
