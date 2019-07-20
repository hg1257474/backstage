import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getServices } from './service';

import { ServiceTableItem } from './data.d';

export interface StateType {
  services: ServiceTableItem[];
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
    getServices: Effect;
  };
  reducers: {
    services: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'serviceTable',

  state: {
    services: [],
    total: 0,
  },

  effects: {
    *getServices({ payload }, { call, put }) {
      const response = yield call(getServices, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    services(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default Model;
