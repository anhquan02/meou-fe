import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Timeline,
  TimelineBody,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineItem,
  Typography,
} from "@material-tailwind/react";

import { getDownloadURL, ref } from "firebase/storage";

import {
  BellIcon,
  CurrencyDollarIcon,
  HomeIcon,
} from "@heroicons/react/24/solid";
import { Box, Step, StepLabel, Stepper } from "@mui/material";
import Fetch from "../../services/Fetch";
import { storage } from "../../services/firebase";
import convertMoney from "../../services/Utils";
import Notify from "../../components/Notify";

const MAPPING_STATUS = {
  1: { value: "Đang chờ xử lý", color: "blue-gray" },
  2: { value: "Xác nhận đơn hàng", color: "light-blue" },
  3: { value: "Đang đóng gói", color: "light-blue" },
  4: { value: "Đang giao hàng", color: "light-blue" },
  5: { value: "Đã nhận hàng", color: "green" },
  9: { value: "Đã hủy", color: "red" },
} as any;

const TABLE_HEAD = [
  "STT",
  "Hình ảnh",
  "Tên sản phẩm",
  "Số lượng",
  "Giá",
  "Màu",
  "Kích cỡ",
  "Thương hiệu",
  "Đế giày",
  "Lót giày",
];

const ORDER_TYPE = {
  STORE: {
    text: "Đặt hàng tại cửa hàng",
    color: "blue-gray",
    value: 1,
  },
  ONLINE: {
    text: "Đặt hàng online",
    color: "light-blue",
    value: 2,
  },
};

const OrderDetail = () => {
  const router = useRouter();
  const [openLoading, setOpenLoading] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [snackMsg, setSnackMsg] = useState("");
  const { id } = router.query;
  const [order, setOrder] = useState<any>({});
  const [orderItems, setOrderItems] = useState<any>([]);
  const [transactions, setTransactions] = useState<any>([]);
  const [renderState, setRenderState] = useState(false);
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

  const changeStatus = useCallback(
    async (statusId: number) => {
      if (!order?.id) return;
      setOpenLoading(true);
      await Fetch.put(`/api/v1/order/change-status`, {
        idOrder: order?.id,
        idStatus: statusId,
        note: "",
      })
        .then((res: any) => {
          if (res.status === 200) {
            onShowResult({
              type: "success",
              msg: "Cập nhật trạng thái thành công!",
            });
            setOrder((cur: any) => ({ ...cur, statusId: statusId }));
          }
        })
        .catch((error: any) => {
          onShowResult({
            type: "error",
            msg: error.message,
          });
        });
    },
    [order]
  );

  useEffect(() => {
    (async () => {
      if (!id) return;
      await Fetch.get(`/api/v1/order-item/all?idOrder=${id}`)
        .then((res: any) => {
          if (res.status === 200) {
            const orders = res.data.data.orders;
            orders.map(async (order: any) => {
              const url = await handleDownloadImage(order.image);
              order.image = url;
            });

            setOrderItems(orders);
            setOrder(res.data.data.order);
            setTransactions(res.data.data.transactions);
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

  const renderTimeline = () => {
    if (order?.typeOrder == 1) {
      return renderTimelineStore();
    } else {
      return renderTimelineOnline();
    }
  };

  const renderTimelineStore = () => {
    return (
      <>
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={order?.statusId} alternativeLabel>
            <Step completed={false}>
              <StepLabel>
                <Typography variant="h6">Chờ xác nhận</Typography>
              </StepLabel>
            </Step>
            <Step completed={false}>
              <StepLabel>
                <Typography variant="h6">Xác nhận</Typography>
              </StepLabel>
            </Step>
            <Step completed={false}>
              <StepLabel>
                <Typography variant="h6">Đóng gói</Typography>
              </StepLabel>
            </Step>
            <Step completed={false}>
              <StepLabel>
                <Typography variant="h6">Giao hàng</Typography>
              </StepLabel>
            </Step>
            <Step completed={true}>
              <StepLabel>
                <Typography variant="h6">Đã nhận hàng</Typography>
              </StepLabel>
            </Step>
          </Stepper>
        </Box>
        <div className="w-full flex md:flex-row flex-col gap-4 py-4 my-4">
          <div className="border border-blue-gray-100 rounded min-h-[200px] w-full">
            <div className="w-full text-center text-blue-gray-600 my-2">
              <Typography variant="h5">Lịch sử</Typography>
              <div className="p-4">
                <Timeline>
                  {/* {transactions.map((transaction: any, index: number) => {
                    return (
                      <TimelineItem key={index}>
                        <TimelineConnector />
                        <TimelineHeader>
                          <TimelineIcon className="p-2" />
                          <Typography variant="h6" color="blue-gray">
                            {`${MAPPING_STATUS[transaction.statusId].value} (${
                              transaction.createdDate
                            })`}
                          </Typography>
                        </TimelineHeader>
                        <TimelineBody className="pb-8">
                          <Typography
                            color="gray"
                            className="font-normal text-gray-600"
                          >
                            {transaction.username || ""}
                          </Typography>
                          <span>{transaction.note || ""}</span>
                        </TimelineBody>
                      </TimelineItem>
                    );
                  })} */}
                  <TimelineItem>
                    <TimelineConnector />
                    <TimelineHeader>
                      <TimelineIcon className="p-2" />
                      <Typography variant="h6" color="blue-gray">
                        Đã nhận hàng {`(${transactions[4].createdDate})`}
                      </Typography>
                    </TimelineHeader>
                    <TimelineBody className="pb-8">
                      <Typography
                        color="gray"
                        className="font-normal text-gray-600"
                      >
                        {transactions[4].username || ""}
                      </Typography>
                      <span>{transactions[4].note || ""}</span>
                    </TimelineBody>
                  </TimelineItem>
                </Timeline>
              </div>
            </div>
          </div>
          <div className="border border-blue-gray-100 rounded min-h-[200px] w-full">
            <div className="w-full text-center text-blue-gray-600 my-2">
              <Typography variant="h5">Thông tin đơn hàng</Typography>
            </div>
            <div className="">
              <div className="grid md:grid-cols-2 gap-4 items-center p-4">
                <label htmlFor="">Mã đơn hàng</label>
                <Input
                  type="text"
                  size="lg"
                  value={order?.code || ""}
                  disabled
                />
                <label htmlFor="">Nhân viên tạo hóa đơn</label>
                <Input
                  type="text"
                  size="lg"
                  value={order?.username || ""}
                  disabled
                />
                <label htmlFor="">Phân loại</label>
                <Input
                  type="text"
                  size="lg"
                  value={order?.typeOrders || ""}
                  disabled
                />
                <label htmlFor="">Trạng thái</label>
                <Input
                  type="text"
                  size="lg"
                  value={MAPPING_STATUS[order?.statusId]?.value || ""}
                  disabled
                />
                <label htmlFor="">Phương thức thanh toán</label>
                <Input
                  type="text"
                  size="lg"
                  value={order.paymentMethod || ""}
                  disabled
                />
                <label htmlFor="">Tổng giá</label>
                <Input
                  type="text"
                  size="lg"
                  value={order?.totalPrice + " VND" || "0 VND"}
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="border border-blue-gray-100 rounded min-h-[200px] w-full">
            <div className="w-full text-center text-blue-gray-600 my-2">
              <Typography variant="h5">Thông tin khách hàng</Typography>
            </div>
            <div className="">
              <div className="grid md:grid-cols-2 gap-4 items-center p-4">
                <label htmlFor="">Tên</label>
                <Input
                  type="text"
                  size="lg"
                  value={order?.nameCustomer || ""}
                  disabled
                />
                <label htmlFor="">Số điện thoại</label>
                <Input
                  type="text"
                  size="lg"
                  value={order?.phoneCustomer || ""}
                  disabled
                />
                <label htmlFor="">Địa chỉ</label>
                <Input
                  type="text"
                  size="lg"
                  value={order?.addressCustomer || ""}
                  disabled
                />
                <label htmlFor="">Email</label>
                <Input
                  type="text"
                  size="lg"
                  value={order?.emailCustomer || ""}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderTimelineOnline = () => {
    return (
      <>
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={order?.statusId - 1 || 0} alternativeLabel>
            <Step completed={order?.statusId > 1 && order?.statusId != 9}>
              <StepLabel>
                <Typography variant="h6">Chờ xác nhận</Typography>
              </StepLabel>
            </Step>
            <Step completed={order?.statusId > 2 && order?.statusId != 9}>
              <StepLabel>
                <Typography variant="h6">Xác nhận</Typography>
              </StepLabel>
            </Step>
            <Step completed={order?.statusId > 3 && order?.statusId != 9}>
              <StepLabel>
                <Typography variant="h6">Đóng gói</Typography>
              </StepLabel>
            </Step>
            <Step completed={order?.statusId > 4 && order?.statusId != 9}>
              <StepLabel>
                <Typography variant="h6">Giao hàng</Typography>
              </StepLabel>
            </Step>
            <Step completed={order?.statusId >= 5 && order?.statusId != 9}>
              <StepLabel>
                <Typography variant="h6">Đã nhận hàng</Typography>
              </StepLabel>
            </Step>
            <Step completed={order?.statusId == 9}>
              <StepLabel>
                <Typography variant="h6">Hủy đơn</Typography>
              </StepLabel>
            </Step>
          </Stepper>
        </Box>
        <div className="w-full flex md:flex-row flex-col gap-4 py-4 my-4">
          <div className="border border-blue-gray-100 rounded min-h-[200px] w-full">
            <div className="w-full text-center text-blue-gray-600 my-2">
              <Typography variant="h5">Lịch sử</Typography>
              <div className="p-4">
                <Timeline>
                  {transactions.map((transaction: any, index: number) => {
                    return (
                      <TimelineItem key={index}>
                        <TimelineConnector />
                        <TimelineHeader>
                          <TimelineIcon className="p-2" />
                          <Typography variant="h6" color="blue-gray">
                            {`${MAPPING_STATUS[transaction.statusId].value} (${
                              transaction.createdDate
                            })`}
                          </Typography>
                        </TimelineHeader>
                        <TimelineBody className="pb-8">
                          <Typography
                            color="gray"
                            className="font-normal text-gray-600"
                          >
                            {transaction.username || ""}
                          </Typography>
                          <span>{transaction.note || ""}</span>
                        </TimelineBody>
                      </TimelineItem>
                    );
                  })}
                  {/* <TimelineItem>
                    <TimelineConnector />
                    <TimelineHeader>
                      <TimelineIcon className="p-2" />
                      <Typography variant="h6" color="blue-gray">
                        Đã nhận hàng {`(${transactions[4].createdDate})`}
                      </Typography>
                    </TimelineHeader>
                    <TimelineBody className="pb-8">
                      <Typography
                        color="gray"
                        className="font-normal text-gray-600"
                      >
                        {transactions[4].username || ""}
                      </Typography>
                      <span>{transactions[4].note || ""}</span>
                    </TimelineBody>
                  </TimelineItem> */}
                </Timeline>
              </div>
            </div>
          </div>
          <div className="border border-blue-gray-100 rounded min-h-[200px] w-full">
            <div className="w-full text-center text-blue-gray-600 my-2">
              <Typography variant="h5">Thông tin đơn hàng</Typography>
            </div>
            <div className="">
              <div className="grid md:grid-cols-2 gap-4 items-center p-4">
                <label htmlFor="">Mã đơn hàng</label>
                <Input
                  type="text"
                  size="md"
                  value={order?.code || ""}
                  disabled
                />
                <label htmlFor="">Nhân viên tạo hóa đơn</label>
                <Input
                  type="text"
                  size="md"
                  value={order?.username || ""}
                  disabled
                />
                <label htmlFor="">Phân loại</label>
                <Input
                  type="text"
                  size="md"
                  value={ORDER_TYPE.ONLINE.text || ""}
                  disabled
                />
                <label htmlFor="">Trạng thái</label>
                <Input
                  type="text"
                  size="md"
                  value={MAPPING_STATUS[order?.statusId]?.value || ""}
                  disabled
                />
                <label htmlFor="">Phương thức thanh toán</label>
                <Input
                  type="text"
                  size="md"
                  value={order.paymentMethod || ""}
                  disabled
                />
                <label htmlFor="">Tổng giá</label>
                <Input
                  type="text"
                  size="md"
                  value={
                    (order?.totalPrice && convertMoney(order?.totalPrice)) ||
                    "0 VND"
                  }
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="border border-blue-gray-100 rounded min-h-[200px] w-full">
            <div className="w-full text-center text-blue-gray-600 my-2">
              <Typography variant="h5">Thông tin khách hàng</Typography>
            </div>
            <div className="">
              <div className="grid md:grid-cols-2 gap-4 items-center p-4">
                <label htmlFor="">Tên</label>
                <Input
                  type="text"
                  size="lg"
                  value={order?.nameCustomer || ""}
                  disabled
                />
                <label htmlFor="">Số điện thoại</label>
                <Input
                  type="text"
                  size="lg"
                  value={order?.phoneCustomer || ""}
                  disabled
                />
                <label htmlFor="">Địa chỉ</label>
                <Input
                  type="text"
                  size="lg"
                  value={order?.addressCustomer || ""}
                  disabled
                />
                <label htmlFor="">Email</label>
                <Input
                  type="text"
                  size="lg"
                  value={order?.emailCustomer || ""}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
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
      <div className="mx-auto max-w-screen-xlarge lg:rounded-lg py-4 my-6">
        <Card className="h-full w-full">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-8 flex items-center justify-between gap-8">
              <Typography variant="h5" color="blue-gray">
                Chi tiết hoá đơn
              </Typography>
            </div>
          </CardHeader>
          <CardBody className=" px-4">
            <div className="flex flex-wrap justify-center">              
              {/* status */}
              <div className="w-full">{renderTimeline()}</div>
              {/* table */}
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
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map(
                    (
                      {
                        id,
                        image,
                        nameProduct,
                        quantityOrder,
                        priceSell,
                        colorProduct,
                        sizeProduct,
                        brandProduct,
                        soleProduct,
                        insoleProduct,
                      }: any,
                      index: number
                    ) => {
                      const className = `py-3 px-5 ${
                        index === orderItems.length - 1
                          ? ""
                          : "border-b border-blue-gray-50"
                      }`;
                      return (
                        <tr key={index}>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray">
                              {index + 1}
                            </Typography>
                          </td>
                          <td className={className}>
                            <img
                              src={image || ""}
                              alt=""
                              className="w-24 h-24 object-contain"
                            />
                          </td>
                          <td className={className}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {nameProduct || ""}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {quantityOrder || ""}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {convertMoney(priceSell) || ""}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {colorProduct || ""}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {sizeProduct || ""}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {brandProduct || ""}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {soleProduct || ""}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {insoleProduct || ""}
                            </Typography>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default OrderDetail;
