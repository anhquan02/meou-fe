
import React from "react";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props: any, ref: any) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default Alert;
