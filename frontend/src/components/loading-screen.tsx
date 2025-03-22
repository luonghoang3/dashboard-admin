import React from 'react';
import { Spinner } from '@nextui-org/react';

export interface LoadingScreenProps {
  fullScreen?: boolean;
  text?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  fullScreen = false, 
  text = 'Đang tải dữ liệu...' 
}) => {
  const containerClass = fullScreen 
    ? 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50' 
    : 'w-full';

  return (
    <div className={`${containerClass} flex flex-col items-center justify-center min-h-[200px]`}>
      <Spinner size="lg" color="primary" />
      {text && <p className="mt-4 text-default-500">{text}</p>}
    </div>
  );
}; 