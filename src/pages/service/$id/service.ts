import request from 'umi-request';
import { URL } from '../../../config';

export async function getDetail(id: string) {
  return request(`${URL}/backstage/service/${id}`, {
    mode: 'cors',
  });
}
