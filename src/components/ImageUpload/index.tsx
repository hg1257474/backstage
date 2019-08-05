import React from 'react';
import styles from './index.less';
import { Button } from 'antd';
interface Props {
  target: string;
  onChange?: ([x, y, z]: [string, string, string]) => void;
  value?: string;
}
const url = 'https://www.cyfwg.com';
// const url = 'http://192.168.0.29:7001';
// const url="https://www.huishenghuo.net"
export default class extends React.Component<Props, { image: string; oldValue: string }> {
  constructor(props: Props) {
    super(props);
    console.log('image constructor');
    this.state = { image: props.value || '', oldValue: props.value};
  }
  getImage = () => {
    const { image } = this.state;
    if (image.length > 4) return image;
    return `${url}/resource/${this.props.target}/${image[1]}/${image[0]}`;
  };

  state = { image: '' };
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    const fileName = e.target.files![0].name;
    const fileSize = e.target.files![0].size;
    reader.onload = () => {
      console.log('321312093u45u34');
      console.log(fileName);
      this.setState({ image: reader.result as string });
      this.props.onChange!([fileName, reader.result as string, fileSize]);
    };
    reader.readAsDataURL(e.target.files![0]);
  };
  render() {
    console.log(this.props);
    console.log(this.getImage());
    return (
      <div>
        <img src={this.getImage()} className={styles.img} />
        <Button className={styles.button}>
          {this.state.image ? '修改' : '上传'}
          <input className={styles.input} onChange={this.onChange} type="file" accept="image/*" />
        </Button>
      </div>
    );
  }
}
