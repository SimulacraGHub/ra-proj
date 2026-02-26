import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button {...props} style={{ padding: '0.5rem 1rem', backgroundColor: '#4f46e5', color: 'white', borderRadius: '4px' }}>
      {children}
    </button>
  );
};
