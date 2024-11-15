import React, { useState, useEffect } from "react";
import { push } from "connected-react-router";
import { reducerType } from "redux/reducers";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styles from "./styles";
import useForm from "react-hook-form";
import ErrorMessage from "components/ErrorMessage";
import Input from "components/Input";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Grid from "@material-ui/core/Grid";
import SubmitButton from "components/Button";
import { useTranslation } from "react-i18next";
import SchedulePanelForm from "./components/SchedulePanelForm";
import produce from "immer";
import Alert from "@material-ui/lab/Alert";
import imgLoading from "asset/img/loading.gif";
import {
  typeCheckboxs,
  categoryCheckboxs,
  CheckboxType,
  tranformSchedulesForm,
  defaultShedule,
  holiday,
  parseTime
} from "common/helpers";

import { UserRole, optionType } from "common/";
import GridFullHeight from "components/GridFullHeight";
import GridFormContainer from "components/GridFormContainer";
import { Service as IServiceProps, User as IUserProps } from "@bcn/core";
import { useSelector } from "react-redux";
import { createService, updateService } from "api/services/createService";
import { SET_MESSAGES_REDUCER } from "redux/reducers/messages/actionTypes";
// import country_list from "country";
import { getUsersAPI } from "api/services/getUsers";
import { approveServices } from "api/services/updateShelter";
// import _ from "lodash";

interface NewServiceProps {
  dispatch: Dispatch;
  initialValues?: IServiceProps;
  isCreate: boolean | false;
}

const mapStateToProps = (state: reducerType) => {
  return {};
};

const getSchedulesWithKey = schedules => {
  return schedules.map((schedule, idx) => ({
    key: idx,
    ...schedule
  }));
};

const tranformTypeCheckboxs = types => {
  return typeCheckboxs.map(type => ({
    name: type.name,
    isCheck: types.includes(type.name)
  }));
};

const tranformCategoryCheckboxs = categories => {
  return categoryCheckboxs.map(type => ({
    name: type.name,
    isCheck: categories.includes(type.name)
  }));
};

const initDefaultValues: IServiceProps = {
  name: "",
  description: "",
  address1: "",
  address2: "",
  city: "",
  state: "TX",
  zip: "",
  country: "",
  phone: "",
  contactEmail: "",
  website: "",
  facebook: "",
  twitter: "",
  serviceSummary: "",
  age: "",
  isShowDonate: false,
  isShowFlag: true,
  userEmail: "",
  isCriticalHeader: false,
  isCriticalNeverExpire: false,
  criticalExpiredAt: new Date(),
  managedUsers: [] as IUserProps[]
};

const NewService = React.memo((props: NewServiceProps) => {
  const translate = useTranslation().t;
  const current_user = useSelector(
    (state: reducerType) => state.auth.current_user
  );
  const { dispatch, initialValues, isCreate } = props;
  const defaultValues = initialValues ? initialValues : initDefaultValues;
  const { register, errors, handleSubmit, getValues, reset } = useForm({
    defaultValues: defaultValues
  });
  // const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>();
  const [types, setTypes] = useState<CheckboxType[]>(typeCheckboxs);
  const [categories, setCategories] = useState<CheckboxType[]>(
    categoryCheckboxs
  );

  const [typesAfter, setTypesAfter] = useState([]);
  const [categoriesAfter, setCategoriesAfter] = useState([]);
  const [isContact, setIsContact] = useState(false);
  const [isFlag, setIsFlag] = useState(false);
  const [isDonate, setIsDonate] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [closeSchedules, setCloseSchedules] = useState([]);
  const [isCriticalHeader, setIsCriticalHeader] = useState(false);
  const [isCriticalNeverExpire, setIsCriticalNeverExpire] = useState(false);
  const [criticalExpiredAt, setCriticalExpiredAt] = useState(new Date());
  const [criticalExpiredTimeAt, setCriticalExpiredTimeAt] = useState(
    new Date(
      criticalExpiredAt.getFullYear(),
      criticalExpiredAt.getMonth(),
      criticalExpiredAt.getDate(),
      23,
      59,
      0
    )
  );
  const [managedUsers, setManagedUsers] = useState<optionType[]>([]);
  // const [country, setCountry] = useState();
  const checkAll = (isCheck: boolean) => {
    const afterCate = categories.map(cate => ({
      ...cate,
      isCheck: isCheck
    }));
    setCategories(afterCate);
    setCategoriesAfter(afterCate.map(cate => cate["name"]));
  };

  const unCheckAll = (cates: CheckboxType[]) => {
    const index = categories.findIndex(v => v.name === "ALL");

    const nextState: CheckboxType[] = produce(cates, (draftState: any[]) => {
      draftState[index].isCheck = false;
    });

    setCategories(nextState);
    setCategoriesAfter(
      nextState.filter(fil => fil.isCheck).map(cate => cate["name"])
    );
    return;
  };

  const handleClickCheckbox = (service, isCategory) => {
    const { name, isCheck } = service;
    const index = isCategory
      ? categories.findIndex(v => v.name === name)
      : types.findIndex(v => v.name === name);
    let nextState;
    if (isCategory) {
      if (name === "ALL") {
        checkAll(isCheck);
        return;
      }

      nextState = produce(categories, (draftState: any[]) => {
        draftState[index].isCheck = isCheck;
      });

      let isCheckAll = false;
      const notAllCate = nextState.filter(ce => ce.name !== "ALL");

      for (const k of notAllCate) {
        if (!k.isCheck) {
          isCheckAll = false;
          unCheckAll(nextState);
          return;
        }
        isCheckAll = true;
      }

      if (isCheckAll) {
        checkAll(isCheck);
        return;
      }

      setCategories(nextState);
      setCategoriesAfter(
        nextState.filter(fil => fil.isCheck).map(type => type["name"])
      );
      return;
    }

    nextState = produce(types, (draftState: any[]) => {
      draftState[index].isCheck = isCheck;
    });
    setTypes(nextState);
    setTypesAfter(
      nextState.filter(fil => fil.isCheck).map(type => type["name"])
    );
    return;
  };

  const renderCheckboxs = (service, isCategory: boolean) => {
    const { name, isCheck } = service;

    const checkbox = checked => {
      handleClickCheckbox({ ...service, isCheck: checked }, isCategory);
    };

    return (
      <GridFormContainer key={name} item xs={6} sm={6} md={6}>
        <Input
          name={name}
          type="checkbox"
          label={translate(name)}
          changeHandler={checkbox}
          checked={isCheck}
        />
      </GridFormContainer>
    );
  };

  const submit = async (data: any, e: any) => {
    setLoading(true);
    e.preventDefault();

    // if (!(country && country.value)) {
    //   setError(translate("PLEASE_ENTER_COUNTRY"));
    //   setLoading(false);
    //   return;
    // }

    if (!typesAfter.length) {
      setError(translate("PLEASE_SELECT_AT_LEAST_ONE_SERVICE"));
      setLoading(false);
      return;
    }

    if (!categoriesAfter.length) {
      setError(translate("PLEASE_SELECT_AT_LEAST_ONE_CATEGORY"));
      setLoading(false);
      return;
    }

    if (!isContact && !schedules.length) {
      setError(translate("PLEASE_ADD_SCHEDULE"));
      setLoading(false);
      return;
    }

    if (typesAfter.includes("SHELTER")) {
      if (parseInt(data.totalBeds) < parseInt(data.availableBeds)) {
        setError(translate("AVAILABLE_BEDS_LESS_THAN"));
        setLoading(false);
        return;
      }
    }

    const newSchedules = schedules.map(sche => {
      delete sche.key;
      return { ...sche };
    });

    const newCloseSchedules = closeSchedules.map(clo => {
      delete clo.key;
      return { ...clo };
    });

    const obj = {
      ...data,
      isContact,
      isShowFlag: true,
      category: categoriesAfter,
      type: typesAfter,
      closeSchedules: isContact ? [] : newCloseSchedules,
      schedules: isContact ? [] : newSchedules,
      userEmail: current_user.email,
      isCriticalHeader: isCriticalHeader,
      isCriticalNeverExpire: isCriticalNeverExpire,
      criticalExpiredAt: parseTime(criticalExpiredAt, criticalExpiredTimeAt),
      country: "No data",
      state: "TX",
      managedUsers: managedUsers.map(obj => obj.value)
    };

    if (current_user.isAdmin) {
      obj.isShowDonate = isDonate;
      obj.isShowFlag = isFlag;
      obj.userEmail = data.userEmail || current_user.email;
    } else if (current_user.roles.includes(UserRole.SuperUser)) {
      obj.userEmail = data.userEmail || current_user.email;
    }

    if (obj.availableBeds === "") {
      delete obj.availableBeds;
    }

    if (obj.totalBeds === "") {
      delete obj.totalBeds;
    }

    if (props.isCreate) {
      const res = await createService(obj);
      if (res && res.id) {
        await handleApproveServices(res.id);
        dispatch(push("/manage_services"));
        dispatch({
          type: SET_MESSAGES_REDUCER,
          message: {
            type: "success",
            key: "ADDED_SUCCESSFULLY",
            message: translate("ADDED_SUCCESSFULLY")
          }
        });
        return;
      }
    } else {
      obj.id = initialValues.id;
      const res = await updateService(obj);
      if (res && res.id) {
        await handleApproveServices(res.id);
        dispatch(push("/manage_services"));
        dispatch({
          type: SET_MESSAGES_REDUCER,
          message: {
            type: "success",
            key: "UPDATE_SERVICE_SUCCESSFULLY",
            message: translate("UPDATE_SERVICE_SUCCESSFULLY")
          }
        });
        return;
      }
    }
    setError("");
    setLoading(false);
  };

  const handleApproveServices = async id => {
    if (current_user.roles.includes(UserRole.Administrator)) {
      await approveServices({
        services: [id]
      });
    }
  };

  const classes = styles();

  const addToSchedule = obj => {
    setSchedules([obj, ...schedules]);
  };

  const addToCloseSchedule = obj => {
    setCloseSchedules([obj, ...closeSchedules]);
  };

  const onDeleteSchedule = rowKey => {
    const newData = schedules.map((she, idx) => ({ ...she, key: idx }));
    const index = newData.findIndex(fa => fa.key === rowKey);
    newData.splice(index, 1);
    setSchedules(newData);
  };

  const onDeleteCloseSchedule = rowKey => {
    const newData = closeSchedules.map((she, idx) => ({
      ...she,
      key: idx
    }));
    const index = newData.findIndex(fa => fa.key === rowKey);
    newData.splice(index, 1);
    setCloseSchedules(newData);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    if (initialValues && initialValues.id) {
      reset({
        ...initialValues,
        availableBeds: !!initialValues.availableBeds
          ? initialValues.availableBeds
          : "",
        totalBeds: !!initialValues.totalBeds ? initialValues.totalBeds : ""
      });
      setSchedules(getSchedulesWithKey(initialValues.schedules));
      setCloseSchedules(getSchedulesWithKey(initialValues.closeSchedules));
      setTypes(tranformTypeCheckboxs(initialValues.type));
      setCategories(tranformCategoryCheckboxs(initialValues.category));
      setTypesAfter([...initialValues.type]);
      setCategoriesAfter([...initialValues.category]);
      setIsContact(initialValues.isContact);
      setIsFlag(initialValues.isShowFlag);
      setIsDonate(initialValues.isShowDonate);
      setIsCriticalHeader(initialValues.isCriticalHeader);
      setIsCriticalNeverExpire(initialValues.isCriticalNeverExpire);
      if (initialValues.criticalExpiredAt) {
        setCriticalExpiredAt(new Date(initialValues.criticalExpiredAt));
        setCriticalExpiredTimeAt(new Date(initialValues.criticalExpiredAt));
      }
      const users: any = initialValues.managedUsers;
      setManagedUsers(
        users.map((user: IUserProps) => ({
          label: user.email,
          value: user.id
        }))
      );

      // initialValues.country &&
      //   setCountry({
      //     label: initialValues.country,
      //     value: initialValues.country
      //   });
      return;
    }
    if (!current_user.isAdmin) setIsFlag(true);
    // eslint-disable-next-line
  }, [initialValues, isCreate]);

  const accessCreateHeader =
    current_user.isAdmin || current_user.roles.includes(UserRole.SuperUser);

  const filterUser = async value => {
    const data = await getUsersAPI({
      q: value,
      limit: 25,
      skip: 0,
      search: "name, email, phone, displayName"
    });
    return data.map(u => ({ label: u.email, value: u.id }));
  };

  const loadOptions = inputValue =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve(filterUser(inputValue));
      }, 1000);
    });

  const onChangeUsers = obj => {
    setManagedUsers(obj);
  };

  // const _loadOptions = _.debounce(filterUser, 500)

  return (
    <React.Fragment>
      <form name="form_service" onSubmit={handleSubmit(submit)}>
        <fieldset className={classes.fieldset}>
          <legend className={classes.legend}>Name</legend>
          <Input
            name="name"
            type="string"
            fullWidth
            placeholder={translate("PH_COMMUNITY_SERVICE_NAME")}
            label={translate("COMMUNITY_SERVICE_NAME")}
            validate={register({
              required: true
            })}
            error={errors.name}
          />
          {errors.name && errors.name.type === "required" && (
            <ErrorMessage>
              {translate("REQUIRED_INPUT_CTA", {
                value: translate("COMMUNITY_SERVICE_NAME")
              })}
            </ErrorMessage>
          )}
          <Input
            name="description"
            type="textarea"
            fullWidth
            placeholder={translate("DESC_LESS_THAN_VALUE", {
              value: 1000
            })}
            label={translate("DESCRIPTION")}
            validate={register({
              required: true,
              maxLength: 1000
            })}
            error={errors.description}
          />
          {errors.description && errors.description.type === "required" && (
            <ErrorMessage>
              {translate("PLEASE_ENTER_SERVICE_TYPE")}
            </ErrorMessage>
          )}
          {errors.description && errors.description.type === "maxLength" && (
            <ErrorMessage>
              {translate("DESC_LESS_THAN_VALUE", {
                value: 1000
              })}
            </ErrorMessage>
          )}
        </fieldset>
        <br />
        <fieldset className={classes.fieldset}>
          <legend className={classes.legend}>Address</legend>
          <Input
            name="address1"
            type="string"
            fullWidth
            placeholder={translate("PH_ADDRESS_1")}
            label={translate("ADDRESS_1")}
            validate={register({
              required: true
            })}
            error={errors.address1}
          />
          {errors.address1 && errors.address1.type === "required" && (
            <ErrorMessage>
              {translate("REQUIRED_INPUT_CTA", {
                value: translate("ADDRESS_1")
              })}
            </ErrorMessage>
          )}
          <Input
            name="address2"
            type="string"
            fullWidth
            placeholder={translate("PH_ADDRESS_2")}
            label={translate("ADDRESS_2")}
            validate={register({
              required: false
            })}
            error={errors.address2}
          />
          <Input
            name="city"
            type="string"
            fullWidth
            placeholder={translate("PH_CITY")}
            label={translate("CITY")}
            validate={register({
              required: true
            })}
            error={errors.city}
          />
          {errors.city && errors.city.type === "required" && (
            <ErrorMessage>
              {translate("REQUIRED_INPUT_CTA", {
                value: translate("CITY")
              })}
            </ErrorMessage>
          )}
          <Input
            name="state"
            type="string"
            fullWidth
            placeholder="TX"
            disabled
            label={translate("STATE")}
            validate={register({
              required: true
            })}
            error={errors.state}
          />

          {errors.state && errors.state.type === "required" && (
            <ErrorMessage>
              {translate("REQUIRED_INPUT_CTA", {
                value: translate("STATE")
              })}
            </ErrorMessage>
          )}
          <Input
            name="zip"
            type="string"
            fullWidth
            placeholder="79601"
            label={translate("ZIP")}
            validate={register({
              required: true
            })}
            error={errors.zip}
          />
          {errors.zip && errors.zip.type === "required" && (
            <ErrorMessage>
              {translate("REQUIRED_INPUT_CTA", {
                value: translate("ZIP")
              })}
            </ErrorMessage>
          )}
          {/* <Input
            name="country"
            type="select2"
            fullWidth
            label={translate("COUNTRY")}
            validate={register({
              required: true
            })}
            changeHandler={setCountry}
            value={country}
            options={country_list}
            placeholder={translate("PH_COUNTRY")}
            error={errors.country}
          />
          {errors.country && errors.country.type === "required" && (
            <ErrorMessage>{translate("PLEASE_ENTER_COUNTRY")}</ErrorMessage>
          )} */}
          <Input
            name="phone"
            type="phonenumber"
            fullWidth
            placeholder="(325) 555-0100"
            label={translate("PHONE")}
            validate={register({
              required: false
            })}
            error={errors.phone}
          />
          <Input
            name="contactEmail"
            type="contactEmail"
            fullWidth
            placeholder="name@your-nonprofit.org"
            label={translate("EMAIL")}
            validate={register({
              required: false,
              // eslint-disable-next-line
              pattern: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
            })}
            error={errors.contactEmail}
          />
          {errors.contactEmail && errors.contactEmail.type === "pattern" && (
            <ErrorMessage>
              {translate("EMAIL_MUST_BE_A_VALID_EMAIL")}
            </ErrorMessage>
          )}
          <Input
            name="website"
            type="string"
            fullWidth
            placeholder="https://your-nonprofit.org"
            label="WEBSITE"
            validate={register({
              required: false
            })}
            error={errors.website}
          />
        </fieldset>
        <br />
        <fieldset className={classes.fieldset}>
          <legend className={classes.legend}>
            {translate("SOCIAL_MEDIA_LINKS")}
          </legend>
          <Input
            name="facebook"
            type="string"
            fullWidth
            placeholder="https://www.facebook.com/abc.xyz"
            label="FACEBOOK"
            validate={register({
              required: false
            })}
            error={errors.facebook}
          />
          <Input
            name="twitter"
            type="string"
            fullWidth
            placeholder="https://www.twitter.com/abc.xyz"
            label="TWITTER"
            validate={register({
              required: false
            })}
            error={errors.twitter}
          />
          <Input
            name="instagram"
            type="string"
            fullWidth
            placeholder="https://www.instagram.com/abc.xyz"
            label="INSTAGRAM"
            validate={register({
              required: false
            })}
            error={errors.instagram}
          />
          <Input
            name="youtube"
            type="string"
            fullWidth
            placeholder="https://www.youtube.com/abc.xyz"
            label="YOUTUBE"
            validate={register({
              required: false
            })}
            error={errors.youtube}
          />
        </fieldset>
        <br />
        <fieldset className={classes.fieldset}>
          <legend className={classes.legend}>{translate("SERVICE")}</legend>
          <GridFullHeight container>
            {types.map(type => renderCheckboxs(type, false))}
          </GridFullHeight>
          {typesAfter.length > 0 && (
            <>
              <Input
                name="serviceSummary"
                type="string"
                fullWidth
                placeholder={translate("PH_SERVICE_DETAILS")}
                label={translate("SERVICE_DETAILS")}
                validate={register({
                  required: true
                })}
                error={errors.serviceSummary}
              />
              {errors.serviceSummary &&
                errors.serviceSummary.type === "required" && (
                  <ErrorMessage>
                    {translate("REQUIRED_INPUT_CTA", {
                      value: translate("SERVICE_DETAILS")
                    })}
                  </ErrorMessage>
                )}
            </>
          )}
          {typesAfter.includes("SHELTER") && (
            <>
              <Input
                name="totalBeds"
                type="number"
                fullWidth
                placeholder={translate("PH_TOTAL_BED")}
                label={translate("TOTAL_BEDS")}
                validate={register({
                  required: false,
                  min: 1
                })}
                error={errors.totalBeds}
              />
              {errors.totalBeds && errors.totalBeds.type === "min" && (
                <ErrorMessage>
                  {translate("MINIMUM_TOTAL_BEDS", {
                    value: 1
                  })}
                </ErrorMessage>
              )}
              <Input
                name="availableBeds"
                type="number"
                fullWidth
                placeholder={translate("PH_AVAILABLE_BEDS")}
                label={translate("AVAILABLE_BEDS")}
                validate={register({
                  required: false,
                  min: 0
                })}
                error={errors.availableBeds}
              />
              {errors.availableBeds && errors.availableBeds.type === "min" && (
                <ErrorMessage>
                  {translate("MINIMUM_AVAILABLE_BEDS", {
                    value: 0
                  })}
                </ErrorMessage>
              )}
            </>
          )}
        </fieldset>
        <br />
        <fieldset className={classes.fieldset}>
          <legend className={classes.legend}>{translate("CATEGORY")}</legend>
          <GridFullHeight container>
            {categories.map(category => renderCheckboxs(category, true))}
          </GridFullHeight>
        </fieldset>
        <br />
        <fieldset className={classes.fieldset}>
          <legend className={classes.legend}>{translate("AGE_GROUP")}</legend>
          <Input
            name="age"
            type="string"
            fullWidth
            placeholder={translate("PH_AGE_GROUP")}
            label=""
            validate={register({
              required: false
            })}
            error={errors.instagram}
          />
        </fieldset>
        <br />
        <fieldset className={classes.fieldset}>
          <legend className={classes.legend}>
            {translate("CONTACT_GROUP")}
          </legend>
          <Input
            name={"isContact"}
            type="checkbox"
            label={translate("IS_SHOW_CONTACT")}
            changeHandler={setIsContact}
            checked={isContact}
          />
        </fieldset>
        <br />
        {!isContact && (
          <>
            <fieldset className={classes.fieldset}>
              <legend className={classes.legend}>
                {translate("SCHEDULE")}
              </legend>
              <>
                <SchedulePanelForm
                  addToSchedule={addToSchedule}
                  schedules={tranformSchedulesForm(schedules)}
                  onDeleteSchedule={onDeleteSchedule}
                  defaultValues={defaultShedule}
                  register={register}
                  errors={errors}
                  getValues={getValues}
                  dispatch={dispatch}
                />
              </>
            </fieldset>
            <br />
            <fieldset className={classes.fieldset}>
              <legend className={classes.legend}>
                {translate("HOLIDAYS_CLOSED_DAYS")}
              </legend>
              <>
                <SchedulePanelForm
                  addToSchedule={addToCloseSchedule}
                  schedules={tranformSchedulesForm(closeSchedules)}
                  onDeleteSchedule={onDeleteCloseSchedule}
                  defaultValues={holiday}
                  register={register}
                  errors={errors}
                  close
                  getValues={getValues}
                  dispatch={dispatch}
                />
              </>
            </fieldset>
          </>
        )}
        <br />
        {accessCreateHeader && (
          <>
            <fieldset className={classes.fieldset}>
              <legend className={classes.legend}>
                {translate("CRITICAL_SERVICES")}
              </legend>
              <Input
                name={"isCriticalHeader"}
                type="checkbox"
                label={translate("ADD_THIS_HEADER")}
                changeHandler={setIsCriticalHeader}
                checked={isCriticalHeader}
              />
              <Input
                name={"criticalDescription"}
                type="string"
                label=""
                fullWidth
                placeholder={translate("CRITICAL_DESC")}
                validate={register({
                  required: isCriticalHeader
                })}
                error={errors.criticalDescription}
              />
              {errors.criticalDescription &&
                errors.criticalDescription.type === "required" && (
                  <ErrorMessage>
                    {translate("REQUIRED_INPUT_CTA", {
                      value: translate("CRITICAL_DESC")
                    })}
                  </ErrorMessage>
                )}
              {!isCriticalNeverExpire && (
                <>
                  <Input
                    name="expireDate"
                    type="date"
                    fullWidth
                    label={translate("EXPIRY_DATE")}
                    changeHandler={e => setCriticalExpiredAt(e)}
                    value={criticalExpiredAt}
                  />
                  <Input
                    name="expireTime"
                    type="time"
                    fullWidth
                    label={translate("EXPIRY_TIME")}
                    changeHandler={e => setCriticalExpiredTimeAt(e)}
                    value={criticalExpiredTimeAt}
                  />
                </>
              )}
              <Input
                name={"isCriticalNeverExpire"}
                type="checkbox"
                label={translate("NEVER_EXPIRIES")}
                changeHandler={setIsCriticalNeverExpire}
                checked={isCriticalNeverExpire}
              />
            </fieldset>
            <br />
          </>
        )}
        <fieldset className={classes.fieldset}>
          <legend className={classes.legend}>
            {translate("FLAG_AND_DONATE")}
          </legend>
          <Input
            name={"isFlag"}
            type="checkbox"
            label={translate("IS_SHOW_FLAG")}
            changeHandler={setIsFlag}
            checked={isFlag}
          />
          {!!current_user.isAdmin && (
            <Input
              name={"isDonate"}
              type="checkbox"
              label={translate("IS_SHOW_DONATE")}
              changeHandler={setIsDonate}
              checked={isDonate}
            />
          )}
        </fieldset>
        <br />
        {current_user.isAdmin && (
          <>
            <fieldset className={classes.fieldset}>
              <legend className={classes.legend}>
                {translate("OWNED_BY")}
              </legend>
              <Input
                name="userEmail"
                type="email"
                fullWidth
                placeholder="name@your-nonprofit.org"
                label=""
                validate={register({
                  required: false,
                  // eslint-disable-next-line
                  pattern: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
                })}
                error={errors.userEmail}
              />
              {errors.userEmail && errors.userEmail.type === "pattern" && (
                <ErrorMessage>
                  {translate("EMAIL_MUST_BE_A_VALID_EMAIL")}
                </ErrorMessage>
              )}
            </fieldset>
            <br />
            <fieldset className={classes.fieldset}>
              <legend className={classes.legend}>
                {translate("MANAGED_USERS")}
              </legend>
              <Input
                name="managedUsers"
                type="select2async"
                fullWidth
                label=""
                value={managedUsers}
                loadOptions={loadOptions}
                changeHandler={onChangeUsers}
              />
            </fieldset>
          </>
        )}
        {!current_user.isAdmin &&
          current_user.roles.includes(UserRole.SuperUser) && (
            <>
              <br />
              <fieldset className={classes.fieldset}>
                <legend className={classes.legend}>
                  {translate("MANAGED_USERS")}
                </legend>
                <Input
                  name="managedUsers"
                  type="select2async"
                  fullWidth
                  label=""
                  value={managedUsers}
                  loadOptions={loadOptions}
                  changeHandler={onChangeUsers}
                />
              </fieldset>
            </>
          )}
        {error && <Alert severity="error">{error}</Alert>}
        <Grid
          style={{ paddingTop: "20px" }}
          container
          spacing={1}
          direction="row"
        >
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <ButtonGroup fullWidth>
              <SubmitButton
                disabled={loading}
                type="submit"
                variant="contained"
              >
                {loading ? (
                  <img alt="loading" src={imgLoading} width="30px" />
                ) : isCreate ? (
                  translate("ADD_SERVICE")
                ) : (
                  translate("UPDATE_SERVICE")
                )}
              </SubmitButton>
            </ButtonGroup>
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
});

export default connect(mapStateToProps)(NewService);
