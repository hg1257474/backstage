/*
import request from 'umi-request';
const url = 'http://192.168.0.29:7001';
export async function getConclusions(params: any) {
  console.log(params);
  Object.keys(params).forEach(item => {
    if (params[item] === 'false' || !params[item]) delete params[item];
    else if (params[item] === 'ascend') params[item] = 1;
    else if (params[item] === 'descend') params[item] = -1;
    else if (item === 'isNameFiltered') {
      params.nameFilter = params[item]
        .replace('咨询', 'communication')
        .replace('合同', 'contract')
        .replace('起草', 'draft')
        .replace('审核', 'review');
      console.log(params.nameFilter);
      params.nameFilter = params.nameFilter.split(/\s/);
      delete params[item];
    } else if (item === 'isUpdatedAtFiltered') {
      params.updatedAtFilter = params[item];
      delete params[item];
    } else if (item == 'isStatusFiltered') {
      params.statusFilter = params[item];
      delete params[item];
    }
  });
  return request(`${url}/backstage/conclusion`, {
    mode: 'cors',
    params,
  });
}
*/
import getCURD from '../../services/curd';
export const getConclusions = getCURD('conclusion')[3];
