import React from 'react';

interface FormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  className?: string;
}

const Form: React.FC<FormProps> = ({ onSubmit, children, className }) => {
  return (
    <form onSubmit={onSubmit} className={`p-3 sm:p-4 bg-white rounded-lg shadow-md space-y-4 max-w-screen-sm mx-auto ${className}`}>
      {children}
    </form>
  );
};

export default Form;