import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { get } from './service';

import { CustomerTableItem } from './data.d';

export interface StateType {
  data: CustomerTableItem[];
  count: number;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    get: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'customerTable',

  state: {
    data: [],
    count: 0,
  },

  effects: {
    *get({ payload }, { call, put }) {
      const response = yield call(get, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload.data,
        count: action.payload.count,
      };
    },
  },
};

export default Model;
