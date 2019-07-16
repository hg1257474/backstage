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

let oldSearchValue: string = 'undefined';
let oldTableCondition = undefined;
let q = 0;
interface AdvancedFormProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  submitting: boolean;
  servicerTable: StateType;
}
/*
@connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
  submitting: loading.effects['formAdvancedForm/submitAdvancedForm'],
}))
*/
@connect(x => {
  return {
    submitting: x.loading.effects['formAdvancedForm/submitAdvancedForm'],
    servicerTable: x.servicerTable,
  };
})
class AdvancedForm extends Component<AdvancedFormProps> {

  state = {
    needRemount: false,
    width: '100%',
    page: 1,
    inputTarget: null,
    pagination: { total: 10 },
  };

  componentDidMount() {
    console.log(this.props);
    this.props.dispatch({
      type: 'servicerTable/getServicers',
      payload: {
        page: 1,
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
          page: 1,
          searchValue: oldSearchValue,
        },
      });
      this.setState({ page: 1, inputTarget: null });
    }
  };

  onChangeCondition = (pagination, filtersArg, sorter) => {
    
    console.log(pagination);
    console.log(sorter);
    console.log(filtersArg);
    const tableCondition = {
      pageCurrent: pagination.current,
      privilegeFilter: filtersArg.privilege,
      servicesTotalOrder: sorter.order,
    };
    if (_.isEqual(tableCondition, oldTableCondition)) {
      oldTableCondition = tableCondition;
      this.props.dispatch({
        type: 'servicerTable/getServicers',
        payload: {
          search: {
            allName: oldSearchValue,
            ...oldTableCondition,
          },
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

  validate = () => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        // submit the values
        dispatch({
          type: 'formAdvancedForm/submitAdvancedForm',
          payload: values,
        });
      }
    });
  };
  render() {
    console.log(this);
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
                      {getFieldDecorator('account', {
                        initialValue: this.state.inputTarget.account,
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
                        rules: [{ required: true, message: '请选择管理员' }],
                      })(<Input placeholder="请输入" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                    <Form.Item label={fieldLabels.avatar}>
                      {getFieldDecorator('avatar', {
                        initialValue: this.state.inputTarget.avatar,
                        rules: [{ required: true, message: '请选择' }],
                      })(<ImageUpload onChange={() => null} />)}
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                    <Form.Item label={fieldLabels.total}>
                      {getFieldDecorator('total', {
                        initialValue: this.state.inputTarget.total,
                        rules: [{ required: true, message: '请输入服务客户人数' }],
                      })(<Input placeholder="请输入" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col lg={6} md={12} sm={24}>
                    <Form.Item label={fieldLabels.grade}>
                      {getFieldDecorator('grade', {
                        initialValue: this.state.inputTarget.grade,
                        rules: [{ required: true, message: '请输入分数' }],
                      })(<Input placeholder="请输入" />)}
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                    <Form.Item label={fieldLabels.expert}>
                      {getFieldDecorator('expert', {
                        initialValue: this.state.inputTarget.expert,
                        rules: [{ required: true, message: '请输入' }],
                      })(<Input placeholder="请输入" />)}
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                    <Form.Item label={fieldLabels.privilege}>
                      {getFieldDecorator('privilege', {
                        initialValue: this.state.inputTarget.privilege,
                        rules: [{ required: true, message: '请选择律师权限' }],
                      })(
                        <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择">
                          <Option value="assignLawyer">分配律师</Option>
                          <Option value="manageManager">管理管理员</Option>
                          <Option value="manageLawyer">管理律师</Option>
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
            extra={<Search placeholder="输入用户名或姓名搜索" onSearch={this.onSearch} />}
          >
            <TableForm
              pagination={this.state.pagination}
              onChangeCondition={this.onChangeCondition}
              value={this.props.servicerTable.servicers}
              onChoose={inputTarget => {
                console.log(inputTarget);
                this.setState({ inputTarget });
              }}
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
