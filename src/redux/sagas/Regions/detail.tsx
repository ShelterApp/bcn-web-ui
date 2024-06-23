import { call, put, takeLatest, select } from "redux-saga/effects";
import { getRegionDetail, deleteRegion } from "api/regions";
import * as types from "redux/reducers/service/actionTypes";
import { SET_MESSAGES_REDUCER } from "redux/reducers/messages/actionTypes";
import i18n from "i18n";

function* getRegion(action) {
  try {
    yield put({ type: types.SET_LOADING, loading: true });

    let region = yield call(getRegionDetail, action.id);

    yield put({ type: types.SET_REGION, region });
    yield put({ type: types.SET_LOADING, loading: false });
  } catch (error) {
    return Promise.reject(error);
  }
}

export const getRegions = state => state.service.regions;

function* fdeleteRegion(action) {
  try {
    const { id } = action;
    const regions: any[] = yield select(getRegions);
    let newRegions = [...regions];
    var i = regions.findIndex(s => s.id === id);
    if (i > -1) {
      newRegions.splice(i, 1);
    }

    yield put({ type: types.SET_REGIONS, regions: newRegions });
    yield call(deleteRegion, id);
    yield put({
      type: SET_MESSAGES_REDUCER,
      message: {
        type: "success",
        key: "",
        message: i18n.t("DELETE_REGION_SUCCESSFUL")
      }
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

export function* regionDetail() {
  yield takeLatest(types.GET_REGION_REQUEST, getRegion);
  yield takeLatest(types.DELETE_REGION_REQUEST, fdeleteRegion);
}
