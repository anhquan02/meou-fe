import { useRouter } from "next/router";
import {
  Fragment,
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Fetch from "../../../services/Fetch";
import Notify from "../../../components/Notify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../services/firebase";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Dialog,
  DialogBody,
  IconButton,
  Input,
  Option,
  Radio,
  Select,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Textarea,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import {
  ChevronUpDownIcon,
  PencilIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { v4 } from "uuid";
import convertMoney from "../../../services/Utils";

const MAPPING_EN_VI = {
  brand: "Thương hiệu",
  color: "Màu sắc",
  size: "Kích cỡ",
  sole: "Đế",
  insole: "Lót giày",
} as any;

const TABLE_HEAD = [
  "Ảnh",
  "Thương hiệu",
  "Màu sắc",
  "Kích cỡ",
  "Đế",
  "Lót giày",
  "Giá",
  "Số lượng",
  "Hành động",
];

type ProductItem = {
  brandId: any;
  insoleId: any;
  defaultPrice: any;
  soleId: any;
  sizeIds: any[];
  colorIds: any[];
};

type DataPost = {
  imageList: any[];
  productId: any;
  name: any;
  brandId: any;
  insoleId: any;
  price: any;
  colorId: any;
  quantity: any;
  sizeId: any;
  imageRef: any[];
  b64: any[];
};

const ProductDetail = () => {
  const router = useRouter();
  const [openLoading, setOpenLoading] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [snackMsg, setSnackMsg] = useState("");
  const { id } = router.query;
  const [product, setProduct] = useState({
    name: "",
    image: "",
    imageURL: "",
    imageRef: "" as any,
    price: 0 as any,
    description: "",
    quantity: 0 as any,
    status: true as any,
  });
  const [newItems, setNewItems] = useState<ProductItem>({
    brandId: 1,
    insoleId: "",
    defaultPrice: 0,
    soleId: "",
    sizeIds: [],
    colorIds: [],
  });
  const [action, setAction] = useState("update-product");

  const [dataPost, setDataPost] = useState<DataPost[]>([]);

  const [productItems, setProductItems] = useState<any[]>();
  const [productItem, setProductItem] = useState<any>();
  const [color, setColor] = useState<any[]>([]);
  const [brand, setBrand] = useState<any[]>([]);
  const [size, setSize] = useState<any[]>([]);
  const [sole, setSole] = useState<any[]>([]);
  const [insole, setInsole] = useState<any[]>([]);

  const onCloseSnack = () => {
    setOpenSnack(false);
  };
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

  const getAllProductItem = async () => {
    return await Fetch.get(`/api/v1/product-item/product-id?productId=${id}`)
      .then(async (res: any) => {
        if (res.status === 200) {
          let data = res.data.data;
          data.forEach(async (item: any) => {
            item.imageListURL = [];
            if (!item.imageList || item.imageList.length == 0) {
              item.imageURL = "";
            } else {
              item.imageURL = await handleDownloadImage(item.imageList[0].name);
              item.imageList.forEach(async (img: any) => {
                item.imageListURL.push(await handleDownloadImage(img.name));
              });
            }
          });
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
      if (!id) return;
      const brand = await getAllBrand();
      const color = await getAllColor();
      const size = await getAllSize();
      const sole = await getAllSole();
      const insole = await getAllInsole();
      const productItems = await getAllProductItem();
      setColor(color);
      setBrand(brand);
      setSize(size);
      setSole(sole);
      setInsole(insole);
      setProductItems(productItems);
      await Fetch.get(`/api/v1/product/id?id=${id}`)
        .then(async (res: any) => {
          if (res.status === 200) {
            let data = res.data.data;
            data.imageURL = await handleDownloadImage(data.image);
            data.price =
              convertMoney(data.minPrice) + " ~ " + convertMoney(data.maxPrice);
            if (data.minPrice == data.maxPrice) {
              data.price = data.minPrice;
            }
            setProduct(data);
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
  }, [id]);

  const fileInput = useRef<HTMLInputElement | any>(null);

  const handleClickChooseFile = (e: any) => {
    if (fileInput.current != null) {
      fileInput.current?.click();
    }
  };

  const handleClickChooseItemFile = (e: any, ref: any) => {
    if (ref.current != null) {
      ref.current?.click();
    }
  };

  const handleChangeFileValue = (e: any) => {
    const [file] = e.target.files;
    if (!file) return;
    // fileInput.current = e.target.files[0];
    let reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e: any) => {
      setProduct((cur) => ({
        ...cur,
        image: e.target.result,
        imageURL: e.target.result,
        imageRef: file,
      }));
    };
  };

  const handleChangeFileItemValue = (e: any, idx: any) => {
    const files = e.target.files;
    if (!files || files.length == 0) return;
    // const _dataPost = [...dataPost];
    for (var i = 0; i < files.length; i++) {
      let reader: FileReader = new FileReader();
      reader.readAsDataURL(files[i]);
      if (dataPost[idx]?.imageRef == undefined) dataPost[idx].imageRef = [];
      // dataPost[idx].imageRef.push(files[i]);
      setDataPost((cur: any) => {
        cur[idx].imageRef.push(files[i]);
        return [...cur];
      });
      reader.onload = (ev: any) => {
        if (dataPost[idx]?.b64 == undefined) dataPost[idx].b64 = [];
        // dataPost[idx].b64.push(ev.target.result);
        setDataPost((cur: any) => {
          cur[idx].b64.push(ev.target.result);
          return [...cur];
        });
      };
    }
    // setDataPost((prev) => [..._dataPost]);
  };

  useEffect(() => {
    let data: any[] = [];
    newItems.colorIds.forEach((colorId) => {
      const _color = color.find((c) => c.id == colorId);
      newItems.sizeIds.forEach((sizeId) => {
        const _size = size.find((c) => c.id == sizeId);
        data.push({
          productId: id,
          name: product.name + " [" + _color.name + " - " + _size.name + "]",
          brandId: newItems.brandId,
          insoleId: newItems.insoleId,
          soleId: newItems.soleId,
          price: newItems.defaultPrice,
          colorId,
          quantity: 0,
          sizeId,
          imageRef: [],
          status: 1,
          b64: [],
        });
      });
    });
    setDataPost(data);
  }, [newItems]);

  const handleUploadImage = async (file: any) => {
    if (!file) return;
    const imageStr = file.name + v4();
    const imageRef = ref(storage, `images/${imageStr}`);
    await uploadBytes(imageRef, file)
      .then((snapshot) => {
        onShowResult({
          type: "success",
          msg: "Lưu ảnh thành công!",
        });
      })
      .catch((error) => {
        onShowResult({
          type: "error",
          msg: error,
        });
        return "";
      });
    return imageStr;
  };

  const handleConfirm = async () => {
    setOpenLoading(true);
    const _dataPost = [...dataPost];
    for (var i = 0; i < _dataPost.length; i++) {
      const { imageRef } = _dataPost[i];
      _dataPost[i].imageList = [];
      for (var j = 0; j < imageRef.length; j++) {
        const imageStr = await handleUploadImage(imageRef[j]);
        _dataPost[i].imageList.push({ name: imageStr });
      }
    }
    if (action == "update-product") {
      const image = await handleUploadImage(product.imageRef);
      const data = {
        ...product,
        nameImage: image,
        status: product.status,
      };
      Fetch.put("/api/v1/product", product)
        .then((res: any) => {
          if (res.status === 200) {
            onShowResult({
              type: "success",
              msg: "Cập nhật thành công!",
            });
          }
        })
        .catch((error: any) => {
          onShowResult({
            type: "error",
            msg: "Cập nhật thất bại!",
          });
        });
    } else if (action == "create-item") {
      Fetch.post("/api/v1/product-item", { dto: _dataPost })
        .then((res: any) => {
          if (res.status === 200) {
            onShowResult({
              type: "success",
              msg: "Thêm mới thành công!",
            });
            setOpenConfirm(false);
          }
        })
        .catch((error: any) => {
          onShowResult({
            type: "error",
            msg: "Thêm mới thất bại!",
          });
        });
    } else if (action == "update-item") {
      console.log(productItem);
      Fetch.put("/api/v1/product-item", { dto: [productItem] })
        .then((res: any) => {
          if (res.status === 200) {
            onShowResult({
              type: "success",
              msg: "Cập nhật thành công!",
            });
            setOpenConfirm(false);
            setProductItem(null);
            setAction("update-product");
          }
        })
        .catch((error: any) => {
          onShowResult({
            type: "error",
            msg: "Cập nhật thất bại!",
          });
        });
    }
  };

  const renderListImage = (index: any) => {
    return (
      <div className="w-full h-auto my-2 flex gap-4">
        {dataPost[index].b64.map((img: any, idx: number) => {
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={idx} src={img} alt="product" className="w-24 h-24 " />
          );
        })}
      </div>
    );
  };

  const renderDataPost = () => {
    return (
      <>
        <div className="my-2">
          <Typography variant="h6" color="blue-gray">
            Chi tiết
          </Typography>
        </div>
        {dataPost.map((item: any, index: number) => {
          const ref = createRef<HTMLInputElement | any>();
          return (
            <Fragment key={item.name}>
              <div className="flex my-4 gap-4">
                <Input
                  label="Tên sản phẩm"
                  size="md"
                  value={item.name}
                  onChange={(e) => {
                    setDataPost((cur: any) => {
                      cur[index].name = e.target.value;
                      return [...cur];
                    });
                  }}
                />
                <Input
                  label="Giá sản phẩm"
                  size="md"
                  type="number"
                  value={item.price}
                  onChange={(e) => {
                    setDataPost((cur: any) => {
                      cur[index].price = e.target.value;
                      return [...cur];
                    });
                  }}
                />
                <Input
                  label="Số lượng"
                  size="md"
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    setDataPost((cur: any) => {
                      cur[index].quantity = e.target.value;
                      return [...cur];
                    });
                  }}
                />
                <div className="relative w-full mb-4 gap-3">
                  <Button
                    size="sm"
                    color={"blue-gray"}
                    className="!absolute right-1 top-1 rounded"
                    onClick={(e: any) => handleClickChooseItemFile(e, ref)}
                  >
                    Chọn ảnh
                    <input
                      type="file"
                      id="file"
                      ref={ref}
                      style={{ display: "none" }}
                      onChange={(e: any) => {
                        handleChangeFileItemValue(e, index);
                      }}
                      multiple
                    />
                  </Button>
                </div>
              </div>
              {/* list img */}
              <div className="w-full h-auto my-2 flex gap-4">
                {renderListImage(index)}
              </div>
              {/* divider */}
            </Fragment>
          );
        })}
        <div className="pt-4">
          <Button
            className="flex items-center gap-3 ml-auto"
            size="sm"
            onClick={() => {
              setAction("create-item");
              setOpenConfirm(true);
            }}
          >
            <PlusIcon strokeWidth={2} className="h-4 w-4" /> Thêm mới
          </Button>
        </div>
      </>
    );
  };

  const renderAddPanel = () => {
    return (
      <TabPanel value="create-item" className="min-h-[500px]">
        <div className="">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Select label="Thương hiệu" size="md">
              {brand.map((item) => (
                <Option
                  key={item.id}
                  value={item.id + ""}
                  defaultChecked={item.id == newItems.brandId}
                  onClick={() => {
                    setNewItems((cur) => ({
                      ...cur,
                      brandId: item.id,
                    }));
                  }}
                >
                  {item.name}
                </Option>
              ))}
            </Select>
            {/* sole */}
            <Select label="Đế" size="md">
              {sole.map((item) => (
                <Option
                  key={item.id}
                  value={item.id + ""}
                  defaultChecked={item.id == newItems.soleId}
                  onClick={() => {
                    setNewItems((cur) => ({
                      ...cur,
                      soleId: item.id,
                    }));
                  }}
                >
                  {item.name}
                </Option>
              ))}
            </Select>
            {/* insole */}
            <Select label="Lót giày" size="md">
              {insole.map((item) => (
                <Option
                  key={item.id}
                  value={item.id + ""}
                  defaultChecked={item.id == newItems.insoleId}
                  onClick={() => {
                    setNewItems((cur) => ({
                      ...cur,
                      insoleId: item.id,
                    }));
                  }}
                >
                  {item.name}
                </Option>
              ))}
            </Select>
            <Input
              label="Giá mặc định"
              type="number"
              size="md"
              value={newItems.defaultPrice}
              onChange={(e) => {
                setNewItems((cur) => ({
                  ...cur,
                  defaultPrice: e.target.value,
                }));
              }}
            />
          </div>
          <div className="flex flex-col gap-4 mb-4">
            <Typography variant="h6" color="blue-gray">
              Màu sắc
            </Typography>
            {/* display all color */}
            <div className="grid grid-cols-6 gap-4">
              {color.map((item) => (
                <Button
                  key={item.id}
                  color={
                    newItems.colorIds.includes(item.id)
                      ? "light-blue"
                      : "blue-gray"
                  }
                  onClick={() => {
                    if (newItems.colorIds.includes(item.id)) {
                      setNewItems((cur) => ({
                        ...cur,
                        colorIds: cur.colorIds.filter(
                          (colorId) => colorId != item.id
                        ),
                      }));
                    } else {
                      setNewItems((cur) => ({
                        ...cur,
                        colorIds: [...cur.colorIds, item.id],
                      }));
                    }
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 mb-4">
            <Typography variant="h6" color="blue-gray">
              Kích cỡ
            </Typography>
            {/* display all size */}
            <div className="grid grid-cols-6 gap-4">
              {size.map((item) => (
                <Button
                  key={item.id}
                  color={
                    newItems.sizeIds.includes(item.id)
                      ? "light-blue"
                      : "blue-gray"
                  }
                  onClick={() => {
                    if (newItems.sizeIds.includes(item.id)) {
                      setNewItems((cur) => ({
                        ...cur,
                        sizeIds: cur.sizeIds.filter(
                          (sizeId) => sizeId != item.id
                        ),
                      }));
                    } else {
                      setNewItems((cur) => ({
                        ...cur,
                        sizeIds: [...cur.sizeIds, item.id],
                      }));
                    }
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </div>
          </div>
          <div className="">{renderDataPost()}</div>
        </div>
      </TabPanel>
    );
  };

  const renderAdjustPanel = () => {
    return (
      <TabPanel value="update-item" className="min-h-[200px]">
        <div className="">
          <div className="grid grid-cols-4 gap-4 mb-4">
            {/* input name */}
            <Input
              label="Tên sản phẩm"
              type="text"
              size="md"
              value={productItem?.name || ""}
              onChange={(e) => {
                setProductItem((cur: any) => ({
                  ...cur,
                  name: e.target.value,
                }));
              }}
            />
            <Input
              label="Giá "
              type="number"
              size="md"
              value={productItem?.price || ""}
              onChange={(e) => {
                setProductItem((cur: any) => ({
                  ...cur,
                  price: e.target.value,
                }));
              }}
            />
            <Input
              label="Số lượng"
              type="number"
              size="md"
              value={productItem?.quantity || ""}
              onChange={(e) => {
                setProductItem((cur: any) => ({
                  ...cur,
                  quantity: e.target.value,
                }));
              }}
            />
            <Select
              label="Thương hiệu"
              size="md"
              value={productItem.brandId + ""}
              onChange={(value) => {
                setProductItem((cur: any) => ({
                  ...cur,
                  brandId: value,
                }));
              }}
            >
              {brand.map((item) => (
                <Option key={item.id} value={item.id + ""}>
                  {item.name}
                </Option>
              ))}
            </Select>
            <Select
              label="Màu"
              size="md"
              value={productItem.colorId + ""}
              onChange={(value) => {
                setProductItem((cur: any) => ({
                  ...cur,
                  colorId: value,
                }));
              }}
            >
              {color.map((item) => (
                <Option key={item.id} value={item.id + ""}>
                  {item.name}
                </Option>
              ))}
            </Select>
            <Select
              label="Kích thước"
              size="md"
              value={productItem.sizeId + ""}
              onChange={(value) => {
                setProductItem((cur: any) => ({
                  ...cur,
                  sizeId: value,
                }));
              }}
            >
              {size.map((item) => (
                <Option key={item.id} value={item.id + ""}>
                  {item.name}
                </Option>
              ))}
            </Select>
            <Select
              label="Đế"
              size="md"
              value={productItem.soleId + ""}
              onChange={(value) => {
                setProductItem((cur: any) => ({
                  ...cur,
                  soleId: value,
                }));
              }}
            >
              {sole.map((item) => (
                <Option key={item.id} value={item.id + ""}>
                  {item.name}
                </Option>
              ))}
            </Select>
            <Select
              label="Lót giày"
              size="md"
              value={productItem.insoleId + ""}
              onChange={(value) => {
                setProductItem((cur: any) => ({
                  ...cur,
                  insoleId: value,
                }));
              }}
            >
              {insole.map((item) => (
                <Option key={item.id} value={item.id + ""}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-4 mb-4">
            <Typography variant="h6" color="blue-gray">
              Ảnh
            </Typography>
            {/* display all color */}
            <div className="grid grid-cols-5 gap-4">
              {productItem.imageListURL?.map((item: any, index: number) => (
                <img
                  key={index}
                  src={item}
                  alt="product"
                  className="w-24 h-24 object-cover"
                />
              ))}
            </div>
          </div>
          <div className="pt-4">
            <Button
              className="flex items-center gap-3 ml-auto"
              size="sm"
              onClick={() => {
                setAction("update-item");
                setOpenConfirm(true);
              }}
            >
              <PencilIcon strokeWidth={2} className="h-4 w-4" /> Cập nhật
            </Button>
          </div>
        </div>
      </TabPanel>
    );
  };

  const detailRef = useRef<any>(null);

  const updateRef = useRef<any>(null);
  useEffect(() => {
    if (action == "update-item") {
      updateRef.current?.click();
    }
    if (action == "update-product") {
      detailRef.current?.click();
    }
  }, [action]);

  return (
    <>
      <Notify
        openLoading={openLoading}
        openSnack={openSnack}
        alertType={alertType}
        snackMsg={snackMsg}
        onClose={onCloseSnack}
      />
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <Typography variant="h5" color="blue-gray">
              Chi tiết sản phẩm
            </Typography>
          </div>
        </CardHeader>
        <CardBody className=" px-4">
          <div className="flex flex-wrap justify-center">
            <div className="">
              <div className="grid md:grid-cols-4 grid-cols-1 gap-4 mb-4">
                <Input
                  label="Tên sản phẩm"
                  type="text"
                  size="lg"
                  placeholder="Tên sản phẩm"
                  value={product.name || ""}
                  onChange={(e) => {
                    setProduct({ ...product, name: e.target.value });
                  }}
                />
                <Input
                  label="Giá sản phẩm"
                  size="lg"
                  placeholder="Giá sản phẩm"
                  value={product.price || "0"}
                  onChange={(e) => {
                    // setProduct({ ...product, price: e.target.value });
                  }}
                />
                <Input
                  label="Số lượng sản phẩm"
                  size="lg"
                  placeholder="Số lượng sản phẩm"
                  value={product.quantity || "0"}
                  onChange={(e) => {
                    // setProduct({ ...product, price: e.target.value });
                  }}
                />
                <div>
                  <div className="flex gap-4">
                    <Radio
                      name="color"
                      color="green"
                      label="Đang kinh doanh"
                      defaultChecked={product.status ==1}
                      onClick={()=>{
                        setProduct({ ...product, status: 1 });
                      }}
                    />
                    <Radio
                      name="color"
                      color="red"
                      label="Ngừng kinh doanh"
                      defaultChecked={product.status != 1}
                      onClick={()=>{
                        setProduct({ ...product, status: 2 });
                      }}
                    />
                  </div>
                </div>
              </div>
              <Textarea
                label="Mô tả sản phẩm"
                className="mb-4"
                value={product.description || ""}
                onChange={(e) => {
                  setProduct({ ...product, description: e.target.value });
                }}
              />
              <div className="relative w-full mb-4 gap-3">
                <Input
                  label="Hình ảnh"
                  size="lg"
                  className="pr-20"
                  containerProps={{
                    className: "min-w-0",
                  }}
                  value={product?.image || ""}
                  onChange={
                    (e) => {}
                    // setProduct((cur) => ({
                    //   ...cur,
                    //   image: e.target.value,
                    // }))
                  }
                  // defaultValue={product?.image || ""}
                />
                <Button
                  size="sm"
                  color={"blue-gray"}
                  className="!absolute right-1 top-1 rounded"
                  onClick={handleClickChooseFile}
                >
                  Chọn ảnh
                  <input
                    type="file"
                    id="file"
                    ref={fileInput}
                    style={{ display: "none" }}
                    onChange={handleChangeFileValue}
                  />
                </Button>
              </div>
              <div className="w-full flex justify-center">
                {product.image && (
                  <img
                    src={product.imageURL}
                    alt="product"
                    className="w-64 h-64  object-cover"
                  />
                )}
              </div>
              <div className="w-full">
                <Button
                  onClick={() => {
                    setAction("update-product");
                    setOpenConfirm(true);
                  }}
                  className="w-full my-4 bg-blue-gray-500 hover:bg-blue-gray-600 mx-1"
                >
                  Lưu sản phẩm
                </Button>
              </div>
              {action && (
                <Tabs id="custom-animation" value={action}>
                  <TabsHeader
                    indicatorProps={{
                      className: "bg-gray-900/10 shadow-none !text-gray-900",
                    }}
                  >
                    <Tab
                      className=""
                      value="update-product"
                      ref={detailRef}
                      onClick={() => {
                        setAction("update-product");
                      }}
                    >
                      <Typography color="blue-gray">
                        Sản phẩm chi tiết
                      </Typography>
                    </Tab>
                    <Tab
                      className=""
                      value="create-item"
                      onClick={() => {
                        setAction("create-item");
                      }}
                    >
                      <Typography color="blue-gray">Thêm</Typography>
                    </Tab>
                    {productItem && (
                      <Tab
                        className=""
                        value="update-item"
                        ref={updateRef}
                        onClick={() => {
                          setAction("update-item");
                        }}
                      >
                        <Typography color="blue-gray">Sửa</Typography>
                      </Tab>
                    )}
                  </TabsHeader>
                  <TabsBody
                    animate={{
                      initial: { y: 250 },
                      mount: { y: 0 },
                      unmount: { y: 250 },
                    }}
                    className="border border-gray-400 rounded-md my-4"
                  >
                    <TabPanel value="update-product">
                      <div className="w-full overflow-x-auto">
                        <table className="mt-4 w-full min-w-max table-auto text-left">
                          <thead>
                            <tr>
                              {TABLE_HEAD.map((head, index) => (
                                <th
                                  key={head}
                                  className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                                >
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                                  >
                                    {head}{" "}
                                    {index !== 0 &&
                                      index !== TABLE_HEAD.length - 1 && (
                                        <ChevronUpDownIcon
                                          strokeWidth={2}
                                          className="h-4 w-4"
                                        />
                                      )}
                                  </Typography>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {productItems?.map(
                              (
                                {
                                  imageURL,
                                  brandId,
                                  colorId,
                                  sizeId,
                                  soleId,
                                  insoleId,
                                  price,
                                  quantity,
                                },
                                index
                              ) => {
                                const isLast =
                                  index === productItems.length - 1;
                                const className = `py-3 px-5 ${
                                  index === productItems.length - 1
                                    ? ""
                                    : "border-b border-blue-gray-50"
                                }`;
                                return (
                                  <tr key={index}>
                                    <td className={className}>
                                      <img
                                        src={
                                          // @ts-ignore
                                          imageURL && imageURL.includes("https")
                                            ? imageURL
                                            : "/nike-air-force-1-shadow-all-white.jpg"
                                        }
                                        className="w-16 h-16"
                                      />
                                    </td>
                                    <td className={className}>
                                      {brand.find((item) => item.id === brandId)
                                        ?.name || ""}
                                    </td>
                                    <td className={className}>
                                      {color.find((item) => item.id === colorId)
                                        ?.name || ""}
                                    </td>
                                    <td className={className}>
                                      {size.find((item) => item.id === sizeId)
                                        ?.name || ""}
                                    </td>
                                    <td className={className}>
                                      {sole.find((item) => item.id === soleId)
                                        ?.name || ""}
                                    </td>
                                    <td className={className}>
                                      {insole.find(
                                        (item) => item.id === insoleId
                                      )?.name || ""}
                                    </td>
                                    <td className={className}>
                                      {convertMoney(price)}
                                    </td>
                                    <td className={className}>{quantity}</td>
                                    <td className={className}>
                                      <Tooltip content="Sửa">
                                        <IconButton
                                          variant="text"
                                          onClick={() => {
                                            setAction("update-item");
                                            setProductItem(productItems[index]);
                                          }}
                                        >
                                          <PencilIcon className="h-4 w-4" />
                                        </IconButton>
                                      </Tooltip>
                                    </td>
                                  </tr>
                                );
                              }
                            )}
                          </tbody>
                        </table>
                      </div>
                    </TabPanel>
                    {renderAddPanel()}
                    {productItem && renderAdjustPanel()}
                  </TabsBody>
                </Tabs>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
      <ConfirmDialog
        onShow={openConfirm}
        onClose={() => {
          setOpenConfirm(false);
        }}
        onConfirm={() => handleConfirm()}
      />
    </>
  );
};

export default ProductDetail;
