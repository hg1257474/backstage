import React from 'react';
import styles from './index.less';
import { Button } from 'antd';
interface Props {
  onChange?: ([x, y]: [string, string]) => void;
  value?: string;
}
const getImage = x => {
  const y = x;
  if (y.includes('base64')) return y;
  return `https://www.huishenghuo.net/resource_test/${x}`;
};
export default class extends React.Component<Props, { image: string }> {
  constructor(props: Props) {
    super(props);
    this.state = { image: props.value || '' };
  }
  state = { image: '' };
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    const fileName = e.target.files![0].name;
    reader.onload = () => {
      console.log('321312093u45u34');
      console.log(fileName);
      this.setState({ image: reader.result as string });
      this.props.onChange!([fileName, reader.result as string]);
    };
    reader.readAsDataURL(e.target.files![0]);
  };
  render() {
    console.log(this.props);
    return (
      <div>
        <img src={getImage(this.state.image)} className={styles.img} />
        <Button className={styles.button}>
          {this.state.image ? '修改' : '上传'}
          <input className={styles.input} onChange={this.onChange} type="file" accept="image/*" />
        </Button>
      </div>
    );
  }
}
