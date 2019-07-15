import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Icon,
  Input,
  List,
  Menu,
  Modal,
  Progress,
  Radio,
  Row,
  Select,
} from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import Link from 'umi/link';
import Result from './Result';
import { StateType } from './model';
import { ServiceListItemDataType } from './data.d';
import styles from './style.less';
const statusArray = ['处理中', '已完结'];
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;

interface BasicListProps extends FormComponentProps {
  serviceList: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}
interface BasicListState {
  conditionSelected: 'processing' | 'end' | 'all';
}
@connect(
  ({
    serviceList,
    loading,
  }: {
    serviceList: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    serviceList,
    loading: loading.models.listBasicList,
  }),
)
class ServiceList extends Component<BasicListProps, BasicListState> {
  state: BasicListState = { conditionSelected: 'all' };
  componentDidMount() {
    const { dispatch } = this.props;
    console.log(1111111111111);
    dispatch({
      type: 'serviceList/get',
      payload: {
        page: 1,
      },
    });
  }
  render() {
    const {
      serviceList: { list },
      loading,
    } = this.props;
    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup
          defaultValue="all"
          onChange={(e: any) => {
            console.log(e);
            this.setState({ conditionSelected: e });
          }}
        >
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="processing">进行中</RadioButton>
          <RadioButton value="end">已完结</RadioButton>
        </RadioGroup>
      </div>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 50,
    };

    const ListContent = ({
      data: { name, createdAt, status,serviceId },
    }: {
      data: ServiceListItemDataType;
    }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>{name}</div>
        <div className={styles.listContentItem}>{statusArray[status]}</div>
        <div className={styles.listContentItem}>{moment(createdAt).format('YYYY年MM月DD日')}</div>
        <div className={styles.listContentItem}><Link to={`/service/${serviceId}`}>查看</Link></div>
        
      </div>
    );
    console.log(this.props);
    const that = this;
    return (
      <>
        <PageHeaderWrapper>
          <div className={styles.standardList}>
            <Card
              className={styles.listCard}
              bordered={false}
              title="服务列表"
              style={{ marginTop: 24 }}
              bodyStyle={{ padding: '0 32px 40px 32px' }}
              extra={null /*extraContent*/}
            >
              <List
                size="large"
                rowKey="id"
                loading={loading}
                pagination={{
                  total: this.props.serviceList.count,
                  onChange(e) {
                    that.props.dispatch({
                      type: 'serviceList/get',
                      payload: {
                        page: e,
                      },
                    });
                  },
                }}
                dataSource={this.props.serviceList.list}
                renderItem={item => (
                  <List.Item >
                    <ListContent data={item} />
                  </List.Item>
                )}
              />
            </Card>
          </div>
        </PageHeaderWrapper>
      </>
    );
  }
}

export default ServiceList;
