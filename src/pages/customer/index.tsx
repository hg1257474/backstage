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

import { CustomerTableItem } from './data.d';
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
  customerTable: StateType;
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
    customerTable,
    loading,
  }: {
    customerTable: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    customerTable,
    loading: loading.models.rule,
  }),
)
// interface momentType extends typeof moment={}
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    formValues: {},
  };

  columns = [
    {
      title: '客户id',
      dataIndex: 'customerId',
    },
    {
      title: '注册日期',
      dataIndex: 'createdAt',
      render(date: moment.Moment) {
        return moment(date).format('YYYY年MM月DD日');
      },
    },
    {
      title: '操作',
      render: (text: string, record: CustomerTableItem) => <Link to={`customer/${record.customerId}`}>查看</Link>,
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerTable/get',
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
              rowKey="customerId"
              columns={this.columns}
              dataSource={this.props.customerTable.data}
              pagination={{total:this.props.customerTable.count,onChange(page){
                that.props.dispatch({
                  type: 'customerTable/get',
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

export default Form.create<TableListProps>()(TableList);
