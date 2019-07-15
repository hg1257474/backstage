import {
  Avatar,
  Button,
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
  InputNumber,
} from 'antd';
import styles from '../../style.less';
import ImageUpload from '../ImageUpload';
const { Option } = Select;
import React, { FormEvent } from 'react';
import Result from '../../Result';
import { NewTargetType } from '../../index';
import {
  getIndexPageTermTotal,
  getIndexPageCategories,
  getIndexPageCategoryTotal,
} from '../../service';
import { resolveSrv } from 'dns';

const FormItem = Form.Item;

type ValidationRule = {
  /** validation error message */
  message?: React.ReactNode;
  /** built-in validation type, available options: https://github.com/yiminghe/async-validator#type */
  type?: string;
  /** indicates whether field is required */
  required?: boolean;
  /** treat required fields that only contain whitespace as errors */
  whitespace?: boolean;
  /** validate the exact length of a field */
  len?: number;
  /** validate the min length of a field */
  min?: number;
  /** validate the max length of a field */
  max?: number;
  /** validate the value from a list of possible values */
  enum?: string | string[];
  /** validate from a regular expression */
  pattern?: RegExp;
  /** transform a value before validation */
  transform?: (value: any) => any;
  /** custom validate function (Note: callback must be called) */
  validator?: (rule: any, value: any, callback: any, source?: any, options?: any) => any;
};
type GetFieldDecoratorOptions = {
  /** 子节点的值的属性，如 Checkbox 的是 'checked' */
  valuePropName?: string;
  /** 子节点的初始值，类型、可选值均由子节点决定 */
  initialValue?: any;
  /** 收集子节点的值的时机 */
  trigger?: string;
  /** 可以把 onChange 的参数转化为控件的值，例如 DatePicker 可设为：(date, dateString) => dateString */
  getValueFromEvent?: (...args: any[]) => any;
  /** Get the component props according to field value. */
  getValueProps?: (value: any) => any;
  /** 校验子节点值的时机 */
  validateTrigger?: string | string[];
  /** 校验规则，参见 [async-validator](https://github.com/yiminghe/async-validator) */
  rules?: ValidationRule[];
  /** 是否和其他控件互斥，特别用于 Radio 单选控件 */
  exclusive?: boolean;
  /** Normalize value to form component */
  normalize?: (value: any, prevValue: any, allValues: any) => any;
  /** Whether stop validate on first rule of error for this field.  */
  validateFirst?: boolean;
  /** 是否一直保留子节点的信息 */
  preserve?: boolean;
};
interface Props {
  newTarget?: NewTargetType;
  indexPageCategories?: Array<string>;
  max: number;
  visible: boolean | undefined;
  onDone: () => void;
  onCancel: () => void;
  onSubmit: (e: FormEvent<Element>) => void;
  current: any;
  done: Boolean;
  // getFieldDecorator: (...x: any[]) => (...x: any[]) => {};
  getFieldDecorator: <T extends Object = {}>(
    id: keyof T,
    options?: GetFieldDecoratorOptions | undefined,
  ) => (node: React.ReactNode) => React.ReactNode;
}
interface State {
  max: number;
  newTarget?: NewTargetType;
  indexPageCategories?: Array<string>;
  current: {
    category?: String;
    categoryDescription?: String;
    categoryIcon?: String;
    term?: String;
    termSummary?: String;
    termDescription?: String;
    termIcon?: String;
    index?: number;
  };
}
export default class extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    console.log(props);
    console.log('Dddddddddddddddddddddddddddddddddddd');
    this.state = {
      max: props.max,
      newTarget: props.newTarget,
      current: props.current,
      indexPageCategories: props.indexPageCategories,
    };
  }

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };
  onSelectNewTarget = async (e: any) => {
    console.log(e);
    let newState = {};
    if (e === 'IndexPageCategory') {
      const count = await getIndexPageCategoryTotal();
      newState = {
        max: count,
        current: { category: '', categoryDescription: '', categoryIcon: '', index: count },
      };
    }
    if (e === 'IndexPageTerm') {
      const count = await getIndexPageTermTotal(0);
      const indexPageCategories = await getIndexPageCategories();
      console.log(count);
      newState = {
        max: count,
        indexPageCategories,
        current: {
          termIcon: '',
          category: indexPageCategories[0],
          term: '',
          termSummary: '',
          termDescription: '',
          index: count,
        },
      };
    }
    newState.newTarget = e;
    console.log(newState);
    this.setState(newState);
  };
  render() {
    const { getFieldDecorator, done, onDone, onCancel, onSubmit } = this.props;
    const { current, newTarget } = this.state;
    const modalFooter =
      done || !current
        ? { footer: null, onCancel: onDone }
        : { okText: '保存', onOk: onSubmit, onCancel: onCancel };
    console.log(current);
    console.log(this.props);
    return (
      <Modal
        title={done ? null : `任务${current ? '编辑' : '添加'}`}
        className={styles.standardListForm}
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
              <Button type="primary" onClick={onDone}>
                知道了
              </Button>
            }
            className={styles.formResult}
          />
        )}

        {!this.props.done && (
          <>
            {this.state.newTarget && (
              <FormItem label="请选择新加对象" {...this.formLayout}>
                <Select defaultValue={this.state.newTarget} onChange={this.onSelectNewTarget}>
                  <Option value="IndexPageCategory">首页分类</Option>
                  <Option value="IndexPageTerm">首页子项</Option>
                </Select>
                ,
              </FormItem>
            )}
            {(newTarget === 'IndexPageCategory' || current.categoryDescription !== undefined) && (
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
                    initialValue: current.categoryDescription||"-",
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="服务图标" {...this.formLayout}>
                  {getFieldDecorator('categoryIcon', {
                    rules: [{ required: true, message: '请上传服务图标' }],
                    initialValue: current.categoryIcon,
                  })(<ImageUpload />)}
                </FormItem>
                <FormItem label="序号" {...this.formLayout}>
                  {getFieldDecorator('index', {
                    rules: [{ required: true, message: '请填写序号' }],
                    initialValue: current.index + 1,
                  })(
                    <InputNumber
                      placeholder="请输入"
                      min={1}
                      max={this.state.newTarget ? this.state.max + 1 : this.state.max}
                    />,
                  )}
                </FormItem>
              </>
            )}
            {(newTarget === 'IndexPageTerm' || current.termDescription !== undefined) && (
              <>
                <FormItem
                  label="服务类别"
                  {...this.formLayout}
                  data-asd={this.state.indexPageCategories![current.category]}
                >
                  {getFieldDecorator('category', {
                    rules: [{ required: true, message: '请输入任务名称' }],
                    initialValue: current.category,
                  })(
                    <Select>
                      {this.state.indexPageCategories!.map((item, index) => (
                        <Option value={item} key={index}>
                          {item}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
                <FormItem label="服务名" {...this.formLayout}>
                  {getFieldDecorator('term', {
                    rules: [{ required: true, message: '请输入任务名称' }],
                    initialValue: current.term,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="服务概要" {...this.formLayout}>
                  {getFieldDecorator('termSummary', {
                    rules: [{ required: true, message: '请输入任务名称' }],
                    initialValue: current.termSummary,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="服务说明" {...this.formLayout}>
                  {getFieldDecorator('termDescription', {
                    rules: [{ required: true, message: '请输入任务名称' }],
                    initialValue: current.termDescription||"-",
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="服务图标" {...this.formLayout}>
                  {getFieldDecorator('termIcon', {
                    rules: [{ required: true, message: '请上传服务图标' }],
                    initialValue: current.termIcon,
                  })(<ImageUpload />)}
                </FormItem>
                <FormItem label="序号" {...this.formLayout}>
                  {getFieldDecorator('index', {
                    rules: [{ required: true, message: '请填写序号' }],
                    initialValue: current.index! + 1,
                  })(
                    <InputNumber
                      placeholder="请输入"
                      min={1}
                      max={this.state.newTarget ? this.state.max + 1 : this.state.max}
                    />,
                  )}
                </FormItem>
              </>
            )}
          </>
        )}
      </Modal>
    );
  }
}

/*
 <Select style={{width:"30%"}}>
                      <Option value="merger">融资并购</Option>
                      <Option value="laborDispute">劳务纠纷</Option>
                    </Select>,
                    */
