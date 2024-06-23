import React, { useState } from "react";
import Input from "components/Input";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Grid from "@material-ui/core/Grid";
import ButtonOutline from "components/ButtonOutline";
import Alert from "@material-ui/lab/Alert";
import { Coordinator } from "common/models/units";
import { validateEmail } from "common/helpers";
import { useTranslation } from "react-i18next";

interface FormCoodinatorProps {
  addCoordinators?: (obj) => void;
}

const FormCoordinator = React.memo((props: FormCoodinatorProps) => {
  const [error, setError] = useState<null | string>();
  const translate = useTranslation().t;
  const defaultValues: Coordinator = {
    displayName: "",
    title: "",
    email: "",
    officePhone: "",
    fax: "",
    mobile: "",
    extension: ""
  };
  const [values, setValues] = useState({ ...defaultValues });

  const submit = () => {
    if (!values.displayName) {
      setError(translate("REQUIRED_INPUT_CTA", { value: translate("NAME") }));
      return;
    }
    if (!values.title) {
      setError(translate("REQUIRED_INPUT_CTA", { value: translate("TITLE") }));
      return;
    }
    if (values.email && !validateEmail(values.email)) {
      setError(translate("EMAIL_MUST_BE_A_VALID_EMAIL"));
      return;
    }
    if (!values.officePhone) {
      setError(translate("REQUIRED_INPUT_CTA", { value: translate("PHONE") }));
      return;
    }

    const obj = {
      ...values
    };

    props.addCoordinators(obj);
    setValues({ ...defaultValues });
  };

  const onChange = (value, label) => {
    setValues({
      ...values,
      [label]: value
    });
  };

  return (
    <React.Fragment>
      <Input
        value={values.displayName}
        name="displayName"
        type="string"
        fullWidth
        placeholder={translate("PH_FULL_NAME")}
        label={translate("NAME")}
        changeHandler={e => onChange(e, "displayName")}
      />
      <Input
        value={values.title}
        name="title"
        type="string"
        fullWidth
        placeholder={translate("PH_LIAISON_TITLE")}
        label={translate("TITLE")}
        changeHandler={e => onChange(e, "title")}
      />
      <Input
        value={values.email}
        name="email"
        type="email"
        fullWidth
        placeholder={translate("PH_EMAIL")}
        label={translate("EMAIL")}
        changeHandler={e => onChange(e, "email")}
      />
      <Input
        value={values.officePhone}
        name="officePhone"
        type="phonenumber"
        fullWidth
        placeholder="(xxx) xxx-xxxx"
        label={translate("OFFICE_PHONE")}
        changeHandler={e => onChange(e, "officePhone")}
      />
      <Input
        value={values.extension}
        name="extension"
        type="string"
        fullWidth
        placeholder={translate("PH_EXT")}
        label={translate("EXTENSION")}
        changeHandler={e => onChange(e, "extension")}
      />
      <Input
        value={values.mobile}
        name="mobile"
        type="phonenumber"
        fullWidth
        placeholder="(xxx) xxx-xxxx"
        label={translate("MOBILE_PHONE")}
        changeHandler={e => onChange(e, "mobile")}
      />
      <br />
      {error && <Alert severity="error">{error}</Alert>}
      <Grid
        style={{ paddingTop: "20px" }}
        container
        spacing={1}
        direction="row"
      >
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <ButtonGroup fullWidth>
            <ButtonOutline onClick={() => submit()} variant="contained">
              {translate("ADD_ADDRESS")}
            </ButtonOutline>
          </ButtonGroup>
        </Grid>
      </Grid>
    </React.Fragment>
  );
});

export default FormCoordinator;
