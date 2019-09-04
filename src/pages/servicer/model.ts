import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { message } from 'antd';
import {
  addServicer,
  deleteServicer,
  updateServicer,
  getServicers,
  getLawyerExhibition,
} from './service';
import { ServicerTableItemDataType } from './data';
import { number } from 'prop-types';
export interface StateType {
  lawyerExhibition: string[];
  servicers: Array<ServicerTableItemDataType>;
  total: number;
  timestamp: number;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    getLawyerExhibition: Effect;
    getServicers: Effect;
    deleteServicer: Effect;
    addServicer: Effect;
    updateServicer: Effect;
  };
  reducers: {
    servicers: Reducer<StateType>;
    lawyerExhibition: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'servicerForm',

  state: {
    lawyerExhibition: [],
    timestamp: 0,
    servicers: [],
    total: 0,
  },

  effects: {
    *getLawyerExhibition({}, { call, put }) {
      const res = yield call(getLawyerExhibition);
      console.log(res);
      yield put({
        type: 'lawyerExhibition',
        payload: { lawyerExhibition: res },
      });
    },
    *getServicers({ payload }, { call, put }) {
      const { timestamp } = payload;
      delete payload.timestamp;
      console.log(payload);
      const res = yield call(getServicers, payload.params);
      console.log(res);
      yield put({
        type: 'servicers',
        payload: { ...res, timestamp },
      });
    }, 
    *addServicer({ payload }, { call, put }) {
      console.log(payload);
      const res = yield call(addServicer, payload.data);
      if (res) {
        yield put({
          type: 'getLawyerExhibition',
        });
        yield put({
          type: 'getServicers',
          payload,
        });
      }
    },
    *deleteServicer({ payload }, { call, put }) {
      const res = yield call(deleteServicer, payload.id);
      if (res) {
        yield put({
          type: 'getLawyerExhibition',
        });
        yield put({
          type: 'getServicers',
          payload,
        });
      }
    },

    *updateServicer({ payload }, { call, put }) {
      const res = yield call(updateServicer, payload.data);
      message.success('提交成功');
      if (res) {
        yield put({
          type: 'getLawyerExhibition',
        });
        yield put({
          type: 'getServicers',
          payload,
        });
      }
    },
  },
  reducers: {
    servicers(state, action) {
      return { ...state, ...action.payload };
    },
    lawyerExhibition(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};

export default Model;
