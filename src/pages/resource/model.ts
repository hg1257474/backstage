import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getList, deleteList, postList, putList } from './service';

import {
  IndexCategoryListItemDataType,
  IndexTermListItemDataType,
  PriceListItemDataType,
} from './data.d';

export interface StateType {
  list: Array<IndexCategoryListItemDataType | IndexTermListItemDataType | PriceListItemDataType>;
  count:Number
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    getList: Effect;
    deleteList: Effect;
    postList: Effect;
    putList: Effect;
  };
  reducers: {
    list: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'listBasicList',

  state: {
    list: [],
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const response = yield call(getList, payload);
      yield put({
        type: 'list',
        payload: response, //Array.isArray(response) ? response : [],
      });
    },
    *deleteList({ payload }, { call, put }) {
      const response = yield call(deleteList, payload);
      yield put({
        type: 'list',
        payload: response, //Array.isArray(response) ? response : [],
      });
    },
    *postList({ payload }, { call, put }) {
      const response = yield call(postList, payload);
      yield put({
        type: 'list',
        payload: response, //Array.isArray(response) ? response : [],
      });
    },
    *putList({ payload }, { call, put }) {
      const response = yield call(putList, payload);
      yield put({
        type: 'list',
        payload: response, //Array.isArray(response) ? response : [],
      });
    },
  },

  reducers: {
    list(state, action) {
      return {
        ...state,
        list: action.payload.data,
        count:action.payload.count
      };
    },
  },
};

export default Model;
