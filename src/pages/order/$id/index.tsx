import { Badge, Card, Row, Descriptions, Divider, Table } from 'antd';
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
const Label = ({ children }: { children: any }) => <span>{children}</span>;
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
          <Descriptions title="订单详情" style={{ marginBottom: 32 }}>
            <div>
            <Row>
              <Label>订单名称:</Label>
              {orderDetail.description.serviceId ? (
                <Link to={`service/${orderDetail.description.serviceId}`}>{orderDetail.name}</Link>
              ) : (
                orderDetail.name
              )}
            </Row>
            <Row>
              <Label>客户:</Label>
              <Link to={`customer/${orderDetail.customerId}`}>{orderDetail.customerName}</Link>
            </Row>
            <Row>
              <Label>交易日期:</Label>
              {new Date(orderDetail.updatedAt).toLocaleString()}
            </Row>
              <Row>
                <Label>订单金额:</Label>
                {orderDetail.totalFee}
              </Row>
              {pointDeduction && (
                <Row>
                  <Label>积分抵扣金额:</Label>
                  {pointDeduction}
                </Row>
              )}
              {pointDeduction && (
                <Row>
                  <Label>最终金额:</Label>
                  {orderDetail.totalFee - pointDeduction}
                </Row>
              )}
            </div>
          </Descriptions>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Basic;
