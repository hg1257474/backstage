import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { ConclusionDetail } from './data.d';
import { getDetail } from './service';
import { string } from 'prop-types';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: ConclusionDetail) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: ConclusionDetail;
  effects: {
    getDetail: Effect;
  };
  reducers: {
    detail: Reducer<ConclusionDetail>;
  };
}

const Model: ModelType = {
  namespace: 'conclusionDetail',

  state: {
    conclusion: ['', []],
    processorName: '',
    name: [],
    description: '',
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
