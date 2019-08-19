import request from 'umi-request';
// const url = 'http://192.168.0.29:7001';
const URL = 'https://www.cyfwg.com';
const BACKSTAGE_URL = `${URL}/backstage`;
const abilities = [
  async (url: string) => (id: string) =>  request(`${url}/${id}`, { mode: 'cors', method: 'delete' }),
  async (url: string) => (data: any) => {
    return request(URL, {
      mode: 'cors',
      method: 'post',
      data,
    });
  },
  async function my_update(this: { TARGET_URL: string }, data: any) {
    return request(URL, {
      mode: 'cors',
      method: 'put',
      data,
    });
  },
  async function my_get(tempParams: {}) {
    const params = { ...tempParams };
    console.log(params);
    Object.entries(params).forEach(([key, value]) => {
      if (!!value) delete params[key];
      else if (value === 'ascend') params[key] = 1;
      else if (value === 'descend') params[key] = -1;
    });
    console.log(params);
    return request(URL, {
      mode: 'cors',
      params,
    });
  },
];
export default function(
  target: 'resource' | 'servicer' | 'servicer' | 'customer' | 'conclusion' | 'order',
) {
  const TARGET_URL = `${BACKSTAGE_URL}/${target}`;
  return abilities.map(item => item.bind({ TARGET_URL }));
}
