import {
  HomeIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  RectangleGroupIcon,
  BanknotesIcon,
  ShoppingCartIcon
} from "@heroicons/react/24/solid";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export var routes = [
  {
    layout: "dashboard",
    pages: [
      {
        id:1,
        icon: <HomeIcon {...icon} />,
        name: "Trang chủ",
        path: "/manager/home",
      },
      {
        id:2,
        icon: <RectangleGroupIcon {...icon} />,
        name: "Sản phẩm",
        path: "/manager/product",
        isOpen:false,
        children: [
          {
            childName: "Lót giày",
            path: "/manager/product/insole",
          }
        ]
      },
      {
        id:2,
        icon: <BanknotesIcon {...icon} />,
        name: "Hóa đơn",
        path: "/manager/order",
      },
      {
        id:2,
        icon: <ShoppingCartIcon {...icon} />,
        name: "Bán hàng tại quầy",
        path: "/manager/shopping",
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        id:1,
        icon: <ArrowRightOnRectangleIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
      },
      {
        id:2,
        icon: <UserPlusIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
      },
    ],
  },
];

export default routes;
