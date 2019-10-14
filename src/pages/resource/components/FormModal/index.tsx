import {
  Avatar,
  Button,
  DatePicker,
  Dropdown,
  Form,
  Icon,
  Input,
  message,
  List,
  Menu,
  Modal,
  Progress,
  Radio,
  Row,
  Select,
  InputNumber,
  Upload,
} from 'antd';
import { URL } from '../../../../config';
import styles from '../../style.less';
import ImageUpload from '../ImageUpload';
const { Option } = Select;
import React, { FormEvent, ChangeEvent } from 'react';
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
type TargetType = 'indexPageCategory' | 'indexPageTerm';
interface Props {
  target: TargetType;
  max: number;
  indexPageCategorySelected?: number;
  onDone: () => void;
  onCancel: () => void;
  onSubmit: (e: FormEvent<Element>) => void;
  inputTarget: any;
  done: Boolean;
  // getFieldDecorator: (...x: any[]) => (...x: any[]) => {};
  getFieldDecorator: <T extends Object = {}>(
    id: keyof T,
    options?: GetFieldDecoratorOptions | undefined,
  ) => (node: React.ReactNode) => React.ReactNode;
}
interface State {
  max: number;
  visible: boolean;
  indexPageCategorySelected: number;
  indexPageCategories?: Array<string>;
  inputTarget: {
    category?: String;
    term?: String;
    termDescription?: String;
    termIcon?: String;
    index?: number;
  };
}
const Other = ({
  value,
  onChange,
  isFileUpload,
}: {
  value: any;
  onChange: (x: [string, string] | string) => void;
  isFileUpload: boolean;
}) => {
  return isFileUpload ? (
    <Upload
      defaultFileList={value.map((item: [string], index: number) => ({
        name: item[0],
        uid: index,
        size: index,
        type: 'text/plain',
      }))}
      onChange={({ file, fileList }) => {
        console.log(fileList);
        if (file.status === 'done') {
          onChange([file.name, file.response]);
        } else if (file.status === 'error') {
          message.error(`${file.name} 上传失败`);
        }
      }}
      action={`${URL}/file`}
    >
      <Button>
        <Icon type="upload" /> 上传
      </Button>
      {/* {value[0] === '-' ? '' : value[0]} */}
      {/* <Button style={{ marginLeft: '0.5em' }}>{value[0] === '-' ? '上传' : '修改'}</Button> */}
    </Upload>
  ) : (
    <Input value={value} defaultValue="-" onChange={e => onChange(e.currentTarget.value)} />
  );
};

export default class extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      visible: false,
      max: 0,
      inputTarget: props.inputTarget || {},
      indexPageCategories: [],
      indexPageCategorySelected: props.indexPageCategorySelected,
    };
  }
  async componentDidMount() {
    const max = await this.getMax();
    let indexPageCategories = [];
    if (this.props.target === 'indexPageTerm') indexPageCategories = await getIndexPageCategories();
    this.setState({ visible: true, max, indexPageCategories });
  }
  getMax = () => {
    if (this.props.target === 'indexPageCategory') return getIndexPageCategoryTotal();
    if (this.props.target === 'indexPageTerm')
      return getIndexPageTermTotal(this.state.indexPageCategorySelected);
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  render() {
    const { getFieldDecorator, done, onDone, onCancel, onSubmit } = this.props;
    const { inputTarget } = this.state;
    const modalFooter =
      done || !inputTarget
        ? { footer: null, onCancel: onDone }
        : { okText: '保存', onOk: onSubmit, onCancel: onCancel };
    const that = this;
    console.log(this.props);
    /*    console.log(this.state);*/
    return (
      this.state.visible && (
        <Modal
          title={done ? null : `任务${inputTarget ? '编辑' : '添加'}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={true}
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
              {this.props.target === 'indexPageCategory' && (
                <>
                  <FormItem label="服务类名" {...this.formLayout}>
                    {getFieldDecorator('category', {
                      rules: [{ required: true, message: '请输入服务类名' }],
                      initialValue: inputTarget.category,
                    })(<Input placeholder="请输入" />)}
                  </FormItem>
                  <FormItem label="序号" {...this.formLayout}>
                    {getFieldDecorator('index', {
                      rules: [{ required: true, message: '请填写序号' }],
                      initialValue:
                        inputTarget.index !== undefined
                          ? inputTarget.index + 1
                          : this.state.max + 1,
                    })(
                      <InputNumber
                        placeholder="请输入"
                        min={1}
                        max={
                          this.props.inputTarget.index !== undefined
                            ? this.state.max
                            : this.state.max + 1
                        }
                      />,
                    )}
                  </FormItem>
                </>
              )}
              {this.props.target === 'indexPageTerm' && (
                <>
                  <FormItem label="服务类别" {...this.formLayout}>
                    {getFieldDecorator('category', {
                      rules: [{ required: true, message: '请输入任务名称' }],
                      initialValue: inputTarget.category || this.props.indexPageCategorySelected,
                      getValueFromEvent(res) {
                        /*                    console.log(res);*/
                        setTimeout(
                          async () =>
                            that.setState({
                              max: await getIndexPageTermTotal(res),
                            }),
                          0,
                        );
                        return res;
                      },
                    })(
                      <Select>
                        {this.state.indexPageCategories!.map((item, index) => (
                          <Option value={index} key={index}>
                            {item}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </FormItem>
                  <FormItem label="服务名" {...this.formLayout}>
                    {getFieldDecorator('term', {
                      rules: [{ required: true, message: '请输入任务名称' }],
                      initialValue: inputTarget.term,
                    })(<Input placeholder="请输入" />)}
                  </FormItem>
                  <FormItem label="服务说明" {...this.formLayout}>
                    {getFieldDecorator('termDescription', {
                      rules: [{ required: true, message: '请输入任务名称' }],
                      initialValue: inputTarget.termDescription,
                    })(<Input placeholder="请输入" />)}
                  </FormItem>
                  <FormItem label="其他参数" {...this.formLayout}>
                    {getFieldDecorator('termOther', {
                      rules: [{ required: true, message: '请输入其他参数' }],
                      initialValue: inputTarget.termOther || '-',
                      getValueFromEvent: value => value,
                    })(
                      <Other
                        isFileUpload={
                          this.state.indexPageCategorySelected ===
                          this.state.indexPageCategories!.length - 1
                        }
                      />,
                    )}
                  </FormItem>
                  <FormItem label="服务图标" {...this.formLayout}>
                    {getFieldDecorator('termIcon', {
                      rules: [{ required: true, message: '请上传服务图标' }],
                      initialValue: inputTarget.termIcon,
                    })(<ImageUpload />)}
                  </FormItem>
                  <FormItem label="序号" {...this.formLayout}>
                    {getFieldDecorator('index', {
                      rules: [{ required: true, message: '请填写序号' }],
                      initialValue:
                        inputTarget.index !== undefined
                          ? inputTarget.index + 1
                          : this.state.max + 1,
                    })(
                      <InputNumber
                        placeholder="请输入"
                        min={1}
                        max={
                          this.props.inputTarget != undefined ? this.state.max : this.state.max + 1
                        }
                      />,
                    )}
                  </FormItem>
                </>
              )}
            </>
          )}
        </Modal>
      )
    );
  }
}
