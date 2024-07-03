import { call, put, takeLatest, select } from "redux-saga/effects";
import { getUnits } from "api/units";
import * as types from "redux/reducers/service/actionTypes";
import { SKIP } from "common/";
import { Unit as IUnit } from "@bcn/core";
import { groupUnits } from "common";

export const getCurrentUnits = state => state.service.units;

const LIMIT = "1000";

const initQueryCL = {
  sort: "type",
  direction: "ASC",
  limit: LIMIT,
  skip: SKIP
};

function* getUnitsSaga(action) {
  try {
    yield put({ type: types.SET_LOADING, loading: true });
    const { params } = action;
    const query = {
      ...initQueryCL,
      ...params
    };

    let units = yield call(getUnits, query);

    if (units.length === LIMIT) {
      yield put({ type: types.SET_CAN_LOADING_MORE, canLoadmore: true });
    } else if (units.length < LIMIT) {
      yield put({ type: types.SET_CAN_LOADING_MORE, canLoadmore: false });
    }

    const data = groupUnits(units);

    yield put({ type: types.SET_UNITS, units: units });
    yield put({ type: types.SET_GROUP_UNITS, groupUnits: data });
    yield put({ type: types.SET_LOADING, loading: false });
  } catch (error) {
    return Promise.reject(error);
  }
}

function* loadmoreUnits(action) {
  try {
    const { params } = action;
    const data: IUnit[] = yield select(getCurrentUnits);
    yield put({ type: types.SET_LOADING_MORE, loadingMore: true });
    const query = {
      ...initQueryCL,
      ...params,
      skip: data.length
    };

    let regions = yield call(getUnits, query);

    if (regions.length === LIMIT) {
      yield put({ type: types.SET_CAN_LOADING_MORE, canLoadmore: true });
    } else if (regions.length < LIMIT) {
      yield put({ type: types.SET_CAN_LOADING_MORE, canLoadmore: false });
    }
    yield put({ type: types.UPDATE_UNITS, regions });
    yield put({ type: types.SET_LOADING_MORE, loadingMore: false });
  } catch (error) {
    return Promise.reject(error);
  }
}

export function* listUnits() {
  yield takeLatest(types.GET_UNITS_REQUEST, getUnitsSaga);
  yield takeLatest(types.LOADMORE_UNITS_REQUEST, loadmoreUnits);
}
