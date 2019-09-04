import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {
  getList,
  deleteItem,
  updateItem,
  newItem,
  getIndexPageBanner,
  updateIndexPageBanner,
} from './service';
import { Item as IndexPageTermListItem } from './components/IndexPageTermList';
import {
  IndexCategoryListItemDataType,
  IndexTermListItemDataType,
  PriceListItemDataType,
} from './data.d';

export interface StateType {
  indexPageBanner: any[] | null;
  resources: Array<
    IndexCategoryListItemDataType | IndexTermListItemDataType | PriceListItemDataType
  >;
  total: number;
  indexPageTermList?: {
    total: number;
    resources: IndexPageTermListItem[];
  };
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
    getIndexPageBanner: Effect;
    updateIndexPageBanner: Effect;
    getIndexPageTermList: Effect;
    getResources: Effect;
    deleteItem: Effect;
    updateItem: Effect;
    newItem: Effect;
  };
  reducers: {
    indexPageBanner: Reducer<StateType>;
    indexPageTermList: Reducer<StateType>;
    list: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'resourceList',

  state: {
    indexPageBanner: null,
    resources: [],
    total: 0,
    timestamp: 0,
  },

  effects: {
    *getIndexPageBanner({}, { call, put }) {
      const res = yield call(getIndexPageBanner);
      yield put({
        type: 'indexPageBanner',
        payload: { indexPageBanner: res },
      });
    },
    *updateIndexPageBanner({ payload }, { call, put }) {
      const res = yield call(updateIndexPageBanner, payload);
      console.log(res);
      yield put({
        type: 'indexPageBanner',
        payload: { indexPageBanner: res },
      });
    },
    *getResources({ payload }, { call, put }) {
      const timestamp = payload.timestamp;
      delete payload.timestamp;
      const response = yield call(getList, payload);
      yield put({
        type: 'list',
        payload: { ...response, timestamp }, //Array.isArray(response) ? response : [],
      });
    },
    *getIndexPageTermList({ payload }, { call, put }) {
      console.log(payload);
      const response = yield call(getList, payload);
      yield put({
        type: 'indexPageTermList',
        payload: { indexPageTermList: response },
      });
    },
    *deleteItem({ payload }, { call, put }) {
      console.log(payload);
      let callback = payload.callback || {};
      delete callback.current;
      delete payload.callback;
      payload.current = payload.current || 1;
      const response = yield call(deleteItem, payload);
      if (payload.target === 'indexPageTerm') {
        yield put({
          type: 'indexPageTermList',
          payload: { indexPageTermList: response },
        });
      } else
        yield put({
          type: 'list',
          payload: { ...response, ...callback }, //Array.isArray(response) ? response : [],
        });
    },
    *updateItem({ payload }, { call, put }) {
      const timestamp = payload.timestamp;
      console.log(payload);
      delete payload.timestamp;
      const response = yield call(updateItem, payload);
      if (payload.params.target !== 'indexPageTerm')
        yield put({
          type: 'list',
          payload: { ...response, timestamp }, //Array.isArray(response) ? response : [],
        });
      else {
        yield put({
          type: 'list',
          payload: { timestamp },
        });
        yield put({
          type: 'indexPageTermList',
          payload: { indexPageTermList: response, timestamp },
        });
      }
    },
    *newItem({ payload }, { call, put }) {
      console.log(payload);
      const timestamp = payload.timestamp;
      delete payload.timestamp;
      const response = yield call(newItem, payload);
      if (payload.params.target === 'indexPageTerm')
        yield put({
          type: 'indexPageTermList',
          payload: { indexPageTermList: response, timestamp },
        });
      else
        yield put({
          type: 'list',
          payload: { ...response, timestamp }, //Array.isArray(response) ? response : [],
        });
    },
  },

  reducers: {
    indexPageBanner(state, action) {
      return { ...state, ...action.payload };
    },

    indexPageTermList(state, { payload }) {
      return { ...state, ...payload };
    },

    list(state, action) {
      console.log(action.payload);
      return { ...state, ...action.payload };
      /*
      const list = action.payload.list.map((item, index) => {
        if (action.payload.target === 'indexPage') {
          if (action.payload.categorySelected) {
            return {
              termIcon: item[0],
              term: item[1],
              termSummary: item[2],
              termDescription: item[3],
              index: index + (action.payload.page - 1) * 10,
            };
          } else
            return {
              categoryIcon: item[0],
              category: item[1],
              categoryDescription: item[2],
              index: index + (action.payload.page - 1) * 10,
            };
        }
      });
      return {
        ...state,
        list,
        total: action.payload.total,
      };
      */
    },
  },
};

export default Model;
