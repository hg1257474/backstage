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
import { classBody } from '@babel/types';
import { getIndexPageCategories } from './service';
interface PartSelectedType<T extends 'indexPage' | 'payPage'> {
  part: T;
  categorySelected?: T extends 'indexPage' ? string : void;
}
//type bb<T>=T extends "qwe"
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const getImage = x => {
  const y = x;
  if (y.includes('base64')) return y;
  return `http://192.168.0.29:7001/resource_test/${x}`;
};
interface BasicListProps extends FormComponentProps {
  resourceList: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}
export type NewTargetType = 'IndexPageCategory' | 'IndexPageTerm' | undefined;

interface BasicListState {
  visible: boolean;
  done: boolean;
  page: number;
  partSelected: {
    part: 'indexPage' | 'payPage';
    categorySelected?: string;
  };
  newTarget?: NewTargetType;
  indexPageCategories?: Array<string>;
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
const empty1: IndexTermListItemDataType = {
  termIcon: '',
  term: '',
  termSummary: '',
  termDescription: '',
  index: -1,
};
/*
@connect((x: { resourceList: StateType; loading: { models: { [key: string]: boolean } } }) => {
  return { resourceList: x.resourceList, loading: x.loading.models.listBasicList, x };
})
*/
@connect((x: { resourceList: StateType; loading: { models: { [key: string]: boolean } } }) => {
  console.log(x)
  return { resourceList: x.resourceList, loading: x.loading.models.listBasicList, x };
})
class BasicList extends Component<BasicListProps, BasicListState> {
  state: BasicListState = {
    visible: false,
    done: false,
    page: 1,
    shouldNewItem: false,
    current: undefined,
    partSelected: { part: 'indexPage' } as PartSelectedType<'indexPage'>,
  };
  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  addBtn: HTMLButtonElement | undefined | null = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'resourceList/getList',
      payload: {
        page: this.state.page,
        target: 'indexPage',
      },
    });
  }

  newItem = async () => {
    let newState = {};
    let newTarget: NewTargetType = undefined;
    let current:
      | Partial<IndexCategoryListItemDataType | IndexTermListItemDataType | PriceListItemDataType>
      | undefined = undefined;
    if (
      this.state.partSelected.part === 'indexPage' &&
      this.state.partSelected.categorySelected !== undefined
    ) {
      const indexPageCategories = await getIndexPageCategories();
      newState = {
        newTarget: 'IndexPageTerm',
        current: {
          term: '',
          termSummary: '',
          termDescription: '',
          termIcon: '',
          category: this.state.partSelected.categorySelected,
          index: this.props.resourceList.total,
        },
        indexPageCategories,
      };
    } else if (this.state.partSelected.part === 'indexPage') {
      newState = {
        newTarget: 'IndexPageCategory',
        current: {
          categoryIcon: '',
          category: '',
          categoryDescription: '',
          index: this.props.resourceList.total,
        },
      };
    }
    // console.log(newTarget)
    newState.visible = true;
    this.setState(newState);
  };

  showEditModal = async (
    item: IndexCategoryListItemDataType | IndexTermListItemDataType | PriceListItemDataType,
  ) => {
    // console.log(item);
    let newState: { visible: true; current: typeof item; indexPageCategories?: string[] } = {
      visible: true,
      current: item,
    };
    if (this.state.partSelected.categorySelected) {
      newState.indexPageCategories = await getIndexPageCategories();
      newState.current.category = this.state.partSelected.categorySelected;
    }
    this.setState(newState);
  };

  onDone = () => {
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
      newTarget: undefined,
      current: {},
    });
  };

  onCancel = () => {
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    this.setState({
      visible: false,
      newTarget: undefined,
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
        // console.log(current)
        // console.log(fieldsValue);
        fieldsValue.index--;
        if (fieldsValue.category !== undefined) {
          const payload = {};
          let params = { part: 'indexPage' };
          payload.target = 'indexPage';
          if (fieldsValue.term !== undefined) {
            params.categorySelected = fieldsValue.category;
            payload.categorySelected = fieldsValue.category;
          }
          payload.page = Math.ceil((fieldsValue.index + 1) / 10);
          this.setState({
            done: true,
            partSelected: params as PartSelectedType<'indexPage'>,
            current: undefined,
          });
          console.log(current);
          if (this.state.newTarget)
            dispatch({
              type: 'resourceList/newItem',
              payload: { payload, data: fieldsValue },
            });
          else
            dispatch({
              type: 'resourceList/updateItem',
              payload: {
                payload,
                data: {
                  ...fieldsValue,
                  oldCategory: this.state.partSelected.categorySelected,
                  oldIndex: current!.index,
                },
              },
            });
        }
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
          type: 'resourceList/deleteItem',
          payload: {
            index,
            page: this.state.page,
            target: this.state.partSelected.part,
            categorySelected: this.state.partSelected.categorySelected,
          },
        });
      },
    });
  };
  render() {
    const {
      resourceList: { list },
      loading,
    } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    console.log(this.props);
    const { visible, done, current = {}, partSelected } = this.state;
    const getReturnSuperiorContent = () => {
      if (partSelected.part === 'indexPage' && partSelected.categorySelected !== undefined) {
        return [
          <a
            onClick={e => {
              this.setState({ partSelected: { part: 'indexPage' } });
              this.props.dispatch({
                type: 'resourceList/getList',
                payload: {
                  page: 1,
                  target: 'indexPage',
                },
              });
            }}
          >
            返回上级分类
          </a>,
        ];
      }
    };
    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue={partSelected.part}>
          <RadioButton value="indexPage">首页类目</RadioButton>
          <RadioButton value="payPage">咨询价格</RadioButton>
        </RadioGroup>
      </div>
    );
    const IndexCategoryListContent = ({
      data: { category, categoryDescription, index },
    }: {
      data: IndexCategoryListItemDataType;
    }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>类别</span>
          <p>
            <a
              onClick={() => {
                const partSelected: PartSelectedType<'indexPage'> = {
                  part: 'indexPage',
                  categorySelected: category,
                };
                this.props.dispatch({
                  type: 'resourceList/getList',
                  payload: { target: 'indexPage', categorySelected: category, page: 1 },
                });
                this.setState({ partSelected });
              }}
            >
              {category}
            </a>
          </p>
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
          <p>{this.state.partSelected.categorySelected}</p>
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
    const that = this;
    // console.log(this.props.listBasicList);
    // console.log(this.props.listBasicList.list);
    // console.log('DDDDDDDDDDDDD232323232');
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
                onClick={this.newItem}
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
                pagination={
                  {
                    total: this.props.resourceList.total,
                    current: this.state.page,
                    onChange(e) {
                      that.setState({ page: e });
                    },
                  } /*paginationProps*/
                }
                dataSource={list /*this.state.selectedPage === 'index' ? index : payment*/}
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
                    {this.state.partSelected.part === 'indexPage' && (
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            src={getImage(
                              (item as IndexCategoryListItemDataType).categoryIcon ||
                                (item as IndexTermListItemDataType).termIcon,
                            )}
                            shape="square"
                            size="large"
                          />
                        }
                      />
                    )}
                    {partSelected.part === 'indexPage' &&
                      partSelected.categorySelected === undefined && (
                        <IndexCategoryListContent data={item as IndexCategoryListItemDataType} />
                      )}
                    {partSelected.part === 'indexPage' &&
                      partSelected.categorySelected !== undefined && (
                        <IndexTermListContent data={item as IndexTermListItemDataType} />
                      )}
                    {partSelected.part === 'payPage' && (
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
            max={this.props.resourceList.total}
            newTarget={this.state.newTarget}
            indexPageCategories={this.state.indexPageCategories}
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
