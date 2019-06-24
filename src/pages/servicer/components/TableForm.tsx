import { Button, Divider, Input, Popconfirm, Table, message } from 'antd';
import React, { Fragment, PureComponent } from 'react';
import Link from 'umi/link';
import { isEqual } from 'lodash';
import styles from '../style.less';

export interface TableFormDateType {
  account: string;
  password: string;
  name: string;
  avatar: string;
  total: number;
  grade: number;
  expert: [];
  privilege: [];
  serviceTotal?: number;
  id:string;
}
interface TableFormProps {
  loading?: boolean;
  value?: TableFormDateType[];
  onChoose: (value: TableFormDateType | null | 'new') => void;
}

interface TableFormState {
  loading?: boolean;
  value?: TableFormDateType[];
  data?: TableFormDateType[];
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
  columns = [
    {
      title: '账号',
      dataIndex: 'account',
      key: 'account',
      width: '20%',
    },
    {
      title: '密码',
      dataIndex: 'password',
      key: 'password',
      width: '20%',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: '处理服务数',
      dataIndex: 'serviceTotal',
      key: 'serviceTotal',
      width: '20%',
      render(text: number, record: TableFormDateType) {
        return <Link to={`/servicer/${record.id}/service`}>{text}</Link>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: TableFormDateType, index: number) => {
        /*
        const { loading } = this.state;
        if (!!record.editable && loading) {
          return null;
        }
        */
        if (index === this.state.editing) {
          return (
            <span>
              <a onClick={e => this.props.onChoose(null)}>取消</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(index)}>
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
                this.props.onChoose(record);
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(index)}>
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
      data: props.value,
      loading: false,
      editing: -1,
      value: props.value,
    };
  }

  render() {
    console.log(this);
    const { loading, data } = this.state;

    return (
      <Fragment>
        <Table<TableFormDateType>
          loading={loading}
          columns={this.columns}
          dataSource={data}
          pagination={{ total: 10 }}
          rowClassName={record => ''}
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={() => this.props.onChoose('new')}
          icon="plus"
        >
          新增成员
        </Button>
      </Fragment>
    );
  }
}

export default TableForm;
