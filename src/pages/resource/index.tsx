import {
  Avatar,
  Button,
  Card,
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
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { findDOMNode } from 'react-dom';
import { StateType } from './model';
import { IndexListItemDataType, PaymentListItemDataType } from './data.d';
import styles from './style.less';
import FormModal from './components/FormModal';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { Search, TextArea } = Input;
interface BasicListProps extends FormComponentProps {
  listBasicList: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}
interface BasicListState {
  visible: boolean;
  done: boolean;
  shouldNewItem: boolean;
  current?: Partial<IndexListItemDataType | PaymentListItemDataType>;
  selectedPage: 'index' | 'payment';
}
const payment: PaymentListItemDataType[] = [
  { category: '普通', fee: 23213, id: 'dsds', description: 'dsdsds' },
];
/*
@connect(
  ({
    listBasicList,
    loading,
  }: {
    listBasicList: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    listBasicList,
    loading: loading.models.listBasicList,
  }),
)
*/
@connect((x: { listBasicList: StateType; loading: { models: { [key: string]: boolean } } }) => {
  return { listBasicList: x.listBasicList, loading: x.loading.models.listBasicList, x };
})
class BasicList extends Component<BasicListProps, BasicListState> {
  state: BasicListState = {
    visible: false,
    done: false,
    shouldNewItem: false,
    current: undefined,
    selectedPage: 'index' as 'index' | 'payment',
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  addBtn: HTMLButtonElement | undefined | null = undefined;

  componentDidMount() {
    /*
    const { dispatch } = this.props;
    dispatch({
      type: 'listBasicList/fetch',
      payload: {
        count: 5,
      },
    });
    */
  }

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };

  showEditModal = (item: IndexListItemDataType | PaymentListItemDataType) => {
    console.log(item);
    this.setState({
      visible: true,
      current: item,
    });
  };

  handleDone = () => {
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
      current: {},
    });
  };

  handleCancel = () => {
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    this.setState({
      visible: false,
      current: {},
    });
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    const id = current ? current.id : '';
    console.log(id)
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    form.validateFields(
      (err: string | undefined, fieldsValue: IndexListItemDataType | PaymentListItemDataType) => {
        if (err) return;
        console.log(fieldsValue);
        this.setState({
          done: true,
          current: {},
        });
        console.log(id)
        if (!id)
          dispatch({
            type: 'listBasicList/add',
            payload: { id: new Date().getTime(), ...fieldsValue },
          });
        else
          dispatch({
            type: 'listBasicList/update',
            payload: { id:id,...fieldsValue },
          });
      },
    );
  };

  deleteItem = (id: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'listBasicList/submit',
      payload: { id },
    });
  };
  onRemoveItem = (x:IndexListItemDataType | PaymentListItemDataType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'listBasicList/remove',
      payload: { id:x.id },
    });
  };

  render() {
    const {
      listBasicList: { list },
      loading,
    } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    console.log(this.props);
    const { visible, done, current = {}, selectedPage } = this.state;

    const editAndDelete = (
      key: string,
      currentItem: IndexListItemDataType | PaymentListItemDataType,
    ) => {
      if (key === 'edit') this.showEditModal(currentItem);
      else if (key === 'delete') {
        Modal.confirm({
          title: '删除任务',
          content: '确定删除该任务吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => this.deleteItem(currentItem.id),
        });
      }
    };

    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const Info: React.SFC<{
      title: React.ReactNode;
      value: React.ReactNode;
      bordered?: boolean;
    }> = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue={this.state.selectedPage}>
          <RadioButton value="index">首页</RadioButton>
          <RadioButton value="payment">支付页</RadioButton>
        </RadioGroup>
        <Search
          style={{ display: 'none' }}
          className={styles.extraContentSearch}
          placeholder="请输入"
          onSearch={() => ({})}
        />
      </div>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 50,
    };
    const IndexListContent = ({
      data: { category, categoryDescription, term, termSummary, termDescription },
    }: {
      data: IndexListItemDataType;
    }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>类别</span>
          <p>{category}</p>
        </div>

        {term && (
          <div className={styles.listContentItem}>
            <span>服务</span>
            <p>{term}</p>
          </div>
        )}
        {categoryDescription && (
          <div className={styles.listContentItem}>
            <span>类别说明</span>
            <p>{categoryDescription}</p>
          </div>
        )}
        {termSummary && (
          <div className={styles.listContentItem}>
            <span>服务简略</span>
            <p>{termSummary}</p>
          </div>
        )}
        {termDescription && (
          <div className={styles.listContentItem}>
            <span>服务说明</span>
            <p>{termDescription}</p>
          </div>
        )}
      </div>
    );
    const PaymentListContent = ({
      data: { category, description, fee },
    }: {
      data: PaymentListItemDataType;
    }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>类别</span>
          <p>{category}</p>
        </div>

        <div className={styles.listContentItem}>
          <span>说明</span>
          <p>{description}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>金额</span>
          <p>{fee}</p>
        </div>
      </div>
    );

    const MoreBtn: React.SFC<{
      item: IndexListItemDataType | PaymentListItemDataType;
    }> = ({ item }) => (
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => editAndDelete(key, item)}>
            <Menu.Item key="edit">编辑</Menu.Item>
            <Menu.Item key="delete">删除</Menu.Item>
          </Menu>
        }
      >
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );
    /*
    const getModalContent = () => {
      console.log(this);
      if (done) {
        return (
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
        );
      }
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="任务名称" {...this.formLayout}>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入任务名称' }],
              initialValue: current.service,
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="开始时间" {...this.formLayout}>
            {getFieldDecorator('createdAt', {
              rules: [{ required: true, message: '请选择开始时间' }],
              initialValue: current.createdAt ? moment(current.createdAt) : null,
            })(
              <DatePicker
                showTime
                placeholder="请选择"
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: '100%' }}
              />,
            )}
          </FormItem>
          <FormItem label="任务负责人" {...this.formLayout}>
            {getFieldDecorator('owner', {
              rules: [{ required: true, message: '请选择任务负责人' }],
              initialValue: current.owner,
            })(
              <Select placeholder="请选择">
                <SelectOption value="付晓晓">付晓晓</SelectOption>
                <SelectOption value="周毛毛">周毛毛</SelectOption>
              </Select>,
            )}
          </FormItem>
          <FormItem {...this.formLayout} label="产品描述">
            {getFieldDecorator('subDescription', {
              rules: [{ message: '请输入至少五个字符的产品描述！', min: 5 }],
              initialValue: current.subDescription,
            })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
          </FormItem>
        </Form>
      );
    };
    */
    console.log(this.props.listBasicList.list);
    console.log('DDDDDDDDDDDDD232323232');
    return (
      <>
        <PageHeaderWrapper>
          <div className={styles.standardList}>
            <Card
              className={styles.listCard}
              bordered={false}
              title="基本列表"
              style={{ marginTop: 24 }}
              bodyStyle={{ padding: '0 32px 40px 32px' }}
              extra={extraContent}
            >
              <Button
                type="dashed"
                style={{ width: '100%', marginBottom: 8 }}
                icon="plus"
                onClick={this.showModal}
                ref={component => {
                  // eslint-disable-next-line  react/no-find-dom-node
                  this.addBtn = findDOMNode(component) as HTMLButtonElement;
                }}
              >
                添加
              </Button>
              <List<IndexListItemDataType | PaymentListItemDataType>
                size="large"
                rowKey="id"
                loading={loading}
                pagination={false /*paginationProps*/}
                dataSource={
                  this.props.listBasicList
                    .list /*this.state.selectedPage === 'index' ? index : payment*/
                }
                renderItem={item => (
                  <List.Item
                    actions={[
                      <a
                        key="edit"
                        onClick={e => {
                          e.preventDefault();
                          this.showEditModal(item);
                        }}
                      >
                        编辑
                      </a>,
                      <a
                        key="remove"
                        onClick={e => {
                          e.preventDefault();
                          this.onRemoveItem(item);
                        }}
                      >删除</a>,
                      //<MoreBtn key="more" item={item} />,
                    ]}
                  >
                    {this.state.selectedPage === 'index' && (
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            src={
                              (item as IndexListItemDataType).categoryIcon ||
                              (item as IndexListItemDataType).termIcon
                            }
                            shape="square"
                            size="large"
                          />
                        }
                      />
                    )}
                    {this.state.selectedPage === 'index' && (
                      <IndexListContent data={item as IndexListItemDataType} />
                    )}
                    {this.state.selectedPage === 'payment' && (
                      <PaymentListContent data={item as PaymentListItemDataType} />
                    )}
                  </List.Item>
                )}
              />
            </Card>
          </div>
        </PageHeaderWrapper>
        {this.state.visible && (
          <FormModal
            current={current}
            onCancel={this.handleCancel}
            onDone={this.handleDone}
            selectedPage={this.state.selectedPage}
            done={done}
            onSubmit={this.handleSubmit}
            visible={visible}
            getFieldDecorator={getFieldDecorator}
          />
        )}
      </>
    );
  }
}

export default Form.create<BasicListProps>()(BasicList);
