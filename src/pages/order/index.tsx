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
  };

  columns = [
    {
      title: '订单名',
      dataIndex: 'name',
    },
    {
      title: '金额',
      dataIndex: 'fee',
      render(data: number) {
        return data/100
      },
    },
    {
      title: '交易时间',
      dataIndex: 'createdAt',
      render(date: moment.Moment) {
        return moment(date).format('YYYY年MM月DD日 HH时mm分SS秒');
      },
    },
    {
      title: '操作',
      render: (text: string, record: OrderTableItem) => <Link to={`order/${record.orderId}`}>查看</Link>,
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderTable/get',
      payload:{page:1}
    });
  }

  render() {
    console.log(this.props);
    const { loading } = this.props;
    const that=this
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Table
              loading={loading}
              rowKey="orderId"
              columns={this.columns}
              dataSource={this.props.orderTable.data}
              pagination={{total:this.props.orderTable.count,onChange(page){
                that.props.dispatch({
                  type: 'orderTable/get',
                  payload:{page}
                });
              }}}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default OrderTable;
