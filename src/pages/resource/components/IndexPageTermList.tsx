import { List, Avatar } from 'antd';
import React from 'react';
import _ from 'lodash';
export type Item = [string, string, string];
export interface Props {
  loading?: boolean;
  data: Item[];
  total: number;
}
interface State {
  current: number;
  willChangeCurrent?: {
    current: number;
    oldProps: Props;
  };
}
export default class extends React.Component<Props, State> {
  state = { current: 1 };
  static getDerivedStateFromProps(props: Props, state: State) {
    if (state.willChangeCurrent && !_.isEqual(props, state.willChangeCurrent.oldProps)) {
      state.current = state.willChangeCurrent.current;
      delete state.willChangeCurrent;
    }
    return state;
  }
  render() {
    const that = this;
    return (
      <List<Item>
        pagination={{
          total: this.props.total,
          current: this.state.current,
          onChange(e) {
            that.setState({ current: e });
          },
        }}
        loading={this.props.loading}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              title={item[1]}
              avatar={<Avatar src={getImage(item[0])} shape="square" size="large" />}
            />
            <div>{item[2]}</div>
          </List.Item>
        )}
      />
    );
  }
}
