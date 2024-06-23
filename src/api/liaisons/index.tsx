import axios from "../configApi";
import { removeEmptyObject } from "common/helpers";

export const getLiaisons = async params => {
  try {
    const res = await axios.get(`/liaisons`, {
      params: removeEmptyObject(params)
    });

    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateLiaison = async obj => {
  try {
    const res = await axios.put(`/liaisons/${obj.id}`, obj);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

export const createLiaison = async obj => {
  try {
    const res = await axios.post(`/liaisons`, obj);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getLiaisonDetail = async id => {
  try {
    const res = await axios.get(`/liaisons/${id}`);

    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteLiaison = async id => {
  try {
    const res = await axios.delete(`/liaisons/${id}`);

    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
