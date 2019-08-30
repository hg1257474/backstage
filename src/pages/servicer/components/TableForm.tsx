import { Button, Divider, Input, Popconfirm, Table, message, Icon } from 'antd';
import React, { Fragment, PureComponent } from 'react';
import Link from 'umi/link';
import { isEqual } from 'lodash';
import { ServicerTableItemDataType } from '../data';
import { TableProps } from 'antd/lib/table/interface';
import styles from '../style.less';
import { TableState } from '../index';
export type OnChange = TableProps<ServicerTableItemDataType>['onChange'];
const privilegeMap = {
  canAssignService: '分配服务',
  canProcessingService: '处理服务',
  canManageServicer: '管理成员',
};
interface TableFormProps extends TableState {
  loading?: boolean;
  value?: ServicerTableItemDataType[];
  total: number;
  onChange: OnChange;
  onChoose: (id: string | null, type?: 'new' | 'delete') => void;
}

interface TableFormState {
  loading?: boolean;
  value?: ServicerTableItemDataType[];
  data?: ServicerTableItemDataType[];
  editing: number;
}

class TableForm extends PureComponent<TableFormProps, TableFormState> {
  static getDerivedStateFromProps(nextProps: TableFormProps, preState: TableFormState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }
    return {
      data: nextProps.value,
      value: nextProps.value,
    };
  }

  clickedCancel: boolean = false;

  index = 0;

  cacheOriginData = {};
  remove = (index: number) => {
    const { data = [] } = this.state;
    const newData = data.filter((value, key) => key !== index);
    this.setState({ data: newData, value: newData });
  };
  filterIcon = target => filtered => (
    <Icon type="search" style={{ color: target ? '#1890ff' : undefined }} />
  );
  usernameSearchInput: Input | null = null;
  nameSearchInput: Input | null = null;
  filterDropdown = (target: 'usernameSearchInput' | 'nameSearchInput') => ({
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
            that[target] = node;
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
  onFilterDropdownVisibleChange = (target: 'usernameSearchInput' | 'nameSearchInput') => (
    visible: boolean,
  ) => {
    if (visible) {
      setTimeout(() => this.nameSearchInput!.select());
    }
  };
  getColumns = () => [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      filterIcon: this.filterIcon(this.props.isUsernameFiltered),
      onFilterDropdownVisibleChange: this.onFilterDropdownVisibleChange('usernameSearchInput'),
      filterDropdown: this.filterDropdown('usernameSearchInput'),
      width: '20%',
    },
    {
      title: '姓名',
      filterIcon: this.filterIcon(this.props.isNameFiltered),
      onFilterDropdownVisibleChange: this.onFilterDropdownVisibleChange('nameSearchInput'),
      filterDropdown: this.filterDropdown('nameSearchInput'),
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: '权限',
      dataIndex: 'privilege',
      key: 'privilege',
      width: '30%',
      filtered: this.props.privilegeFilter.length,
      filteredValue: this.props.privilegeFilter,
      filters: [
        {
          text: privilegeMap['canManageServicer'],
          value: 'canManageServicer',
        },
        {
          text: privilegeMap['canProcessingService'],
          value: 'canProcessingService',
        },
        {
          text: privilegeMap['canAssignService'],
          value: 'canAssignService',
        },
      ],
      render(text: {}) {
        return Object.keys(text)
          .map(item => privilegeMap[item])
          .join(',');
      },
    },
    {
      title: '处理服务数',
      dataIndex: 'servicesTotal',
      key: 'servicesTotal',
      sorter: true,
      width: '15%',
      sortOrder: this.props.servicesTotalSortOrder,
      render(text: number, record: ServicerTableItemDataType) {
        return <Link to={`/service?processorId=${record.id}`}>{text}</Link>;
      },
    },
    {
      title: '操作',

      dataIndex: 'id',
      render: (id: string, record: ServicerTableItemDataType, index: number) => (
        <span>
          <a
            onClick={e => {
              this.setState({ editing: index });
              this.props.onChoose(id);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <Popconfirm title="是否要删除此行？" onConfirm={() => this.props.onChoose(id, 'delete')}>
            <a>删除</a>
          </Popconfirm>
        </span>
      ),
    },
  ];

  constructor(props: TableFormProps) {
    super(props);
    this.state = {
      editing: -1,
      data: props.value,
      loading: false,
      editing: -1,
      value: props.value,
    };
  }
  render() {
    const { loading, data } = this.state;
    console.log(data);
    console.log(this.props);
    return (
      <Fragment>
        <Table<ServicerTableItemDataType>
          loading={loading}
          columns={this.getColumns()}
          dataSource={data}
          rowKey="id"
          rowClassName={record => ''}
          onChange={this.props.onChange}
          pagination={{ current: this.props.current, total: this.props.total }}
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={() => this.props.onChoose(null, 'new')}
          icon="plus"
        >
          新增成员
        </Button>
      </Fragment>
    );
  }
}

export default TableForm;
