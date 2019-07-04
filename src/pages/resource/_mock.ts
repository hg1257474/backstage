import {
  IndexCategoryListItemDataType,
  IndexTermListItemDataType,
  PriceListItemDataType,
} from './data.d';
import { query } from '@/services/user';
type List = IndexCategoryListItemDataType | IndexTermListItemDataType;
const { categoryIcon, serviceIcon } = require('./images.js');
const rawData = [
  [
    categoryIcon,
    '合同-1',
    '法律咨询提供合同',
    [
      [
        serviceIcon,
        '合作伙伴-7',
        '介绍法务官所在律所，法务官团队及餐饮法律咨询服务',
        '本着平等互利共同发展的原则，经甲乙双方友好协商，就甲方委托加工生产生产事宜达成协议，双方应遵守本条规定所行事。',
      ],
      [
        serviceIcon,
        '合作伙伴-8',
        '介绍法务官所在律所，法务官团队及餐饮法律咨询服务',
        '本着平等互利共同发展的原则，经甲乙双方友好协商，就甲方委托加工生产生产事宜达成协议，双方应遵守本条规定所行事。',
      ],
      [
        serviceIcon,
        '合作伙伴-9',
        '介绍法务官所在律所，法务官团队及餐饮法律咨询服务',
        '本着平等互利共同发展的原则，经甲乙双方友好协商，就甲方委托加工生产生产事宜达成协议，双方应遵守本条规定所行事。',
      ],
    ],
  ],
  [
    categoryIcon,
    '合同-2',
    '法律咨询提供合同',
    [
      [
        serviceIcon,
        '合作伙伴-1',
        '介绍法务官所在律所，法务官团队及餐饮法律咨询服务',
        '本着平等互利共同发展的原则，经甲乙双方友好协商，就甲方委托加工生产生产事宜达成协议，双方应遵守本条规定所行事。',
      ],
      [
        serviceIcon,
        '合作伙伴-2',
        '介绍法务官所在律所，法务官团队及餐饮法律咨询服务',
        '本着平等互利共同发展的原则，经甲乙双方友好协商，就甲方委托加工生产生产事宜达成协议，双方应遵守本条规定所行事。',
      ],
      [
        serviceIcon,
        '合作伙伴-3',
        '介绍法务官所在律所，法务官团队及餐饮法律咨询服务',
        '本着平等互利共同发展的原则，经甲乙双方友好协商，就甲方委托加工生产生产事宜达成协议，双方应遵守本条规定所行事。',
      ],
    ],
  ],
  [
    categoryIcon,
    '合同-3',
    '法律咨询提供合同',
    [
      [
        serviceIcon,
        '合作伙伴-4',
        '介绍法务官所在律所，法务官团队及餐饮法律咨询服务',
        '本着平等互利共同发展的原则，经甲乙双方友好协商，就甲方委托加工生产生产事宜达成协议，双方应遵守本条规定所行事。',
      ],
      [
        serviceIcon,
        '合作伙伴-5',
        '介绍法务官所在律所，法务官团队及餐饮法律咨询服务',
        '本着平等互利共同发展的原则，经甲乙双方友好协商，就甲方委托加工生产生产事宜达成协议，双方应遵守本条规定所行事。',
      ],
      [
        serviceIcon,
        '合作伙伴-6',
        '介绍法务官所在律所，法务官团队及餐饮法律咨询服务',
        '本着平等互利共同发展的原则，经甲乙双方友好协商，就甲方委托加工生产生产事宜达成协议，双方应遵守本条规定所行事。',
      ],
    ],
  ],
];
type DataType={data:List[],count:number}
function list(params:any
): DataType {
  const data = [];
  const index=params.index
  let count=null
  if(params.part==="IndexPage"){
    if(params.selectedCategory===undefined){
      count=rawData.length
      for (let key = index; key < index + 10 && key < rawData.length; key++) {
        data.push({
          index: key,
          categoryIcon: rawData[key][0],
          category: rawData[key][1],
          categoryDescription: rawData[key][2],
        });
      }
    }
    else {
      const terms=rawData[params.selectedCategory][3]
      count=terms.length
      for (let key = index; key < index + 10 && key < terms.length; key++) {
        data.push({
          index: key,
          category: rawData[params.selectedCategory][1],
          termIcon: terms[key][0],
          term:terms[key][1],
          termSummary: terms[key][2],
          termDescription: terms[key][3],
        });
      }
    }
  }
  return {data,count};
}

/*
function getFakeList(req: { query: any }, res: { json: (arg0: BasicListItemDataType[]) => void }) {
  const params = req.query;
  const result = fakeList(params.target, params.index, params.category);
  sourceData = result;
  return res.json(result);
}
*/
function index(req: { query: any }, res: { json: (arg0: DataType) => void }) {
  const params = req.query;
  return res.json(list(params));
}
function update(req: { query: any; body: any }, res: { json: (arg0: DataType) => void }) {
  const params = req.query;
  const body = req.body;
  if (params.part === 'IndexPage') {
    if (params.selectedCategory) {
      rawData[params.selectedCategory][3].splice(body.oldIndex, 1);
      rawData[params.selectedCategory][3].splice(body.index, 0, [
        body.termIcon,
        body.term,
        body.termSummary,
        body.termDescription,
      ]);
    } else {
      rawData.splice(body.oldIndex, 1);

      rawData.splice(body.index, 0, [body.categoryIcon, body.category, body.categoryDescription]);
    }
  }
  params.index = body.index - 9 > -1 ? params.index - 10 : 0;
  return res.json(list(params));
}
function remove(req: { query: any }, res: { json: (arg0:DataType) => void }) {
  console.log(111111111)
  const params = req.query;
  console.log(params)
  if (params.part === 'IndexPage') {
    if (params.selectedCategory) rawData[params.selectedCategory][3].splice(params.index, 1);
    else rawData.splice(params.index, 1);
  }
  params.index = params.index - 9 > -1 ? params.index - 10 : 0;
  return res.json(list(params));
}
function add(req: any, res: { json: (arg0: DataType) => void }) {
  const params = req.query;
  const body = req.body;
  if (params.part === 'IndexPage') {
    if (params.selectedCategory)
      rawData[params.selectedCategory][3].splice(body.index, 0, [
        body.termIcon,
        body.term,
        body.termSummary,
        body.termDescription,
      ]);
    else
      rawData.splice(body.index, 0, [body.categoryIcon, body.category, body.categoryDescription]);
  }
  params.index = body.index - 9 > -1 ? params.index - 10 : 0;
  return res.json(list(params));
}
export default {
  'GET  /api/fake_list': index,
  'POST  /api/fake_list': add,
  'PUT /api/fake_list': update,
  'DELETE /api/fake_list': remove,
};
