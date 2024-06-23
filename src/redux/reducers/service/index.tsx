import produce from "immer";
import * as types from "./actionTypes";
import {
  QueryServiceProps,
  initQuery,
  initQuerySearch,
  ServiceProps
} from "common/";
import { User, CrisisLine, Liaison, Region, Unit } from "@fywinnv/core";
import { Feedback } from "@fywinnv/core/dist/models";

export interface ICoords {
  latitude: number;
  longitude: number;
}

export interface ServiceReducer {
  data: ServiceProps[];
  loading: boolean;
  loadingMore: boolean;
  loadingLocation: boolean;
  queryData: QueryServiceProps;
  queryDataMS: QueryServiceProps;
  queryDataSearch: QueryServiceProps;
  currentLocation: ICoords;
  canLoadmore: boolean;
  myFavorites: ServiceProps[];
  crisis_lines: CrisisLine[];
  liaisons: Liaison[];
  liaison: Liaison;
  regions: Region[];
  region: Region;
  feedbacks: Feedback[];
  lineDetail: CrisisLine;
  critical_header_services: ServiceProps[];
  users: User[];
  user: User;
  groupLiaisons: any;
  groupUnits: any;
  units: Unit[];
  unit: Unit;
}

const currentLocation = sessionStorage.getItem("@fywinnv_current_location");

const initial = {
  data: [] as ServiceProps[],
  loading: false,
  loadingMore: false,
  loadingLocation: false,
  queryData: initQuery,
  queryDataMS: {},
  queryDataSearch: initQuerySearch,
  currentLocation: currentLocation
    ? JSON.parse(currentLocation)
    : {
        latitude: 0,
        longitude: 0
      },
  canLoadmore: false,
  myFavorites: [] as ServiceProps[],
  crisis_lines: [] as CrisisLine[],
  liaisons: [] as Liaison[],
  liaison: {} as Liaison,
  regions: [] as Region[],
  region: {} as Region,
  feedbacks: [] as Feedback[],
  lineDetail: {} as CrisisLine,
  critical_header_services: [] as ServiceProps[],
  users: [] as User[],
  user: {} as User,
  groupLiaisons: {},
  groupUnits: {},
  units: [] as Unit[],
  unit: {} as Unit
} as ServiceReducer;

export const serviceReducer = (state = initial, action: any) =>
  produce(state, draft => {
    switch (action.type) {
      case types.GET_SERVICES:
        draft.data = action.services;
        break;
      case types.SET_LOADING:
        draft.loading = action.loading;
        break;
      case types.SET_QUERY_SERVICE:
        draft.queryData = action.queryData;
        break;
      case types.SET_CURRENT_LOCATION:
        draft.currentLocation = action.currentLocation;
        break;
      case types.SET_LOADING_MORE:
        draft.loadingMore = action.loadingMore;
        break;
      case types.SET_CAN_LOADING_MORE:
        draft.canLoadmore = action.canLoadmore;
        break;
      case types.SET_LOADING_LOCATION:
        draft.loadingLocation = action.loading;
        break;
      case types.UPDATE_LIST_SERVICES:
        draft.data = [...draft.data, ...action.services];
        break;
      case types.SET_MY_FAVORITES:
        draft.myFavorites = action.services;
        break;
      case types.SET_CRISIS_LINES:
        draft.crisis_lines = action.crisis_lines;
        break;
      case types.UPDATE_CRISIS_LINES:
        draft.crisis_lines = [...draft.crisis_lines, ...action.crisis_lines];
        break;
      case types.SET_USERS:
        draft.users = action.users;
        break;
      case types.UPDATE_USERS:
        draft.users = [...draft.users, ...action.users];
        break;
      case types.SET_QUERY_SEARCH_SERVICE:
        draft.queryDataSearch = action.queryDataSearch;
        break;
      case types.SET_QUERY_MANAGE_SERVICE:
        draft.queryDataMS = action.queryDataMS;
        break;
      case types.SET_FEEDBACKS:
        draft.feedbacks = action.feedbacks;
        break;
      case types.UPDATE_FEEDBACKS:
        draft.feedbacks = [...draft.feedbacks, ...action.feedbacks];
        break;
      case types.SET_CRISISLINE_DETAIL:
        draft.lineDetail = action.crisis_line;
        break;
      case types.SET_CRITICAL_HEADER:
        draft.critical_header_services = action.services;
        break;
      case types.SET_USER_DETAIL:
        draft.user = action.user;
        break;
      case types.SET_LIAISONS:
        draft.liaisons = action.liaisons;
        break;
      case types.SET_GROUP_LIAISONS:
        draft.groupLiaisons = action.groupLiaisons;
        break;
      case types.UPDATE_LIAISONS:
        draft.liaisons = [...draft.liaisons, ...action.liaisons];
        break;
      case types.SET_LIAISON:
        draft.liaison = action.liaison;
        break;
      case types.SET_REGIONS:
        draft.regions = action.regions;
        break;
      case types.UPDATE_REGIONS:
        draft.regions = [...draft.regions, ...action.regions];
        break;
      case types.SET_REGION:
        draft.region = action.region;
        break;
      case types.SET_GROUP_UNITS:
        draft.groupUnits = action.groupUnits;
        break;
      case types.SET_UNITS:
        draft.units = action.units;
        break;
      case types.SET_UNIT:
        draft.unit = action.unit;
        break;
      case types.UPDATE_UNITS:
        draft.units = [...draft.units, ...action.units];
        break;
      default:
        return draft;
    }
    return draft;
  });
