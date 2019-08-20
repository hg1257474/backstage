import { extend } from 'umi-request';
// const url = 'http://192.168.0.29:7001';
import { message } from 'antd';
const URL = 'http://192.168.0.29:7001'; //'https://www.cyfwg.com';
const BACKSTAGE_URL = `${URL}/backstage`;
const request = extend({
  errorHandler: e => {
    console.log(e);
    message.warn('网络连接不畅');
  },
});
export default function(
  target: 'resource' | 'servicer' | 'servicer' | 'customer' | 'conclusion' | 'order',
) {
  const url = `${BACKSTAGE_URL}/${target}`;
  return [
    (id: string) => request(`${url}/${id}`, { mode: 'cors', method: 'delete' }),
    (data: any) =>
      request(url, {
        mode: 'cors',
        method: 'post',
        data,
      }),
    (id: string, data: any) =>
      request(`${url}/${id}`, {
        mode: 'cors',
        method: 'put',
        data,
      }),
    (tempParams: {}) => {
      console.log(url);
      const params = { ...tempParams };
      console.log(params);
      Object.entries(params).forEach(([key, value]) => {
        console.log(key, value);
        if (!value) delete params[key];
        else if (value === 'ascend') params[key] = 1;
        else if (value === 'descend') params[key] = -1;
      });
      console.log(params);
      return request(url, {
        mode: 'cors',
        params,
      });
    },
  ];
}
