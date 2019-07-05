import request from 'umi-request';
import {
  IndexCategoryListItemDataType,
  IndexTermListItemDataType,
  PriceListItemDataType,
} from './data.d';
interface Params {
  partSelected: {}
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
  console.log(params)
  return request('/api/fake_list', {
    method: 'PUT',
      ...params,
  });
}

export async function postList(params: ParamsType) {
  console.log(params)
  return request('/api/fake_list', {
    method: 'POST',
      ...params,
  });
}
export async function getIndexPageTermCount(category:number){
  return request('/backstage/static/index_page/term/count',{
    params:{category}
  })
}
export async function getIndexPageCategoryCount(){
  return request('/backstage/static/index_page/category/count')
}
export async function getIndexPageCategories(){
  return request('/backstage/static/index_page/categories')
}
