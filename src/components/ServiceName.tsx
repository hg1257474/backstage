import React from 'react';
import { FormattedMessage } from 'umi-plugin-react/locale';
export default ({ serviceName }: { serviceName: string[] }) => {
  console.log(serviceName);
  return (
    <span>
      {serviceName.map((item, index) => (
        <span>
          {/[a-z]/.test(item) ? <FormattedMessage id={`serviceType.${item}`} /> : item}
          {index !== serviceName.length - 1 && '-'}
        </span>
      ))}
    </span>
  );
};
