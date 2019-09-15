import { extend } from 'umi-request';
import { URL } from '../config';
// const url = 'http://192.168.0.29:7001';
import { message } from 'antd';
export const BACKSTAGE_URL = `${URL}/backstage`;
export const request = extend({
  errorHandler: e => {
    console.log(e);
    message.warn('网络连接不畅');
  },
});
(() => {
  let a = document.querySelector('.ant-pro-sider-menu-logo');
  if (a) a.style.display = 'none';
  a = document.querySelector('.ant-pro-global-footer');
  if (a) a.style.display = 'none';
})();
setInterval(() => {
  let a = document.querySelector('.ant-pro-sider-menu-logo');
  if (a) a.style.display = 'none';
  a = document.querySelector('.ant-pro-global-footer');
  if (a) a.style.display = 'none';
}, 10000);
let style1 = document.createElement('style');
let style1Text = document.createTextNode(
  '.ant-descriptions-item-content{color:#8c8c8c} .ant-descriptions-item-label{color:black}',
);
style1.append(style1Text);
document.head.append(style1);
export const getServiceNameGroup = () =>
  request(`${URL}/backstage/service/name_group`, { mode: 'cors' });
export default function(
  target:
    | 'resource'
    | 'servicer'
    | 'servicer'
    | 'customer'
    | 'conclusion'
    | 'order'
    | 'service'
    | 'analysis',
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
    (data: any) =>
      request(`${url}/${data.id}`, {
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
