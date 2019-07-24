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
  Table,
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
// const url="http://192.168.0.29:7001"
const url = 'http://www.huishenghuo.net';
const getImage = x => {
  const y = x;
  if (y.includes('base64')) return y;
  return `${url}/resource_test/${x}`;
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
  current: number;
  partSelected: {
    part: 'indexPage' | 'payPage';
    categorySelected?: string;
  };
  newTarget?: NewTargetType;
  shouldNewItem: boolean;
  indexPageCategorySelected?: number;
  inputTarget?: Partial<
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
  console.log(x);
  return { resourceList: x.resourceList, loading: x.loading.models.resourceList };
})
class BasicList extends Component<BasicListProps, BasicListState> {
  state: BasicListState = {
    visible: false,
    done: false,
    shouldNewItem: false,
    current: 1,
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
      type: 'resourceList/getResources',
      payload: {
        current: this.state.current,
        target: 'indexPage',
      },
    });
  }

  newItem = async () => {
    let newState = {};
    let newTarget: NewTargetType = undefined;
    let inputTarget:
      | Partial<IndexCategoryListItemDataType | IndexTermListItemDataType | PriceListItemDataType>
      | undefined = undefined;
    if (
      this.state.partSelected.part === 'indexPage' &&
      this.state.partSelected.categorySelected !== undefined
    ) {
      const indexPageCategories = await getIndexPageCategories();
      newState = {
        newTarget: 'IndexPageTerm',
        inputTarget: {
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
        inputTarget: {
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
    let newState: { visible: true; inputTarget: typeof item; indexPageCategories?: string[] } = {
      visible: true,
      inputTarget: item,
    };
    if (this.state.partSelected.categorySelected) {
      newState.indexPageCategories = await getIndexPageCategories();
      newState.inputTarget.category = this.state.partSelected.categorySelected;
    }
    this.setState(newState);
  };

  onDone = () => {
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
      newTarget: undefined,
      inputTarget: {},
    });
  };

  onCancel = () => {
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    this.setState({
      visible: false,
      newTarget: undefined,
      inputTarget: {},
    });
  };

  onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { inputTarget } = this.state;
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
        // console.log(inputTarget)
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
            inputTarget: undefined,
          });
          console.log(inputTarget);
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
                  oldIndex: inputTarget!.index,
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
    const ActionBar = ({
      target,
      inputTarget,
      callback,
    }: {
      target: any;
      inputTarget: any;
      callback?: any;
    }) => (
      <>
        <a
          className={styles['action-btn']}
          onClick={e => {
            e.preventDefault();
            if (callback) callback();
            this.showEditModal(target, inputTarget);
          }}
        >
          编辑
        </a>
        <a
          className={styles['action-btn']}
          key="remove"
          onClick={e => {
            e.preventDefault();
            if (callback) callback();
            this.onDelete(target, inputTarget);
          }}
        >
          删除
        </a>
      </>
    );
    const {
      resourceList: { list },
      loading,
    } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    console.log(this.props);
    const { visible, done, inputTarget = {}, partSelected } = this.state;
    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue={partSelected.part}>
          <RadioButton value="indexPage">首页类目</RadioButton>
          <RadioButton value="payPage">咨询价格</RadioButton>
        </RadioGroup>
      </div>
    );
    const IndexCategoryListContent = ({ index, category }: IndexCategoryListItemDataType) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <ActionBar inputTarget={category} target="indexPageCategory" />
          <a
            className={styles['action-btn']}
            onClick={() => {
              this.props.dispatch({
                type: 'resource/getResources',
                target: 'IndexPageTerm',
                categorySelected: index + this.state.current * 10,
              });
              this.setState({
                indexPageCategorySelected: index,
              });
            }}
          >
            {this.state.indexPageCategorySelected === index ? '隐藏' : '查看'}
          </a>
        </div>
        {this.state.indexPageCategorySelected === index && (
          <IndexPageTermList {...this.props.indexPageTermList} />
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
    console.log(this.props);
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
                    current: this.state.current,
                    onChange(e) {
                      that.setState({ inputTarget: e });
                    },
                  } /*paginationProps*/
                }
                dataSource={
                  this.props.resourceList
                    .resources /*this.state.selectedPage === 'index' ? index : payment*/
                }
                renderItem={(item, index, ...other) => (
                  <List.Item className={styles.test123456789}>
                    <List.Item.Meta title={item} />
                    {partSelected.part === 'indexPage' &&
                      partSelected.categorySelected === undefined && (
                        <IndexCategoryListContent index={index} category={item} />
                      )}
                  </List.Item>
                )}
              />
            </Card>
          </div>
        </PageHeaderWrapper>
        {this.state.visible && (
          <FormModal
            inputTarget={inputTarget}
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
