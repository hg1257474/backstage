import request from 'umi-request';
import { IndexListItemDataType, PaymentListItemDataType } from './data.d';
import axios from 'axios';
const sendRequest = async (data: any) => {
  console.log(data);
  try {
    const res = await axios.post('http://192.168.0.29:7001/resource/upload', data, {
      withCredentials: true,
    });
    console.log(res);
    console.log("34124234")
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
interface ParamsType extends Partial<IndexListItemDataType | PaymentListItemDataType> {
  count?: number;
}

export async function queryFakeList(params: ParamsType) {
  return request('/api/fake_list', {
    params,
  });
}

export async function removeFakeList(params: ParamsType) {
  const { count = 5, ...restParams } = params;
  return request('/api/fake_list', {
    method: 'POST',
    params: {
      count,
    },
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params: ParamsType) {
  const { count = 5, ...restParams } = params;
  return request('/api/fake_list', {
    method: 'POST',
    params: {
      count,
    },
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params: ParamsType) {
  const { count = 5, ...restParams } = params;
  return request('/api/fake_list', {
    method: 'POST',
    params: {
      count,
    },
    data: {
      ...restParams,
      method: 'update',
    },
  });
}
