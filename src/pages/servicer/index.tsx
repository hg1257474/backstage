import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  Popover,
  Row,
  Select,
  TimePicker,
} from 'antd';
import _ from 'lodash';
import React, { Component } from 'react';
import { TableFormDateType } from './components/TableForm';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import TableForm from './components/TableForm';
import FooterToolbar from './components/FooterToolbar';
import styles from './style.less';
import { image } from './images';
import ImageUpload from '../../components/ImageUpload';
import { StateType } from './model';
import { threadId } from 'worker_threads';
import { getServicer } from './service';

const { Option } = Select;
const { Search } = Input;
const fieldLabels = {
  account: '账号',
  password: '密码',
  name: '成员姓名',
  avatar: '头像',
  total: '服务客户数量',
  grade: '总体评分',
  expert: '擅长',
  privilege: '权限',
};

let oldSearchValue: string = "";
export interface TableCondition {
  pagination: { total: number; current: number };
  filteredValue: [];
  sortOrder: 'ascend' | 'descend' | false;
}
interface Props extends FormComponentProps {
  dispatch: Dispatch<any>;
  submitting: boolean;
  servicerTable: StateType;
}
interface State {
  width: string;
  inputTarget: any;
  tableCondition: TableCondition;
}
/*
@connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
  submitting: loading.effects['formAdvancedForm/submitAdvancedForm'],
}))
*/
function getPrevilegeSelectValue(value) {
  if (value) return value;
}
const initialTableCondition: TableCondition = {
  pagination: { total: 0, current: 1 },
  filteredValue: [],
  sortOrder: false,
};
@connect(x => {
  return {
    submitting: x.loading.effects['formAdvancedForm/submitAdvancedForm'],
    servicerTable: x.servicerTable,
  };
})
class AdvancedForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tableCondition: {
        pagination: { total: props.servicerTable.total, current: 1 },
        filteredValue: [],
        sortOrder: false,
      },
      width: '100%',
      inputTarget: null,
    };
  }

  searchRef = React.createRef();

  componentDidMount() {
    console.log(this.props);
    this.props.dispatch({
      type: 'servicerTable/getServicers',
      payload: {
        pagination: { current: 1 },
      },
    });
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  onSearch = (value: string) => {
    if (value.trim() !== oldSearchValue) {
      oldSearchValue = value.trim();
      this.props.dispatch({
        type: 'servicerTable/getServicers',
        payload: {
          pagination: { current: 1 },
          allName: oldSearchValue,
        },
      });

      this.setState({
        tableCondition: initialTableCondition,
        inputTarget: null,
      });
    }
  };

  onChoose = async (id: string | null, type?: 'new' | 'delete') => {
    if (type === 'delete') {
      const { total } = this.props.servicerTable;
      const { current } = this.state.tableCondition.pagination;
      const currentPage = total - 1 > (current - 1) * 10 ? current : current - 1;
      const tableCondition = {
        ...initialTableCondition,
        pagination: { total: total - 1, current: currentPage },
      };
      this.setState({ tableCondition });
      this.searchRef.current.input.input.value = '';
      this.props.dispatch({
        type: 'servicerTable/updateServicers',
        payload: {
          params: { pagination: { current: currentPage } },
          data: { method: 'DELETE', id },
        },
      });
      return;
    }
    let inputTarget = type === 'new' ? {} : null;
    if (id !== null) inputTarget = await getServicer(id);
    this.setState({ inputTarget });
  };

  onChangeTableCondition = (pagination, filtersArg, sorter) => {
    console.log((this.searchRef.current.input.input.value = ''));
    console.log(pagination);
    console.log(sorter);
    console.log(filtersArg);

    const newTableCondition: TableCondition = {
      pagination: { total: this.props.servicerTable.total, current: pagination.current },
      filteredValue: filtersArg.privilege,
      sortOrder: sorter.order,
    };
    console.log(newTableCondition);
    console.log(this.state.tableCondition);
    if (!_.isEqual(newTableCondition, this.state.tableCondition)) {
      this.setState({
        tableCondition: newTableCondition,
        inputTarget: null,
      });

      this.props.dispatch({
        type: 'servicerTable/getServicers',
        payload: {
          allName: oldSearchValue,
          ...newTableCondition,
        },
      });
    }
  };

  getErrorInfo = () => {
    const {
      form: { getFieldsError },
    } = this.props;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = (fieldKey: string) => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null;
      }
      const errorMessage = errors[key] || [];
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <Icon type="cross-circle-o" className={styles.errorIcon} />
          <div className={styles.errorMessage}>{errorMessage[0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={(trigger: HTMLElement) => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode as HTMLElement;
            }
            return trigger;
          }}
        >
          <Icon type="exclamation-circle" />
        </Popover>
        {errorCount}
      </span>
    );
  };

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0] as HTMLDivElement;
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.servicerTable.total !== state.tableCondition.pagination.total)
      state.tableCondition.pagination.total = props.servicerTable.total;
    return state;
  }
  validate = () => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        // submit the values
        console.log(values)
        const data = values;
        data.method = data.id ? 'PUT' : 'POST';
        const { total } = this.props.servicerTable;
        const { current } = this.state.tableCondition.pagination;
        let params = undefined;
        let currentPage = undefined;
        if (values.method === 'PUT') currentPage = current;
        else {
          currentPage = Math.ceil((total + 1) / 10);
        }
        params = { pagination: { current: currentPage, total: total + 1 } };
        dispatch({
          type: 'servicerTable/updateServicers',
          payload: {
            data,
            params,
          },
        });
        const tableCondition = {
          ...initialTableCondition,
          ...params,
        };
        this.setState({ tableCondition ,inputTarget:null});
        this.searchRef.current.input.input.value = '';
      }
    });
  };
  render() {
    console.log(this);
    const that = this;
    const {
      form: { getFieldDecorator },
      submitting,
    } = this.props;
    const { width } = this.state;
    return (
      <>
        <PageHeaderWrapper content="在此页面管理律师和管理员">
          {this.state.inputTarget && (
            <Card title="详细信息" className={styles.card} bordered={false}>
              <Form layout="vertical" hideRequiredMark>
                <Row gutter={16}>
                  <Col lg={6} md={12} sm={24}>
                    <Form.Item label={fieldLabels.account}>
                      {getFieldDecorator('username', {
                        initialValue: this.state.inputTarget.username,
                        rules: [{ required: true, message: '请输入' }],
                      })(<Input placeholder="请输入" />)}
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                    <Form.Item label={fieldLabels.password}>
                      {getFieldDecorator('password', {
                        initialValue: this.state.inputTarget.password,
                        rules: [{ required: true, message: '请选择' }],
                      })(<Input placeholder="请输入" />)}
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                    <Form.Item label={fieldLabels.name}>
                      {getFieldDecorator('name', {
                        initialValue: this.state.inputTarget.name,
                        rules: [],
                      })(<Input placeholder="请输入" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                    <Form.Item label={fieldLabels.avatar}>
                      {getFieldDecorator('avatar', {
                        initialValue: this.state.inputTarget.avatar,
                        rules: [],
                      })(<ImageUpload />)}
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                    <Form.Item label={fieldLabels.total}>
                      {getFieldDecorator('serviceTotal', {
                        initialValue: this.state.inputTarget.total,
                        rules: [],
                      })(<Input placeholder="请输入" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col lg={6} md={12} sm={24}>
                    <Form.Item label={fieldLabels.grade}>
                      {getFieldDecorator('grade', {
                        initialValue: this.state.inputTarget.grade,
                        rules: [],
                      })(<Input placeholder="请输入" />)}
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                    <Form.Item label={fieldLabels.expert}>
                      {getFieldDecorator('expert', {
                        initialValue: this.state.inputTarget.expert,
                        rules: [],
                      })(<Input placeholder="请输入" />)}
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                    <Form.Item label={fieldLabels.privilege}>
                      {getFieldDecorator('privilege', {
                        initialValue:
                          this.state.inputTarget.privilege &&
                          Object.keys(this.state.inputTarget.privilege),
                        rules: [{ required: true, message: '请选择律师权限' }],
                      })(
                        <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择">
                          <Option value="canAssignService">分配服务</Option>
                          <Option value="canManageServicer">管理成员</Option>
                          <Option value="canProcessingService">处理服务</Option>
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          )}
          <Card
            title="成员管理"
            bordered={false}
            extra={
              <Search
                placeholder="输入用户名或姓名搜索"
                ref={this.searchRef}
                onSearch={this.onSearch}
              />
            }
          >
            <TableForm
              tableCondition={this.state.tableCondition}
              onChange={this.onChangeTableCondition}
              value={this.props.servicerTable.servicers}
              onChoose={this.onChoose}
            />
          </Card>
        </PageHeaderWrapper>
        <FooterToolbar style={{ width }}>
          {this.getErrorInfo()}
          <Button type="primary" onClick={this.validate} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </>
    );
  }
}

export default Form.create<AdvancedFormProps>()(AdvancedForm);
