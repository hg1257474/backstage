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
import Callback from '../../components/Callback';

import { ConclusionTableItem } from './data.d';
import React, { Component, Fragment } from 'react';
const { RangePicker } = DatePicker;
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import * as moment from 'moment';
import { TableProps } from 'antd/lib/table/interface';
import { StateType } from './model';
type OnChange = TableProps<ConclusionTableItem>['onChange'];

const maps = {
  contract: '合同',
  review: '审核',
  draft: '起草',
  communication: '咨询',
  submitted: '已提交',
  wait_quote: '待报价',
  wait_assign: '待分配',
  wait_pay: '待支付',
  processing: '服务中',
  end: '已完结',
};
import styles from './style.less';
interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  conclusionTable: StateType;
}
interface TableListState {
  callback?: {
    timestamp: number;
    newState: TableListState;
  };
  current: number;
  isServiceNameFiltered: boolean | string;
  isProcessorFiltered: boolean | string;
}
/* eslint react/no-multi-comp:0 */
@connect(
  ({
    conclusionTable,
    loading,
  }: {
    conclusionTable: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    conclusionTable,
    loading: loading.models.rule,
  }),
)
// interface momentType extends typeof moment={}
class ConclusionTable extends Callback<TableListProps, TableListState> {
  state: TableListState = {
    current: 1,
    isServiceNameFiltered: false,
    isProcessorFiltered: false,
  };
  filterIcon = filtered => (
    <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
  );

  serviceNameSearchInput: Input | null = null;
  processorSearchInput: Input | null = null;
  onChange: OnChange = ({ current }, filter, { field, order }) => {
    console.log(current, filter, field, order);
    const newState: NonNullable<TableListState['callback']>['newState'] = {
      current: field ? 1 : current!,
      isServiceNameFiltered:
        filter.serviceName && filter.serviceName[0] ? filter.serviceName[0] : false,
      isProcessorFiltered: filter.processor && filter.processor[0] ? filter.processor[0] : false,
    };
    const timestamp = new Date().getTime();
    this.setState({
      callback: {
        timestamp,
        newState,
      },
    });
    this.props.dispatch({
      type: 'conclusionTable/getConclusions',
      payload: {
        ...newState,
        timestamp,
      },
    });
    return 1;
  };

  onServiceNameFilterDropdownVisibleChange = visible => {
    if (visible) {
      setTimeout(() => this.serviceNameSearchInput!.select());
    }
  };
  onProcessorFilterDropdownVisibleChange = visible => {
    if (visible) {
      setTimeout(() => this.processorSearchInput!.select());
    }
  };

  serviceNameFilterDropdown = ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
    const that = this;
    return (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            that.serviceNameSearchInput = node;
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
  processorFilterDropdown = ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
    const that = this;
    return (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            that.processorSearchInput = node;
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
      dataIndex: 'serviceName',
      filterIcon: this.filterIcon,
      filterDropdown: this.serviceNameFilterDropdown,
      filtered: this.state.isServiceNameFiltered,
      onFilterDropdownVisibleChange: this.onServiceNameFilterDropdownVisibleChange,
      render: (value: []) => (
        <span>
          {value
            .join('-')
            .replace('communication', '咨询')
            .replace('contract', '合同')
            .replace('review', '审核')
            .replace('draft', '起草')}
        </span>
      ),
    },
    {
      title: '处理律师',
      dataIndex: 'processor',
      filterIcon: this.filterIcon,
      filterDropdown: this.processorFilterDropdown,
      filtered: this.state.isProcessorFiltered,
      onFilterDropdownVisibleChange: this.onProcessorFilterDropdownVisibleChange,
    },
    {
      title: '操作',
      dataIndex: '_id',
      render: (text: string) => <Link to={`conclusion/${text}`}>查看</Link>,
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'conclusionTable/getConclusions',
      payload: { current: 1 },
    });
  }
  render() {
    console.log(this.props);
    const { loading } = this.props;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Table<ConclusionTableItem>
              loading={loading}
              rowKey="_id"
              onChange={this.onChange}
              columns={this.getColumns()}
              dataSource={this.props.conclusionTable.conclusions}
              pagination={{
                total: this.props.conclusionTable.total,
                current: this.state.current,
              }}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ConclusionTable;
