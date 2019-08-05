import request from 'umi-request';
// const url = 'http://192.168.0.29:7001';
const url = 'https://www.cyfwg.com';
export async function updateServicers({
  params,
  data,
  method,
}: {
  params: any;
  data: any;
  method: string;
}) {
  console.log(111);
  console.log(params, data, method);
  Object.keys(params).forEach(item => {
    if (
      params[item] === undefined ||
      params[item] === false ||
      params[item] === null ||
      (params[item] instanceof Array && !params[item].length)
    )
      delete params[item];
  });
  console.log('fuck');

  if (data.privilege)
    Object.values(data.privilege).forEach((item, index) => {
      if (!index) data.privilege = {};
      data.privilege[item] = true;
    });

  console.log('fuck');
  console.log(data);
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
  if (!params.allName || params.allName === 'undefined') delete params.allName;
  if (params.sortOrder) params.sortOrder = params.sortOrder === 'ascend' ? 1 : -1;
  return request(url + '/backstage/servicer', { params, mode: 'cors' });
}
