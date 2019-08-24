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
import { TableFormDateType, OnChange } from './components/TableForm';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import TableForm from './components/TableForm';
import FooterToolbar from './components/FooterToolbar';
import styles from './style.less';
import Callback from '../../components/Callback';
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
interface Props extends FormComponentProps {
  dispatch: Dispatch<any>;
  submitting: boolean;
  servicerForm: StateType;
  timestamp: number;
}
export interface TableState {
  servicesTotalSortOrder?: 'ascend' | 'descend' | false;
  isNameFiltered: boolean | string;
  isUsernameFiltered: boolean | string;
  privilegeFilter: string[];
  current: number;
}
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
interface State extends TableState {
  callback?: {
    timestamp: number;
    newState: Omit<State, 'width'>;
  };
  width: string;
  inputTarget?: any;
}
const initialTableState: NonNullable<State['callback']>['newState'] = {
  current: 1,
  isNameFiltered: false,
  isUsernameFiltered: false,
  privilegeFilter: [],
  servicesTotalSortOrder: false,
};
/*
@connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
  submitting: loading.effects['formAdvancedForm/submitAdvancedForm'],
}))
*/
@connect(x => {
  return {
    submitting: x.loading.effects['formAdvancedForm/submitAdvancedForm'],
    servicerForm: x.servicerForm,
    timestamp: x.servicerForm.timestamp,
  };
})
class ServicerForm extends Callback<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ...initialTableState,
      width: '100%',
    };
  }

  searchRef = React.createRef();

  componentDidMount() {
    /* console.log(this.props); */
    this.props.dispatch({
      type: 'servicerForm/getServicers',
      payload: {
        params: { current: 1 },
      },
    });
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  onChange: OnChange = ({ current }, filter, { field, order }) => {
    /* console.log(current, filter, field, order); */
    const newState: NonNullable<State['callback']>['newState'] = {
      current: current!,
      isNameFiltered: filter.name && filter.name.length ? filter.name[0] : false,
      isUsernameFiltered: filter.username && filter.username.length ? filter.username[0] : false,
      privilegeFilter: filter.privilege,
      servicesTotalSortOrder: field === 'servicesTotal' && order,
    };
    const timestamp = new Date().getTime();
    this.setState({
      callback: {
        timestamp,
        newState,
      },
    });
    this.props.dispatch({
      type: 'servicerForm/getServicers',
      payload: {
        params: newState,
        timestamp,
      },
    });
    return 1;
  };

  onChoose = async (id: string | null, type?: 'new' | 'delete') => {
    if (type === 'delete') {
      console.log(id);
      const { total } = this.props.servicerForm;
      let { current } = this.state;
      const timestamp = new Date().getTime();
      current = (total - 1 === 10 * (current - 1) ? current - 1 : current) || 1;
      this.setState({
        callback: {
          timestamp,
          newState: { ...this.state, current },
        },
      });

      this.props.dispatch({
        type: 'servicerForm/deleteServicer',
        payload: {
          id,
          params: {
            current,
            isNameFiltered: this.state.isNameFiltered,
            isUsernameFiltered: this.state.isUsernameFiltered,
            privilegeFilter: this.state.privilegeFilter,
            servicesTotalSortOrder: this.state.servicesTotalSortOrder,
          },
          timestamp,
        },
      });
      return 1;
    }
    /* console.log(type); */
    let inputTarget = type === 'new' ? {} : null;
    if (id !== null) inputTarget = await getServicer(id);
    /* console.log(inputTarget); */
    this.setState({ inputTarget });
    return 1;
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

  validate = () => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    if (this.state.inputTarget === undefined) return 1;
    validateFieldsAndScroll((error, values) => {
      /* console.log(error); */
      /* console.log(values); */
      if (!error) {
        const timestamp = new Date().getTime();
        let action: any = {};
        let newState = {};
        values.id = this.state.inputTarget._id;
        Object.values(values.privilege).forEach((item, index) => {
          if (!index) values.privilege = {};
          values.privilege[item as string] = true;
        });
        if (values.avatar && !values.avatar.length) delete values.avatar;
        /* console.log(values); */
        if (values.id) {
          action = {
            type: 'servicerForm/updateServicer',
            payload: {
              params:this.state,
              data: values,
            },
          };
        } else {
          let { current } = this.state;
          const { total } = this.props.servicerForm;
          current = 1;
          newState = {
            current,
            isNameFiltered: false,
            isUsernameFiltered: false,
            privilegeFilter: [],
            servicesTotalSortOrder: false,
          };
          action = {
            type: 'servicerForm/addServicer',
            payload: {
              params: { current },
              data: values,
            },
          };
        }
        console.log(action);

        action.payload.timestamp = timestamp;
        console.log(action);
        dispatch(action);
        console.log(action);
        this.setState({
          callback: {
            timestamp,
            newState: { ...this.state, ...newState, inputTarget: undefined },
          },
        });
      }
    });
  };

  render() {
    /* console.log(this); */
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
                      })(<ImageUpload target="lawyer_avatar" />)}
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
          <Card title="成员管理" bordered={false}>
            <TableForm
              onChange={this.onChange}
              value={this.props.servicerForm.servicers}
              current={this.state.current}
              total={this.props.servicerForm.total}
              onChoose={this.onChoose}
              servicesTotalSortOrder={this.state.servicesTotalSortOrder}
              privilegeFilter={this.state.privilegeFilter}
              isNameFiltered={this.state.isNameFiltered}
              isUsernameFiltered={this.state.isUsernameFiltered}
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

export default Form.create()(ServicerForm);
