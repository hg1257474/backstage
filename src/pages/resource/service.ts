import request from 'umi-request';
import {
  IndexCategoryListItemDataType,
  IndexTermListItemDataType,
  PriceListItemDataType,
} from './data.d';
interface Params {
  partSelected: {};
  current?: number;
}
const url = 'http://192.168.0.29:7001';
// const url = 'https://www.huishenghuo.net';
type ParamsType = IndexCategoryListItemDataType | IndexTermListItemDataType | PriceListItemDataType;
export async function getList(params: Params) {
  return request(url + '/backstage/resource', {
    mode: 'cors',
    params,
  });
}

export async function deleteItem(params: Params) {
  console.log(params);
  return request(url + '/backstage/resource', {
    mode: 'cors',
    method: 'DELETE',
    params,
  });
}

export async function updateItem(arg: any) {
  console.log(arg);
  return request(url + '/backstage/resource', {
    mode: 'cors',
    method: 'PUT',
    ...arg,
  });
}

export async function newItem(arg: any) {
  return request(url + '/backstage/resource', {
    mode: 'cors',
    method: 'POST',
    ...arg,
  });
}
export async function getIndexPageTermTotal(category: number) {
  return request(url + '/backstage/resource/index_page_term_total', {
    mode: 'cors',
    params: { category },
  });
}
export async function getIndexPageCategoryTotal() {
  return request(url + '/backstage/resource/index_page_category_total', {
    mode: 'cors',
  });
}
export async function getIndexPageCategories() {
  return request(url + '/backstage/resource/index_page_categories', {
    mode: 'cors',
  });
}
