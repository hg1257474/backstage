import getCURD from '../../services/curd';
const abilities = getCURD('servicer');
export const deleteServicer = abilities[0];
export const addServicer = abilities[1];
export const updateServicer = abilities[2];
export const getServicers = abilities[3];
