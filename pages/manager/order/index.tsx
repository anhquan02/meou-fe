import { use, useEffect, useState } from "react";
import Notify from "../../../components/Notify";
import Fetch from "../../../services/Fetch";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { ChevronUpDownIcon, PencilIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import convertMoney from "../../../services/Utils";

const TABLE_HEAD = [
  "STT",
  "Mã hóa đơn",
  "Tổng tiền",
  "Phương thức thanh toán",
  "Phân loại",
  "Trạng thái",
  "Ghi chú",
  "Hành động",
];

const TABS = [
  {
    label: "Tất cả",
    value: "all",
  },
];

const MAPPING_STATUS = {
  1: { value: "Đang chờ xử lý", color: "blue-gray" },
  2: { value: "Xác nhận đơn hàng", color: "light-blue" },
  3: { value: "Đang đóng gói", color: "light-blue" },
  4: { value: "Đang giao hàng", color: "light-blue" },
  5: { value: "Đã nhận hàng", color: "green" },
  6: { value: "Trả hàng", color: "green" },
  9: { value: "Đã hủy", color: "red" },
} as any;

const OrderPage = () => {
  const [openLoading, setOpenLoading] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [snackMsg, setSnackMsg] = useState("");
  const [data, setData] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const router = useRouter();
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
      await Fetch.post(
        `/api/v1/order/all-page?page=${currentPage}&size=${pageSize}`
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
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await Fetch.post(
        `/api/v1/order/all-page?page=${currentPage}&size=${pageSize}`
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
    })();
  }, [currentPage, pageSize]);

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
      <Card className="w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <Typography variant="h5" color="blue-gray">
              Hoá đơn
            </Typography>
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
                  {
                    id,
                    code,
                    totalPrice,
                    paymentMethod,
                    typeOrders,
                    statusId,
                    note,
                  },
                  index
                ) => {
                  const isLast = index === data.length - 1;
                  const className = `py-3 px-5 ${
                    index === data.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;
                  return (
                    <tr key={code}>
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
                              {code}
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
                              {convertMoney(totalPrice || 0)}
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
                              {paymentMethod}
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
                              {typeOrders}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={MAPPING_STATUS[statusId].color}
                          className="w-full text-center"
                          value={MAPPING_STATUS[statusId].value}
                        />
                      </td>
                      <td className={className}>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {note || ""}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Tooltip content="Chi tiết hóa đơn">
                          <IconButton
                            variant="text"
                            onClick={() => {
                              router.push(`/manager/order/${id}`);
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

export default OrderPage;
