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
type SelectedPartType<T extends "IndexPage"|"ConsultingPrice">={
  part:T,

  [T extends "asd"?"asd":"dsadas"]?:T extends "IndexPage"? never:void
}
functio
function asd
const fuck1:SelectedPartType<"IndexPage">={part:"IndexPage"}
//type bb<T>=T extends "qwe"
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
  selectedPart: { part: 'IndexPage'; selectedCategory?: number } | 'ConsultingPrice';
  shouldNewItem: boolean;
  current?: Partial<
    IndexCategoryListItemDataType | IndexTermListItemDataType | PriceListItemDataType
  >;
}
const _maps1 = { indexCategory: '首页分类', indexTerm: '首页子项', price: '会员价格价格' };
const _maps2 = {
  indexCategory: '删除首页分类会导致全部子项删除，您确定继续吗？',
  indexTerm: '首页子项',
  price: '会员价格价格',
};
@connect((x: { listBasicList: StateType; loading: { models: { [key: string]: boolean } } }) => {
  return { listBasicList: x.listBasicList, loading: x.loading.models.listBasicList, x };
})
class BasicList extends Component<BasicListProps, BasicListState> {
  state: BasicListState = {
    visible: false,
    done: false,
    shouldNewItem: false,
    current: undefined,
    selectedPart: { part: 'IndexPage' } as
      | { part: 'IndexPage'; selectedCategory?: number }
      | 'ConsultingPrice',
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  addBtn: HTMLButtonElement | undefined | null = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'listBasicList/getList',
      payload: {
        index: 0,
        part: 'IndexPage',
      },
    });
  }

  newItem = () => {
    
    if(this.state.selectedPart.part){
      console.log()
    }
    //const current=
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

  onDone = () => {
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
      current: {},
    });
  };

  onCancel = () => {
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    this.setState({
      visible: false,
      current: {},
    });
  };

  onSubmit = (e: React.FormEvent) => {
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
  onDelete = (index: Number) => {
    Modal.confirm({
      title: '删除条目', //_maps1[this.state.selectedPage],
      content: '您确定删除条目?', //_maps2[this.state.selectedPage],
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'listBasicList/deleteList',
          payload: {
            index,
            ...(typeof this.state.selectedPart === 'string'
              ? { part: this.state.selectedPart }
              : this.state.selectedPart),
          },
        });
      },
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
    const { visible, done, current = {}, selectedPart } = this.state;
    const getReturnSuperiorContent = () => {
      if (
        (selectedPart as { part: 'IndexPage'; selectedCategory?: number }).selectedCategory !==
        undefined
      ) {
        return [<a onClick={e => e.preventDefault()}>返回上级分类</a>];
      }
    };
    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup
          defaultValue={
            (selectedPart as { part: 'IndexPage'; selectedCategory?: number }).part || selectedPart
          }
        >
          <RadioButton value="IndexPage">首页类目</RadioButton>
          <RadioButton value="ConsultingPrice">咨询价格</RadioButton>
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
    console.log(this.props.listBasicList);
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
              actions={getReturnSuperiorContent()}
            >
              <Button
                type="dashed"
                style={{ width: '100%', marginBottom: 8 }}
                icon="plus"
                onClick={() => {
                  this.showModal('new');
                }}
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
                          this.onDelete(item.index);
                        }}
                      >
                        删除
                      </a>,
                      //<MoreBtn key="more" item={item} />,
                    ]}
                  >
                    {(this.state.selectedPart as { part: 'IndexPage'; selectedCategory?: number })
                      .part === 'IndexPage' && (
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
                    {(selectedPart as { part: 'IndexPage'; selectedCategory?: number }).part ===
                      'IndexPage' && (
                      <IndexCategoryListContent data={item as IndexCategoryListItemDataType} />
                    )}
                    {(selectedPart as { part: 'IndexPage'; selectedCategory?: number })
                      .selectedCategory !== undefined && (
                      <IndexTermListContent data={item as IndexTermListItemDataType} />
                    )}
                    {selectedPart === 'ConsultingPrice' && (
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
            onCancel={this.onCancel}
            onDone={this.onDone}
            done={done}
            onSubmit={this.onSubmit}
            visible={visible}
            getFieldDecorator={getFieldDecorator}
            max={this.props.listBasicList.count}
          />
        )}
      </>
    );
  }
}

export default Form.create<BasicListProps>()(BasicList);
/*
{this.state.indexPageCategorySelected && (
                <Button
                  type="dashed"
                  style={{ width: '100%', marginBottom: 8 }}
                  icon="rollback"
                  onClick={this.showModal}
                  ref={component => {
                    // eslint-disable-next-line  react/no-find-dom-node
                    this.addBtn = findDOMNode(component) as HTMLButtonElement;
                  }}
                >
                  返回类目
                </Button>
              )}
              */
