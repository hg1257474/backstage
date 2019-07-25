import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getOrders } from './service';

import { OrderTableItem } from './data.d';

export interface StateType {
  orders: OrderTableItem[];
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
    getOrders: Effect;
  };
  reducers: {
    orders: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'orderTable',

  state: {
    orders: [],
    total: 0,
  },

  effects: {
    *getOrders({ payload }, { call, put }) {
      const response = yield call(getOrders, payload);
      yield put({
        type: 'orders',
        payload: response,
      });
    },
  },

  reducers: {
    orders(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default Model;
