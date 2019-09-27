import { request } from '../../../services/curd';
import { URL } from '../../../config';

export async function getDetail(id: string) {
  return request(`${URL}/backstage/conclusion/${id}`, {
    mode: 'cors',
  });
}
