import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import mRequest from './service';
import {
  IndexPageBanner,
  IndexPageCategoryListItem,
  IndexPageTermListItem,
  ProductListItem,
} from './data.d';

export interface StateType {
  indexPageBanner: IndexPageBanner;
  indexPageCategoryList: {
    total: number;
    content: IndexPageCategoryListItem[];
  };
  productList: ProductListItem[];
  indexPageTermList: {
    category: number;
    content: IndexPageTermListItem[];
  };
  timestamp: number;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    mGet: Effect;
    mUpdate: Effect;
  };
  reducers: {
    mSet: Reducer<StateType>;
  };
}
const Model: ModelType = {
  namespace: 'resourceList',
  state: {
    productList: [],
    indexPageBanner: ['', ''],
    indexPageTermList: {
      category: -1,
      content: [],
    },
    indexPageCategoryList: {
      total: 0,
      content: [],
    },
    timestamp: 0,
  },

  effects: {
    *mGet({ payload }, { call, put }) {
      const res = yield call(mRequest, payload);
      yield put({
        type: 'mSet',
        payload: {
          [payload.target]: res,
          timestamp: new Date().getTime(),
        },
      });
    },
    *mUpdate({ payload }, { call, put }) {
      const res = yield call(mRequest, payload);
      if (res === 'success' && payload.callback) {
        if (payload.callback instanceof Array)
          for (let i = 0; i < payload.callback.length; i++)
            yield put({
              type: 'mGet',
              payload: { ...payload, ...payload.callback[i], method: 'get' },
            });
        else
          yield put({
            type: 'mGet',
            payload: { ...payload, ...payload.callback, method: 'get' },
          });
      }
    },
  },

  reducers: {
    mSet(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};

export default Model;
