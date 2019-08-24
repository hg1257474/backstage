import { Card, Col, DatePicker, Row, Tabs } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

import { RangePickerValue } from 'antd/es/date-picker/interface';
import React from 'react';
import numeral from 'numeral';
import moment from 'moment';
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
  loading,
  test,
  selectDate,
}: {
  rangePickerValue: RangePickerValue;
  test: any;
  isActive: (key: 'today' | 'week' | 'month' | 'year') => string;
  salesData: VisitDataType[];
  loading: boolean;
  selectDate: (key: 'today' | 'week' | 'month' | 'year') => void;
}) => {
  const getTrend = (category, target) => {
    const units = {
      month: '月',
      week: '周',
      day: '日',
    };
    const dateRange = isActive('year')
      ? 'month'
      : isActive('month')
      ? 'week'
      : isActive('week')
      ? 'day'
      : 'month';
    console.log(dateRange, category);
    return test
      ? test[`${dateRange}${category}`].map(item => {
          return {
            x: `${
              isActive('month')
                ? 2 +
                  item._id[dateRange] -
                  moment()
                    .date(1)
                    .week()
                : item._id[dateRange]
            }${units[dateRange]}`,
            y: item[target],
          };
        })
      : [];
  };
  return (
    <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
      <div className={styles.salesCard}>
        <Tabs
          tabBarExtraContent={
            <div className={styles.salesExtraWrap}>
              <div className={styles.salesExtra}>
                <a className={isActive('week')} onClick={() => selectDate('week')}>
                  <FormattedMessage
                    id="dashboard-analysis.analysis.all-week"
                    defaultMessage="All Week"
                  />
                </a>
                <a className={isActive('month')} onClick={() => selectDate('month')}>
                  <FormattedMessage
                    id="dashboard-analysis.analysis.all-month"
                    defaultMessage="All Month"
                  />
                </a>
                <a className={isActive('year')} onClick={() => selectDate('year')}>
                  <FormattedMessage
                    id="dashboard-analysis.analysis.all-year"
                    defaultMessage="All Year"
                  />
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
                    data={getTrend('SalesTrend', 'sales')}
                  />
                </div>
              </Col>
            </Row>
          </TabPane>
          <TabPane
            tab={
              <FormattedMessage
                id="dashboard-analysis.analysis.new-customers"
                defaultMessage="Visits"
              />
            }
            key="views"
          >
            <Row>
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <Bar
                    height={292}
                    title={
                      <FormattedMessage
                        id="dashboard-analysis.analysis.new-customers-trend"
                        defaultMessage="Visits Trend"
                      />
                    }
                    data={getTrend('NCTrend', 'total')}
                  />
                </div>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </Card>
  );
};

export default SalesCard;
