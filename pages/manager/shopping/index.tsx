import { useEffect, useState } from "react";
import Notify from "../../../components/Notify";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../../services/firebase";
import Fetch from "../../../services/Fetch";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
  Input,
  Select,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import {
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import convertMoney from "../../../services/Utils";

const ShoppingPage = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [openLoading, setOpenLoading] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [snackMsg, setSnackMsg] = useState("");
  const [color, setColor] = useState<any[]>([]);
  const [brand, setBrand] = useState<any[]>([]);
  const [size, setSize] = useState<any[]>([]);
  const [sole, setSole] = useState<any[]>([]);
  const [insole, setInsole] = useState<any[]>([]);
  const [productItems, setProductItems] = useState<any[]>([]);
  const [customer, setCustomer] = useState<any[]>([]);
  const [orderInformation, setOrderInformation] = useState<any>({});
  const [orderItems, setOrderItems] = useState<any[]>([]);

  const handleOpen = () => {
    setShowDialog(!showDialog);
  };

  const onCloseSnack = () => {
    setOpenSnack(false);
  };

  const onShowResult = ({ type, msg }: any) => {
    setOpenSnack(true);
    setOpenLoading(false);
    setAlertType(type);
    setSnackMsg(msg);
  };

  const handleDownloadImage = async (image: any) => {
    if (!image) return "";
    const imageRef = ref(storage, `images/${image}`);
    const url = await getDownloadURL(imageRef)
      .then((url) => {
        return url;
      })
      .catch((error) => {
        onShowResult({
          type: "error",
          msg: error,
        });
        return "";
      });
    return url;
  };

  const getAllBrand = async () => {
    return await Fetch.get("/api/v1/brand/all-list")
      .then(async (res: any) => {
        if (res.status === 200) {
          let data = res.data.data;
          onShowResult({
            type: "success",
            msg: "Lấy dữ liệu thành công!",
          });
          return data;
        }
      })
      .catch((error: any) => {
        onShowResult({
          type: "error",
          msg: error.message,
        });
        return [];
      });
  };

  const getCustomerByPhone = async (phone: any) => {
    if (phone.length < 10) {
      setCustomer([]);
      return [];
    }
    return await Fetch.get(`/api/v1/account/search-customer?phone=${phone}`)
      .then((res: any) => {
        if (res.status === 200) {
          setCustomer(res.data.data);
          return res.data.data;
        }
      })
      .catch((error) => {
        return [];
      });
  };

  const getAllColor = async () => {
    return await Fetch.get("/api/v1/color/all-list")
      .then(async (res: any) => {
        if (res.status === 200) {
          let data = res.data.data;
          onShowResult({
            type: "success",
            msg: "Lấy dữ liệu thành công!",
          });
          return data;
        }
      })
      .catch((error: any) => {
        onShowResult({
          type: "error",
          msg: error.message,
        });
        return [];
      });
  };

  const getAllSize = async () => {
    return await Fetch.get("/api/v1/size/all-list")
      .then(async (res: any) => {
        if (res.status === 200) {
          let data = res.data.data;
          onShowResult({
            type: "success",
            msg: "Lấy dữ liệu thành công!",
          });
          return data;
        }
      })
      .catch((error: any) => {
        onShowResult({
          type: "error",
          msg: error.message,
        });
        return [];
      });
  };

  const getAllSole = async () => {
    return await Fetch.get("/api/v1/sole/all-list")
      .then(async (res: any) => {
        if (res.status === 200) {
          let data = res.data.data;
          onShowResult({
            type: "success",
            msg: "Lấy dữ liệu thành công!",
          });
          return data;
        }
      })
      .catch((error: any) => {
        onShowResult({
          type: "error",
          msg: error.message,
        });
        return [];
      });
  };

  const getAllInsole = async () => {
    return await Fetch.get("/api/v1/insole/all-list")
      .then(async (res: any) => {
        if (res.status === 200) {
          let data = res.data.data;
          onShowResult({
            type: "success",
            msg: "Lấy dữ liệu thành công!",
          });
          return data;
        }
      })
      .catch((error: any) => {
        onShowResult({
          type: "error",
          msg: error.message,
        });
        return [];
      });
  };

  useEffect(() => {
    (async () => {
      const brand = await getAllBrand();
      const color = await getAllColor();
      const size = await getAllSize();
      const sole = await getAllSole();
      const insole = await getAllInsole();
      setColor(color);
      setBrand(brand);
      setSize(size);
      setSole(sole);
      setInsole(insole);
      Fetch.post("/api/v1/product-item/search-countersale", {})
        .then((res: any) => {
          if (res.status === 200) {
            let data = res.data.data;
            data.map(async (item: any) => {
              if (!item.imageList || item.imageList.length == 0) {
                item.image = "";
              } else {
                item.image = await handleDownloadImage(item.imageList[0].name);
              }
            });
            setProductItems(data);
            onShowResult({
              type: "success",
              msg: "Lấy dữ liệu thành công!",
            });
          }
        })
        .catch((error: any) => {
          onShowResult({
            type: "error",
            msg: error.message,
          });
        });
    })();
  }, []);

  const handleAddToCart = (item: any) => {
    const orderItem = { ...item };
    orderItem.quantity = 1;
    const index = orderItems.findIndex((x) => x.id === orderItem.id);
    if (index === -1) {
      setOrderItems([...orderItems, orderItem]);
    } else {
      let newOrderItems = [...orderItems];
      newOrderItems[index].quantity = newOrderItems[index].quantity + 1;
      setOrderItems(newOrderItems);
    }
    setShowDialog(false);
  };

  const handleMinusQuantity = (item: any) => {
    let index = orderItems.findIndex((x) => x.id === item.id);
    if (index !== -1) {
      let newOrderItems = [...orderItems];
      if (newOrderItems[index].quantity == 1) {
        // remove item
        newOrderItems.splice(index, 1);
      } else {
        newOrderItems[index].quantity = newOrderItems[index].quantity - 1;
      }
      setOrderItems(newOrderItems);
    }
  };

  const handlePlusQuantity = (item: any) => {
    let index = orderItems.findIndex((x) => x.id === item.id);
    let idx = productItems.findIndex((x) => x.id === item.id);
    if (index !== -1) {
      let newOrderItems = [...orderItems];
      if (newOrderItems[index].quantity >= productItems[idx].quantity) {
        newOrderItems[index].quantity = productItems[idx].quantity;
      } else {
        newOrderItems[index].quantity = newOrderItems[index].quantity + 1;
      }
      setOrderItems(newOrderItems);
    }
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    orderItems.map((item) => {
      totalPrice = totalPrice + item.price * item.quantity;
    });
    return totalPrice;
  };

  const handleCreateOrder = () => {
    setOpenLoading(true);
    if (!orderInformation.nameCustomer) {
      onShowResult({
        type: "error",
        msg: "Vui lòng nhập tên khách hàng",
      });
      return;
    }
    if (!orderInformation.phoneCustomer) {
      onShowResult({
        type: "error",
        msg: "Vui lòng nhập số điện thoại khách hàng",
      });
      return;
    }
    if (!orderInformation.addressCustomer) {
      onShowResult({
        type: "error",
        msg: "Vui lòng nhập địa chỉ khách hàng",
      });
      return;
    }
    if (!orderInformation.emailCustomer) {
      onShowResult({
        type: "error",
        msg: "Vui lòng nhập email khách hàng",
      });
      return;
    }
    if (orderItems.length == 0) {
      onShowResult({
        type: "error",
        msg: "Vui lòng chọn sản phẩm",
      });
      return;
    }
    let order = {
      orderDTO: { ...orderInformation, paymentMethod: "Chuyển khoản" },
      productItemDTOS: orderItems,
    };
    Fetch.post("/api/v1/order/create-order", order)
      .then((res: any) => {
        if (res.status === 200) {
          onShowResult({
            type: "success",
            msg: "Tạo đơn hàng thành công!",
          });
        }
      })
      .catch((error: any) => {
        onShowResult({
          type: "error",
          msg: error.message,
        });
      });
  };

  return (
    <>
      <Notify
        openLoading={openLoading}
        openSnack={openSnack}
        alertType={alertType}
        snackMsg={snackMsg}
        onClose={onCloseSnack}
      />
      <Dialog open={showDialog} handler={handleOpen} className="max-h-[600px]">
        <DialogHeader>Tìm kiếm sản phẩm</DialogHeader>
        <DialogBody divider className="">
          <Card className="">
            <table className=" table-auto text-left overflow-scroll w-full h-[500px] block">
              <thead className="">
                <tr>
                  <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                    Ảnh
                  </th>
                  <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                    Sản phẩm
                  </th>
                  <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                    Giá bán
                  </th>
                  <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                    Số lượng
                  </th>
                  <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="overflow-y-auto max-h-[450px]">
                {productItems?.map((item: any, index) => {
                  return (
                    <tr key={item.id}>
                      <td>
                        <img
                          src={
                            // @ts-ignore
                            item.image && item.image.includes("https")
                              ? item.image
                              : "/nike-air-force-1-shadow-all-white.jpg"
                          }
                          className="w-32 h-32"
                          alt={""}
                        />
                      </td>
                      <td>
                        <div className="flex flex-col gap-2">
                          <span className="text-sm font-semibold">
                            {item.name}
                          </span>
                          <span className="text-xs text-blue-gray-500">
                            {item.description}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col gap-2">
                          <span className="text-sm font-semibold">
                            {item.price}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col gap-2">
                          <span className="text-sm font-semibold">
                            {item.quantity}
                          </span>
                        </div>
                      </td>
                      <td>
                        <Button
                          onClick={() => {
                            handleAddToCart(item);
                          }}
                        >
                          Chọn
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </DialogBody>
      </Dialog>
      <Card className="w-full h-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <Typography variant="h5" color="blue-gray">
              Bán hàng tại quầy
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="px-4 min-h-[560px]">
          <div className="w-full flex flex-row gap-4">
            <div className="w-3/4 ">
              <Card>
                <table className="table-auto text-left w-full min-w-max">
                  <thead className="">
                    <tr>
                      <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                        Ảnh
                      </th>
                      <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                        Sản phẩm
                      </th>
                      <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                        Giá bán
                      </th>
                      <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                        Số lượng
                      </th>
                      <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                        Thành tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.length != 0 &&
                      orderItems.map((item: any, index) => {
                        return (
                          <tr key={item.id} className="items-center">
                            <td className="p-4">
                              <img
                                src={
                                  // @ts-ignore
                                  item.image && item.image.includes("https")
                                    ? item.image
                                    : "/nike-air-force-1-shadow-all-white.jpg"
                                }
                                className="w-32 h-32"
                                alt={""}
                              />
                            </td>
                            <td className="p-4">
                              <div className="flex flex-col gap-2">
                                <span className="text-sm font-semibold">
                                  {item.name}
                                </span>
                                {/* <span className="text-xs text-blue-gray-500">
                                  {item.description}
                                </span> */}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-col gap-2">
                                <span className="text-sm font-semibold">
                                  {convertMoney(item.price)}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-row gap-2 items-center">
                                {/* minus button */}
                                <IconButton
                                  onClick={() => {
                                    handleMinusQuantity(item);
                                  }}
                                >
                                  <MinusIcon className="w-5 h-5 text-inherit" />
                                </IconButton>
                                <span className="text-sm font-semibold">
                                  {item.quantity}
                                </span>
                                <IconButton
                                  onClick={() => {
                                    handlePlusQuantity(item);
                                  }}
                                >
                                  <PlusIcon className="w-5 h-5 text-inherit" />
                                </IconButton>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-col gap-2">
                                <span className="text-sm font-semibold">
                                  {convertMoney(item.price * item.quantity)}
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </Card>
            </div>
            <div className="w-1/4 px-4">
              <Button
                className="w-full flex items-center gap-4 mb-4 mx-auto justify-center"
                onClick={handleOpen}
              >
                <ShoppingCartIcon className="w-5 h-5 text-inherit" />
                Thêm sản phẩm
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
      <div className="my-6"></div>
      <div className="flex flex-row w-full">
        <div className="w-3/4">
          <Typography variant="h5">Tài khoản</Typography>
        </div>
        <div className="w-1/4">
          <Input
            label="Số điện thoại"
            className=""
            onChange={(e: any) => {
              getCustomerByPhone(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="my-4">
        {customer.length != 0 &&
          customer.map((item: any, index: number) => {
            return (
              <div
                key={index}
                className="w-full flex flex-row gap-4 items-center p-4"
              >
                <div className="w-1/5">
                  <Typography variant="h6">{item.username}</Typography>
                </div>
                <div className="w-1/5">
                  <Typography variant="h6">{item.phone}</Typography>
                </div>
                <div className="w-1/5">
                  <Typography variant="h6">{item.address}</Typography>
                </div>
                <div className="w-1/5">
                  <Typography variant="h6">{item.email}</Typography>
                </div>
                <div className="w-1/5">
                  <Button
                    className="w-full"
                    onClick={() => {
                      setOrderInformation({
                        nameCustomer: item.name,
                        phoneCustomer: item.phone,
                        addressCustomer: item.address,
                        emailCustomer: item.email,
                      });
                    }}
                  >
                    Chọn
                  </Button>
                </div>
              </div>
            );
          })}
      </div>
      <hr className="border border-blue-gray-300 my-4" />
      <div className="my-6"></div>
      <Typography variant="h5">Khách hàng</Typography>
      <hr className="border border-blue-gray-300 my-4" />
      <div className="w-full flex flex-row">
        <div className="w-3/4 px-4">
          <Card className="w-full">
            <CardBody>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input
                  label="Tên khách hàng"
                  type="text"
                  color="light-blue"
                  value={orderInformation.nameCustomer}
                  onChange={(e) => {
                    setOrderInformation({
                      ...orderInformation,
                      nameCustomer: e.target.value,
                    });
                  }}
                />
                <Input
                  label="Số điện thoại"
                  type="text"
                  color="light-blue"
                  value={orderInformation.phoneCustomer}
                  onChange={(e) => {
                    setOrderInformation({
                      ...orderInformation,
                      phoneCustomer: e.target.value,
                    });
                  }}
                />
                <Input
                  label="Địa chỉ"
                  type="text"
                  color="light-blue"
                  value={orderInformation.addressCustomer}
                  onChange={(e) => {
                    setOrderInformation({
                      ...orderInformation,
                      addressCustomer: e.target.value,
                    });
                  }}
                />
                {/* email */}
                <Input
                  label="Email"
                  type="text"
                  color="light-blue"
                  value={orderInformation.emailCustomer}
                  onChange={(e) => {
                    setOrderInformation({
                      ...orderInformation,
                      emailCustomer: e.target.value,
                    });
                  }}
                />
              </div>
              <Textarea
                label="Ghi chú"
                className="w-full "
                color="light-blue"
                value={orderInformation.note}
                onChange={(e) => {
                  setOrderInformation({
                    ...orderInformation,
                    note: e.target.value,
                  });
                }}
              />
            </CardBody>
          </Card>
        </div>
        <div className="w-1/4 px-4 flex flex-col">
          <div className="w-full flex justify-between">
            <Typography color="blue-gray">Tiền hàng</Typography>
            <Typography color="blue-gray">
              {convertMoney(calculateTotalPrice())} VND
            </Typography>
          </div>
          <div className="w-full flex justify-between">
            <Typography variant="h6" color="blue-gray">
              Tổng tiền
            </Typography>
            <Typography variant="h6" color="blue-gray">
              {convertMoney(calculateTotalPrice())} VND
            </Typography>
          </div>
          <Button
            className="w-full mt-auto"
            onClick={() => {
              handleCreateOrder();
            }}
          >
            Xác nhận đặt hàng
          </Button>
        </div>
      </div>
    </>
  );
};

export default ShoppingPage;
