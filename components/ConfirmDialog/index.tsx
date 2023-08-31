import {
    Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";

const ConfirmDialog = ({ data, onShow, onConfirm, onClose }: any) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen((prev) => !prev)

  useEffect(() => {
    setOpen(onShow);
  }, [onShow]);

  const handleClose = () => {
    setOpen(false);
    onClose?.(false);
  };

  const handleConfirm = () => {
    setOpen(false);
    onClose?.(true);
    onConfirm?.(data);
  };

  return (
    <>
      <Dialog open={open} handler={handleOpen} className="z-20">
        <DialogHeader>Xác nhận </DialogHeader>
        <DialogBody divider>
          Bạn có chắc chắn muốn thực hiện hành động này?
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleClose}
            className="mr-1"
          >
            <span>Hủy</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleConfirm}>
            <span>Xác nhận</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default ConfirmDialog;
