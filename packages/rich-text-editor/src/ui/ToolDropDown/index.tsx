// import { addClassName } from '@/utils/className';
import { FC, useState } from 'react';
import ToolButton from '../ToolButton';
// import { DownOutlined } from '@ant-design/icons';

interface ToolDropDownProps {}

const ToolDropDown: FC<ToolDropDownProps> = () => {
  const [showDropDown, setShowDropDown] = useState(false);

  return (
    <>
      <ToolButton onClick={() => setShowDropDown(!showDropDown)} />
      {/* <DownOutlined /> */}
      {/* </ToolButton> */}

      {showDropDown && <div>123</div>}
    </>
  );
};

export default ToolDropDown;
