import request from 'umi-request';
export async function get(params: {page:number}) {
  console.log(params)
  return request('/backstage/services', {
    params,
  });
}
