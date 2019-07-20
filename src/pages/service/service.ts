import request from 'umi-request';
const url = 'http://192.168.0.29:7001';
export async function getServices(params: any) {
  return request('/backstage/service', {
    params,
  });
}
