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
import React, { Component } from 'react';
import { TableFormDateType } from './components/TableForm';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import TableForm from './components/TableForm';
import FooterToolbar from './components/FooterToolbar';
import styles from './style.less';
import { img1, img2 } from './data';
const { Option } = Select;

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

interface AdvancedFormProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  submitting: boolean;
}

@connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
  submitting: loading.effects['formAdvancedForm/submitAdvancedForm'],
}))
class AdvancedForm extends Component<AdvancedFormProps> {
  state = {
    width: '100%',
    shouldInput: false,
  };

  componentDidMount() {
    console.log(this.props);
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

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
  test: TableFormDateType[] = [
    {
      account: 'admin',
      password: 'password',
      name: '阿斯顿',
      avatar: img1,
      total: 10,
      grade: 100,
      expert: '擅长',
      privilege: '权限',
      id: '111111111111111',
    },
    {
      account: '账号',
      password: '密码',
      name: '成员姓名',
      avatar: img2,
      total: 20,
      grade: 200,
      expert: '擅长',
      privilege: '权限',
      id: '22222222222222',
    },
  ];
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
          {this.state.shouldInput && (
            <Card title="详细信息" className={styles.card} bordered={false}>
              <Form layout="vertical" hideRequiredMark>
                <Row gutter={16}>
                  <Col lg={6} md={12} sm={24}>
                    <Form.Item label={fieldLabels.account}>
                      {getFieldDecorator('account', {
                        rules: [{ required: true, message: '请输入' }],
                      })(<Input placeholder="请输入" />)}
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                    <Form.Item label={fieldLabels.password}>
                      {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请选择' }],
                      })(<Input placeholder="请输入" />)}
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                    <Form.Item label={fieldLabels.name}>
                      {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请选择管理员' }],
                      })(<Input placeholder="请输入" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                    <Form.Item label={fieldLabels.avatar}>
                      {getFieldDecorator('avatar', {
                        rules: [{ required: true, message: '请选择' }],
                      })(<Input placeholder="请输入" />)}
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                    <Form.Item label={fieldLabels.total}>
                      {getFieldDecorator('owner2', {
                        rules: [{ required: true, message: '请选择管理员' }],
                      })(<Input placeholder="请输入" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col lg={6} md={12} sm={24}>
                    <Form.Item label={fieldLabels.grade}>
                      {getFieldDecorator('approver2', {
                        rules: [{ required: true, message: '请选择审批员' }],
                      })(<Input placeholder="请输入" />)}
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                    <Form.Item label={fieldLabels.expert}>
                      {getFieldDecorator('dateRange2', {
                        rules: [{ required: true, message: '请输入' }],
                      })(
                        <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择">
                          <Option value="taxReporting">税收报账</Option>
                          <Option value="licenseProcessing">许可证办理</Option>
                          <Option value="equityDistribution">股权分配</Option>
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                    <Form.Item label={fieldLabels.privilege}>
                      {getFieldDecorator('type2', {
                        rules: [{ required: true, message: '请选择仓库类型' }],
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
          <Card title="成员管理" bordered={false}>
            <TableForm
              value={this.test}
              onCancel={() => this.setState({ shouldInput: false, inputTarget: null })}
              onChange={(x: TableFormDateType) => {
                console.log(x);
                console.log('dddddddddddddddddddddddddddd');
                this.setState({ shouldInput: true, inputTarget: x });
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
