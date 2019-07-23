import { Badge, Card, Descriptions, Divider, Table } from 'antd';
import React, { Component } from 'react';
import Link from 'umi/link';
import { Dispatch } from 'redux';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { BasicProfileDataType } from './data.d';
import styles from './style.less';

const progressColumns = [
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '当前进度',
    dataIndex: 'rate',
    key: 'rate',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (text: string) => {
      if (text === 'success') {
        return <Badge status="success" text="成功" />;
      }
      return <Badge status="processing" text="进行中" />;
    },
  },

  {
    title: '操作员ID',
    dataIndex: 'operator',
    key: 'operator',
  },
  {
    title: '耗时',
    dataIndex: 'cost',
    key: 'cost',
  },
];

interface BasicProps {
  loading: boolean;
  dispatch: Dispatch<any>;
  profileBasic: BasicProfileDataType;
}
interface BasicState {
  visible: boolean;
}

@connect(
  ({
    profileBasic,
    loading,
  }: {
    profileBasic: BasicProfileDataType;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    profileBasic,
    loading: loading.effects['profileBasic/fetchBasic'],
  }),
)
class Basic extends Component<BasicProps, BasicState> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'profileBasic/fetchBasic',
    });
  }

  render() {
    const { profileBasic, loading } = this.props;
    const { basicGoods, basicProgress } = profileBasic;
    let goodsData: typeof basicGoods = [];
    if (basicGoods.length) {
      let num = 0;
      let amount = 0;
      basicGoods.forEach(item => {
        num += Number(item.num);
        amount += Number(item.amount);
      });
      goodsData = basicGoods.concat({
        id: '总计',
        num,
        amount,
      });
    }
    const renderContent = (value: any, row: any, index: any) => {
      const obj: {
        children: any;
        props: { colSpan?: number };
      } = {
        children: value,
        props: {},
      };
      if (index === basicGoods.length) {
        obj.props.colSpan = 0;
      }
      return obj;
    };
    const goodsColumns = [
      {
        title: '类型',
        dataIndex: 'num',
        key: 'num',
        align: 'center' as 'left' | 'right' | 'center',
        render: (text: React.ReactNode, row: any, index: number) => {
          if (index < basicGoods.length) {
            return text;
          }
          return <span style={{ fontWeight: 600 }}>{text}</span>;
        },
      },
      {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
        align: 'center' as 'left' | 'right' | 'center',
        render: (text: React.ReactNode, row: any, index: number) => {
          if (index < basicGoods.length) {
            return text;
          }
          return <span style={{ fontWeight: 600 }}>{text}</span>;
        },
      },
      {
        title: '时间',
        dataIndex: 'amount',
        key: 'amount',
        align: 'center' as 'left' | 'right' | 'center',
        render: (text: React.ReactNode, row: any, index: number) => {
          if (index < basicGoods.length) {
            return text;
          }
          return <span style={{ fontWeight: 600 }}>{text}</span>;
        },
      },
      {
        title: '查看',
        dataIndex: 'id',
        key: 'id',
        align: 'center' as 'left' | 'right' | 'center',
        render: (text: React.ReactNode, row: any, index: number) => {
          if (index < basicGoods.length) {
            return <Link to={`/service/${row}`}>{text}</Link>;
          }
        },
      },
    ];
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Descriptions title="用户信息" style={{ marginBottom: 32 }}>
            <Descriptions.Item label="企业全名">付小小</Descriptions.Item>
            <Descriptions.Item label="门店数量">18100000000</Descriptions.Item>
            <Descriptions.Item label="加盟模式">菜鸟仓储</Descriptions.Item>
            <Descriptions.Item label="联系人">浙江省杭州市西湖区万塘路18号</Descriptions.Item>
            <Descriptions.Item label="电话">无</Descriptions.Item>
            <Descriptions.Item label="微信">无</Descriptions.Item>
            <Descriptions.Item label="钉钉">无</Descriptions.Item>
            <Descriptions.Item label="会员">无</Descriptions.Item>
            <Descriptions.Item label="到期时间">无</Descriptions.Item>
            <Descriptions.Item label="历史消费金额">无</Descriptions.Item>
            <Descriptions.Item label="积分">无</Descriptions.Item>
            <Descriptions.Item label="积分">无</Descriptions.Item>
          </Descriptions>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Basic;
