import request from 'umi-request';
import {
  IndexCategoryListItemDataType,
  IndexTermListItemDataType,
  PriceListItemDataType,
} from './data.d';
import axios from 'axios';
import { SelectedPage } from './index';
const sendRequest = async (data: any) => {
  console.log(data);
  try {
    const res = await axios.post('http://192.168.0.29:7001/resource/upload', data, {
      withCredentials: true,
    });
    console.log(res);
    console.log('34124234');
  } catch (e) {
    console.log(e);
  }
};
export const add = (data: any) => {
  sendRequest({ ...data, action: 'add' });
};
export const remove = (data: any) => {
  sendRequest({ ...data, action: 'remove' });
};
export const update = (data: any) => {
  sendRequest({ ...data, action: 'update' });
};
interface Params{ index: number; selectedPage:SelectedPage,current?:number}
type ParamsType = IndexCategoryListItemDataType | IndexTermListItemDataType | PriceListItemDataType;
export async function queryFakeList(params:Params) {
  return request('/api/fake_list', {
    params,
  });
}

export async function removeFakeList(params: Params) {
  return request('/api/fake_list_test', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addFakeList(params: ParamsType) {
  return request('/api/fake_list', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateFakeList(params: ParamsType) {
  return request('/api/fake_list', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
