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
import React, { Component, Fragment, ClassicComponent } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import * as moment from 'moment';
import { StateType } from './model';

import styles from './style.less';
import { RangePickerProps } from 'antd/lib/date-picker/interface';

const { RangePicker } = DatePicker;
interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  orderTable: StateType;
}

interface TableListState {
  shouldFilterName: boolean;
  modalVisible: boolean;
  current: number;
  updatedAtSort: boolean;
  totalFeeSort: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  formValues: { [key: string]: string };
  isNameFiltered: boolean;
  isUpdatedAtFiltered: boolean;
  isRangePickerOpen: boolean;
}
/* eslint react/no-multi-comp:0 */
/*
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
*/
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
  }) => {
    console.log(loading);
    return {
      orderTable,
      loading: loading.models.orderTable,
    };
  },
)
// interface momentType extends typeof moment={}
class OrderTable extends Component<TableListProps, TableListState> {
  state: TableListState = {
    shouldFilterName: false,
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    formValues: {},
    current: 1,
    totalFeeSort: false,
    updatedAtSort: false,
    isNameFiltered: false,
    isUpdatedAtFiltered: false,
    isRangePickerOpen: false,
  };
  nameFilterIcon = filtered => (
    <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
  );
  updatedAtFilterIcon = filtered => (
    <Icon type="calendar" style={{ color: filtered ? '#1890ff' : undefined }} />
  );
  nameSearchInput: Input | null = null;
  updatedAtRangePicker: null | ClassicComponent<RangePickerProps, any> = null;
  onNameSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({
      current: 1,
      totalFeeSort: false,
      updatedAtSort: false,
    });
    console.log(this.nameSearchInput);
    this.props.dispatch({
      type: 'orderTable/getOrders',
      payload: {
        current: 1,
        name: this.nameSearchInput!.input.value,
      },
    });
  };
  onNameFilterDropdownVisibleChange = visible => {
    if (visible) {
      setTimeout(() => this.nameSearchInput!.select());
    }
  };
  onUpdatedAtFilterDropdownVisibleChange = visible => {
    if (visible) {
      this.setState({ isRangePickerOpen: true });
      setTimeout(() => this.updatedAtRangePicker!.focus());
    } else this.setState({ isRangePickerOpen: false });
  };
  onNameFilter = (value, record) =>
    record['dsdsds']
      .toString()
      .toLowerCase()
      .includes(value.toLowerCase());

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };
  updatedAtFilterDropdown = ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
    const that = this;
    return (
      <div style={{ padding: 8 }}>
        <RangePicker
          open={this.state.isRangePickerOpen}
          onChange={(momentDate, date) => {
            setSelectedKeys(date);
            confirm();
          }}
          ref={node => {
            that.updatedAtRangePicker = node;
          }}
        />
      </div>
    );
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
          onPressEnter={() => this.onNameSearch(selectedKeys, confirm)}
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
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    );
  };
  getColumns = () => [
    {
      title: '订单名',
      dataIndex: 'name',
      filterIcon: this.nameFilterIcon,
      filterDropdown: this.nameFilterDropdown,
      filtered: this.state.isNameFiltered,
      onFilterDropdownVisibleChange: this.onNameFilterDropdownVisibleChange,
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
      dataIndex: 'updatedAt',
      filtered: this.state.isUpdatedAtFiltered,
      filterIcon: this.updatedAtFilterIcon,
      filterDropdown: this.updatedAtFilterDropdown,
      sortOrder: this.state.updatedAtSort,
      onFilterDropdownVisibleChange: this.onUpdatedAtFilterDropdownVisibleChange,
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

    const { field, order } = sorter;
    console.log(pagination);
    console.log(filter);
    console.log(sorter);
    const newState = {
      current: field ? 1 : current,
      totalFeeSort: field === 'totalFee' && order,
      updatedAtSort: field === 'updatedAt' && order,
      isNameFiltered: filter.name ? filter.name[0] : false,
      isUpdatedAtFiltered: filter.updatedAt ? filter.updatedAt : false,
    };

    console.log(newState);
    this.setState(newState);
    this.props.dispatch({
      type: 'orderTable/getOrders',
      payload: { ...newState },
    });
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderTable/getOrders',
      payload: { current: 1 },
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
              rowKey="_id"
              columns={this.getColumns()}
              dataSource={this.props.orderTable.orders}
              onChange={this.onChange}
              pagination={{ total: this.props.orderTable.total, current: this.state.current }}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default OrderTable;
