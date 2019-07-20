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

import { ServiceTableItem } from './data.d';
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
  serviceTable: StateType;
}
type SortType = boolean | 'ascend' | 'descend';
interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  formValues: { [key: string]: string };
  current: number;
  updatedAtSort: SortType;
  isNameFiltered: boolean;
  isStatusFiltered: boolean;
}
/* eslint react/no-multi-comp:0 */
@connect(
  ({
    serviceTable,
    loading,
  }: {
    serviceTable: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    serviceTable,
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
    current: 1,
    updatedAtSort: false,
    isStatusFiltered: false,
    isNameFiltered: false,
  };
  nameFilterIcon = filtered => (
    <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
  );
  nameSearchInput: Input | null = null;
  onNameFilterDropdownVisibleChange = visible => {
    if (visible) {
      setTimeout(() => this.nameSearchInput!.select());
    }
  };
  nameFilterDropdown = ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
    const that = this;
    return (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            that.nameSearchInput = node;
          }}
          placeholder={`Search`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={confirm}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={confirm}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    );
  };
  getColumns = () => [
    {
      title: '服务名',
      dataIndex: 'name',
      filterIcon: this.nameFilterIcon,
      filterDropdown: this.nameFilterDropdown,
      filtered: this.state.isNameFiltered,
      onFilterDropdownVisibleChange: this.onNameFilterDropdownVisibleChange,
    },
    {
      title: '状态',
      filtered: this.state.isStatusFiltered,
      filters: [
        {
          text: '已完结',
          value: 'end',
        },
        {
          text: '待支付',
          value: 'wait_pay',
        },
        {
          text: '服务中',
          value: 'processing',
        },
        {
          text: '待分配',
          value: 'wait_assign',
        },
        {
          text: '待报价',
          value: 'wait_quote',
        },
      ],
      dataIndex: 'consumption',
    },
    {
      title: '更新时间',
      sorter: true,
      sortOrder: this.state.updatedAtSort,
      dataIndex: 'updatedAt',
    },
    {
      title: '操作',
      dataIndex: '_id',
      render: (text: string) => <Link to={`customer/${text}`}>查看</Link>,
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerTable/getCustomers',
      payload: { current: 1 },
    });
  }
  onChange = (pagination, filter, sorter) => {
    const { current } = pagination;
    //const {};

    const { field, order } = sorter;
    console.log(pagination);
    console.log(filter);
    console.log(sorter);
    const newState = {
      current: field ? 1 : current,

      updatedAtSort: field === 'updatedAt' && order,
      isNameFiltered: filter.name && filter.company ? filter.company[0] : false,
      isStatusFiltered: filter.status && filter.company ? filter.company[0] : false,
    };

    console.log(newState);
    this.setState(newState);
    this.props.dispatch({
      type: 'customerTable/getCustomers',
      payload: { ...newState },
    });
  };
  render() {
    console.log(this.props);
    const { loading } = this.props;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Table
              loading={loading}
              rowKey="_id"
              onChange={this.onChange}
              columns={this.getColumns()}
              dataSource={this.props.serviceTable.services}
              pagination={{
                total: this.props.serviceTable.total,
                current: this.state.current,
              }}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
