import { takeLatest, put } from "redux-saga/effects";
import * as types from "redux/reducers/auth/actionTypes";
import { SET_MESSAGES_REDUCER } from "redux/reducers/messages/actionTypes";
import { setToken } from "api/configApi";
// import Cookie from 'js-cookie';
import i18n from "i18n";

function* loginFunction(action) {
  try {
    const { current_user } = action;
    setToken(current_user.token);
    yield put({
      type: types.SET_CURRENT_USER,
      current_user: {
        ...current_user,
        isLogin: true
      }
    });
    yield put({
      type: SET_MESSAGES_REDUCER,
      message: {
        type: "success",
        key: "WELCOME_BACK_WITH_USER",
        message: i18n.t("WELCOME_BACK_WITH_USER", { value: current_user.email })
      }
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

function* logoutFunction(action) {
  try {
    setToken("");
    yield put({
      type: types.CLEAR_AUTH
    });
    yield put({
      type: SET_MESSAGES_REDUCER,
      message: {
        type: "success",
        key: "SIGNED_OUT_SUCCESSFULLY",
        message: i18n.t("SIGNED_OUT_SUCCESSFULLY")
      }
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

function* Login() {
  yield takeLatest(types.LOGIN_REQUEST, loginFunction);
  yield takeLatest(types.LOGOUT_REQUEST, logoutFunction);
}

export default Login;
