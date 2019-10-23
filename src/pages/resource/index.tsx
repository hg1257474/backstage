import { Button, Card, List, Modal, Radio, Form } from 'antd';
import ImageUpload from '../../components/ImageUpload';
import _ from 'lodash';
import React, { Component } from 'react';
import mRequest from './service';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { findDOMNode } from 'react-dom';
import { StateType } from './model';
import {
  IndexPageBanner,
  IndexPageCategoryListItem,
  IndexPageTermListItem,
  ProductListItem,
} from './data.d';
import styles from './style.less';
import IndexPageTermList from './components/IndexPageTermList';
import FormModal from './components/FormModal';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
interface BasicListProps extends FormComponentProps {
  resourceList: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}
export type NewTargetType = 'IndexPageCategory' | 'IndexPageTerm' | undefined;
interface BasicListState {
  done: boolean;
  indexPageCategoryListCurrent: number;
  partSelected: 'indexPageColumn' | 'indexPageBanner' | 'product';
  newState?: Partial<BasicListState>;
  editTarget?: any;
}
const CARD_TITLES = {
  indexPageCategory: '首页分级类目',
  indexPageBanner: '首页头图',
};
/*
@connect((x: { resourceList: StateType; loading: { models: { [key: string]: boolean } } }) => {
  return { resourceList: x.resourceList, loading: x.loading.models.listBasicList, x };
})
*/
@connect((x: { resourceList: StateType; loading: { models: { [key: string]: boolean } } }) => {
  /*  console.log(x);*/
  return { resourceList: x.resourceList, loading: x.loading.models.resourceList };
})
class BasicList extends Component<BasicListProps, BasicListState> {
  state: BasicListState = {
    done: false,
    indexPageCategoryListCurrent: 1,
    partSelected: 'indexPageColumn',
  };
  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  addBtn: HTMLButtonElement | undefined | null = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'resourceList/mGet',
      payload: {
        target: 'indexPageCategoryList',
        params: {
          current: 1,
        },
      },
    });
    dispatch({
      type: 'resourceList/mGet',
      payload: {
        target: 'indexPageBanner',
      },
    });
    dispatch({
      type: 'resourceList/mGet',
      payload: {
        target: 'productList',
      },
    });
  }
  componentDidUpdate(prevProps: BasicListProps) {
    if (this.props.resourceList.timestamp !== prevProps.resourceList.timestamp)
      this.setState({ ...this.state, ...this.state.newState, newState: undefined });
  }

  newItem = (type: 'indexPageCategory' | 'indexPageTerm') => async () => {
    let editTarget: BasicListState['editTarget'] = {};
    const { resourceList } = this.props;
    switch (type) {
      case 'indexPageCategory':
        editTarget = {
          indexPageCategoryTotal: resourceList.indexPageCategoryList.total,
          isNew: true,
        };
        break;
      case 'indexPageTerm':
        editTarget = {
          indexPageCategories: await mRequest({ target: 'indexPageCategories' }),
          term: [],
          indexPageTermTotal: resourceList.indexPageTermList.content.length,
          category: resourceList.indexPageTermList.category,
          isNew: true,
        };
        break;
    }
    editTarget.type = type;
    console.log(editTarget);
    this.setState({ editTarget });
  };

  onDone = () => {
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    this.setState({
      done: false,
      editTarget: undefined,
    });
  };

  onCancel = () => {
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    this.setState(
      {
        editTarget: undefined,
      },
      () => this.props.form.resetFields(),
    );
  };
  onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { editTarget } = this.state;
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    form.validateFields((err: string | undefined, fieldsValue: any) => {
      if (err) return;
      let newState: BasicListState['newState'] = { done: true };
      let data: any = {};
      let callback: any = {};
      console.log(fieldsValue);
      switch (editTarget.type) {
        case 'product':
          callback = {
            target: 'productList',
          };
          data = fieldsValue;
          break;
        case 'indexPageCategory':
          callback = {
            params: {
              current: newState.indexPageCategoryListCurrent = Math.ceil(fieldsValue.index / 10),
            },
            target: 'indexPageCategoryList',
          };
          fieldsValue.index -= 1;
          data = editTarget.isNew ? fieldsValue : { ...fieldsValue, oldIndex: editTarget.index };
          break;
        case 'indexPageTerm':
          callback = [
            {
              params: {
                current: newState.indexPageCategoryListCurrent = Math.ceil(
                  fieldsValue.category / 10,
                ),
              },
              target: 'indexPageCategoryList',
            },
            {
              params: {
                category: editTarget.category,
              },
              target: 'indexPageTermList',
            },
          ];
          fieldsValue.index -= 1;
          data = editTarget.isNew
            ? fieldsValue
            : { ...fieldsValue, oldIndex: editTarget.index, oldCategory: editTarget.category };
          break;
        default:
          throw new Error('d');
      }
      this.setState({ newState });
      dispatch({
        type: 'resourceList/mUpdate',
        payload: {
          method: editTarget.isNew ? 'post' : 'put',
          data,
          target: editTarget.type,
          callback,
        },
      });
    });
  };

  onDelete = (
    target: 'indexPageCategory' | 'indexPageTerm',
    params: any,
    callback: any,
    newState: BasicListState['newState'],
  ) => {
    Modal.confirm({
      title: '删除条目', //_maps1[this.state.selectedPage],
      content: '您确定删除条目?', //_maps2[this.state.selectedPage],
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        console.log(target, params, callback, newState);
        /*        console.log("fuckkkk")*/
        this.setState({ newState });
        dispatch({
          type: 'resourceList/mUpdate',
          payload: {
            method: 'delete',
            target,
            callback,
            params,
          },
        });
      },
    });
  };
  render() {
    console.log(this.props);
    const ActionBar = ({
      editTarget,
      deleteTarget,
    }: {
      editTarget: ((x: any[]) => BasicListState['editTarget']) | BasicListState['editTarget'];
      deleteTarget: ['indexPageCategory' | 'indexPageTerm', any, any, BasicListState['newState']];
    }) => (
      <>
        <a
          className={styles['action-btn']}
          onClick={async e => {
            e.preventDefault();
            if (editTarget instanceof Function) editTarget = await editTarget();
            this.setState({ editTarget });
          }}
        >
          编辑
        </a>
        <a
          className={styles['action-btn']}
          key="remove"
          onClick={e => {
            /*            console.log(target, inputTarget, editCb, delCb);*/
            e.preventDefault();
            this.onDelete(...deleteTarget);
          }}
        >
          删除
        </a>
      </>
    );
    const { loading, resourceList } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    /*    console.log(this.props);*/
    const { done, partSelected } = this.state;
    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup
          defaultValue={partSelected}
          onChange={e => this.setState({ partSelected: e.target.value })}
        >
          <RadioButton value="indexPageColumn">首页类目</RadioButton>
          <RadioButton value="indexPageBanner">首页头图</RadioButton>
          <RadioButton value="product">产品</RadioButton>
        </RadioGroup>
      </div>
    );
    const IndexCategoryListContent = ({ category, index }: { category: string; index: number }) => {
      const deleteCallbackCurrent =
        resourceList.indexPageCategoryList.total - 1 >
        (this.state.indexPageCategoryListCurrent - 1) * 10
          ? this.state.indexPageCategoryListCurrent
          : this.state.indexPageCategoryListCurrent - 1 || 1;
      return (
        <div className={styles.listContent}>
          <div className={styles.listContentItem}>
            {category}
            <ActionBar
              editTarget={{
                type: 'indexPageCategory',
                category,
                index,
                indexPageCategoryTotal: resourceList.indexPageCategoryList.total,
              }}
              deleteTarget={[
                'indexPageCategory',
                { category: index },
                {
                  target: 'indexPageCategoryList',
                  params: { current: deleteCallbackCurrent },
                },
                { indexPageCategoryListCurrent: deleteCallbackCurrent },
              ]}
            />
            <a
              className={styles['action-btn']}
              onClick={() => {
                this.props.dispatch({
                  type: 'resourceList/mGet',
                  payload: {
                    target: 'indexPageTermList',
                    params: {
                      category: resourceList.indexPageTermList.category === index ? -1 : index,
                    },
                  },
                });
              }}
            >
              {resourceList.indexPageTermList.category === index ? '隐藏' : '查看'}
            </a>
            {resourceList.indexPageTermList.category === index && (
              <IndexPageTermList
                loading={this.props.loading}
                ActionBar={ActionBar}
                onAddItem={this.newItem('indexPageTerm')}
                list={resourceList.indexPageTermList}
              />
            )}
          </div>
        </div>
      );
    };
    const ProductListItem = ({ item, index }: { item: ProductListItem; index: number }) => (
      <>
        <div className={styles.listContentItem}>{item.name}</div>

        <div className={styles.listContentItem}>
          {item.presentPrice}

          <span
            style={{ width: '6em', display: 'inline-block', paddingLeft: '1.5em', color: 'red' }}
          >
            {item.originalPrice ? '促销中' : ''}
          </span>
        </div>
        <a
          onClick={async () => {
            const product = await mRequest({
              target: 'product',
              params: { product: index },
            });
            this.setState({
              editTarget: {
                ...product,
                type: 'product',
                index,
              },
            });
          }}
        >
          编辑
        </a>
      </>
    );
    const that = this;
    console.log(this.state.editTarget);
    return (
      <>
        <PageHeaderWrapper>
          <div className={styles.standardList}>
            <Card
              className={styles.listCard}
              bordered={false}
              title={CARD_TITLES[partSelected]}
              style={{ marginTop: 24 }}
              bodyStyle={{ padding: '0 32px 40px 32px' }}
              extra={extraContent}
            >
              <Button
                type="dashed"
                style={{
                  width: '100%',
                  marginBottom: 8,
                  display: partSelected === 'indexPageColumn' ? '' : 'none',
                }}
                icon="plus"
                onClick={this.newItem('indexPageCategory')}
                ref={component => {
                  // eslint-disable-next-line  react/no-find-dom-node
                  this.addBtn = findDOMNode(component) as HTMLButtonElement;
                }}
              >
                添加
              </Button>
              <List<IndexPageCategoryListItem | ProductListItem>
                size="large"
                style={
                  ['indexPageColumn', 'product'].includes(partSelected) ? {} : { display: 'none' }
                }
                rowKey="index"
                loading={loading}
                pagination={
                  partSelected === 'indexPageColumn'
                    ? {
                        total: resourceList.indexPageCategoryList.total,
                        current: this.state.indexPageCategoryListCurrent,
                        onChange(current) {
                          that.setState({ newState: { indexPageCategoryListCurrent: current } });
                          that.props.dispatch({
                            type: 'resourceList/mGet',
                            payload: {
                              target: 'indexPageCategoryList',
                              params: { current },
                            },
                          });
                        },
                      }
                    : false /*paginationProps*/
                }
                dataSource={
                  partSelected === 'product'
                    ? resourceList.productList
                    : resourceList.indexPageCategoryList.content
                }
                renderItem={(item, index) => (
                  <List.Item className={styles.test123456789}>
                    {partSelected === 'product' ? (
                      <ProductListItem item={item as ProductListItem} index={index} />
                    ) : (
                      <IndexCategoryListContent
                        index={index + (this.state.indexPageCategoryListCurrent - 1) * 10}
                        category={item as IndexPageCategoryListItem}
                      />
                    )}
                  </List.Item>
                )}
              />
              <ImageUpload
                target="indexPage"
                visible={partSelected === 'indexPageBanner'}
                value={this.props.resourceList.indexPageBanner}
                onChange={data => {
                  /*                  console.log(value);*/
                  this.props.dispatch({
                    type: 'resourceList/mUpdate',
                    payload: {
                      method: 'put',
                      data,
                      target: 'indexPageBanner',
                      callback: {
                        target: 'indexPageBanner',
                      },
                    },
                  });
                }}
              />
            </Card>
          </div>
        </PageHeaderWrapper>
        {this.state.editTarget && (
          <FormModal
            target={this.state.editTarget}
            onCancel={this.onCancel}
            onDone={this.onDone}
            done={done}
            onSubmit={this.onSubmit}
            getFieldDecorator={getFieldDecorator}
          />
        )}
      </>
    );
  }
}
export default Form.create<BasicListProps>()(BasicList);
{
  /*
<RadioButton value="discountRatio">积分折扣比例</RadioButton>
<RadioButton value="memberPrice">会员价格</RadioButton> */
}
