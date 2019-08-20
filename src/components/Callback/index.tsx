import React from 'react';
export default class<P, S> extends React.Component<P, S> {
  static getDerivedStateFromProps(props: any, state: any) {
    if (state.callback && state.callback.timestamp === props.timestamp) {
      state = { ...state, ...state.callback.newState };
      state.callback = undefined;
    }
    return state;
  }
}
