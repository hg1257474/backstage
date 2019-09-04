import React, { ReactComponentElement } from 'react';
import { Modal } from 'antd';
interface Props {
  type: 'image' | 'video';
  maxSize?: number;
  aspectRatio?: number;
  onChange?: (x: any) => void;
}
const getFileSize = (x: number) => {
  let unit = ['M', 'K', 'B'];
  while (x > 1024) {
    x = x / 1024;
    unit.pop();
  }
  return x.toFixed(0) + unit.pop();
};
export default ({ onChange, type, maxSize, aspectRatio }: Props) => {
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files!.length) return;
    const file = e.target.files![0];
    const fileName = file.name;
    const fileSize = file.size;
    const readFile = () => {
      const reader = new FileReader();
      reader.onload = () => {
        onChange!([fileName, reader.result as string, fileSize]);
      };
      reader.readAsDataURL(file);
    };
    if (maxSize && maxSize < fileSize) {
      Modal.error({ title: `文件大小不能超过${getFileSize(maxSize)}` });
      return;
    }
    if (aspectRatio) {
      let img = document.createElement('img');
      const src = URL.createObjectURL(e.target.files![0]);
      img.src = src;
      img.onload = () => {
        URL.revokeObjectURL(src);
        if (img.width / img.height !== aspectRatio)
          Modal.error({ title: `图片长宽高必须为${aspectRatio}` });
        else readFile();
      };
    } else readFile();
    readFile();
  };

  return (
    <div>
      <input
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          left: 0,
          top: 0,
          visibility: 'hidden',
        }}
        type="file"
        onChange={onChange}
      />
    </div>
  );
};
