import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getConclusions } from './service';

import { ConclusionTableItem } from './data.d';

export interface StateType {
  conclusions: ConclusionTableItem[];
  total: number;
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
    getConclusions: Effect;
  };
  reducers: {
    conclusions: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'conclusionTable',

  state: {
    timestamp: 0,
    conclusions: [],
    total: 0,
  },

  effects: {
    *getConclusions({ payload }, { call, put }) {
      const { timestamp } = payload;
      delete payload.timestamp;
      const res = yield call(getConclusions, payload);
      yield put({
        type: 'conclusions',
        payload: { ...res, timestamp },
      });
    },
  },

  reducers: {
    conclusions(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default Model;
