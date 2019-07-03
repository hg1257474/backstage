import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {
  addFakeList,
  queryFakeList,
  removeFakeList,
  updateFakeList,
  add,
  remove,
  update,
} from './service';

import {
  IndexCategoryListItemDataType,
  IndexTermListItemDataType,
  PriceListItemDataType,
} from './data.d';

export interface StateType {
  list: Array<IndexCategoryListItemDataType | IndexTermListItemDataType | PriceListItemDataType>;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    appendFetch: Effect;
    submit: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
    appendList: Reducer<StateType>;
    add: Reducer<StateType>;
    update: Reducer<StateType>;
    remove: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'listBasicList',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      console.log(response)
      yield put({
        type: 'queryList',
        payload: response//Array.isArray(response) ? response : [],
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'appendList',
        payload: response//Array.isArray(response) ? response : [],
      });
    },
    *submit({ payload }, { call, put }) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeFakeList : updateFakeList;
      } else {
        callback = addFakeList;
      }
      const response = yield call(callback, payload); // post
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    appendList(state = { list: [] }, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
    remove(state = { list: [] }, action) {
      remove(action.payload);
      return {
        ...state,
        list: state.list.filter(item => item.index != action.payload.index),
      };
    },
    update(state = { list: [] }, action) {
      update(action.payload);
      return {
        ...state,
        list: state.list.map(item => (item.index != action.payload.id ? item : action.payload)),
      };
    },
    add(state = { list: [] }, action) {
      add(action.payload);
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
  },
};

export default Model;
