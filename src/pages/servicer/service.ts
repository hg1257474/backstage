import request from 'umi-request';
const url = 'http://192.168.0.29:7001';
export async function fakeSubmitForm(params: any) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}
export async function getServicers(params: any) {
  console.log(params);
  return request(url + '/backstage/servicer', { params, mode: 'cors' });
}
