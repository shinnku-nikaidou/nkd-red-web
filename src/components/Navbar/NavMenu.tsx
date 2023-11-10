import type { ReactNode } from "react";

const NavMenu = (props: { children: ReactNode }) => (
  <nav>
    <ul className="flex gap-x-3 font-medium text-gray-500">{props.children}</ul>
  </nav>
);

export { NavMenu };
