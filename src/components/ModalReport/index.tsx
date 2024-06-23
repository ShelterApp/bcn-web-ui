import React from "react";
import useForm from "react-hook-form";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Grid from "@material-ui/core/Grid";

import ButtonOutline from "components/ButtonOutline";
import SubmitButton from "components/Button";
import ErrorMessage from "components/ErrorMessage";
import Input from "components/Input";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: "block"
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      outline: "none",
      boxShadow: theme.shadows[5],
      padding: "16px 12px 24px",
      borderRadius: 5,
      maxHeight: "70vh",
      overflowY: "scroll",
      maxWidth: 360,
      [theme.breakpoints.down("xs")]: {
        maxWidth: "90vw !important"
      },
      [theme.breakpoints.down("md")]: {
        maxWidth: "50vw"
      },
      margin: "auto",
      marginTop: "10vh"
    },
    title: {
      fontSize: 16,
      fontWeight: 600,
      borderBottom: "1px solid #dddddd",
      paddingRight: 15,
      paddingLeft: 15,
      paddingBottom: 15,
      marginBottom: 0
    },
    root: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1)
        // width: "25ch"
      }
    }
  })
);

interface ModalReportProps {
  open: boolean;
  setOpen: Function;
  submitForm: Function;
}

const ModalReport = React.memo((props: ModalReportProps) => {
  const classes = useStyles();
  const { open, setOpen, submitForm } = props;
  const translate = useTranslation().t;
  const { register, errors, handleSubmit } = useForm();
  const submit = (data: any, e: any) => {
    e.preventDefault();

    submitForm(data);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={() => handleClose()}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 className={classes.title}>{translate("REPORT_TITLE")}</h2>
            <form
              className={classes.root}
              name="feedback"
              onSubmit={handleSubmit(submit)}
            >
              <Input
                name="email"
                type="email"
                fullWidth
                placeholder="mark@gmail.com"
                label={translate("EMAIL")}
                validate={register({
                  required: true,
                  // eslint-disable-next-line
                  pattern: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
                })}
                error={errors.email}
              />
              {errors.email && errors.email.type === "required" && (
                <ErrorMessage>
                  {translate("REQUIRED_INPUT_CTA", {
                    value: translate("EMAIL")
                  })}
                </ErrorMessage>
              )}
              {errors.email && errors.email.type === "pattern" && (
                <ErrorMessage>
                  {translate("EMAIL_MUST_BE_A_VALID_EMAIL")}
                </ErrorMessage>
              )}
              <Input
                name="message"
                type="textarea"
                fullWidth
                label={translate("MESSAGE")}
                validate={register({
                  required: true
                })}
                error={errors.message}
              />
              {errors.message && errors.message.type === "required" && (
                <ErrorMessage>
                  {translate("REQUIRED_INPUT_CTA", {
                    value: translate("MESSAGE")
                  })}
                </ErrorMessage>
              )}
              <Grid
                style={{ paddingTop: "20px" }}
                container
                spacing={1}
                direction="row"
              >
                <Grid item xs={6} sm={6} md={6} lg={6}>
                  <ButtonGroup onClick={handleClose} fullWidth>
                    <ButtonOutline variant="contained">
                      {translate("CANCEL")}
                    </ButtonOutline>
                  </ButtonGroup>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6}>
                  <ButtonGroup fullWidth>
                    <SubmitButton type="submit" variant="contained">
                      {translate("SEND")}
                    </SubmitButton>
                  </ButtonGroup>
                </Grid>
              </Grid>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
});

export default ModalReport;
