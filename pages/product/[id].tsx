import { useRouter } from "next/router";
import Notify from "../../components/Notify";
import { useEffect, useState } from "react";
import Fetch from "../../services/Fetch";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../services/firebase";
import { useStore } from "react-redux";
import convertMoney from "../../services/Utils";

const Product = () => {
  const router = useRouter();
  const [openLoading, setOpenLoading] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [snackMsg, setSnackMsg] = useState("");
  const [product, setProduct] = useState<any>();
  const [selected, setSelected] = useState<any>({
    size: "",
    color: "",
    insole: "",
    sole: "",
  });
  const { id } = router.query;
  const store = useStore();

  const onCloseSnack = () => {
    setOpenSnack(false);
  };
  const [openConfirm, setOpenConfirm] = useState(false);
  const [productItem, setProductItem] = useState<any>();
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
    (async () => {
      if (!id) return;
      const data = await Fetch.get(`/api/v1/product/all-item?idProduct=${id}`)
        .then(async (res: any) => {
          if (res.status === 200) {
            let _data = res.data.data;
            _data.product.imageURL = await handleDownloadImage(
              _data.product.image
            );
            return _data;
          }
        })
        .catch((error: any) => {
          onShowResult({
            type: "error",
            msg: error.message,
          });
        });
      setProduct(data);
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      if (
        !selected.size ||
        !selected.color ||
        !selected.insole ||
        !selected.sole
      )
        return;
      const data = await Fetch.get(
        `/api/v1/product-item/choose-types?soleId=${selected.sole}&productId=${id}&sizeId=${selected.size}&insoleId=${selected.insole}&colorId=${selected.color}`
      )
        .then((res: any) => {
          if (res.status === 200) {
            return res.data.data;
          }
        })
        .catch(() => {});
      if (data) {
        data.q = 1;
      }
      setProductItem(data);
    })();
  }, [id, selected]);

  return (
    <>
      <Notify
        openLoading={openLoading}
        openSnack={openSnack}
        alertType={alertType}
        snackMsg={snackMsg}
        onClose={onCloseSnack}
      />
      <div className="mx-auto max-w-screen-xl p-2 lg:rounded-lg p-4 my-6">
        <div className="content-container flex flex-col small:flex-row small:items-start py-6 relative">
          <div className="md:w-3/4 w-full">
            <img
              src={product?.product.imageURL}
              alt=""
              className="h-96 mx-auto"
            />
          </div>
          <div className="md:w-1/4 w-full">
            <div className="small:sticky small:top-20 w-full py-8 small:py-0 small:max-w-[344px] medium:max-w-[400px] flex flex-col gap-y-12">
              {/* display name, nameBrand */}
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-bold">{product?.product.name}</h1>
                <h2 className="text-sm text-gray-400">
                  {product?.product.nameBrand}
                </h2>
              </div>
              {/* select size */}
              <div className="flex flex-col gap-y-2">
                <h1 className="text-sm text-gray-400">Chọn kích cỡ</h1>
                <div className="flex flex-row gap-x-2">
                  {product?.size.map((item: any, index: number) => (
                    <button
                      key={index}
                      className={`${
                        selected.size === item.id
                          ? "bg-blue-gray-500"
                          : "bg-gray-100"
                      } w-auto h-10 rounded-lg p-4 flex items-center justify-center`}
                      onClick={() =>
                        setSelected({ ...selected, size: item.id })
                      }
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
              {/* select color */}
              <div className="flex flex-col gap-y-2 ">
                <h1 className="text-sm text-gray-400">Chọn màu</h1>
                <div className="flex flex-row gap-x-4">
                  {product?.color.map((item: any, index: number) => (
                    <button
                      key={index}
                      className={`${
                        selected.color === item.id
                          ? "bg-blue-gray-500"
                          : "bg-gray-100"
                      } w-auto h-10 rounded-lg p-4 flex items-center justify-center`}
                      onClick={() =>
                        setSelected({ ...selected, color: item.id })
                      }
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
              {/* select insole */}
              <div className="flex flex-col gap-y-2">
                <h1 className="text-sm text-gray-400">Chọn lót giày</h1>
                <div className="flex flex-row gap-x-2">
                  {product?.insole.map((item: any, index: number) => (
                    <button
                      key={index}
                      className={`${
                        selected.insole === item.id
                          ? "bg-blue-gray-500"
                          : "bg-gray-100"
                      }  w-auto h-10 rounded-lg p-4 flex items-center justify-center`}
                      onClick={() =>
                        setSelected({ ...selected, insole: item.id })
                      }
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
              {/* select sole */}
              <div className="flex flex-col gap-y-2">
                <h1 className="text-sm text-gray-400">Chọn đế giày</h1>
                <div className="flex flex-row gap-x-2">
                  {product?.sole.map((item: any, index: number) => (
                    <button
                      key={index}
                      className={`${
                        selected.sole === item.id
                          ? "bg-blue-gray-500"
                          : "bg-gray-100"
                      }  w-auto h-10 rounded-lg p-4 flex items-center justify-center`}
                      onClick={() =>
                        setSelected({ ...selected, sole: item.id })
                      }
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
              {productItem && !productItem?.price && (
                <div className="flex flex-col gap-y-2">
                  {/* hết hàng */}
                  <div className="flex flex-col gap-y-2">
                    <h2 className="text-center text-white bg-orange-300 rounded-lg p-4 ">
                      Hết hàng
                    </h2>
                  </div>
                </div>
              )}
              {productItem?.quantity ? (
                <>
                  {/* button minus and plus quantity */}
                  <div className="flex flex-col gap-y-2">
                    <h1 className="text-sm text-gray-400">Số lượng</h1>
                    <div className="flex flex-row gap-x-2">
                      <button
                        className="w-10 h-10 rounded-lg p-4 flex items-center justify-center"
                        onClick={() => {
                          if (productItem.q > 1) {
                            setProductItem({
                              ...productItem,
                              q: productItem.q - 1,
                            });
                          }
                        }}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className="w-20 h-10 rounded-lg p-4 flex items-center justify-center"
                        value={productItem.q}
                        readOnly
                      />
                      <button
                        className="w-10 h-10 rounded-lg p-4 flex items-center justify-center"
                        onClick={() => {
                          if (productItem.q < productItem.quantity) {
                            setProductItem({
                              ...productItem,
                              q: productItem.q + 1,
                            });
                          }
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
              {/* display price */}
              <div className="flex flex-col gap-y-2">
                <h1 className="text-lg font-bold">
                  {productItem?.price
                    ? convertMoney(productItem?.price * productItem?.q || 0)
                    : convertMoney(product?.product.minPrice || 0) +
                      " ~ " +
                      convertMoney(product?.product.maxPrice || 0)}{" "}
                </h1>
              </div>
              {/* btn Thêm vào giỏ hàng */}
              <div className="flex flex-col gap-y-2">
                <button
                  className={`${
                    productItem?.price == null
                      ? "bg-gray-300"
                      : "bg-blue-gray-500"
                  } w-full h-10 rounded-lg p-4 flex items-center justify-center`}
                  onClick={() => {
                    onShowResult({
                      type: "success",
                      msg: "Thêm vào giỏ hàng thành công",
                    });
                    store.dispatch({
                      type: "ADD_TO_CART",
                      payload: productItem,
                    });
                  }}
                  disabled={productItem?.price == null}
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
