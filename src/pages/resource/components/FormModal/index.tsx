import {
  Button,
  Form,
  Icon,
  Input,
  message,
  Modal,
  Select,
  InputNumber,
  Upload,
  Checkbox,
} from 'antd';
import { URL } from '../../../../config';
import styles from '../../style.less';
import ImageUpload from '../ImageUpload';
const { Option } = Select;
import mRequest from '../../service';
import React, { FormEvent } from 'react';
import Result from '../../Result';
const FormItem = Form.Item;
const { TextArea } = Input;

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
  target: {
    indexPageCategoryTotal?: number;
    indexPageTermTotal?: number;
    indexPageCategories?: string[];
    index?: number;
    type: 'indexPageTerm' | 'indexPageCategory' | 'product';
    [x: string]: any;
  };
  onDone: () => void;
  onCancel: () => void;
  onSubmit: (e: FormEvent<Element>) => void;
  done: Boolean;
  // getFieldDecorator: (...x: any[]) => (...x: any[]) => {};
  getFieldDecorator: <T extends Object = {}>(
    id: keyof T,
    options?: GetFieldDecoratorOptions | undefined,
  ) => (node: React.ReactNode) => React.ReactNode;
}
interface State {
  indexPageColumnIndexMax: number;
  isProductPromotion?: boolean;
}
const Other = ({
  value,
  onChange,
  isFileUpload,
}: {
  value?: any;
  onChange?: (x: [string, string][] | string) => void;
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
        console.log(file);
        console.log(fileList);
        console.log(value);

        if (file.status === 'done') {
          onChange!([...(value instanceof Array ? value : []), [file.name, file.response]]);
        } else if (file.status === 'error') {
          message.error(`${file.name} 上传失败`);
        } else if (file.status === 'removed') {
          onChange!(value.filter((item: [string]) => item[0] !== file.name));
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
    <Input value={value} defaultValue="-" onChange={e => onChange!(e.currentTarget.value)} />
  );
};
export default class extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { target } = props;
    let newState: Partial<State> = {};
    switch (target.type) {
      case 'indexPageCategory':
        console.log(target);
        newState.indexPageColumnIndexMax = target.indexPageCategoryTotal;
        break;
      case 'indexPageTerm':
        newState.indexPageColumnIndexMax = target.isNew
          ? target.indexPageTermTotal! + 1
          : target.indexPageTermTotal;
        break;
      case 'product':
        newState.isProductPromotion = !!target.originalPrice;
        break;
      default:
        throw new Error('dd');
    }
    this.state = {
      indexPageColumnIndexMax: 0,
      ...newState,
    };
  }
  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  render() {
    const { getFieldDecorator, done, onDone, onCancel, onSubmit, target } = this.props;
    const modalFooter =
      done || !target
        ? { footer: null, onCancel: onDone }
        : { okText: '保存', onOk: onSubmit, onCancel: onCancel };
    const that = this;
    console.log(target);
    /*    console.log(this.state);*/
    return (
      <Modal
        title={done ? null : `项目${target ? '编辑' : '添加'}`}
        className={styles.standardListForm}
        width={640}
        bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
        destroyOnClose={true}
        visible={!!target}
        {...modalFooter}
      >
        {!!this.props.target && (
          <>
            {this.props.done && (
              <Result
                type="success"
                title="操作成功"
                description="您的操作已经成功"
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
                {target.type === 'indexPageCategory' && (
                  <FormItem label="服务类名" {...this.formLayout}>
                    {getFieldDecorator('category', {
                      rules: [{ required: true, message: '请输入服务类名' }],
                      initialValue: target.category,
                    })(<Input placeholder="请输入" />)}
                  </FormItem>
                )}

                {target.type === 'indexPageTerm' && (
                  <>
                    <FormItem label="服务类别" {...this.formLayout}>
                      {getFieldDecorator('category', {
                        rules: [{ required: true, message: '请输入任务名称' }],
                        initialValue: target.category,
                        getValueFromEvent(category) {
                          /*                    console.log(res);*/
                          setTimeout(async () => {
                            const indexPageTermTotal = await mRequest({
                              target: 'indexPageTermTotal',
                              params: { category },
                            });
                            that.setState({
                              indexPageColumnIndexMax:
                                target.isNew || target.category !== category
                                  ? indexPageTermTotal + 1
                                  : indexPageTermTotal,
                            });
                          }, 0);
                          return category;
                        },
                      })(
                        <Select>
                          {target.indexPageCategories!.map((item, index) => (
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
                        initialValue: target.term[1],
                      })(<Input placeholder="请输入" />)}
                    </FormItem>
                    <FormItem label="服务说明" {...this.formLayout}>
                      {getFieldDecorator('termDescription', {
                        rules: [{ required: true, message: '请输入任务名称' }],
                        initialValue: target.term[2],
                      })(<Input placeholder="请输入" />)}
                    </FormItem>
                    <FormItem label="其他参数" {...this.formLayout}>
                      {getFieldDecorator('termOther', {
                        rules: [{ required: true, message: '请输入其他参数' }],
                        initialValue: target.term[3] || '-',
                        getValueFromEvent: value => value,
                      })(
                        <Other
                          isFileUpload={target.category === target.indexPageCategories!.length - 1}
                        />,
                      )}
                    </FormItem>
                    <FormItem label="服务图标" {...this.formLayout}>
                      {getFieldDecorator('termIcon', {
                        rules: [{ required: true, message: '请上传服务图标' }],
                        initialValue: target.term[0],
                      })(<ImageUpload />)}
                    </FormItem>
                  </>
                )}
                {target.type.includes('indexPage') && (
                  <FormItem label="序号" {...this.formLayout}>
                    {getFieldDecorator('index', {
                      rules: [{ required: true, message: '请填写序号' }],
                      initialValue: target.isNew
                        ? this.state.indexPageColumnIndexMax
                        : target.index! + 1,
                    })(
                      <InputNumber
                        disabled={
                          target.type === 'indexPageCategory' &&
                          target.index === target.indexPageCategoryTotal! - 1
                        }
                        placeholder="请输入"
                        min={1}
                        max={this.state.indexPageColumnIndexMax}
                      />,
                    )}
                  </FormItem>
                )}
                {target.type === 'product' && (
                  <>
                    <FormItem label="名称" {...this.formLayout}>
                      {getFieldDecorator('name', {
                        initialValue: target.name,
                      })(<span>{target.name}</span>)}
                    </FormItem>
                    <FormItem label="价格" {...this.formLayout}>
                      {getFieldDecorator('presentPrice', {
                        rules: [{ required: true, message: '请填写价格' }],
                        initialValue: target.presentPrice,
                      })(<InputNumber placeholder="请输入" min={0.01} />)}

                      <Checkbox
                        defaultChecked={this.state.isProductPromotion}
                        onChange={e => this.setState({ isProductPromotion: e.target.checked })}
                        style={{ marginLeft: '2em' }}
                      >
                        是否促销
                      </Checkbox>
                    </FormItem>
                    {this.state.isProductPromotion && (
                      <FormItem label="原价" {...this.formLayout}>
                        {getFieldDecorator('originalPrice', {
                          rules: [{ required: true, message: '请填写原价' }],
                          initialValue: target.originalPrice || target.presentPrice,
                        })(<InputNumber placeholder="请输入" min={0.01} />)}
                      </FormItem>
                    )}
                    {this.state.isProductPromotion && (
                      <FormItem label="优惠说明" {...this.formLayout}>
                        {getFieldDecorator('promotionDescription', {
                          // rules: [{ required: true, message: '请填写原价' }],
                          initialValue: target.promotionDescription || '',
                        })(<TextArea placeholder="请输入" />)}
                      </FormItem>
                    )}
                    <FormItem label="说明" {...this.formLayout}>
                      {getFieldDecorator('description', {
                        initialValue: target.description || '',
                      })(<Input placeholder="请输入" />)}
                    </FormItem>
                  </>
                )}
              </>
            )}
          </>
        )}
      </Modal>
    );
  }
}
