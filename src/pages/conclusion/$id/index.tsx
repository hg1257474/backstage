import { Badge, Card, Descriptions, List, Divider, Table, Button, Icon } from 'antd';
import React, { Component } from 'react';
import Link from 'umi/link';
import { Dispatch } from 'redux';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { ConclusionDetail } from './data.d';
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
  conclusionDetail: ConclusionDetail;
}
interface BasicState {
  visible: boolean;
}

@connect(
  ({
    conclusionDetail,
    loading,
  }: {
    conclusionDetail: ConclusionDetail;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    conclusionDetail,
    loading: loading.effects['profileBasic/fetchBasic'],
  }),
)
class Basic extends Component<BasicProps, BasicState> {
  componentDidMount() {
    const { dispatch } = this.props;
    console.log(this.props);
    dispatch({
      type: 'conclusionDetail/getDetail',
      payload: this.props.match.params.id,
    });
  }

  render() {
    const { conclusionDetail, loading } = this.props;
    const { description, conclusion } = conclusionDetail;
    return (
      <PageHeaderWrapper>
        <Card bordered={false} loading={loading} className="service-detail">
          <Descriptions
            title={<ServiceName serviceName={conclusionDetail.name} />}
            layout="vertical"
            colon={false}
            column={3}
            style={{ marginBottom: 32 }}
          >
            <Descriptions.Item label="对接律师">{conclusionDetail.processorName}</Descriptions.Item>
            <Descriptions.Item label="提交时间" span={2}>
              {new Date(conclusionDetail.createdAt).toLocaleString()}
            </Descriptions.Item>

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
          </Descriptions>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Basic;
