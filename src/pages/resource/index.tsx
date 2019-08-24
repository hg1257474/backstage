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
import _ from 'lodash';
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
import IndexPageTermList from './components/IndexPageTermList';
import FormModal from './components/FormModal';
import { classBody } from '@babel/types';
import { getIndexPageCategories } from './service';
import { match } from 'minimatch';
interface PartSelectedType<T extends 'indexPage' | 'payPage'> {
  part: T;
  categorySelected?: T extends 'indexPage' ? string : void;
}
//type bb<T>=T extends "qwe"
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
interface BasicListProps extends FormComponentProps {
  resourceList: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}
export type NewTargetType = 'IndexPageCategory' | 'IndexPageTerm' | undefined;

interface BasicListState {
  editTarget?: 'indexPageCategory' | 'indexPageTerm';
  done: boolean;
  current: number;
  partSelected: 'indexPageCategory';
  callback?: {
    timestamp: number;
    newState: BasicListState;
  };
  newTarget?: NewTargetType;
  shouldNewItem: boolean;
  indexPageCategorySelected?: number;
  inputTarget?: Partial<
    IndexCategoryListItemDataType | IndexTermListItemDataType | PriceListItemDataType
  >;
}
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
    done: false,
    shouldNewItem: false,
    current: 1,
    partSelected: 'indexPageCategory',
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
        target: 'indexPageCategory',
      },
    });
  }
  static getDerivedStateFromProps(props: BasicListProps, state: BasicListState) {
    console.log(state);
    if (state.callback && props.resourceList.timestamp === state.callback.timestamp) {
      state = { ...state, ...state.callback.newState };
      state.callback = undefined;
      console.log(state);
    }
    return state;
  }

  newItem = editTarget => () => {
    let newState = {};
    this.setState({ editTarget });
    this.setState(newState);
  };

  onDone = () => {
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    this.setState({
      done: false,
      editTarget: undefined,
      inputTarget: undefined,
    });
  };

  onCancel = () => {
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    this.setState({
      editTarget: undefined,
      inputTarget: undefined,
    });
  };
  indexPageTermListCurrent = 1;
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
        const timestamp = new Date().getTime();
        let current = 0;
        if (this.state.editTarget === 'indexPageCategory') {
          fieldsValue.index! -= 1;
          current = this.state.inputTarget
            ? this.state.current
            : Math.ceil((this.props.resourceList.total + 1) / 10);

          this.setState({
            callback: {
              newState: { current, done: true },
              timestamp,
            },
          });
        } else if (this.state.editTarget === 'indexPageTerm') {
          fieldsValue.index! -= 1;
          current = 1; //this.indexPageTermCurrent;
          this.setState({
            callback: {
              newState: { current, done: true },
              timestamp,
            },
          });
        }
        const payload = {
          timestamp,
          params: {
            current,
            target: this.state.editTarget,
            indexPageCategorySelected: this.state.indexPageCategorySelected,
          },
          data: {
            ...fieldsValue,
            oldCategory: this.state.indexPageCategorySelected,
            oldIndex: inputTarget && inputTarget.index,
          },
        };
        if (this.state.inputTarget)
          dispatch({
            type: 'resourceList/updateItem',
            payload,
          });
        else
          dispatch({
            type: 'resourceList/newItem',
            payload,
          });
      },
    );
  };
  // %no%
  onChangeIndexPageTermListCurrent = current => {
    this.indexPageTermListCurrent = current;
    this.props.dispatch({
      type: 'resourceList/getIndexPageTermList',
      payload: {
        target: 'indexPageTerm',
        categorySelected: this.state.indexPageCategorySelected! + (this.state.current - 1) * 10,
        current: 1,
      },
    });
  };

  onDelete = (target: any, inputTarget: any, callback?: any) => {
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
            current: callback.current,
            callback,
            target,
            indexPageCategorySelected: this.state.indexPageCategorySelected,
            inputTarget: target.includes('indexPage') ? inputTarget.index : inputTarget,
          },
        });
      },
    });
  };
  render() {
    const ActionBar = ({
      target,
      inputTarget,
      editCb,
      delCb,
    }: {
      target: any;
      inputTarget: any;
      editCb?: (...x: any) => {};
      delCb?: (...x: any) => {};
    }) => (
      <>
        <a
          className={styles['action-btn']}
          onClick={e => {
            console.log(11);
            console.log(target, inputTarget);
            e.preventDefault();
            if (editCb) editCb();
            this.setState({ editTarget: target, inputTarget });
          }}
        >
          编辑
        </a>
        <a
          className={styles['action-btn']}
          key="remove"
          onClick={e => {
            e.preventDefault();
            this.onDelete(target, inputTarget, delCb && delCb());
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
    const { done, inputTarget = {}, partSelected } = this.state;
    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue={partSelected}>
          <RadioButton value="indexPageCategory">首页类目</RadioButton>
          <RadioButton value="payPage">咨询价格</RadioButton>
        </RadioGroup>
      </div>
    );
    const IndexCategoryListContent = ({ index, category }: IndexCategoryListItemDataType) => {
      const rIndex = (this.state.current - 1) * 10 + index!;
      return (
        <div className={styles.listContent}>
          <div className={styles.listContentItem}>
            {category}
            <ActionBar
              inputTarget={{ index: rIndex, category }}
              target="indexPageCategory"
              delCb={() => {
                const timestamp = new Date().getTime();
                let current =
                  (this.state.current - 1) * 10 === this.props.resourceList.total - 1
                    ? this.state.current - 1
                    : this.state.current;
                if (!current) current = 1;
                const callback = { newState: { current }, timestamp };
                this.setState({ callback });
                return { ...callback, current };
              }}
            />
            <a
              className={styles['action-btn']}
              onClick={() => {
                this.props.dispatch({
                  type: 'resourceList/getIndexPageTermList',
                  payload: {
                    target: 'indexPageTerm',
                    indexPageCategorySelected: rIndex,
                    current: 1,
                  },
                });
                this.setState(prevState => ({
                  indexPageCategorySelected:
                    prevState.indexPageCategorySelected === rIndex ? undefined : rIndex,
                }));
              }}
            >
              {this.state.indexPageCategorySelected === rIndex ? '隐藏' : '查看'}
            </a>
            {this.state.indexPageCategorySelected === rIndex && (
              <IndexPageTermList
                loading={this.props.loading}
                ActionBar={ActionBar}
                onCurrentChange={this.onChangeIndexPageTermListCurrent}
                {...this.props.resourceList.indexPageTermList}
              />
            )}
          </div>
        </div>
      );
    };
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
    console.log(this.state)
    console.log(this.state);
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
                onClick={this.newItem(this.state.partSelected)}
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
                      const timestamp = new Date().getTime();
                      that.setState({
                        callback: {
                          timestamp,
                          newState: { current: e, indexPageCategorySelected: undefined },
                        },
                      });
                      that.props.dispatch({
                        type: 'resourceList/getResources',
                        payload: {
                          timestamp,
                          current: e,
                          target: that.state.partSelected,
                        },
                      });
                    },
                  } /*paginationProps*/
                }
                dataSource={
                  this.props.resourceList
                    .resources /*this.state.selectedPage === 'index' ? index : payment*/
                }
                renderItem={(item, index) => (
                  <List.Item className={styles.test123456789}>
                    {partSelected === 'indexPageCategory' && (
                      <IndexCategoryListContent index={index} category={item} />
                    )}
                  </List.Item>
                )}
              />
            </Card>
          </div>
        </PageHeaderWrapper>
        {this.state.editTarget && (
          <FormModal
            target={this.state.editTarget}
            inputTarget={inputTarget}
            indexPageCategorySelected={this.state.indexPageCategorySelected}
            onCancel={this.onCancel}
            onDone={this.onDone}
            done={done}
            onSubmit={this.onSubmit}
            getFieldDecorator={getFieldDecorator}
            max={this.props.resourceList.total}
          />
        )}
      </>
    );
  }
}
export default Form.create<BasicListProps>()(BasicList);
