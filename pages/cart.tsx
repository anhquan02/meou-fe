import { Fragment, useEffect, useState } from "react";
import Notify from "../components/Notify";
import { useStore } from "react-redux";
import SignInPrompt from "../components/SignInPrompt";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../services/firebase";
import { Card, CardBody, Input, Textarea } from "@material-tailwind/react";
import Fetch from "../services/Fetch";
import { useRouter } from "next/router";
import convertMoney from "../services/Utils";
import ConfirmDialog from "../components/ConfirmDialog";

const CartPage = () => {
  const [openLoading, setOpenLoading] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [snackMsg, setSnackMsg] = useState("");
  const [items, setItems] = useState([]);
  const [orderInformation, setOrderInformation] = useState<any>({});
  const router = useRouter();
  const store = useStore();
  const onCloseSnack = () => {
    setOpenSnack(false);
  };
  const { auth }: any = store.getState();
  const [openConfirm, setOpenConfirm] = useState(false);

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

  useEffect(() => {
    // load data from redux
    (async () => {
      const { cart }: any = store.getState();
      const { items } = cart;
      const newItems: any = await Promise.all(
        items.map(async (item: any) => {
          let imageURL = "/nike-air-force-1-shadow-all-white.jpg";
          if (item.images.length > 0) {
            imageURL = await handleDownloadImage(item.images[0].name);
          }

          return { ...item, imageURL };
        })
      );
      setItems(newItems);
    })();
  }, []);

  const handleChangeQuantity = (id: any, type: any) => {
    const newItems: any = items.map((item: any) => {
      if (item.id === id) {
        if (type === "+") {
          // check q vs quantity
          if (item.q >= item.quantity) return item;
          return { ...item, q: item.q + 1 };
        } else {
          return { ...item, q: item.q - 1 };
        }
      }
      return item;
    });
    // filter remove item q = 0
    const filterItems = newItems.filter((item: any) => item.q > 0);
    setItems(filterItems);
  };

  useEffect(() => {
    const { auth }: any = store.getState();
    const { user } = auth;
    if (user) {
      setOrderInformation({
        nameCustomer: user.fullname,
        emailCustomer: user.email,
        phoneCustomer: user.phone,
        addressCustomer: user.address,
      });
    }
  }, [store]);

  const handleOrder = () => {
    if (items.length === 0) {
      onShowResult({
        type: "error",
        msg: "Giỏ hàng trống",
      });
      return;
    }
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
        msg: "Vui lòng nhập số điện thoại",
      });
      return;
    }
    if (!orderInformation.addressCustomer) {
      onShowResult({
        type: "error",
        msg: "Vui lòng nhập địa chỉ",
      });
      return;
    }
    if (!orderInformation.emailCustomer) {
      onShowResult({
        type: "error",
        msg: "Vui lòng nhập email",
      });
      return;
    }
    setOpenLoading(true);
    const productItemDTOS = items.map((item: any) => {
      return {
        id: item.id,
        quantity: item.q,
      };
    });
    // create order
    let order = {
      orderDTO: { ...orderInformation, paymentMethod: "Chuyển khoản" },
      productItemDTOS: productItemDTOS,
    };
    Fetch.post("/api/v1/order/create-order-online", order)
      .then((res: any) => {
        if (res.status === 200) {
          onShowResult({
            type: "success",
            msg: "Tạo đơn hàng thành công!",
          });
          store.dispatch({
            type: "CLEAR_CART",
          });
          router.push("/");
        }
      })
      .catch((error: any) => {
        onShowResult({
          type: "error",
          msg: error.message,
        });
      });
  };

  const handleRemoveItem = (id: any) => {
    // remove from store
    const { cart }: any = store.getState();
    const { items } = cart;
    store.dispatch({
      type: "REMOVE_FROM_CART",
      payload: {
        id: id,
      },
    });
    // remove from state
    const filterItems = items.filter((item: any) => item.id !== id);
    setItems(filterItems);
  };

  const renderItems = () => {
    return (
      <>
        {items.map((item: any) => {
          return (
            <div className="flex flex-row gap-2" key={item.id}>
              <div className="w-1/4">
                <img src={item.imageURL} className="w-full h-full" alt="" />
              </div>
              <div className="w-1/2 py-6">
                {/*display name, nameBrand  */}
                <div className="flex flex-row p-2">
                  <div className="w-1/2">
                    <p>{item.name}</p>
                  </div>
                  <div className="w-1/2">
                    <p>{item.nameBrand || ""}</p>
                  </div>
                </div>
                {/*display price, quantity, total */}
                <div className="flex flex-row p-2">
                  <div className="w-1/2">
                    <p>Đơn giá: {convertMoney(item.price)}</p>
                  </div>
                </div>
                {/* remove button */}
                <div className="flex flex-row p-2">
                  <div className="w-1/2">
                    <button
                      className="bg-red-500 text-white rounded-lg p-2"
                      onClick={() => {
                        handleRemoveItem(item.id);
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
              <div className="1/4">
                {/* button minus and plus quantity */}
                <div className="flex flex-row p-2">
                  <div className="w-1/2">
                    <button
                      className="w-10 h-10 rounded-lg p-4 flex items-center justify-center"
                      onClick={() => handleChangeQuantity(item.id, "-")}
                    >
                      -
                    </button>
                  </div>
                  <input
                    type="text"
                    className="w-12 h-10 rounded-lg p-4 flex items-center justify-center"
                    value={item.q}
                    readOnly
                  />
                  <div className="w-1/2">
                    <button
                      className="w-10 h-10 rounded-lg p-4 flex items-center justify-center"
                      onClick={() => handleChangeQuantity(item.id, "+")}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
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
      <ConfirmDialog
        onShow={openConfirm}
        onClose={() => {
          setOpenConfirm(false);
        }}
        onConfirm={() => handleOrder()}
      />
      <div className="mx-auto max-w-screen-xl lg:rounded-lg p-4 my-6">
        <div className="content-container flex flex-col  small:items-start py-6 relative gap-4">
          <div className=" w-full">
            <div className="w-full">{!auth.token && <SignInPrompt />}</div>
            <div className="w-full my-4">{renderItems()}</div>
          </div>
          <div className=" w-full">
            <div className="w-full">
              <p className="text-2xl font-bold mb-8">Thông tin đơn hàng</p>
              <div className="flex justify-between my-2">
                <p>Tạm tính</p>
                <p>
                  {convertMoney(
                    items?.reduce((total: any, item: any) => {
                      return total + item.price * item.q;
                    }, 0) || 0
                  )}
                </p>
              </div>
              <div className="flex justify-between my-2">
                <p>Phí vận chuyển</p>
                <p>0 VND</p>
              </div>
              <hr className="w-full border border-blue-gray-300" />
              <div className="flex justify-between my-2">
                <p>Tổng cộng</p>
                <p>
                  {convertMoney(
                    items?.reduce((total: any, item: any) => {
                      return total + item.price * item.q;
                    }, 0) || 0
                  )}
                </p>
              </div>
              <Card className="w-full">
                <CardBody>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Input
                      label="Tên khách hàng"
                      type="text"
                      color="light-blue"
                      value={orderInformation.nameCustomer || ""}
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
                      value={orderInformation.phoneCustomer || ""}
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
                      value={orderInformation.addressCustomer || ""}
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
                      value={orderInformation.emailCustomer || ""}
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
                    value={orderInformation.note || ""}
                    onChange={(e) => {
                      setOrderInformation({
                        ...orderInformation,
                        note: e.target.value,
                      });
                    }}
                  />
                </CardBody>
              </Card>
              <button
                className="bg-blue-gray-500 text-white rounded-lg p-2 w-full"
                onClick={() => setOpenConfirm(true)}
              >
                Đặt hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
