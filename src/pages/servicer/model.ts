import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { message } from 'antd';
import { updateServicers, getServicers } from './service';
import { ServicerTableItemDataType } from './data';
import { number } from 'prop-types';
export interface StateType {
  servicers: Array<ServicerTableItemDataType>;
  total: number;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    getServicers: Effect;
    updateServicers: Effect;
  };
  reducers: {
    servicers: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'servicerTable',

  state: {
    servicers: [],
    total: 0,
  },

  effects: {
    *getServicers({ payload }, { call, put }) {
      const res = yield call(getServicers, payload);
      yield put({
        type: 'servicers',
        payload: res,
      });
    },

    *updateServicers({ payload }, { call, put }) {
      const res = yield call(updateServicers, payload);
      message.success('提交成功');
      yield put({
        type: 'servicers',
        payload: res,
      });
    },
  },
  reducers: {
    servicers(state, action) {
      return { ...state, ...action.payload };
    },
  },
};

export default Model;
