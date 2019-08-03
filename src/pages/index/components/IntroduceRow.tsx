import { Col, Icon, Row, Tooltip } from 'antd';

import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import numeral from 'numeral';
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field } from './Charts';
import { VisitDataType } from '../data.d';
import Trend from './Trend';
import Yuan from '../utils/Yuan';
import styles from '../style.less';
import * as moment from 'moment';
const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 12,
  style: { marginBottom: 24 },
};
const year = moment().year();
const IntroduceRow = ({
  loading,
  visitData,
  test,
}: {
  loading: boolean;
  visitData: VisitDataType[];
  test: any;
}) => {
  const _test = test
    ? test.monthNCTrend.map(item => ({
        x: `${year}.${item._id.month}`,
        y: item.total,
      }))
    : [];
  console.log(test);
  console.log(_test);
  return (
    <Row gutter={24} type="flex">
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title={
            <FormattedMessage
              id="dashboard-analysis.analysis.total-sales"
              defaultMessage="Total Sales"
            />
          }
          action={
            <Tooltip
              title={
                <FormattedMessage
                  id="dashboard-analysis.analysis.introduce"
                  defaultMessage="Introduce"
                />
              }
            >
              <Icon type="info-circle-o" />
            </Tooltip>
          }
          loading={loading}
          total={() => <Yuan>126560</Yuan>}
          footer={
            <Field
              label={
                <FormattedMessage
                  id="dashboard-analysis.analysis.day-sales"
                  defaultMessage="Daily Sales"
                />
              }
              value={`￥${numeral(12423).format('0,0')}`}
            />
          }
          contentHeight={46}
        >
          <Trend flag="up" style={{ marginRight: 16 }}>
            <FormattedMessage
              id="dashboard-analysis.analysis.week"
              defaultMessage="Weekly Changes"
            />
            <span className={styles.trendText}>12%</span>
          </Trend>
          <Trend flag="down">
            <FormattedMessage id="dashboard-analysis.analysis.day" defaultMessage="Daily Changes" />
            <span className={styles.trendText}>11%</span>
          </Trend>
        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title={
            <FormattedMessage id="dashboard-analysis.analysis.new-users" defaultMessage="Visits" />
          }
          action={
            <Tooltip
              title={
                <FormattedMessage
                  id="dashboard-analysis.analysis.introduce"
                  defaultMessage="Introduce"
                />
              }
            >
              <Icon type="info-circle-o" />
            </Tooltip>
          }
          total={numeral(_test.length ? _test.reduce((prev, next) => prev + next.y, 0) : 0).format(
            '0,0',
          )}
          footer={
            <Field
              label={
                <FormattedMessage
                  id="dashboard-analysis.analysis.day-new-users"
                  defaultMessage="Daily Visits"
                />
              }
              value={numeral(_test.length ? _test[_test.length - 1].y : 0).format('0,0')}
            />
          }
          contentHeight={46}
        >
          <MiniArea
            color="#975FE4"
            data={/*visitData*/ _test.length < 2 ? [..._test, ..._test] : _test}
          />
        </ChartCard>
      </Col>
    </Row>
  );
};

export default IntroduceRow;
