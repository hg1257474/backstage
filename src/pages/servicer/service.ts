import getCURD, { request } from '../../services/curd';
import { URL } from '../../config';
const abilities = getCURD('servicer');
export const getLawyerExhibition = () =>
  request(`${URL}/client_mini_program/lawyer_exhibition?target=id_list`, {
    mode: 'cors',
  });
export const deleteServicer = abilities[0];
export const addServicer = abilities[1];
export const updateServicer = abilities[2];
export const getServicers = abilities[3];
export const getServicer = (id: string) =>
  request(`${URL}/backstage/servicer/${id}`, {
    mode: 'cors',
  });
