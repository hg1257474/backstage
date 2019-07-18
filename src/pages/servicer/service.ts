import request from 'umi-request';
const url = 'http://192.168.0.29:7001';
export async function fakeSubmitForm(params: any) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}
export async function updateServicers({ params, data }: { params: any; data: any }) {
  console.log(data, params);
  params.currentPage = params.pagination.current;
  delete params.pagination;
  const { method } = data;
  delete data.method;
  return request(url + `/backstage/servicer/${data.id || 'new'}`, {
    mode: 'cors',
    method,
    data,
    params,
  });
}
export async function getServicer(id: string) {
  return request(url + `/backstage/servicer/${id}`, { mode: 'cors' });
}
export async function getServicers(params: any) {
  console.log(params);
  params.currentPage = params.pagination.current;
  delete params.pagination;
  if (!params.allName || params.allName === 'undefined') delete params.allName;
  if (params.sortOrder) params.sortOrder = params.sortOrder === 'ascend' ? 1 : -1;
  return request(url + '/backstage/servicer', { params, mode: 'cors' });
}
