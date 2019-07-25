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
  expert: any;
  privilege: any;
  id: string;
}
interface TableFormProps {
  loading?: boolean;
  value?: TableFormDateType[];
  onChange: (value: TableFormDateType) => void;
  onCancel: () => void;
}

interface TableFormState {
  loading?: boolean;
  editing: number;
  value?: TableFormDateType[];
  data?: TableFormDateType[];
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

  columns = [
    {
      title: '账号',
      dataIndex: 'account',
      key: 'account',
      width: '20%',
      render: (text: string, record: TableFormDateType) => {
        return <Link to="/servicer/fdfsfsf">{text}</Link>;
      },
    },
    {
      title: '密码',
      dataIndex: 'password',
      key: 'password',
      width: '20%',
      render: (text: string, record: TableFormDateType) => {
        return text;
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
      render: (text: string, record: TableFormDateType) => {
        return text;
      },
    },
    {
      title: '操作',
      key: 'id',
      dataIndex: 'id',
      render: (text: string, record: TableFormDateType, index: number) => {
        if (this.state.editing === index) {
          return (
            <span>
              <a
                onClick={e => {
                  this.props.onCancel();
                  this.setState({ editing: -1 });
                }}
              >
                取消
              </a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(index)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        }
        return (
          <span>
            <a onClick={e => this.toggleEditable(e, index)}>编辑</a>
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
      editing: -1,
      data: props.value,
      loading: false,
      value: props.value,
    };
  }

  toggleEditable = (e: React.MouseEvent | React.KeyboardEvent, index: number) => {
    e.preventDefault();
    const { data = [] } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.state.data![index];
    console.log(target);
    if (target) {
      // 进入编辑状态时保存原始数据
      this.props.onChange(target);
      this.setState({ editing: index });
    }
  };

  newMember = () => {
    /*
    const { data = [] } = this.state;
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      workId: '',
      name: '',
      department: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
    */
  };

  remove(index: number) {
    const { data = [] } = this.state;
    this.props.onCancel();
    data.splice(index, 1);
    this.setState({ editing: -1, data, value: data });
  }

  handleKeyPress(e: React.KeyboardEvent, key: string) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  saveRow(e: React.MouseEvent | React.KeyboardEvent, key: string) {
    /*
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if (!target.workId || !target.name || !target.department) {
        message.error('请填写完整成员信息。');
        (e.target as HTMLInputElement).focus();
        this.setState({
          loading: false,
        });
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, key);
      const { data = [] } = this.state;
      const { onChange } = this.props;
      if (onChange) {
        onChange(data);
      }
      this.setState({
        loading: false,
      });
    }, 500);
    */
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
          onClick={this.newMember}
          icon="plus"
        >
          新增成员
        </Button>
      </Fragment>
    );
  }
}

export default TableForm;
