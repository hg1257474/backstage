import request from 'umi-request';
interface Params {
  page: number;
}
export async function getOrders(params: any) {
  return request('/backstage/orders', {
    params,
    mode: 'cors',
  });
}
