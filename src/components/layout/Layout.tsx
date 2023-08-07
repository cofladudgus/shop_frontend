import React from 'react';
import { Navbar } from '@/components/layout/Navbar';

interface Props {
  children: React.ReactNode;
}

export const Layout = (props: Props) => {
  return (
    <div className={'w-full p-0'}>
      <Navbar />
      {props.children}
    </div>
  );
};
