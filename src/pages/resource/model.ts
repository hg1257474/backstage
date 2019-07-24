import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getList, deleteItem, updateItem, newItem } from './service';
import { Item as IndexPageTermListItem } from './components/IndexPageTermList';
import {
  IndexCategoryListItemDataType,
  IndexTermListItemDataType,
  PriceListItemDataType,
} from './data.d';

export interface StateType {
  resources: Array<
    IndexCategoryListItemDataType | IndexTermListItemDataType | PriceListItemDataType
  >;
  total: number;
  indexPageTermList?: {
    total: number;
    data: IndexPageTermListItem[];
  };
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    getResources: Effect;
    deleteItem: Effect;
    updateItem: Effect;
    newItem: Effect;
  };
  reducers: {
    list: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'resourceList',

  state: {
    resources: [],
    total: 0,
  },

  effects: {
    *getResources({ payload }, { call, put }) {
      const response = yield call(getList, payload);
      yield put({
        type: 'list',
        payload: response, //Array.isArray(response) ? response : [],
      });
    },
    *deleteItem({ payload }, { call, put }) {
      const response = yield call(deleteItem, payload);
      yield put({
        type: 'list',
        payload: { ...response, ...payload }, //Array.isArray(response) ? response : [],
      });
    },
    *updateItem({ payload }, { call, put }) {
      console.log(payload);
      const response = yield call(updateItem, payload.data);
      yield put({
        type: 'list',
        payload: { ...response, ...payload.payload }, //Array.isArray(response) ? response : [],
      });
    },
    *newItem({ payload }, { call, put }) {
      console.log(payload);
      const nextPayload = payload.payload;
      const response = yield call(newItem, payload.data);
      yield put({
        type: 'list',
        payload: { ...response, ...nextPayload }, //Array.isArray(response) ? response : [],
      });
    },
  },

  reducers: {
    list(state, action) {
      return { ...state, ...action.payload };
      /*
      const list = action.payload.list.map((item, index) => {
        if (action.payload.target === 'indexPage') {
          if (action.payload.categorySelected) {
            return {
              termIcon: item[0],
              term: item[1],
              termSummary: item[2],
              termDescription: item[3],
              index: index + (action.payload.page - 1) * 10,
            };
          } else
            return {
              categoryIcon: item[0],
              category: item[1],
              categoryDescription: item[2],
              index: index + (action.payload.page - 1) * 10,
            };
        }
      });
      return {
        ...state,
        list,
        total: action.payload.total,
      };
      */
    },
  },
};

export default Model;
