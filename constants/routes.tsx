import {
  HomeIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  RectangleGroupIcon,
  BanknotesIcon,
  ShoppingCartIcon,
  UserGroupIcon
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
      },
      {
        id:3,        
        name: "Đế giày",
        path: "/manager/sole",
      },
      {
        id:3,        
        name: "Lót giày",
        path: "/manager/insole",
      },
      {
        id:4,        
        name: "Thương hiệu",
        path: "/manager/brand",
      },
      {
        id:4,        
        name: "Kích cỡ",
        path: "/manager/size",
      },
      {
        id:4,        
        name: "Màu sắc",
        path: "/manager/color",
      },
      {
        id:5,
        icon: <BanknotesIcon {...icon} />,
        name: "Hóa đơn",
        path: "/manager/order",
      },
      {
        id:6,
        icon: <ShoppingCartIcon {...icon} />,
        name: "Bán hàng tại quầy",
        path: "/manager/shopping",
      },
      {
        id:7,
        icon: <UserGroupIcon {...icon} />,
        name: "Nhân viên",
        path: "/manager/staff",
      },
      // {
      //   id:6,
      //   icon: <GiftIcon {...icon} />,
      //   name: "Khuyến mãi",
      //   path: "/manager/voucher",
      // },
    ],
  },
  {
    title: "Xác thực",
    layout: "auth",
    pages: [
      {
        id:1,
        icon: <ArrowRightOnRectangleIcon {...icon} />,
        name: "Đăng xuất",
        path: "/auth/logout",
      },
    ],
  },
];

export default routes;
