import {
  IndexCategoryListItemDataType,
  IndexTermListItemDataType,
  PriceListItemDataType,
} from './data.d';
type List = IndexCategoryListItemDataType | IndexTermListItemDataType;
const { categoryIcon, serviceIcon } = require('./images.js');
const rawData = [
  [
    categoryIcon,
    '合同',
    '法律咨询提供合同',
    [
      [
        serviceIcon,
        '合作伙伴',
        '介绍法务官所在律所，法务官团队及餐饮法律咨询服务',
        '本着平等互利共同发展的原则，经甲乙双方友好协商，就甲方委托加工生产生产事宜达成协议，双方应遵守本条规定所行事。',
      ],
      [
        serviceIcon,
        '合作伙伴',
        '介绍法务官所在律所，法务官团队及餐饮法律咨询服务',
        '本着平等互利共同发展的原则，经甲乙双方友好协商，就甲方委托加工生产生产事宜达成协议，双方应遵守本条规定所行事。',
      ],
      [
        serviceIcon,
        '合作伙伴',
        '介绍法务官所在律所，法务官团队及餐饮法律咨询服务',
        '本着平等互利共同发展的原则，经甲乙双方友好协商，就甲方委托加工生产生产事宜达成协议，双方应遵守本条规定所行事。',
      ],
    ],
  ],
  [
    categoryIcon,
    '合同',
    '法律咨询提供合同',
    [
      [
        serviceIcon,
        '合作伙伴',
        '介绍法务官所在律所，法务官团队及餐饮法律咨询服务',
        '本着平等互利共同发展的原则，经甲乙双方友好协商，就甲方委托加工生产生产事宜达成协议，双方应遵守本条规定所行事。',
      ],
      [
        serviceIcon,
        '合作伙伴',
        '介绍法务官所在律所，法务官团队及餐饮法律咨询服务',
        '本着平等互利共同发展的原则，经甲乙双方友好协商，就甲方委托加工生产生产事宜达成协议，双方应遵守本条规定所行事。',
      ],
      [
        serviceIcon,
        '合作伙伴',
        '介绍法务官所在律所，法务官团队及餐饮法律咨询服务',
        '本着平等互利共同发展的原则，经甲乙双方友好协商，就甲方委托加工生产生产事宜达成协议，双方应遵守本条规定所行事。',
      ],
    ],
  ],
  [
    categoryIcon,
    '合同',
    '法律咨询提供合同',
    [
      [
        serviceIcon,
        '合作伙伴',
        '介绍法务官所在律所，法务官团队及餐饮法律咨询服务',
        '本着平等互利共同发展的原则，经甲乙双方友好协商，就甲方委托加工生产生产事宜达成协议，双方应遵守本条规定所行事。',
      ],
      [
        serviceIcon,
        '合作伙伴',
        '介绍法务官所在律所，法务官团队及餐饮法律咨询服务',
        '本着平等互利共同发展的原则，经甲乙双方友好协商，就甲方委托加工生产生产事宜达成协议，双方应遵守本条规定所行事。',
      ],
      [
        serviceIcon,
        '合作伙伴',
        '介绍法务官所在律所，法务官团队及餐饮法律咨询服务',
        '本着平等互利共同发展的原则，经甲乙双方友好协商，就甲方委托加工生产生产事宜达成协议，双方应遵守本条规定所行事。',
      ],
    ],
  ],
];

function list(
  target: 'indexCategory' | 'indexTerm',
  index: number,
  category?: number,
): Array<IndexCategoryListItemDataType | IndexTermListItemDataType> {
  const data = [];
  if (target === 'indexCategory') {
    for (let key = index; key < index + 10 && key < rawData.length; key++) {
      data.push({
        index: key,
        categoryIcon: rawData[key][0],
        category: rawData[key][1],
        categoryDescription: rawData[key][2],
      });
    }
  }
  if (target === 'indexTerm') {
    if (category) {
      const indexTerms = rawData[category][3];
      for (let key = index; key < index + 10 && key < indexTerms.length; key++) {
        data.push({
          index: key,
          termIcon: indexTerms[key][0],
          category: rawData[category][1],
          termDescription: indexTerms[key][3],
          termSummary: indexTerms[key][2],
        });
      }
    } else {
      let counter = 0;
      for (let _category of rawData) {
        if (counter + _category[3].length < index) {
          counter += _category[3].length;
          continue;
        }
        for (let key = index - counter; key < index + 10 && key < _category[3].length; key++) {
          data.push({
            index: counter,
            termIcon: _category[3][key][0],
            category: _category[1],
            termDescription: _category[3][key][3],
            termSummary: _category[3][key][2],
          });

          counter++;
        }
      }
    }
  }
  return data;
}

/*
function getFakeList(req: { query: any }, res: { json: (arg0: BasicListItemDataType[]) => void }) {
  const params = req.query;
  const result = fakeList(params.target, params.index, params.category);
  sourceData = result;
  return res.json(result);
}
*/
function index(req: { query: any }, res: { json: (arg0: List[]) => void }) {
  console.log("ddddddddd")
  const params = req.query;
  //const result = fakeList(params.target, params.index, params.category);
  //sourceData = result;
  return []//res.json(result);
}
function update(req: { query: any }, res: { json: (arg0: List[]) => void }) {
  const params = req.query;
  //const result = fakeList(params.target, params.index, params.category);
  //sourceData = result;
  return []//res.json(result);
}
function remove(req: { query: any }, res: { json: (arg0: List[]) => void }) {
  const params = req.query;
  //const result = fakeList(params.target, params.index, params.category);
  //sourceData = result;
  return []//res.json(result);
}
function add(req: { query: any }, res: { json: (arg0: List[]) => void }) {
  const params = req.query;
  //const result = fakeList(params.target, params.index, params.category);
  //sourceData = result;
  return []//res.json(result);
}
/*
function postFakeList(req: { body: any }, res: { json: (arg0: BasicListItemDataType[]) => void }) {
  //const {  url = '', body } = req;
  // const params = getUrlParams(url);
  const { method, id } = body;
  // const count = (params.count * 1) || 20;
  let result = sourceData || [];

  switch (method) {
    case 'delete':
      result = result.filter(item => item.id !== id);
      break;
    case 'update':
      result.forEach((item, i) => {
        if (item.id === id) {
          result[i] = { ...item, ...body };
        }
      });
      break;
    case 'post':
      result.unshift({
        ...body,
        id: `fake-list-${result.length}`,
        createdAt: new Date().getTime(),
      });
      break;
    default:
      break;
  }

  return res.json(result);
}
*/

export default {
  'GET  /api/fake_list': index,
  'POST  /api/fake_list': add,
  'PUT /api/fake_list': update,
  'DELETE /api/fake_list': remove,
};
