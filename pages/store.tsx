import { useRouter } from "next/router";
import Fetch from "../services/Fetch";
import Notify from "../components/Notify";
import { useEffect, useState } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../services/firebase";
import CardProduct from "../components/Card";

const StorePage = () => {
  const router = useRouter();
  const [openLoading, setOpenLoading] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [snackMsg, setSnackMsg] = useState("");
  const [product, setProduct] = useState([]);

  const onCloseSnack = () => {
    setOpenSnack(false);
  };
  const [openConfirm, setOpenConfirm] = useState(false);

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      await Fetch.post("/api/v1/customer/home")
        .then(async (res: any) => {
          if (res.data.code == 200) {
            const _data = res.data.data.content;
            _data.map(async (item: any) => {
              if (!item.image)
                item.imageURL = "/nike-air-force-1-shadow-all-white.jpg";
              else item.imageURL = await handleDownloadImage(item.image);
            });
            setData(_data);
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    })();
  }, []);

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

  return (
    <>
      <Notify
        openLoading={openLoading}
        openSnack={openSnack}
        alertType={alertType}
        snackMsg={snackMsg}
        onClose={onCloseSnack}
      />
      <div className="mx-auto max-w-screen-xl p-2 lg:rounded-full">
        <div className="grid grid-cols-3 gap-4">
          {data.map((item: any, index) => {
            return (
              <CardProduct key={item.id} product={item}  />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default StorePage;
