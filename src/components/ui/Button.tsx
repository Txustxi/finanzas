"use client";
import { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={clsx(
        'rounded-2xl px-4 py-2 shadow-md bg-blue-600 text-white hover:bg-blue-700 transition',
        className,
      )}
    />
  );
}
