import { request } from '../../../services/curd';
import { URL } from '../../../config';
export default (data: { username: string; password: string }) =>
  request(`${URL}/backstage/login`, { mode: 'cors', data, method: 'POST' });
