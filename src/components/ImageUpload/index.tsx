import React from 'react';
import styles from './index.less';
import { Button } from 'antd';
interface Props {
  onChange?: (x: string) => void;
  value?: string;
}
// const url="https://www.huishenghuo.net/resource_test/${x}"
const url = 'http://192.168.0.29:7001';
const getImage = x => {
  const y = x;
  if (y.includes('base64')) return y;
  return `${url}/resource_test/${x}`;
};
export default class extends React.Component<Props, { image: string }> {
  constructor(props: Props) {
    super(props);
    this.state = { image: props.value || '' };
  }
  state = { image: '' };
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.onload = () => {
      console.log(reader.result);
      this.setState({ image: reader.result as string });
      this.props.onChange!(reader.result as string);
    };
    reader.readAsDataURL(e.target.files![0]);
  };
  render() {
    console.log(this.props);
    return (
      <div>
        <img src={this.state.image && getImage(this.state.image)} className={styles.img} />
        <Button className={styles.button}>
          {this.state.image ? '修改' : '上传'}
          <input className={styles.input} onChange={this.onChange} type="file" accept="image/*" />
        </Button>
      </div>
    );
  }
}
