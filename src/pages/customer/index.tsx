import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Modal,
  Table,
  Form,
  Icon,
  Input,
  InputNumber,
  Menu,
  Row,
  Select,
  message,
  Descriptions,
} from 'antd';
import Link from 'umi/link';
import { FormattedMessage } from 'umi-plugin-react/locale';

import { CustomerTableItem } from './data.d';
import React, { Component, Fragment } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import * as moment from 'moment';
import { StateType } from './model';
import { getInfo } from './service';
import styles from './style.less';
import ConclusionTable from '../conclusion';
import { getFileInfo } from 'prettier';
interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  customerTable: StateType;
}
type SortType = boolean | 'ascend' | 'descend';
interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  formValues: { [key: string]: string };
  pointsTotalSort: SortType;
  serviceTotalSort: SortType;
  orderTotalSort: SortType;
  consumptionSort: SortType;
  current: number;
  isCompanyFiltered: boolean;
  infoModalData: [string, any][];
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
    serviceTotalSort: false,
    orderTotalSort: false,
    consumptionSort: false,
    pointsTotalSort: false,
    current: 1,
    isCompanyFiltered: false,
    infoModalData: [],
  };
  companyFilterIcon = filtered => (
    <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
  );
  companySearchInput: Input | null = null;
  onCompanyFilterDropdownVisibleChange = visible => {
    if (visible) {
      setTimeout(() => this.companySearchInput!.select());
    }
  };
  companyFilterDropdown = ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
    const that = this;
    return (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            that.companySearchInput = node;
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
      title: '公司名',
      dataIndex: 'company',
      filterIcon: this.companyFilterIcon,
      filterDropdown: this.companyFilterDropdown,
      filtered: this.state.isCompanyFiltered,
      onFilterDropdownVisibleChange: this.onCompanyFilterDropdownVisibleChange,
    },
    {
      title: '积分',
      sorter: true,
      sortOrder: this.state.pointsTotalSort,
      dataIndex: 'pointsTotal',
    },
    {
      title: '消费金额',
      sorter: true,
      sortOrder: this.state.consumptionSort,
      dataIndex: 'consumption',
    },
    {
      title: '服务数',
      sorter: true,
      sortOrder: this.state.serviceTotalSort,
      dataIndex: 'serviceTotal',
      render: (text: number, record: any) => (
        <Link to={`service?customerId=${record._id}`}>{text}</Link>
      ),
    },
    {
      title: '订单数',
      sorter: true,
      sortOrder: this.state.orderTotalSort,
      dataIndex: 'orderTotal',
      render: (text: number, record: any) => (
        <Link to={`order?customerId=${record._id}`}>{text}</Link>
      ),
    },
    {
      title: '身份信息',
      dataIndex: '_id',
      render: (id: string) => (
        <Button
          type="primary"
          size="small"
          onClick={async () => {
            let res = await getInfo(id);
            console.log(res);
            if (res) {
              res = Object.entries(res).filter(item => !!item[1]);
              console.log(res);
              if (!res.length) res = [null];
              this.setState({ infoModalData: res });
            }
          }}
        >
          查看
        </Button>
      ),
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
      pointsTotalSort: field === 'pointsTotal' && order,
      orderTotalSort: field === 'orderTotal' && order,
      serviceTotalSort: field === 'serviceTotal' && order,
      consumptionSort: field === 'consumption' && order,
      isCompanyFiltered: filter.company && filter.company ? filter.company[0] : false,
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
              dataSource={this.props.customerTable.customers}
              pagination={{
                total: this.props.customerTable.total,
                current: this.state.current,
              }}
            />
            <Modal
              title="身份信息"
              footer={null}
              visible={!!this.state.infoModalData.length}
              onCancel={() => this.setState({ infoModalData: [] })}
            >
              {this.state.infoModalData![0] === null ? (
                <div style={{ textAlign: 'center' }}>无数据</div>
              ) : (
                <Descriptions>
                  {this.state.infoModalData!.map((item: [string, any], index: number) => (
                    <Descriptions.Item
                      key={index}
                      label={<FormattedMessage id={item[0]} />}
                      span={3}
                    >
                      {item[1]}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              )}
            </Modal>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
