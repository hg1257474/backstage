import React from 'react';
import styles from './index.less';
import { Button } from 'antd';
import { URL } from '../../config';
// const URL = 'http://www.cyfwg.com'; 
interface Props {
  style?: { [x: string]: string };
  target: string;
  onChange?: ([x, y, z]: [string, string, number]) => void;
  value?: string;
  visible?: boolean;
}
interface State {
  image: string;
  oldValue?: string;
}
export default class extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    /* console.log('image constructor'); */
    this.state = { image: props.value || '', oldValue: props.value };
  }
  getImage = () => {
    
    let { image } = this.state;
    if (this.props.value !== this.state.oldValue) {
      this.setState({ image: this.props.value || '', oldValue: this.props.value });
      image = this.props.value || '';
    }
    if (image.length > 4) return image;
    return `${URL}/resource/${this.props.target}/${image[1]}/${image[0]}`;
  };

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    const fileName = e.target.files![0].name;
    const fileSize = e.target.files![0].size;
    reader.onload = () => {
      /* console.log('321312093u45u34'); */
      /* console.log(fileName); */
      this.setState({ image: reader.result as string });
      this.props.onChange!([fileName, reader.result as string, fileSize]);
    };
    reader.readAsDataURL(e.target.files![0]);
  };
  render() {
    console.log(this.props);
    console.log(this.getImage());
    return (
      <div style={this.props.visible ? {} : { display: 'none' }}>
        <img src={this.getImage()} className={styles.img} style={this.props.style} />
        <Button className={styles.button}>
          {this.state.image ? '修改' : '上传'}
          <input className={styles.input} onChange={this.onChange} type="file" accept="image/*" />
        </Button>
      </div>
    );
  }
}
