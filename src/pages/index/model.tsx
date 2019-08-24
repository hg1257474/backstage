import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { AnalysisData } from './data.d';
import { getData } from './service';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: AnalysisData) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: AnalysisData;
  effects: {
    getData: Effect;
  };
  reducers: {
    data: Reducer<AnalysisData>;
  };
}

const Model: ModelType = {
  namespace: 'analysis',
  state: {
    dayNCTrend: [],
    daySalesTrend: [],
    monthNCTrend: [],
    monthSalesPie: [],
    monthSalesTrend: [],
    weekNCTrend: [],
    weekNSTrend: [
      {
        "_id": 0,
        "total": 0,
        "services": []
      },
      {
        "_id": 0,
        "total": 0,
        "services": []
      }
    ],
    weekSalesTrend: [],
  },

  effects: {
    *getData({ payload }, { call, put }) {
      const response = yield call(getData);
      console.log(response);
      yield put({
        type: 'data',
        payload: response,
      });
    },
  },

  reducers: {
    data(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default Model;
