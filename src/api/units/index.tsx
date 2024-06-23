import axios from "../configApi";
import { removeEmptyObject } from "common/helpers";

export const getUnits = async params => {
  try {
    const res = await axios.get(`/units`, {
      params: removeEmptyObject({ ...params, populate: "region" })
    });

    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateUnit = async obj => {
  try {
    const res = await axios.put(`/units/${obj.id}`, obj);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

export const createUnit = async obj => {
  try {
    const res = await axios.post(`/units`, obj);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getUnitDetail = async id => {
  try {
    const res = await axios.get(`/units/${id}`, {
      params: { populate: "region" }
    });

    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteUnit = async id => {
  try {
    const res = await axios.delete(`/units/${id}`);

    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
