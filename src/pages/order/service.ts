import request from 'umi-request';
interface Params {
  page: number;
}
const url = 'http://192.168.0.29:7001';
export async function getOrders(params: any) {
  console.log(params);
  Object.keys(params).forEach(item => {
    if (params[item] === 'false' || !params[item]) delete params[item];
    else if (params[item] === 'ascend') params[item] = 1;
    else if (params[item] === 'descend') params[item] = -1;
    else if (item === 'isNameFiltered') {
      params.nameFilter = params[item];
      delete params[item];
    } else if (item === 'isUpdatedAtFiltered') {
      params.updatedAtFilter = params[item];
      delete params[item];
    }
  });
  return request(`${url}/backstage/order`, {
    params,
    mode: 'cors',
  });
}
