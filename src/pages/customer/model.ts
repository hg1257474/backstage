import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getCustomers } from './service';

import { CustomerTableItem } from './data.d';

export interface StateType {
  customers: CustomerTableItem[];
  total: number;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    getCustomers: Effect;
  };
  reducers: {
    customers: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'customerTable',

  state: {
    customers: [],
    total: 0,
  },

  effects: {
    *getCustomers({ payload }, { call, put }) {
      const response = yield call(getCustomers, payload);
      yield put({
        type: 'customers',
        payload: response,
      });
    },
  },

  reducers: {
    customers(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default Model;
