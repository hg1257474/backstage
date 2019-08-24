import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { OrderDetail } from './data.d';
import { getDetail } from './service';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: OrderDetail) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: OrderDetail;
  effects: {
    getDetail: Effect;
  };
  reducers: {
    detail: Reducer<OrderDetail>;
  };
}

const Model: ModelType = {
  namespace: 'serviceDetail',

  state: {
    name: '',
    totalFee: 0,
    customerName: '',
    customerId: '',
    updatedAt: '',
    description:{}
  },

  effects: {
    *getDetail({payload}, { call, put }) {
      const response = yield call(getDetail,payload);
      console.log("@@@@@@@@@@@")
      console.log(response)
      yield put({
        type: 'detail',
        payload: response,
      });
    },
  },

  reducers: {
    detail(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default Model;
