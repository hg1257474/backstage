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
  Modal,
} from 'antd';
import Link from 'umi/link';
import Callback from '../../components/Callback';
import { getServiceNameGroup, URL } from './service';

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
    newState: {
      communication?: TableListState['communication'];
      contract?: TableListState['contract'];
    };
  };
  wantDownload: [string, string];
  communication: {
    current: number;
    isServiceNameFiltered: boolean | string;
    isProcessorFiltered: boolean | string;
  };
  contract: {
    current: number;
    isServiceNameFiltered: boolean | string;
    isProcessorFiltered: boolean | string;
  };
}
type ConclusionCategory = 'communication' | 'contract';
let serviceNameGroup = [];
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
    communication: {
      current: 1,
      isServiceNameFiltered: false,
      isProcessorFiltered: false,
    },
    contract: {
      current: 1,
      isServiceNameFiltered: false,
      isProcessorFiltered: false,
    },
    wantDownload: ['0', '0'],
  };
  filterIcon = (filtered?: boolean) => (
    <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
  );

  serviceNameSearchInput: { communication: Input | null; contract: Input | null } = {
    communication: null,
    contract: null,
  };
  processorSearchInput: { communication: Input | null; contract: Input | null } = {
    communication: null,
    contract: null,
  };
  onChange: (x: ConclusionCategory) => OnChange = category => (
    { current },
    filter,
    { field, order },
  ) => {
    console.log(current, filter, field, order);
    const newState: NonNullable<TableListState['callback']>['newState'] = {
      [category]: {
        current: field ? 1 : current!,
        isServiceNameFiltered:
          filter.serviceName && filter.serviceName[0] ? filter.serviceName[0] : false,
        isProcessorFiltered: filter.processor && filter.processor[0] ? filter.processor[0] : false,
      },
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

  onServiceNameFilterDropdownVisibleChange = (category: ConclusionCategory) => (
    visible?: boolean,
  ) => {
    if (visible) {
      setTimeout(() => this.serviceNameSearchInput[category]!.select());
    }
  };
  onProcessorFilterDropdownVisibleChange = (category: ConclusionCategory) => (
    visible?: boolean,
  ) => {
    if (visible) {
      setTimeout(() => this.processorSearchInput[category]!.select());
    }
  };

  serviceNameFilterDropdown = (category: 'communication' | 'contract') => ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }) => {
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
              that.serviceNameSearchInput[category] = node;
            }}
            placeholder={`搜索服务名`}
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
          Search
        </Button>
        <Button onClick={clearFilters} style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    );
  };
  processorFilterDropdown = (category: ConclusionCategory) => ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }) => {
    const that = this;
    return (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            that.processorSearchInput[category] = node;
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
  getColumns = (category: 'contract' | 'communication') => [
    {
      title: '服务名',
      dataIndex: 'serviceName',
      filterIcon: this.filterIcon,
      filterDropdown: this.serviceNameFilterDropdown(category),
      filtered: this.state[category].isServiceNameFiltered,
      onFilterDropdownVisibleChange: this.onServiceNameFilterDropdownVisibleChange(category),
      render: (value: string[], { description }: { description: string | any }) => (
        <span>
          {typeof description !== 'string'
            ? value
                .filter(item => !['communication', 'contract'].includes(item))
                .join('-')
                .replace('review', '审核')
                .replace('draft', '起草')
            : description.length > 30
            ? `${description.slice(0, 30)}...`
            : description}
          {typeof description === 'string' && description.length > 30 && (
            <Button
              type="link"
              size="small"
              onClick={() =>
                Modal.info({
                  maskClosable: true,
                  title: '问题详情',
                  content: description,
                  icon: () => <></>,
                })
              }
            >
              显示
            </Button>
          )}
        </span>
      ),
    },
    {
      title: '处理律师',
      dataIndex: 'processor',
      filterIcon: this.filterIcon,
      filterDropdown: this.processorFilterDropdown(category),
      filtered: this.state[category].isProcessorFiltered,
      onFilterDropdownVisibleChange: this.onProcessorFilterDropdownVisibleChange(category),
    },
    {
      title: '操作',
      dataIndex: '_id',
      render: (text: string) => <Link to={`conclusion/${text}`}>查看</Link>,
    },
  ];

  async componentDidMount() {
    const { dispatch } = this.props;
    serviceNameGroup = await getServiceNameGroup();
    dispatch({
      type: 'conclusionTable/getConclusions',
      payload: { communication: { current: 1 } },
    });
    dispatch({
      type: 'conclusionTable/getConclusions',
      payload: { contract: { current: 1 } },
    });
  }
  render() {
    console.log(this.props);
    const { wantDownload } = this.state;
    const filename = `${wantDownload[0]}至${wantDownload[1]}.docx`;
    const { loading } = this.props;
    return (
      <PageHeaderWrapper>
        <Card
          bordered={false}
          title="咨询问题"
          extra={
            <Button
              style={{ float: 'right' }}
              type="primary"
              onClick={() => this.setState({ wantDownload: ['1', '1'] })}
            >
              下载咨询类类问题汇总
            </Button>
          }
        >
          <div className={styles.tableList}>
            <Table<ConclusionTableItem>
              loading={loading}
              rowKey="_id"
              onChange={this.onChange('communication')}
              columns={this.getColumns('communication')}
              dataSource={this.props.conclusionTable.communication.conclusions}
              pagination={{
                total: this.props.conclusionTable.communication.total,
                current: this.state.communication.current,
              }}
            />
          </div>
        </Card>
        <Card bordered={false} title="合同问题">
          <div className={styles.tableList}>
            <Table<ConclusionTableItem>
              loading={loading}
              rowKey="_id"
              onChange={this.onChange('contract')}
              columns={this.getColumns('contract')}
              dataSource={this.props.conclusionTable.contract.conclusions}
              pagination={{
                total: this.props.conclusionTable.contract.total,
                current: this.state.contract.current,
              }}
            />
          </div>
        </Card>
        <Modal
          visible={wantDownload[0] !== '0'}
          title="下载问题库"
          footer={null}
          onCancel={() => {
            this.setState({ wantDownload: ['0', '0'] });
          }}
          width={580}
        >
          <div>
            请选择日期范围
            <RangePicker
              style={{ float: 'right' }}
              onChange={(_v, value) => this.setState({ wantDownload: value })}
            ></RangePicker>
          </div>
          {wantDownload[0] !== '1' && (
            <div>
              <Button type="primary" style={{ margin: '13px auto 0 200px' }}>
                <a
                  download={filename}
                  onClick={() =>
                    setTimeout(() => this.setState({ wantDownload: ['0', '0'] }), 1000)
                  }
                  href={`${URL}/backstage/conclusion/archive/${filename}`}
                >
                  立即下载
                </a>
              </Button>
            </div>
          )}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default ConclusionTable;
