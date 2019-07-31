import { Button, Divider, Input, Popconfirm, Table, message } from 'antd';
import React, { Fragment, PureComponent } from 'react';
import Link from 'umi/link';
import { isEqual } from 'lodash';
import { ServicerTableItemDataType } from '../data';
import styles from '../style.less';
const privilegeMap = {
  canAssignService: '分配服务',
  canProcessingService: '处理服务',
  canManageServicer: '管理成员',
};
interface TableFormProps {
  loading?: boolean;
  value?: ServicerTableItemDataType[];
  sortOrder: 'ascend' | 'descend' | false;
  pagination: {
    total: number;
    current: number;
  };
  isNameFiltered: boolean;
  isUsernameFiltered: boolean;
  privilegeFilter: [];
  onChange: (x: any) => void;
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
  getColumns = () => [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      filtered: this.props.isUsernameFiltered,
      width: '20%',
    },
    {
      title: '姓名',
      filtered: this.props.isNameFiltered,
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
      sortOrder: this.props.sortOrder,
      render(text: number, record: ServicerTableItemDataType) {
        return <Link to={`/servicer/${record.id}/service`}>{text}</Link>;
      },
    },
    {
      title: '操作',

      dataIndex: 'id',
      render: (id: string, record: ServicerTableItemDataType, index: number) => {
        /*
        const { loading } = this.state;
        if (!!record.editable && loading) {
          return null;
        }
        */
        if (index === this.state.editing) {
          return (
            <span>
              <a
                onClick={e => {
                  this.setState({ editing: -1 });
                  this.props.onChoose(null);
                }}
              >
                取消
              </a>

              <Divider type="vertical" />
              <Popconfirm
                title="是否要删除此行？"
                onConfirm={() => this.props.onChoose(id, 'delete')}
              >
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        }
        return (
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
            <Popconfirm
              title="是否要删除此行？"
              onConfirm={() => this.props.onChoose(id, 'delete')}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
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
          pagination={this.props.pagination}
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
