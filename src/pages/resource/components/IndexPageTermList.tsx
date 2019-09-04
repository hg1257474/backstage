import { List, Avatar, Button } from 'antd';
import React from 'react';
import _ from 'lodash';
import styles from '../style.less';
import { URL as url } from '../../../config';
export type Item = [string, string, string, string?];
export interface Props {
  loading?: boolean;
  resources: Item[];
  total: number;
  ActionBar: React.Component;
  onAddItem: () => void;
  onCurrentChange: (e: number) => void;
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
    console.log(this.props);
    const { ActionBar } = this.props;
    return (
      <List<Item>
        footer={
          <Button
            type="dashed"
            style={{ width: '100%', marginBottom: 8, background: '#d6e4ff' }}
            onClick={() => {
              console.log('dsdsa');
              this.props.onAddItem();
            }}
            icon="plus"
            ref={component => {}}
          >
            添加子选项
          </Button>
        }
        className={styles['index-page-term-list']}
        pagination={
          // total: this.props.total,
          // current: this.state.current,
          // onChange(e) {
          //   that.props.onCurrentChange(e);
          //   that.setState({ current: e });
          // },
          false
        }
        loading={this.props.loading}
        dataSource={this.props.resources}
        renderItem={(item, index) => (
          <List.Item className={styles.test123456789}>
            <List.Item.Meta
              style={{ textAlign: 'left' }}
              title={item[1]}
              avatar={
                <Avatar
                  src={`${url}/resource/indexPage/${item[0][1]}/${item[0][0]}`}
                  shape="square"
                  size="large"
                />
              }
            />
            <div>{item[2]}</div>
            <div>{item[3]}</div>
            <ActionBar
              target="indexPageTerm"
              inputTarget={{
                termIcon: item[0],
                term: item[1],
                termDescription: item[2],
                termOther: item[3],
                index: (this.state.current - 1) * 10 + index,
              }}
            />
          </List.Item>
        )}
      />
    );
  }
}
