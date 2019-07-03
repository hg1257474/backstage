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
import {
  IndexCategoryListItemDataType,
  IndexTermListItemDataType,
  PriceListItemDataType,
} from './data.d';
import styles from './style.less';
import FormModal from './components/FormModal';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { Search, TextArea } = Input;
export type SelectedPage = 'indexCategory' | 'indexTerm' | 'price';
interface BasicListProps extends FormComponentProps {
  listBasicList: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}
interface BasicListState {
  visible: boolean;
  done: boolean;
  shouldNewItem: boolean;
  current?: Partial<
    IndexCategoryListItemDataType | IndexTermListItemDataType | PriceListItemDataType
  >;
  selectedPage: SelectedPage;
}
@connect((x: { listBasicList: StateType; loading: { models: { [key: string]: boolean } } }) => {
  return { listBasicList: x.listBasicList, loading: x.loading.models.listBasicList, x };
})
class BasicList extends Component<BasicListProps, BasicListState> {
  state: BasicListState = {
    visible: false,
    done: false,
    shouldNewItem: false,
    current: undefined,
    selectedPage: 'indexCategory' as SelectedPage,
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  addBtn: HTMLButtonElement | undefined | null = undefined;

  componentDidMount() {
    
    const { dispatch } = this.props;
    dispatch({
      type: 'listBasicList/fetch',
      payload: {
        index: 0,
        target:"indexCategory"
      },
    });
    
  }

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };

  showEditModal = (
    item: IndexCategoryListItemDataType | IndexTermListItemDataType | PriceListItemDataType,
  ) => {
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
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    form.validateFields(
      (
        err: string | undefined,
        fieldsValue:
          | IndexCategoryListItemDataType
          | IndexTermListItemDataType
          | PriceListItemDataType,
      ) => {
        if (err) return;
        console.log(fieldsValue);
        this.setState({
          done: true,
          current: {},
        });
        if (!current!.index)
          dispatch({
            type: 'listBasicList/add',
            payload: { id: new Date().getTime(), ...fieldsValue },
          });
        else
          dispatch({
            type: 'listBasicList/update',
            payload: { selectedPage: this.state.selectedPage, ...fieldsValue },
          });
          
      },
    );
  };
  onRemoveItem = (
    x: IndexCategoryListItemDataType | IndexTermListItemDataType | PriceListItemDataType,
  ) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'listBasicList/remove',
      payload: { index: x.index, target: this.state.selectedPage },
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
/*
    const editAndDelete = (
      key: string,
      currentItem:
        | IndexCategoryListItemDataType
        | IndexTermListItemDataType
        | PriceListItemDataType,
    ) => {
      if (key === 'edit') this.showEditModal(currentItem);
      else if (key === 'delete') {
        Modal.confirm({
          title: '删除任务',
          content: '确定删除该任务吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => this.deleteItem(currentItem.index),
        });
      }
    };
*/
    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue={this.state.selectedPage}>
          <RadioButton value="indexCategory">首页-分类</RadioButton>
          <RadioButton value="indexTerm">首页-子项</RadioButton>
          <RadioButton value="price">会员价格</RadioButton>
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
    const IndexCategoryListContent = ({
      data: { category, categoryDescription },
    }: {
      data: IndexCategoryListItemDataType;
    }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>类别</span>
          <p>{category}</p>
        </div>
        {categoryDescription && (
          <div className={styles.listContentItem}>
            <span>类别说明</span>
            <p>{categoryDescription}</p>
          </div>
        )}
      </div>
    );
    const IndexTermListContent = ({
      data: { category, term, termSummary, termDescription },
    }: {
      data: IndexTermListItemDataType;
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
    const PriceListContent = ({
      data: { category, description, fee },
    }: {
      data: PriceListItemDataType;
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
              <List<
                | IndexCategoryListItemDataType
                | IndexCategoryListItemDataType
                | PriceListItemDataType
              >
                size="large"
                rowKey="index"
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
                      >
                        删除
                      </a>,
                      //<MoreBtn key="more" item={item} />,
                    ]}
                  >
                    {['index-category', 'index-term'].includes(this.state.selectedPage) && (
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            src={
                              (item as IndexCategoryListItemDataType).categoryIcon ||
                              (item as IndexTermListItemDataType).termIcon
                            }
                            shape="square"
                            size="large"
                          />
                        }
                      />
                    )}
                    {this.state.selectedPage === 'indexCategory' && (
                      <IndexCategoryListContent data={item as IndexCategoryListItemDataType} />
                    )}
                    {this.state.selectedPage === 'indexTerm' && (
                      <IndexTermListContent data={item as IndexTermListItemDataType} />
                    )}
                    {this.state.selectedPage === 'price' && (
                      <PriceListContent data={item as PriceListItemDataType} />
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
