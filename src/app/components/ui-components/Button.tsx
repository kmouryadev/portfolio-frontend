import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--accent)] text-white transition-opacity duration-200 hover:opacity-[0.85]",
  secondary:
    "bg-transparent text-[var(--text)] border border-[var(--border)] transition-colors duration-200 hover:border-[var(--accent-light)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-5 py-2.5 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-[26px] py-[13px] text-[15px]",
};

const baseStyles =
  "inline-block rounded-lg font-semibold no-underline text-center";

type SharedProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

type LinkButtonProps = SharedProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type PlainButtonProps = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonProps = LinkButtonProps | PlainButtonProps;

export default function Button({
  variant = "primary",
  size = "sm",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(baseStyles, variantStyles[variant], sizeStyles[size], className);

  if (props.href !== undefined) {
    const { href, ...anchorProps } = props as LinkButtonProps;
    const isExternal = /^(https?:|mailto:|tel:)/.test(href);

    if (isExternal) {
      return (
        <a href={href} className={classes} {...anchorProps}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as PlainButtonProps;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
