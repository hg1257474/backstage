import getCURD from '../../services/curd';
import request from 'umi-request';
import { URL } from '../../config';
const abilities = getCURD('servicer');
export const deleteServicer = abilities[0];
export const addServicer = abilities[1];
export const updateServicer = abilities[2];
export const getServicers = abilities[3];
export const getServicer = (id: string) =>
  request(`${URL}/backstage/servicer/${id}`, {
    mode: 'cors',
  });
