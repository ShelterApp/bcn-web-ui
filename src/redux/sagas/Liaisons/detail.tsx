import { call, put, takeLatest, select } from "redux-saga/effects";
import { getLiaisonDetail, deleteLiaison } from "api/liaisons";
import * as types from "redux/reducers/service/actionTypes";
import { SET_MESSAGES_REDUCER } from "redux/reducers/messages/actionTypes";
import { groupLiaisons } from "common";
import i18n from "i18n";

function* getLiaison(action) {
  try {
    yield put({ type: types.SET_LOADING, loading: true });

    let liaison = yield call(getLiaisonDetail, action.id);

    yield put({ type: types.SET_LIAISON, liaison });
    yield put({ type: types.SET_LOADING, loading: false });
  } catch (error) {
    return Promise.reject(error);
  }
}

export const getLiaisons = state => state.service.liaisons;

function* fdeleteLiaison(action) {
  try {
    const { id } = action;
    const liaisons: any[] = yield select(getLiaisons);
    let newLiaisons = [...liaisons];
    var i = liaisons.findIndex(s => s.id === id);
    if (i > -1) {
      newLiaisons.splice(i, 1);
    }

    const data = groupLiaisons(newLiaisons);

    yield put({ type: types.SET_GROUP_LIAISONS, groupLiaisons: data });
    yield put({ type: types.SET_LIAISONS, liaisons: newLiaisons });
    yield call(deleteLiaison, id);
    yield put({
      type: SET_MESSAGES_REDUCER,
      message: {
        type: "success",
        key: "",
        message: i18n.t("DELETE_LIAISON_SUCCESSFUL")
      }
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

export function* liaisonDetail() {
  yield takeLatest(types.GET_LIAISON_REQUEST, getLiaison);
  yield takeLatest(types.DELETE_LIAISON_REQUEST, fdeleteLiaison);
}
