import getCURD from '../../services/curd';
export { getServiceNameGroup } from '../../services/curd';
export const getServices = getCURD('service')[3];
