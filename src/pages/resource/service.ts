import request from 'umi-request';
import {
  IndexCategoryListItemDataType,
  IndexTermListItemDataType,
  PriceListItemDataType,
} from './data.d';
import { SelectedPage } from './index';
interface Params {
  index: number;
  target: SelectedPage;
  current?: number;
}
type ParamsType = IndexCategoryListItemDataType | IndexTermListItemDataType | PriceListItemDataType;
export async function getList(params: Params) {
  return request('/api/fake_list', {
    params,
  });
}

export async function deleteList(params: Params) {
  console.log(params);
  return request('/api/fake_list', {
    method: 'DELETE',
    params,
  });
}

export async function putList(params: ParamsType) {
  return request('/api/fake_list', {
    method: 'PUT',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function postList(params: ParamsType) {
  return request('/api/fake_list', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
