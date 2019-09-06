import { Badge, Card, Descriptions, List, Divider, Table, Button, Icon } from 'antd';
import React, { Component } from 'react';
import Link from 'umi/link';
import { Dispatch } from 'redux';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { ServiceDetail } from './data.d';
import ServiceName from '../../../components/ServiceName';
import styles from './style.less';
import service from '..';
const maps = {
  contract: '合同',
  review: '审核',
  draft: '起草',
  communication: '咨询',
  submitted: '已提交',
  wait_quote: '待报价',
  wait_assign: '待分配',
  wait_pay: '待支付',
  processing: '服务中',
  end: '已完结',
};
interface BasicProps {
  loading: boolean;
  dispatch: Dispatch<any>;
  serviceDetail: ServiceDetail;
}
interface BasicState {
  visible: boolean;
}

@connect(
  ({
    serviceDetail,
    loading,
  }: {
    serviceDetail: ServiceDetail;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    serviceDetail,
    loading: loading.effects['profileBasic/fetchBasic'],
  }),
)
class Basic extends Component<BasicProps, BasicState> {
  componentDidMount() {
    const { dispatch } = this.props;
    console.log(this.props);
    dispatch({
      type: 'serviceDetail/getDetail',
      payload: this.props.match.params.id,
    });
  }

  render() {
    const { serviceDetail, loading } = this.props;
    const { contact, totalFee, processorId, comment, description, conclusion } = serviceDetail;
    return (
      <PageHeaderWrapper>
        <Card bordered={false} loading={loading} className="service-detail">
          <Descriptions
            title={<ServiceName serviceName={serviceDetail.name} />}
            layout="vertical"
            colon={false}
            column={3}
            style={{ marginBottom: 32 }}
          >
            <Descriptions.Item label="状态">
              <FormattedMessage id={`serviceStatus.${serviceDetail.status}`} />
            </Descriptions.Item>
            <Descriptions.Item label="客户" span={!!totalFee || !!processorId ? 1 : 2}>
              <Link to={`/customer?customerId=${serviceDetail.customerId}`}>
                {serviceDetail.customerName}
              </Link>
            </Descriptions.Item>
            <Descriptions.Item label="提交时间">
              {new Date(serviceDetail.createdAt).toLocaleString()}
            </Descriptions.Item>

            {!!totalFee && <Descriptions.Item label="报价">{totalFee}</Descriptions.Item>}
            {!!processorId && (
              <Descriptions.Item label="对接律师">
                <Link to={`/servicer?servicerId=${processorId}`}>
                  {serviceDetail.processorName}
                </Link>
              </Descriptions.Item>
            )}
            <Descriptions.Item label="工作时长">{serviceDetail.duration}</Descriptions.Item>

            <Descriptions.Item label="需求描述" span={3}>
              {typeof description === 'string'
                ? description
                : description.map((file, index) => (
                    <a
                      key={index}
                      href={`http://www.cyfwg.com/resource/description/${file[2]}/${file[0]}`}
                      download={file[0]}
                      style={{
                        padding: '0.8em 1em',
                        color: '#262626',
                        background: '#e8e8e8',
                        borderRadius: '0.4em',
                        marginRight: '1em',
                      }}
                    >
                      {file[0]}
                      <Icon type="download" style={{ fontSize: '1.5em', marginLeft: '0.5em' }} />
                    </a>
                  ))}
            </Descriptions.Item>
            <Descriptions.Item label="联系人信息" span={3}>
              <List>
                <List.Item>姓名:{contact.name}</List.Item>
                <List.Item>电话:{contact.phone}</List.Item>
                <List.Item>
                  <FormattedMessage id={`contactMethod.${contact.method}`} />:{contact.content}
                </List.Item>
              </List>
            </Descriptions.Item>
            {!!conclusion && (
              <Descriptions.Item label="律师解答" span={3}>
                <div style={{ marginBottom: '1em' }}>{conclusion[0]}</div>
                {conclusion[1].map((file, index) => (
                  <a
                    key={index}
                    href={`http://www.cyfwg.com/resource/conclusion/${file[2]}/${file[0]}`}
                    download={file[0]}
                    style={{
                      padding: '0.8em 1em',
                      color: '#262626',
                      background: '#e8e8e8',
                      borderRadius: '0.4em',
                      marginRight: '1em',
                    }}
                  >
                    {file[0]}
                    <Icon type="download" style={{ fontSize: '1.5em', marginLeft: '0.5em' }} />
                  </a>
                ))}
              </Descriptions.Item>
            )}
            {!!comment.length && (
              <Descriptions.Item label="客户评价" span={3} className="service-detail">
                <List>
                  <List.Item>问题解决程度:{comment[0]}</List.Item>
                  <List.Item>问题回复速度:{comment[1]}</List.Item>
                  <List.Item>总体满意速度:{comment[2]}</List.Item>
                  <List.Item>{comment[3]}</List.Item>
                </List>
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Basic;
