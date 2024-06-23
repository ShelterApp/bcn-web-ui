import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { useTranslation } from "react-i18next";

interface AlertProps {
  handleClickYes: Function;
  handleClose: Function;
  open: boolean;
  title: string;
}
const AlertDialog = React.memo((props: AlertProps) => {
  const { open, handleClickYes, handleClose, title } = props;
  const translate = useTranslation().t;
  return (
    <div>
      <Dialog
        open={open}
        onClose={() => handleClose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {title}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()} color="primary">
            {translate("NO")}
          </Button>
          <Button onClick={() => handleClickYes()} color="primary" autoFocus>
            {translate("YES")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

export default AlertDialog;
