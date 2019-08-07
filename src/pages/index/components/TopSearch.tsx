import { Card, Col, Icon, Row, Table, Tooltip } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import numeral from 'numeral';
import { SearchDataType, VisitDataType } from '../data.d';
import * as moment from 'moment';
import { MiniArea } from './Charts';
import _ from 'lodash';
import NumberInfo from './NumberInfo';
import Trend from './Trend';
import styles from '../style.less';
const getRatio = (previous, current) =>
  !!previous ? `${(((current - previous) * 100) / previous).toFixed(2)}%` : current.toString();
const getTableTrend = (weekNSTrend, name, total) => {
  let previous;
  if (!weekNSTrend[weekNSTrend.length - 2]) previous = 0;
  else {
    const target = weekNSTrend[weekNSTrend.length - 2].services.find(item =>
      _.isEqual(item.name, name),
    );
    previous = target ? target.total : 0;
  }
  console.log(previous, '@', name, '@', total);
  const ratio = getRatio(previous, total);
  console.log(ratio);
  return { status: ratio.includes('-') ? 'down' : 'up', range: ratio.replace(/-/g, '') };
};
const columns = [
  {
    title: (
      <FormattedMessage
        id="dashboard-analysis.table.service-name"
        defaultMessage="Search keyword"
      />
    ),
    dataIndex: 'keyword',
    key: 'keyword',
    render: (text: React.ReactNode) => <a href="">{text}</a>,
  },
  {
    title: <FormattedMessage id="dashboard-analysis.table.service-total" defaultMessage="Users" />,
    dataIndex: 'count',
    key: 'count',
    sorter: (a: { count: number }, b: { count: number }) => a.count - b.count,
    className: styles.alignRight,
  },
  {
    title: (
      <FormattedMessage id="dashboard-analysis.table.weekly-range" defaultMessage="Weekly Range" />
    ),
    dataIndex: 'range',
    key: 'range',
    sorter: (a: { range: string }, b: { range: string }) =>
      a.range.replace('%', '') - b.range.replace('%', ''),
    render: (text: React.ReactNode, record: { status: number }) => (
      <Trend flag={record.status === 1 ? 'down' : 'up'}>
        <span style={{ marginRight: 4 }}>{text}</span>
      </Trend>
    ),
  },
];

const TopSearch = ({
  loading,
  visitData2,
  searchData,
  dropdownGroup,
  test,
}: {
  test: any;
  loading: boolean;
  visitData2: VisitDataType[];
  dropdownGroup: React.ReactNode;
  searchData: SearchDataType[];
}) => {
  const initialData = new Array(2).fill({ _id: 0, total: 0, services: [] });
  const weekNSTrend = test
    ? test.weekNSTrend.length < 2
      ? initialData.splice(
          2 - test.weekNSTrend.length,
          test.weekNSTrend.length,
          ...test.weekNSTrend,
        )
      : test.weekNSTrend
    : initialData;
  console.log(12334534534);
  console.log(weekNSTrend);
  console.log(visitData2);
  console.log(searchData);
  console.log(
    getRatio(weekNSTrend[weekNSTrend.length - 2].total, weekNSTrend[weekNSTrend.length - 1].total),
  );
  // const weekNSTrend=test?test.weekNStrend.length
  return (
    <Card
      loading={loading}
      bordered={false}
      title={
        <FormattedMessage
          id="dashboard-analysis.analysis.new-service-submit"
          defaultMessage="Online Top Search"
        />
      }
      extra={dropdownGroup}
      style={{
        height: '100%',
      }}
    >
      <Row gutter={68} type="flex">
        <Col sm={24} xs={24} style={{ marginBottom: 24 }}>
          <NumberInfo
            subTitle={
              <span>
                <FormattedMessage
                  id="dashboard-analysis.analysis.new-services-total"
                  defaultMessage="search users"
                />
                <Tooltip
                  title={
                    <FormattedMessage
                      id="dashboard-analysis.analysis.introduce"
                      defaultMessage="introduce"
                    />
                  }
                >
                  <Icon style={{ marginLeft: 8 }} type="info-circle-o" />
                </Tooltip>
              </span>
            }
            gap={8}
            total={numeral(test ? test.weekNSTrend[test.weekNSTrend.length - 1].total : 0).format(
              '0,0',
            )}
            status={
              getRatio(
                weekNSTrend[weekNSTrend.length - 2].total,
                weekNSTrend[weekNSTrend.length - 1].total,
              ).includes('-')
                ? 'down'
                : 'up'
            }
            subTotal={getRatio(
              weekNSTrend[weekNSTrend.length - 2].total,
              weekNSTrend[weekNSTrend.length - 1].total,
            ).replace('-', '')}
          />
          <MiniArea
            line
            height={45}
            data={
              test
                ? test.weekNSTrend.map((item, index) => ({
                    x: `第${index + 1}周`,
                    y: item.total,
                  }))
                : []
            }
          />
        </Col>
      </Row>
      <Table<any>
        rowKey={record => record.index}
        size="small"
        columns={columns}
        dataSource={
          test
            ? test.weekNSTrend[test.weekNSTrend.length - 1].services.map((item, index) => ({
                index,
                keyword: item.name.join('-'),
                count: item.total,
                ...getTableTrend(test.weekNSTrend, item.name, item.total),
              }))
            : []
        }
        pagination={{
          style: { marginBottom: 0 },
          pageSize: 5,
        }}
      />
    </Card>
  );
};

export default TopSearch;
