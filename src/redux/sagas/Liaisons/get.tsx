import { call, put, takeLatest, select } from "redux-saga/effects";
import { getLiaisons } from "api/liaisons";
import * as types from "redux/reducers/service/actionTypes";
import { SKIP } from "common/";
import { Liaison as LiaisonProp } from "@fywinnv/core";
import { groupLiaisons } from "common";

export const getCurrentLiaisons = state => state.service.liaisons;
const LIMIT = 2000;
const initQueryCL = {
  sort: "country",
  direction: "ASC",
  limit: LIMIT,
  skip: SKIP
};

function* getLiaisonsSaga(action) {
  try {
    yield put({ type: types.SET_LOADING, loading: true });
    const { params } = action;
    const query = {
      ...initQueryCL,
      ...params,
      sort: "country"
    };

    let liaisons = yield call(getLiaisons, query);

    if (liaisons.length === LIMIT) {
      yield put({ type: types.SET_CAN_LOADING_MORE, canLoadmore: true });
    } else if (liaisons.length < LIMIT) {
      yield put({ type: types.SET_CAN_LOADING_MORE, canLoadmore: false });
    }

    const data = groupLiaisons(liaisons);

    yield put({ type: types.SET_GROUP_LIAISONS, groupLiaisons: data });
    yield put({ type: types.SET_LIAISONS, liaisons });
    yield put({ type: types.SET_LOADING, loading: false });
  } catch (error) {
    return Promise.reject(error);
  }
}

function* loadmoreLiaisons(action) {
  try {
    const { params } = action;
    const data: LiaisonProp[] = yield select(getCurrentLiaisons);
    yield put({ type: types.SET_LOADING_MORE, loadingMore: true });
    const query = {
      ...initQueryCL,
      ...params,
      skip: data.length
    };

    let liaisons = yield call(getLiaisons, query);

    if (liaisons.length === LIMIT) {
      yield put({ type: types.SET_CAN_LOADING_MORE, canLoadmore: true });
    } else if (liaisons.length < LIMIT) {
      yield put({ type: types.SET_CAN_LOADING_MORE, canLoadmore: false });
    }
    yield put({ type: types.UPDATE_LIAISONS, liaisons });
    yield put({ type: types.SET_LOADING_MORE, loadingMore: false });
  } catch (error) {
    return Promise.reject(error);
  }
}

export function* listLiaisons() {
  yield takeLatest(types.GET_LIAISONS_REQUEST, getLiaisonsSaga);
  yield takeLatest(types.LOADMORE_LIAISONS_REQUEST, loadmoreLiaisons);
}
