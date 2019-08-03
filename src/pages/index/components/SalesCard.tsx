import { Card, Col, DatePicker, Row, Tabs } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

import { RangePickerValue } from 'antd/es/date-picker/interface';
import React from 'react';
import numeral from 'numeral';
import { VisitDataType } from '../data.d';
import { Bar } from './Charts';
import styles from '../style.less';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const rankingListData: { title: string; total: number }[] = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: formatMessage({ id: 'dashboard-analysis.analysis.test' }, { no: i }),
    total: 323234,
  });
}

const SalesCard = ({
  rangePickerValue,
  salesData,
  isActive,
  handleRangePickerChange,
  loading,
  selectDate,
}: {
  rangePickerValue: RangePickerValue;
  isActive: (key: 'today' | 'week' | 'month' | 'year') => string;
  salesData: VisitDataType[];
  loading: boolean;
  handleRangePickerChange: (dates: RangePickerValue, dateStrings: [string, string]) => void;
  selectDate: (key: 'today' | 'week' | 'month' | 'year') => void;
}) => (
  <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
    <div className={styles.salesCard}>
      <Tabs
        tabBarExtraContent={
          <div className={styles.salesExtraWrap}>
            <div className={styles.salesExtra}>
              <a className={isActive('week')} onClick={() => selectDate('week')}>
                <FormattedMessage id="dashboard-analysis.analysis.all-week" defaultMessage="All Week" />
              </a>
              <a className={isActive('month')} onClick={() => selectDate('month')}>
                <FormattedMessage id="dashboard-analysis.analysis.all-month" defaultMessage="All Month" />
              </a>
              <a className={isActive('year')} onClick={() => selectDate('year')}>
                <FormattedMessage id="dashboard-analysis.analysis.all-year" defaultMessage="All Year" />
              </a>
            </div>
          </div>
        }
        size="large"
        tabBarStyle={{ marginBottom: 24 }}
      >
        <TabPane
          tab={<FormattedMessage id="dashboard-analysis.analysis.sales" defaultMessage="Sales" />}
          key="sales"
        >
          <Row type="flex">
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <div className={styles.salesBar}>
                <Bar
                  height={295}
                  title={
                    <FormattedMessage
                      id="dashboard-analysis.analysis.sales-trend"
                      defaultMessage="Sales Trend"
                    />
                  }
                  data={salesData}
                />
              </div>
            </Col>
           
          </Row>
        </TabPane>
        <TabPane
          tab={<FormattedMessage id="dashboard-analysis.analysis.visits" defaultMessage="Visits" />}
          key="views"
        >
          <Row>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <div className={styles.salesBar}>
                <Bar
                  height={292}
                  title={
                    <FormattedMessage
                      id="dashboard-analysis.analysis.visits-trend"
                      defaultMessage="Visits Trend"
                    />
                  }
                  data={salesData}
                />
              </div>
            </Col>
           
          </Row>
        </TabPane>
      </Tabs>
    </div>
  </Card>
);

export default SalesCard;
