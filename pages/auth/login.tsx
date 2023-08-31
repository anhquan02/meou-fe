import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import Link from "next/link";
import { use, useRef, useState } from "react";
import Fetch from "../../services/Fetch";
import { useStore } from "react-redux";
import { useRouter } from "next/router";
import Notify from "../../components/Notify";

export function SignIn() {
  const params = useRef({ username: "", password: "" });
  const router = useRouter();
  const [openLoading, setOpenLoading] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [snackMsg, setSnackMsg] = useState("");

  const handleSignIn = () => {
    Fetch.post("/api/v1/account/login", params.current)
      .then((res: any) => {
        if (res.status === 200) {
          sessionStorage.setItem("token", res.data.token);
          onShowResult({
            type: "success",
            msg: "Đăng nhập thành công!",
          });
          router.push("/manager/home");
        } else {
          onShowResult({
            type: "error",
            msg: "Sai tên đăng nhập hoặc mật khẩu!",
          });
        }
      })
      .catch((error: any) => {
        onShowResult({
          type: "error",
          msg: "Đăng nhập thất bại!",
        });
      });
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

  return (
    <>
      <Notify
        openLoading={openLoading}
        openSnack={openSnack}
        alertType={alertType}
        snackMsg={snackMsg}
        onClose={onCloseSnack}
      />
      <img
        src="https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 z-0 h-full w-full bg-black/50" />
      <div className="container mx-auto p-4">
        <Card className="absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Đăng nhập
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input
              type="username"
              label="Tên đăng nhập"
              size="lg"
              onChange={(e) => {
                params.current.username = e.target.value;
              }}
            />
            <Input
              type="password"
              label="Mật khẩu"
              size="lg"
              onChange={(e) => {
                params.current.password = e.target.value;
              }}
            />
            <div className="-ml-2.5">
              <Checkbox label="Ghi nhớ đăng nhập" />
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" fullWidth onClick={() => handleSignIn()}>
              Đăng nhập
            </Button>
            <Typography variant="small" className="mt-6 flex justify-center">
              Bạn chưa có tài khoản?
              <Link href="" as="/auth/sign-up">
                <Typography
                  as="span"
                  variant="small"
                  color="blue"
                  className="ml-1 font-bold"
                >
                  Đăng ký
                </Typography>
              </Link>
            </Typography>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default SignIn;
