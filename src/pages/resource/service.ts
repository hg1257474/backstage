import { request } from '../../services/curd';
import { URL as url } from '../../config';
const targetMap = {
  indexPageTerm: 'index_page_term',
  indexPageTermList: 'index_page_term_list',
  indexPageCategory: 'index_page_category',
  indexPageCategories: 'index_page_categories',
  indexPageCategoryList: 'index_page_category_list',
  indexPageBanner: 'index_page_banner',
  indexPageTermTotal: 'index_page_term_total',
  productList: 'product_list',
};
export default (content: any) =>
  request(`${url}/backstage/resource/${targetMap[content.target] || content.target}`, {
    mode: 'cors',
    method: content.method || 'get',
    params: content.params,
    data: content.data,
  });
