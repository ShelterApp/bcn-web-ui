import { all } from "redux-saga/effects";
import getServices from "./getServices";
import likeService from "./likeService";
import getCurrentLocation from "./setCurrentLocation";
import getServiceDetail from "./getDetailService";
import getMyFavorites from "./myFavorites";
import getCrisisLines from "./getCrisisLines";
import deleteService from "./deleteService";
import getFeedbacks from "./getFeedbacks";
import getCrisisLineDetail from "./getDetailCrisisLine";
import availableBeds from "./availableBeds";
import listUsers from "./getListUsers";
import { listLiaisons, liaisonDetail } from "../Liaisons";
import { listRegions, regionDetail } from "../Regions";
import { listUnits, unitDetail } from "../Units";

export const serviceSaga = function* root() {
  yield all([
    getServices(),
    likeService(),
    getCurrentLocation(),
    getServiceDetail(),
    getMyFavorites(),
    getCrisisLines(),
    deleteService(),
    getFeedbacks(),
    getCrisisLineDetail(),
    availableBeds(),
    listUsers(),
    listLiaisons(),
    liaisonDetail(),
    listRegions(),
    regionDetail(),
    listUnits(),
    unitDetail()
  ]);
};
