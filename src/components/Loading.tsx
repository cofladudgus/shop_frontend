import React from 'react';
import styles from '@/styles/components/loading.module.scss';

export const Loading = () => {
  return (
    <div
      className={
        'flex flex-col fixed top-0 left-0 h-full bg-transparent w-full gap-8 justify-center text-center z-50'
      }
    >
      <div className={'mx-auto'}>
        <div className={'flex justify-center items-center mb-6'}>
          <div
            className={`${styles.loader} ease-linear rounded-full border-8 border-t-8 border-gray-200 h-28 w-28`}
          ></div>
          <div className={'flex absolute text-center transform font-bold'}>Loading</div>
        </div>
      </div>
    </div>
  );
};
