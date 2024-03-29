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
  AutoComplete,
} from 'antd';
import Link from 'umi/link';

import { ServiceTableItem } from './data.d';
import React, { Component, Fragment } from 'react';
const { RangePicker } = DatePicker;
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { TableProps } from 'antd/lib/table/interface';
import { connect } from 'dva';
import * as moment from 'moment';
import { StateType } from './model';
import { getServiceNameGroup } from './service';
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
  isUpdatedAtFiltered: boolean;
}
let processorId: string;
let customerId: string;
let serviceNameGroup = [];
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
    isUpdatedAtFiltered: false,
  };
  nameFilterIcon = filtered => (
    <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
  );
  updatedAtFilterIcon = filtered => (
    <Icon type="calendar" style={{ color: filtered ? '#1890ff' : undefined }} />
  );
  nameSearchInput: Input | null = null;
  updatedAtRangePicker: null | ClassicComponent<RangePickerProps, any> = null;

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
  updatedAtFilterDropdown = ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
    const that = this;
    return (
      <div style={{ padding: 8 }}>
        <RangePicker
          allowClear={true}
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
        <AutoComplete
          value={selectedKeys[0]}
          onChange={value => setSelectedKeys(value ? [value] : [])}
          onPressEnter={confirm}
          style={{ width: 188, marginRight: 8 }}
          dataSource={serviceNameGroup}
        >
          <Input
            ref={node => {
              that.nameSearchInput = node;
            }}
            placeholder={`输入要搜索的文件名`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={confirm}
            style={{ width: 188, display: 'block' }}
          />
        </AutoComplete>
        <Button
          type="primary"
          onClick={confirm}
          icon="search"
     
          style={{ width: 90, marginRight: 8 }}
        >
          搜索
        </Button>
        <Button onClick={clearFilters} style={{ width: 90 }}>
          重置
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
      dataIndex: 'status',
      render: text => <span>{maps[text]}</span>,
    },
    {
      title: '更新时间',
      sorter: true,
      filtered: this.state.isUpdatedAtFiltered,
      filterIcon: this.updatedAtFilterIcon,
      filterDropdown: this.updatedAtFilterDropdown,
      onFilterDropdownVisibleChange: this.onUpdatedAtFilterDropdownVisibleChange,
      sortOrder: this.state.updatedAtSort,
      dataIndex: 'updatedAt',
      render(date: moment.Moment) {
        return moment(date).format('YYYY年MM月DD日 HH时mm分SS秒');
      },
    },
    {
      title: '操作',
      dataIndex: '_id',
      render: (text: string) => <Link to={`service/${text}`}>查看</Link>,
    },
  ];

  async componentDidMount() {
    serviceNameGroup = await getServiceNameGroup();
    const { dispatch } = this.props;
    ({ processorId, customerId } = this.props.location.query);
    console.log(processorId);
    dispatch({
      type: 'serviceTable/getServices',
      payload: { current: 1, processorId, customerId },
    });
  }
  onChange: TableProps<ServiceTableItem>['onChange'] = ({ current }, filter, { field, order }) => {
    const newState = {
      current: current!,
      updatedAtSort: field === 'updatedAt' && order,
      isNameFiltered: filter.name && filter.name[0] ? filter.name[0] : false,
      isStatusFiltered: filter.status && filter.status[0] ? filter.status : false,
      isUpdatedAtFiltered: filter.updatedAt && filter.updatedAt ? filter.updatedAt : false,
    };
    this.setState(newState);
    this.props.dispatch({
      type: 'serviceTable/getServices',
      payload: { ...newState, processorId, customerId },
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
