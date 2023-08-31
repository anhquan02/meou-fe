import { use, useCallback, useEffect, useState } from "react";
import Notify from "../../../components/Notify";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dialog,
  IconButton,
  Input,
  Tab,
  Tabs,
  TabsHeader,
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

const TABLE_HEAD = ["STT", "Tên thương hiệu", "Hành động"];

const TABS = [
  {
    label: "Tất cả",
    value: "all",
  },
];

const BrandPage = () => {
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
  const [brand, setBrand] = useState<any>();
  const [fetching, setFetching] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
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
    setOpenLoading(true);
    Fetch.get(
      `/api/v1/brand/search-name?name=${searchName}&page=${currentPage}&size=${pageSize}`
    )
      .then((res: any) => {
        if (res.status === 200) {
          setData(res.data.data.content);
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
  }, []);

  const handleConfirm = useCallback(
    (_brand: any) => {
      if (action === "create") {
        Fetch.post("/api/v1/brand", _brand)
          .then((res: any) => {
            if (res.status === 200) {
              onShowResult({
                type: "success",
                msg: "Thêm mới thành công!",
              });
              setFetching(!fetching);
              setOpenDialog(false);
            }
          })
          .catch((error: any) => {
            onShowResult({
              type: "error",
              msg: "Thêm mới thất bại!",
            });
          });
      } else {
        Fetch.put("/api/v1/brand", _brand)
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
        setBrand({});
      }
    },
    [action, fetching]
  );

  useEffect(() => {
    Fetch.get(
      `/api/v1/brand/search-name?name=${searchName}&page=${currentPage}&size=${pageSize}`
    )
      .then((res: any) => {
        if (res.status === 200) {
          setData(res.data.data.content);
          setTotalPage(res.data.data.totalPages);
        }
      })
      .catch((error: any) => {
        onShowResult({
          type: "error",
          msg: "Lấy dữ liệu thất bại!",
        });
      });
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
      <ModalBrand
        open={openDialog}
        handleOpen={handleOpen}
        action={action}
        brand={brand}
        onConfirm={(brand: any) => {
          handleConfirm(brand);
        }}
      />
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Thương hiệu
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Thông tin tất cả các thương hiệu
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button
                className="flex items-center gap-3"
                size="sm"
                onClick={() => {
                  setAction("create");
                  setBrand({});
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
              {data?.map(({ id, name }, index) => {
                const isLast = index === data.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";
                return (
                  <tr key={name}>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray">
                        {index + 1}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {name}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Sửa thương hiệu">
                        <IconButton
                          variant="text"
                          onClick={() => {
                            setAction("edit");
                            setBrand({ id, name });
                            handleOpen();
                          }}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
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

const ModalBrand = ({ open, handleOpen, brand, action, onConfirm }: any) => {
  const [showDialog, setShowDialog] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [brandState, setBrandState] = useState({
    id: "",
    name: "",
  });

  useEffect(() => {
    setShowDialog(open);
  }, [open]);

  useEffect(() => {
    if (brand?.id) setBrandState(brand);
    else setBrandState({ id: "", name: "" });
  }, [brand]);

  const handleConfirm = () => {
    onConfirm?.(brandState);
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
              {action === "create" ? "Thêm mới" : "Cập nhật"} thương hiệu
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <div className="flex flex-wrap justify-center">
              <div className="w-full lg:w-12/12 px-4">
                <div className="relative w-full mb-3">
                  <Input
                    label="Tên thương hiệu"
                    size="lg"
                    onChange={(e) =>
                      setBrandState((cur) => ({ ...cur, name: e.target.value }))
                    }
                    defaultValue={brandState?.name}
                  />
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

export { ModalBrand };

export default BrandPage;
