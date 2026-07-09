import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../../../cn.config';

type TypographyProps = {
  children: ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'span';
  className?: string;
} & DetailedHTMLProps<
  HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement>,
  HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement
>;

const Typography = ({
  children,
  variant = 'p',
  className,
}: TypographyProps) => {
  const baseClasses = '';
  const variantClasses = {
    h1: 'text-3xl font-bold',
    h2: '',
    h3: '',
    h4: '',
    h5: '',
    p: '',
    span: 'text-sm max-sm:text-xs ',
  };

  const classes = cn(baseClasses, variantClasses[variant], className);

  const Typography = variant;

  return <Typography className={classes}>{children}</Typography>;
};

export default Typography;
