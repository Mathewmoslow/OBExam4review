import { ReactNode } from 'react';

export function Canvas({ children, ...props }: { children?: ReactNode } & Record<string, any>) {
  return <div {...props}>{children}</div>;
}
