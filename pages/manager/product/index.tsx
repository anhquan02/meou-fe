import { useCallback, useEffect, useRef, useState } from "react";
import Notify from "../../../components/Notify";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Dialog,
  IconButton,
  Input,
  Option,
  Select,
  Tab,
  Tabs,
  TabsHeader,
  Textarea,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import Fetch from "../../../services/Fetch";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "../../../services/firebase";
import { useRouter } from "next/router";
import convertMoney from "../../../services/Utils";

const TABLE_HEAD = [
  "STT",
  "Tên",
  "Hình ảnh",
  // "Mô tả",
  "Số lượng",
  "Giá",
  "Trạng thái",
  "Hành động",
];

const TABS = [
  {
    label: "Tất cả",
    value: "all",
  },
];

const ProductPage = () => {
  const [openLoading, setOpenLoading] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [snackMsg, setSnackMsg] = useState("");
  const [data, setData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [action, setAction] = useState("create");
  const [size, setProduct] = useState<any>();
  const [fetching, setFetching] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const router = useRouter();

  const handleOpen = () => {
    setOpenDialog(!openDialog);
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

  useEffect(() => {
    (async () => {
      setOpenLoading(true);
      const brands = await getAllBrand();
      setBrands(brands);
      await Fetch.get(
        `/api/v1/product/search-name?name=${searchName}&page=${currentPage}&size=${pageSize}`
      )
        .then((res: any) => {
          if (res.status === 200) {
            let data = res.data.data.content;
            data.map(async (item: any) => {
              item.image = await handleDownloadImage(item.image);
              item.price = item.minPrice + " ~ " + item.maxPrice;
              if (item.minPrice == item.maxPrice) {
                item.price = item.minPrice;
              }
            });
            setData(data);
            setTotalPage(res.data.data.totalPages);
            onShowResult({
              type: "success",
              msg: "Lấy dữ liệu thành công!",
            });
          }
        })
        .catch((error: any) => {
          onShowResult({
            type: "error",
            msg: "Lấy dữ liệu thất bại!",
          });
        });
    })();
  }, []);

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

  const handleDownloadImage = async (image: any) => {
    if (!image) return "";
    const imageRef = ref(storage, `images/${image}`);
    const url = await getDownloadURL(imageRef)
      .then((url) => {
        return url;
      })
      .catch((error: any) => {
        // onShowResult({
        //   type: "error",
        //   msg: "Không tìm thấy ảnh!",
        // });
        return "";
      });
    return url;
  };

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

  const handleConfirm = useCallback(
    async (_product: any) => {
      const image = await handleUploadImage(_product.imageRef);
      const _data = {
        id: _product.id,
        name: _product.name,
        description: _product.description,
        price: _product.price,
        image: image,
        brandId: _product.brandId,
        status: _product.status,
      };
      if (action === "create") {
        Fetch.post("/api/v1/product", _data)
          .then((res: any) => {
            if (res.status === 200) {
              onShowResult({
                type: "success",
                msg: "Thêm mới thành công!",
              });
              setFetching(!fetching);
              setOpenDialog(false);
              router.push(`/manager/product/${res.data.data.id}`);
            }
          })
          .catch((error: any) => {
            onShowResult({
              type: "error",
              msg: "Thêm mới thất bại!",
            });
          });
      } else {
        Fetch.put("/api/v1/product", _data)
          .then((res: any) => {
            if (res.status === 200) {
              onShowResult({
                type: "success",
                msg: "Cập nhật thành công!",
              });
              setFetching(!fetching);
              setOpenDialog(false);
            }
          })
          .catch((error: any) => {
            onShowResult({
              type: "error",
              msg: "Cập nhật thất bại!",
            });
          });
        setProduct({});
      }
    },
    [action, fetching]
  );

  useEffect(() => {
    (async () => {
      Fetch.get(
        `/api/v1/product/search-name?name=${searchName}&page=${currentPage}&size=${pageSize}`
      )
        .then((res: any) => {
          if (res.status === 200) {
            let data = res.data.data.content;
            data.map(async (item: any) => {
              item.image = await handleDownloadImage(item.image);
              item.price =
                convertMoney(item.minPrice || 0) +
                " ~ " +
                convertMoney(item.maxPrice || 0);
              if (item.minPrice == item.maxPrice) {
                item.price = convertMoney(item.minPrice || 0);
              }
            });
            setData(data);
            setTotalPage(res.data.data.totalPages);
          }
        })
        .catch((error: any) => {
          onShowResult({
            type: "error",
            msg: "Lấy dữ liệu thất bại!",
          });
        });
    })();
  }, [searchName, currentPage, pageSize, fetching]);

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPage - 1) {
      setCurrentPage(currentPage + 1);
    }
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
      <ModalProduct
        open={openDialog}
        handleOpen={handleOpen}
        action={action}
        size={size}
        brands={brands}
        onConfirm={(size: any) => {
          handleConfirm(size);
        }}
      />
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Sản phẩm
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Thông tin tất cả các sản phẩm
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button
                className="flex items-center gap-3"
                size="sm"
                onClick={() => {
                  setAction("create");
                  setProduct({});
                  handleOpen();
                }}
              >
                <PlusIcon strokeWidth={2} className="h-4 w-4" /> Thêm mới
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <Tabs value="all" className="w-full md:w-max">
              <TabsHeader>
                {TABS.map(({ label, value }) => (
                  <Tab key={value} value={value}>
                    &nbsp;&nbsp;{label}&nbsp;&nbsp;
                  </Tab>
                ))}
              </TabsHeader>
            </Tabs>
            <div className="w-full md:w-72">
              <Input
                label="Tìm kiếm"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-0">
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
                      {index !== 0 && index !== TABLE_HEAD.length - 1 && (
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
              {data?.map(
                (
                  { id, name, image, description, quantity, price, status },
                  index
                ) => {
                  const isLast = index === data.length - 1;
                  const className = `py-3 px-5 ${
                    index === data.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;
                  return (
                    <tr key={id}>
                      <td className={className}>
                        <Typography variant="small" color="blue-gray">
                          {index + 1}
                        </Typography>
                      </td>
                      <td className={className}>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {name || ""}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <img
                          src={
                            // @ts-ignore
                            image && image.includes("https")
                              ? image
                              : "/nike-air-force-1-shadow-all-white.jpg"
                          }
                          className="w-16 h-16"
                        />
                      </td>
                      {/* <td className={className}>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {description || ""}
                            </Typography>
                          </div>
                        </div>
                      </td> */}
                      <td className={className}>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {quantity || "0"}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {price || "0"}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={status ? "green" : "blue-gray"}
                          value={
                            status ? "Đang kinh doanh" : "Ngừng kinh doanh"
                          }
                          className="py-0.5 px-2 text-[11px] font-medium"
                        />
                      </td>

                      <td className={className}>
                        <Tooltip content="Chi tiết sản phẩm">
                          <IconButton
                            variant="text"
                            onClick={() => {
                              setAction("edit");
                              router.push(`/manager/product/${id}`);
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
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Trang {currentPage + 1} / {totalPage}
          </Typography>
          <div className="flex gap-2">
            {currentPage !== 0 ? (
              <Button variant="outlined" size="sm" onClick={handlePrevious}>
                Lùi lại
              </Button>
            ) : null}
            {currentPage != totalPage - 1 ? (
              <Button variant="outlined" size="sm" onClick={handleNext}>
                Tiếp theo
              </Button>
            ) : null}
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

const ModalProduct = ({
  open,
  handleOpen,
  size,
  action,
  onConfirm,
  brands,
}: any) => {
  const [showDialog, setShowDialog] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [productState, setProductState] = useState({
    id: "",
    name: "",
    description: "",
    // price: 0 as any,
    image: "",
    imageRef: "" as any,
    status: 1 as any,
  });
  const fileInput = useRef<HTMLInputElement | any>(null);

  const handleClickChooseFile = (e: any) => {
    if (fileInput.current != null) {
      fileInput.current?.click();
    }
  };

  const handleChangeFileValue = (e: any) => {
    const [file] = e.target.files;
    // fileInput.current = e.target.files[0];
    setProductState((cur) => ({
      ...cur,
      image: file.name,
      imageRef: file,
    }));
  };

  useEffect(() => {
    setShowDialog(open);
  }, [open]);

  useEffect(() => {
    if (size?.id) setProductState(size);
    else
      setProductState({
        id: "",
        name: "",
        description: "",
        // price: 0,
        image: "",
        imageRef: "",
        status: 1,
      });
  }, [size]);

  const handleConfirm = () => {
    onConfirm?.(productState);
  };
  return (
    <>
      <Dialog
        size="xs"
        open={showDialog}
        handler={handleOpen}
        className="bg-transparent shadow-none z-10"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              {action === "create" ? "Thêm mới" : "Cập nhật"} Sản phẩm
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <div className="flex flex-wrap justify-center">
              <div className="w-full lg:w-12/12 px-4">
                <div className="relative w-full mb-3 gap-3">
                  <Input
                    label="Tên"
                    size="lg"
                    onChange={(e) =>
                      setProductState((cur) => ({
                        ...cur,
                        name: e.target.value,
                      }))
                    }
                    defaultValue={productState?.name}
                  />
                </div>
                <div className="relative w-full mb-3 gap-3">
                  <Textarea
                    label="Mô tả"
                    size="lg"
                    onChange={(e) =>
                      setProductState((cur) => ({
                        ...cur,
                        description: e.target.value,
                      }))
                    }
                    defaultValue={productState?.description}
                  />
                </div>
                <div className="relative w-full mb-3 gap-3">
                  <Select label="Thương hiệu" size="md">
                    {brands.map((item: any) => (
                      <Option
                        key={item.id}
                        value={item.id + ""}
                        onClick={() => {
                          setProductState((cur) => ({
                            ...cur,
                            brandId: item.id,
                          }));
                        }}
                      >
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </div>
                {/* <div className="relative w-full mb-3 gap-3">
                  <Input
                    label="Giá"
                    size="lg"
                    onChange={(e) =>
                      setProductState((cur) => ({
                        ...cur,
                        price: e.target.value,
                      }))
                    }
                    defaultValue={productState?.price}
                  />
                </div> */}
                <div className="relative w-full mb-3 gap-3">
                  <Input
                    label="Hình ảnh"
                    size="lg"
                    className="pr-20"
                    containerProps={{
                      className: "min-w-0",
                    }}
                    onChange={(e) =>
                      setProductState((cur) => ({
                        ...cur,
                        image: e.target.value,
                      }))
                    }
                    defaultValue={productState?.image}
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
              </div>
            </div>
          </CardBody>
          <CardFooter className="pt-0 flex justify-end">
            <Button
              variant="text"
              color="red"
              onClick={handleOpen}
              className="mr-1"
            >
              Hủy
            </Button>
            <Button
              variant="gradient"
              color="green"
              onClick={() => {
                setOpenConfirm(true);
              }}
            >
              {action === "create" ? "Thêm mới" : "Cập nhật"}
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
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

export { ModalProduct };

export default ProductPage;
