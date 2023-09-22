import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { storage } from "../../services/firebase";
import Notify from "../../components/Notify";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import Fetch from "../../services/Fetch";
import convertMoney from "../../services/Utils";

const TABLE_HEAD = ["Ảnh", "Tên sản phẩm", "Giá", "Doanh số"];

export default function Home() {
  const [openLoading, setOpenLoading] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [snackMsg, setSnackMsg] = useState("");
  const [monthSactistical, setMonthSactistical] = useState<any>({});
  const [todaySactistical, setTodaySactistical] = useState<any>({});
  const [topMonthSales, setTopMonthSales] = useState<any>([]);

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

  const getMonthSactistical = async () => {
    return Fetch.post("/api/v1/statistical/statistical-monthly")
      .then((res: any) => {
        if (res.status == 200) {
          return res.data.data;
        }
      })
      .catch((err: any) => {
        return null;
      });
  };

  const getTodaySactistical = async () => {
    return Fetch.post("/api/v1/statistical/statistical-today")
      .then((res: any) => {
        if (res.status == 200) {
          return res.data.data;
        }
      })
      .catch((err: any) => {
        return null;
      });
  };

  const getTopMonthSales = async () => {
    return Fetch.post("/api/v1/statistical/top-month-sales")
      .then((res: any) => {
        if (res.status == 200) {
          let data = res.data.data;
          data.map(async (item: any) => {
            item.imageURL = await handleDownloadImage(item.image);
          });
          return data;
        }
      })
      .catch((err: any) => {
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
      .catch((error) => {
        onShowResult({
          type: "error",
          msg: error,
        });
        return "/nike-air-force-1-shadow-all-white.jpg";
      });
    return url;
  };

  useEffect(() => {
    (async () => {
      setOpenLoading(true);
      const _monthSactistical = await getMonthSactistical();
      const _todaySactistical = await getTodaySactistical();
      const _topMonthSales = await getTopMonthSales();
      setMonthSactistical(_monthSactistical);
      setTodaySactistical(_todaySactistical);
      setTopMonthSales(_topMonthSales);
      onShowResult({
        type: "success",
        msg: "Lấy dữ liệu thành công!",
      });
    })();
  }, []);

  return (
    <>
      <Notify
        openLoading={openLoading}
        openSnack={openSnack}
        alertType={alertType}
        snackMsg={snackMsg}
        onClose={onCloseSnack}
      />
      <div className="h-full w-full">
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4 mb-4">
          <div className="flex flex-col p-4 border border-blue-gray-300 rounded-lg">
            <Typography variant="h4">Doanh số tháng này</Typography>
            <h4 className="text-orange-600">
              {(monthSactistical?.monthQuantity
                ? monthSactistical?.monthQuantity
                : "0") +
                " đơn hàng / " +
                convertMoney(monthSactistical?.monthPrice || 0) || ""}
            </h4>
          </div>
          <div className="flex flex-col p-4 border border-blue-gray-300 rounded-lg">
            <Typography variant="h4">Hôm nay</Typography>
            <h4 className="text-orange-600">
              {(todaySactistical?.todayQuantity
                ? todaySactistical?.todayQuantity
                : "0") +
                " đơn hàng / " +
                convertMoney(todaySactistical?.todayPrice || 0) || ""}
            </h4>
          </div>
          <div className="flex flex-col p-4 border border-blue-gray-300 rounded-lg">
            <Typography variant="h4">Tháng này bán được</Typography>
            <h4 className="text-orange-600">
              {(monthSactistical?.quantityOrder || "0") + " Chiếc"}
            </h4>
          </div>
        </div>
        <div className="w-full my-4 flex flex-col">
          <div className="flex flex-col md:flex-row justify-between">
            <Typography variant="h5">
              Top sản phẩm bán chạy tháng này
            </Typography>
          </div>
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
              {topMonthSales?.map((item: any, index: number) => (
                <tr key={index}>
                  <td>
                    <div className="flex items-center gap-4">
                      <img
                        src={item?.imageURL}
                        alt=""
                        className="w-10 h-10 rounded-full"
                      />
                    </div>
                  </td>
                  <td>
                    <span className="text-sm">{item?.name}</span>
                  </td>
                  <td>
                    <span className="text-sm">
                      {convertMoney(item?.priceProductItem || 0)}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm">{item?.totalQuantity}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
