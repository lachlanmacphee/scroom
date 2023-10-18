import { type ReactNode } from "react";
import { type onClick } from "~/utils/types";

type IconButtonProps = {
  onClick: onClick;
  className: string;
  children: ReactNode;
};

export default function IconButton({
  onClick,
  className,
  children,
}: IconButtonProps) {
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
