import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Table,
  Form,
  Icon,
  Input,
  InputNumber,
  Menu,
  Row,
  Select,
  message,
} from 'antd';
import Link from 'umi/link';

import { OrderTableItem } from './data.d';
import React, { Component, Fragment } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import * as moment from 'moment';
import { StateType } from './model';

import styles from './style.less';
interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  orderTable: StateType;
}

interface TableListState {
  modalVisible: boolean;
  current: number;
  updateAtSort: boolean;
  totalFeeSort: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  formValues: { [key: string]: string };
}
/* eslint react/no-multi-comp:0 */
@connect(
  ({
    orderTable,
    loading,
  }: {
    orderTable: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    orderTable,
    loading: loading.models.rule,
  }),
)
// interface momentType extends typeof moment={}
class OrderTable extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    formValues: {},
    current: 1,
    totalFeeSort: false,
    updateAtSort: false,
  };

  getColumns = () => [
    {
      title: '订单名',
      dataIndex: 'name',
    },
    {
      title: '金额',
      sorter: true,
      dataIndex: 'totalFee',
      sortOrder: this.state.totalFeeSort,
      render(data: number) {
        return data / 100;
      },
    },
    {
      title: '交易时间',
      sorter: true,
      dataIndex: 'updateAt',
      sortOrder: this.state.updateAtSort,
      render(date: moment.Moment) {
        return moment(date).format('YYYY年MM月DD日 HH时mm分SS秒');
      },
    },
    {
      title: '客户ID',
      dataIndex: 'customerId',
      render: (text: string) => <Link to={`customer/${text}`}>{text}</Link>,
    },
  ];

  onChange = (pagination, filter, sorter) => {
    const { current } = pagination;
    //const {};
    const { field } = sorter;
    const newState = {
      current,
      totalFeeSorter: field === 'totalFee' ? sorter.order : this.state.totalFeeSort,
      updateAtSorter: field === 'updateAt' ? sorter.order : this.state.updateAtSort,
    };
    this.setState({ ...newState });
    this.props.dispatch({
      type: 'orderTable/getOrders',
      payload: newState,
    });
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderTable/get',
      payload: { page: 1 },
    });
  }

  render() {
    console.log(this.props);
    const { loading } = this.props;
    const that = this;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Table
              loading={loading}
              rowKey="orderId"
              columns={this.getColumns()}
              dataSource={this.props.orderTable.orders}
              onChange={(...x) => console.log(x)}
              pagination={{ total: this.props.orderTable.total, current: this.state.current }}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default OrderTable;
