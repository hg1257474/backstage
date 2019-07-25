import { List, Avatar, Button } from 'antd';
import React from 'react';
import _ from 'lodash';
import styles from '../style.less';
export type Item = [string, string, string];
export interface Props {
  loading?: boolean;
  resources: Item[];
  total: number;
  ActionBar: React.Component;
  onCurrentChange: (e: number) => void;
}
interface State {
  current: number;
  willChangeCurrent?: {
    current: number;
    oldProps: Props;
  };
}
const getImage = x => {
  const y = x;
  if (y.includes('base64')) return y;
  return `${url}/resource_test/${x}`;
};
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
    console.log(this.props);
    const { ActionBar } = this.props;
    return (
      <List<Item>
        footer={
          <Button
            type="dashed"
            style={{ width: '100%', marginBottom: 8 }}
            icon="plus"
            ref={component => {}}
          >
            添加
          </Button>
        }
        className={styles['index-page-term-list']}
        pagination={{
          total: this.props.total,
          current: this.state.current,
          onChange(e) {
            that.props.onCurrentChange(e);
            that.setState({ current: e });
          },
        }}
        loading={this.props.loading}
        dataSource={this.props.resources}
        renderItem={(item, index) => (
          <List.Item className={styles.test123456789}>
            <List.Item.Meta
              style={{ 'text-align': 'left' }}
              title={item[1]}
              avatar={<Avatar src={getImage(item[0])} shape="square" size="large" />}
            />
            <div>{item[2]}</div>
            <ActionBar />
          </List.Item>
        )}
      />
    );
  }
}
