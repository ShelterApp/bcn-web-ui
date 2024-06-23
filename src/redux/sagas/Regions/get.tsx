import { call, put, takeLatest, select } from "redux-saga/effects";
import { getRegions } from "api/regions";
import * as types from "redux/reducers/service/actionTypes";
import { SKIP } from "common/";
import { Region as RegionProp } from "@fywinnv/core";

export const getCurrentRegions = state => state.service.regions;

const LIMIT = "1000";

const initQueryCL = {
  sort: "type",
  direction: "ASC",
  limit: LIMIT,
  skip: SKIP
};

function* getRegionsSaga(action) {
  try {
    yield put({ type: types.SET_LOADING, loading: true });
    const { params } = action;
    const query = {
      ...initQueryCL,
      ...params
    };

    let regions = yield call(getRegions, query);

    if (regions.length === LIMIT) {
      yield put({ type: types.SET_CAN_LOADING_MORE, canLoadmore: true });
    } else if (regions.length < LIMIT) {
      yield put({ type: types.SET_CAN_LOADING_MORE, canLoadmore: false });
    }

    yield put({ type: types.SET_REGIONS, regions });
    yield put({ type: types.SET_LOADING, loading: false });
  } catch (error) {
    return Promise.reject(error);
  }
}

function* loadmoreRegions(action) {
  try {
    const { params } = action;
    const data: RegionProp[] = yield select(getCurrentRegions);
    yield put({ type: types.SET_LOADING_MORE, loadingMore: true });
    const query = {
      ...initQueryCL,
      ...params,
      skip: data.length
    };

    let regions = yield call(getRegions, query);

    if (regions.length === LIMIT) {
      yield put({ type: types.SET_CAN_LOADING_MORE, canLoadmore: true });
    } else if (regions.length < LIMIT) {
      yield put({ type: types.SET_CAN_LOADING_MORE, canLoadmore: false });
    }
    yield put({ type: types.UPDATE_REGIONS, regions });
    yield put({ type: types.SET_LOADING_MORE, loadingMore: false });
  } catch (error) {
    return Promise.reject(error);
  }
}

export function* listRegions() {
  yield takeLatest(types.GET_REGIONS_REQUEST, getRegionsSaga);
  yield takeLatest(types.LOADMORE_REGIONS_REQUEST, loadmoreRegions);
}
