import { call, put, takeLatest, select } from "redux-saga/effects";
import { getUnitDetail, deleteUnit } from "api/units";
import * as types from "redux/reducers/service/actionTypes";
import { SET_MESSAGES_REDUCER } from "redux/reducers/messages/actionTypes";
import { groupUnits } from "common";
import i18n from "i18n";

function* getUnit(action) {
  try {
    yield put({ type: types.SET_LOADING, loading: true });

    let unit = yield call(getUnitDetail, action.id);

    yield put({ type: types.SET_UNIT, unit });
    yield put({ type: types.SET_LOADING, loading: false });
  } catch (error) {
    return Promise.reject(error);
  }
}

export const getUnits = state => state.service.units;

function* fdeleteUnit(action) {
  try {
    const { id } = action;
    const units: any[] = yield select(getUnits);
    let newUnits = [...units];
    var i = units.findIndex(s => s.id === id);
    if (i > -1) {
      newUnits.splice(i, 1);
    }

    const data = groupUnits(newUnits);

    yield put({ type: types.SET_UNITS, units: newUnits });
    yield put({ type: types.SET_GROUP_UNITS, groupUnits: data });
    yield call(deleteUnit, id);
    yield put({
      type: SET_MESSAGES_REDUCER,
      message: {
        type: "success",
        key: "",
        message: i18n.t("DELETE_COORDINATOR_SUCCESSFUL")
      }
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

export function* unitDetail() {
  yield takeLatest(types.GET_UNIT_REQUEST, getUnit);
  yield takeLatest(types.DELETE_UNIT_REQUEST, fdeleteUnit);
}
