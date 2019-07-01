import {
  Avatar,
  Button,
  Card,
  Option,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Icon,
  Input,
  List,
  Menu,
  Modal,
  Progress,
  Radio,
  Row,
  Select,
} from 'antd';
const { Option } = Select;
import React from 'react';
import Result from '../../Result';

const FormItem = Form.Item;
interface Prop {
  visible:Boolean;
  shouldNewItem:Boolean;
  selectedPage: 'index' | 'pay';
  done: Boolean;
  newItem: Boolean | undefined;
  getFieldDecorator: (...x: any[]) => (...x: any[]) => {};
}
interface State {
  current: {
    category?: String;
    categoryDescription?: String;
    categoryIcon?: String;
    term?: String;
    termSummary?: String;
    termDescription?: String;
    termIcon?: String;
  };
}

export default class extends React.Component<Prop, State> {
  state: State = {
    current: {},
  };
  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };
  onSelectNewTarget = e => {
    let newState = {};
    if (e === 'category') newState = { category: '', categoryDescription: '', categoryIcon: '' };
    if (e === 'term')
      newState = { category: '', termSummary: '', termDescription: '', termIcon: '' };
    this.setState(newState);
  };
  render() {
    const { getFieldDecorator,done } = this.props;
    const { current } = this.state;
    return (
      <Modal
        title={done ? null : `任务${current ? '编辑' : '添加'}`}
        className={this.props.className}
        width={640}
        bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
        destroyOnClose
        visible={this.props.visible}
        {...modalFooter}
      >
        {this.props.done && (
          <Result
            type="success"
            title="操作成功"
            description="一系列的信息描述，很短同样也可以带标点。"
            actions={
              <Button type="primary" onClick={this.handleDone}>
                知道了
              </Button>
            }
            className={styles.formResult}
          />
        )}
        {this.props.selectedPage === 'index' && (
          <>
            {this.props.shouldNewItem && (
              <FormItem label="" {...this.formLayout}>
                {getFieldDecorator('category', {
                  rules: [{ required: true, message: '请选择新加对象' }],
                  initialValue: '',
                })(
                  <Select
                    defaultValue="lucy"
                    style={{ width: 120 }}
                    onChange={this.onSelectNewTaget}
                  >
                    <Option value="jack">服务类型</Option>
                    <Option value="lucy">服务项</Option>
                  </Select>,
                )}
              </FormItem>
            )}
            {current.categoryDescription && (
              <>
                <FormItem label="服务类名" {...this.formLayout}>
                  {getFieldDecorator('category', {
                    rules: [{ required: true, message: '请输入服务类名' }],
                    initialValue: current.category,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="服务类别说明" {...this.formLayout}>
                  {getFieldDecorator('categoryDescription', {
                    rules: [{ required: true, message: '请输入服务类别说明' }],
                    initialValue: current.categoryDescription,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="服务图标" {...this.formLayout}>
                  {getFieldDecorator('icon', {
                    rules: [{ required: true, message: '请上传服务图标' }],
                    initialValue: current.icon,
                  })(<ImageUploader />)}
                </FormItem>
              </>
            )}
            {current.termDescription!==undefined && (
              <>
                <FormItem label="服务类别" {...this.formLayout}>
                  {getFieldDecorator('category', {
                    rules: [{ required: true, message: '请输入任务名称' }],
                    initialValue: current.category,
                  })(
                    <Select>
                      <Option value="merger">融资并购</Option>
                      <Option value="laborDispute">劳务纠纷</Option>
                    </Select>,
                  )}
                </FormItem>
                <FormItem label="服务名" {...this.formLayout}>
                  {getFieldDecorator('title', {
                    rules: [{ required: true, message: '请输入任务名称' }],
                    initialValue: current.term,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="服务概要" {...this.formLayout}>
                  {getFieldDecorator('title', {
                    rules: [{ required: true, message: '请输入任务名称' }],
                    initialValue: current.termSummary,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="服务说明" {...this.formLayout}>
                  {getFieldDecorator('title', {
                    rules: [{ required: true, message: '请输入任务名称' }],
                    initialValue: current.termDescription,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </>
            )}
          </>
        )}
      </Modal>
    );
  }
}
