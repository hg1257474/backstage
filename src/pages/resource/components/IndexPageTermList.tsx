import { List, Avatar, Button } from 'antd';
import React from 'react';
import _ from 'lodash';
import styles from '../style.less';
import { IndexPageTermListItem } from '../data';
import { StateType } from '../model';
import { URL as url } from '../../../config';
import mRequest from '../service';
export type Item = [string, string, string, string?];
export interface Props {
  loading?: boolean;
  list: StateType['indexPageTermList'];
  ActionBar: (...x: any[]) => JSX.Element;
  onAddItem: () => void;
}
interface State {}
export default class extends React.Component<Props, State> {
  render() {
    const { ActionBar, list } = this.props;
    return (
      <List<IndexPageTermListItem>
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
        pagination={false}
        loading={this.props.loading}
        dataSource={list.content}
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
            <ActionBar
              editTarget={() =>
                new Promise(async resolve => {
                  resolve({
                    term: await mRequest({
                      target: 'indexPageTerm',
                      params: { category: list.category, term: index },
                    }),
                    type: 'indexPageTerm',
                    category: list.category,
                    index,
                    indexPageTermTotal: list.content.length,
                    indexPageCategories: await mRequest({ target: 'indexPageCategories' }),
                  });
                })
              }
              deleteTarget={[
                'indexPageTerm',
                { category: list.category, term: index },
                { target: 'indexPageTermList', params: { category: list.category } },
                {},
              ]}
            />
          </List.Item>
        )}
      />
    );
  }
}
