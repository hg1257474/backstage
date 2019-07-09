import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { get} from './service';

import { ServiceListItemDataType } from './data.d';

export interface StateType {
  list: ServiceListItemDataType[];
  count:number
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
    cb: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'serviceList',

  state: {
    list: [],
    count:-1
  },

  effects: {
    *get({ payload }, { call, put }) {
      console.log(1111)
      const response = yield call(get, payload);
      yield put({
        type: 'cb',
        payload: response,
      });
    },
  },

  reducers: {
    cb(state = { list: [] ,count:-1}, action) {
      return {
        ...state,
        list:action.payload.list,
        count:action.payload.count
      };
    },
  },
};

export default Model;
