import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { ServiceDetail } from './data.d';
import { getDetail } from './service';
import { string } from 'prop-types';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: ServiceDetail) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: ServiceDetail;
  effects: {
    getDetail: Effect;
  };
  reducers: {
    detail: Reducer<ServiceDetail>;
  };
}

const Model: ModelType = {
  namespace: 'serviceDetail',

  state: {
    contact: {
      name: '',
      phone: 0,
      method: 'weChat',
      content: '',
    },
    comment: [],
    processorId: '',
    processorName: '',
    name: [],
    description: '',
    status: '',
    totalFee: 0,
    customerName: '',
    customerId: '',
    createdAt: '',
  },

  effects: {
    *getDetail({ payload }, { call, put }) {
      const response = yield call(getDetail, payload);
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
