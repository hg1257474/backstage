import { Badge, Card, Descriptions, Divider, Table } from 'antd';
import React, { Component } from 'react';
import Link from 'umi/link';
import { Dispatch } from 'redux';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { OrderDetail } from './data.d';
import styles from './style.less';

interface BasicProps {
  loading: boolean;
  dispatch: Dispatch<any>;
  orderDetail: OrderDetail;
}
interface BasicState {
  visible: boolean;
}

@connect(
  ({
    orderDetail,
    loading,
  }: {
    orderDetail: OrderDetail;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    orderDetail,
    loading: loading.effects['profileBasic/fetchBasic'],
  }),
)
class Basic extends Component<BasicProps, BasicState> {
  componentDidMount() {
    const { dispatch } = this.props;
    console.log(this.props);
    dispatch({
      type: 'orderDetail/getDetail',
      payload: this.props.match.params.id,
    });
  }

  render() {
    const { orderDetail, loading } = this.props;
    const {
      description: { pointDeduction },
    } = orderDetail;
    return (
      <PageHeaderWrapper>
        <Card bordered={false} loading={loading}>
          <Descriptions title="服务详情" style={{ marginBottom: 32 }}>
            <Descriptions.Item label="服务名称">
              {orderDetail.description.serviceId ? (
                <Link to={`service/${orderDetail.description.serviceId}`}>{orderDetail.name}</Link>
              ) : (
                orderDetail.name
              )}
            </Descriptions.Item>
            <Descriptions.Item label="客户">
              <Link to={`customer/${orderDetail.customerId}`}>{orderDetail.customerName}</Link>
            </Descriptions.Item>
            <Descriptions.Item label="交易日期">
              {new Date(orderDetail.updatedAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="订单金额">{orderDetail.totalFee}</Descriptions.Item>
            {pointDeduction && (
              <Descriptions.Item label="积分抵扣金额">{pointDeduction}</Descriptions.Item>
            )}
            {pointDeduction && (
              <Descriptions.Item label="最终金额">
                {orderDetail.totalFee - pointDeduction}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Basic;
