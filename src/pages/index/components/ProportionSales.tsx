import { Card, Radio } from 'antd';

import { FormattedMessage } from 'umi-plugin-react/locale';
import { RadioChangeEvent } from 'antd/es/radio';
import React from 'react';
import { VisitDataType } from '../data.d';
import { Pie } from './Charts';
import Yuan from '../utils/Yuan';
import styles from '../style.less';

const ProportionSales = ({
  dropdownGroup,
  salesType,
  loading,
  salesPieData,
  handleChangeSalesType,
  test,
}: {
  test: any;
  loading: boolean;
  dropdownGroup: React.ReactNode;
  salesType: 'all' | 'online' | 'stores';
  salesPieData: VisitDataType[];
  handleChangeSalesType?: (e: RadioChangeEvent) => void;
}) => {
  console.log(salesPieData);
  console.log(test && test.monthSalesPie);
  return (
    <Card
      loading={loading}
      className={styles.salesCard}
      bordered={false}
      title={
        <FormattedMessage
          id="dashboard-analysis.analysis.the-proportion-of-sales"
          defaultMessage="The Proportion of Sales"
        />
      }
      style={{
        height: '100%',
      }}
    >
      <div>
        <h4 style={{ marginTop: 8, marginBottom: 32 }}>
          <FormattedMessage id="dashboard-analysis.analysis.month-sales" defaultMessage="Sales" />
        </h4>
        <Pie
          hasLegend
          subTitle={
            <FormattedMessage id="dashboard-analysis.analysis.sales" defaultMessage="Sales" />
          }
          total={() => (
            <Yuan>{test ? test.monthSalesPie.reduce((pre, now) => now.y + pre, 0) : 0}</Yuan>
          )}
          data={test ? test.monthSalesPie : []}
          valueFormat={value => <Yuan>{value}</Yuan>}
          height={248}
          lineWidth={4}
        />
      </div>
    </Card>
  );
};

export default ProportionSales;
