import { request, URL } from '../../../services/curd';
export async function getDetail(id: string) {
  return request(`${URL}/backstage/service/${id}`, {
    mode: 'cors',
  });
}
