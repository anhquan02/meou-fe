import { useStore } from "react-redux";
import { XMarkIcon, ChevronDoubleDownIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

type SidenavAttributes = {
  sidenavOpen: boolean;
  sidenavType: string;
  sidenavColor: string;
};

const Sidenav = ({
  brandImg,
  brandName,
  routes,
}: {
  brandImg: string;
  brandName: string;
  routes: any[];
}) => {
  const store = useStore();
  const { sidenav }: any = store.getState();
  const router = useRouter();
  const { sidenavOpen, sidenavType, sidenavColor }: SidenavAttributes = sidenav;
  const sidenavTypes: any = {
    dark: "bg-gradient-to-br from-blue-gray-800 to-blue-gray-900",
    white: "bg-white shadow-lg",
    transparent: "bg-transparent",
  };

  const handleRouter = (path: any) => {
    router.push(path);
  };


  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        sidenavOpen ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0`}
    >
      <div
        className={`relative border-b ${
          sidenavType === "dark" ? "border-white/20" : "border-blue-gray-50"
        }`}
      >
        <Link href="/" className="flex items-center gap-4 py-6 px-8">
          <Avatar src={brandImg} size="sm" />
          <Typography
            variant="h6"
            color={sidenavType === "dark" ? "white" : "blue-gray"}
          >
            {brandName || "Mèo Ú"}
          </Typography>
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() =>
            store.dispatch({ type: "OPEN_SIDENAV", payload: false })
          }
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>
      <div className="m-4">
        {routes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {title && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography
                  variant="small"
                  color={sidenavType === "dark" ? "white" : "blue-gray"}
                  className="font-black uppercase opacity-75"
                >
                  {title}
                </Typography>
              </li>
            )}
            {pages.map(({ icon, name, path }: any) => (
              <li key={name}>
                <div>
                  <Button
                    variant={
                      router.pathname.includes(path) ? "gradient" : "text"
                    }
                    //@ts-ignore
                    color={
                      router.pathname.includes(path)
                        ? sidenavColor
                        : sidenavType === "dark"
                        ? "white"
                        : "blue-gray"
                    }
                    className="flex items-center gap-4 px-4 capitalize"
                    fullWidth
                    onClick={() => handleRouter(path)}
                  >
                    {icon}
                    <Typography
                      color="inherit"
                      className="font-medium capitalize"
                    >
                      {name}
                    </Typography>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </aside>
  );
};

export default Sidenav;
