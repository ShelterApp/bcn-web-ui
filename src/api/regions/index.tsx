import axios from "../configApi";
import { removeEmptyObject } from "common/helpers";

export const getRegions = async params => {
  try {
    const res = await axios.get(`/regions`, {
      params: removeEmptyObject(params)
    });

    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateRegion = async obj => {
  try {
    const res = await axios.put(`/regions/${obj.id}`, obj);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

export const createRegion = async obj => {
  try {
    const res = await axios.post(`/regions`, obj);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getRegionDetail = async id => {
  try {
    const res = await axios.get(`/regions/${id}`);

    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteRegion = async id => {
  try {
    const res = await axios.delete(`/regions/${id}`);

    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
