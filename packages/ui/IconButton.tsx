import React from 'react'
import { SvgIconProps } from '@mui/material/SvgIcon';
import { Icon } from '@mui/material';
 
type IconBtnProps = {
  bg?: string;
  icon: React.ComponentType<SvgIconProps>;
  br: string;
  color?:string;
};
export const IconBtn:React.FC<IconBtnProps> = ({ bg,color, icon:IconComponent, br }) => {
  const styles = {
    backgroundColor: bg,
    borderRadius: br,
    color:color ? color:"white"
  };
  return (
    <span style={styles}>
      <Icon sx={{color}} component={IconComponent} />
    </span>
  );
};

