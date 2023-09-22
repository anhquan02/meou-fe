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

const TABLE_HEAD = [
  "STT",
  "Tên đăng nhập",
  "Tên khách hàng",
  "email",
  "Số điện thoại",
  "Địa chỉ",
  "Hành động",
];

const TABS = [
  {
    label: "Tất cả",
    value: "all",
  },
];

const StaffPage = () => {
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
  const [sole, setSole] = useState<any>();
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
    Fetch.get(`/api/v1/account/get-staff-information`)
      .then((res: any) => {
        if (res.status === 200) {
          setData(res.data.data);
          //   setTotalPage(res.data.data.totalPages);
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
    (staff: any) => {
      staff.roleId = 2;
      if (staff.password !== staff.cf_password) {
        onShowResult({
          type: "error",
          msg: "Mật khẩu không trùng khớp!",
        });
        return;
      }
      if (action === "create") {
        Fetch.post("/api/v1/account", staff)
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
        Fetch.post("/api/v1/account/update-staff-by-admin", staff)
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
        setSole({});
      }
    },
    [action, fetching]
  );

  useEffect(() => {
    Fetch.get(`/api/v1/account/get-staff-information`)
      .then((res: any) => {
        if (res.status === 200) {
          setData(res.data.data);
          //   setTotalPage(res.data.data.totalPages);
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
      <ModalStaff
        open={openDialog}
        handleOpen={handleOpen}
        action={action}
        staff={sole}
        onConfirm={(staff: any) => {
          handleConfirm(staff);
        }}
      />
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Nhân viên
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Thông tin tất cả các nhân viên
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button
                className="flex items-center gap-3"
                size="sm"
                onClick={() => {
                  setAction("create");
                  setSole({});
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
                ({ id, username, fullname, email, phone, address }, index) => {
                  const isLast = index === data.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";
                  return (
                    <tr key={id}>
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
                              {username || "Chưa có"}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {fullname || "Chưa có"}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {email || "Chưa có"}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {phone || "Chưa có"}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {address || "Chưa có"}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Sửa nhân viên">
                          <IconButton
                            variant="text"
                            onClick={() => {
                              setAction("edit");
                              setSole({
                                id,
                                username,
                                address,
                                fullname,
                                email,
                                phone,
                              });
                              handleOpen();
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
        {/* <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
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
        </CardFooter> */}
      </Card>
    </>
  );
};

const ModalStaff = ({ open, handleOpen, staff, action, onConfirm }: any) => {
  const [showDialog, setShowDialog] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [staffState, setStaffState] = useState({
    id: "",
    username: "",
    fullname: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    cf_password: "",
  });

  useEffect(() => {
    setShowDialog(open);
  }, [open]);

  useEffect(() => {
    if (staff?.id) setStaffState(staff);
    else
      setStaffState({
        id: "",
        username: "",
        fullname: "",
        email: "",
        phone: "",
        password: "",
        address: "",
        cf_password: "",
      });
  }, [staff]);

  const handleConfirm = () => {
    onConfirm?.(staffState);
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
              {action === "create" ? "Thêm mới" : "Cập nhật"} nhân viên
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <div className="flex flex-wrap justify-center">
              <div className="w-full lg:w-12/12 px-4">
                <div className="relative w-full mb-3">
                  <Input
                    label="Tên đăng nhập"
                    size="lg"
                    onChange={(e) =>
                      setStaffState((cur) => ({
                        ...cur,
                        username: e.target.value,
                      }))
                    }
                    defaultValue={staffState?.username}
                  />
                </div>
                <div className="relative w-full mb-3">
                  <Input
                    label="Tên nhân viên"
                    size="lg"
                    onChange={(e) =>
                      setStaffState((cur) => ({
                        ...cur,
                        fullname: e.target.value,
                      }))
                    }
                    defaultValue={staffState?.fullname}
                  />
                </div>
                <div className="relative w-full mb-3">
                  <Input
                    label="Địa chỉ"
                    size="lg"
                    onChange={(e) =>
                      setStaffState((cur) => ({
                        ...cur,
                        address: e.target.value,
                      }))
                    }
                    defaultValue={staffState?.address}
                  />
                </div>
                <div className="relative w-full mb-3">
                  <Input
                    label="Số điện thoại"
                    size="lg"
                    onChange={(e) =>
                      setStaffState((cur) => ({
                        ...cur,
                        phone: e.target.value,
                      }))
                    }
                    defaultValue={staffState?.phone}
                  />
                </div>
                <div className="relative w-full mb-3">
                  <Input
                    label="Email"
                    size="lg"
                    onChange={(e) =>
                      setStaffState((cur) => ({
                        ...cur,
                        email: e.target.value,
                      }))
                    }
                    defaultValue={staffState?.email}
                  />
                </div>
                {action == "create" && (
                  <>
                    <div className="relative w-full mb-3">
                      <Input
                        label="Mật khẩu"
                        size="lg"
                        type="password"
                        onChange={(e) =>
                          setStaffState((cur) => ({
                            ...cur,
                            password: e.target.value,
                          }))
                        }
                        defaultValue={staffState?.password}
                      />
                    </div>
                    <div className="relative w-full mb-3">
                      <Input
                        label="Nhập lại mật khẩu"
                        type="password"
                        size="lg"
                        onChange={(e) =>
                          setStaffState((cur) => ({
                            ...cur,
                            cf_password: e.target.value,
                          }))
                        }
                        defaultValue={staffState?.cf_password}
                      />
                    </div>
                  </>
                )}
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

export { ModalStaff };

export default StaffPage;
