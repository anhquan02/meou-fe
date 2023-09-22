import { useEffect, useState } from "react";
import Notify from "../../components/Notify";
import Fetch from "../../services/Fetch";
import { Button, Chip, Typography } from "@material-tailwind/react";
import convertMoney from "../../services/Utils";
import { useRouter } from "next/router";

const TABLE_HEAD = [
  "STT",
  "Mã đơn hàng",
  "Ngày đặt hàng",
  "Tổng tiền",
  "Trạng thái",
  "Hành động",
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
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const onCloseSnack = () => {
    setOpenSnack(false);
  };

  const onShowResult = ({ type, msg }: any) => {
    setOpenSnack(true);
    setOpenLoading(false);
    setAlertType(type);
    setSnackMsg(msg);
  };

  const router = useRouter();

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

  useEffect(() => {
    (async () => {
      Fetch.post(
        `/api/v1/order/page-client?page=${currentPage}&size=${pageSize}`
      )
        .then((res: any) => {
          setData(res.data.data.content);
          setTotalPage(res.data.data.totalPages);
          onShowResult({
            type: "success",
            msg: "Lấy dữ liệu thành công!",
          });
        })
        .catch((error: any) => {});
    })();
  }, [currentPage, pageSize]);


  return (
    <>
      <Notify
        openLoading={openLoading}
        openSnack={openSnack}
        alertType={alertType}
        snackMsg={snackMsg}
        onClose={onCloseSnack}
      />
      <div className="mx-auto max-w-screen-xl lg:rounded-lg p-4 my-6">
        <table className="table w-full">
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
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map((item: any, index: number) => {
              const isLast = index === data.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";
              return (
                <tr key={item.id}>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray">
                      {index + 1}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray">
                      {item.code}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray">
                      {item.createdDate}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray">
                      {convertMoney(item.totalPrice || 0)}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Chip
                      variant="gradient"
                      color={MAPPING_STATUS[item.statusId].color}
                      className="w-full text-center"
                      value={MAPPING_STATUS[item.statusId].value}
                    />
                  </td>
                  <td>
                    <button
                      className="bg-blue-gray-300 rounded-lg px-4 py-2 text-white"
                      onClick={() => {
                        router.push(`/order/${item.id}`);
                      }}
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex flex-row justify-between my-4">
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
        </div>
      </div>
    </>
  );
};

export default OrderPage;
