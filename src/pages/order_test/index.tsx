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

import { TableListItem } from './data.d';
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
  listTableList: StateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
}
interface test1 {
  key: string;
  fee: number;
  time: moment.Moment;
  name: string;
}
/* eslint react/no-multi-comp:0 */
@connect(
  ({
    listTableList,
    loading,
  }: {
    listTableList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    listTableList,
    loading: loading.models.rule,
  }),
)
// interface momentType extends typeof moment={}
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns = [
    {
      title: '订单名',
      dataIndex: 'name',
    },
    {
      title: '金额',
      dataIndex: 'fee',
      align: 'right' as 'left' | 'center' | 'right',
      render: (val: string) => `${val} 万`,
      // mark to display a total number
    },
    {
      title: '时间',
      dataIndex: 'time',
      render(date: moment.Moment) {
        return date.format('YYYY年MM月DD日 HH时mm分SS秒');
      },
    },
    {
      title: '操作',
      render: (text: string, record: test1) => <Link to={`order/asdasdasd`}>查看</Link>,
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'listTableList/fetch',
    });
  }

  render() {
    console.log(this);
    const dataSource: test1[] = [
      {
        key: '1',
        name: '胡彦斌',
        fee: 32,
        time: moment(),
      },
      {
        key: '2',
        name: '胡彦祖',
        fee: 42,
        time: moment(),
      },
    ];
    const { loading } = this.props;
    console.log(this);

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Table
              loading={loading}
              columns={this.columns}
              dataSource={dataSource}
              pagination={{}}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
