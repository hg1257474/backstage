import request from 'umi-request';
interface Params{
  page:number
}
export async function get(params:Params) {
  return request('/backstage/orders', {
    params,
  });
}
