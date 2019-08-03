import request from 'umi-request';
const url = 'http://192.168.0.29:7001'; //'https://www.cyfwg.com';
export async function fakeChartData() {
  return request('/api/fake_chart_data');
}
export async function getData() {
  console.log(11);
  return request(`${url}/backstage/analysis`, {
    mode: 'cors',
  });
}
