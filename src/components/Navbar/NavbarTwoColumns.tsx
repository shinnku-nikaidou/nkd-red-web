import type { ReactNode } from "react";

const NavbarTwoColumns = (props: { children: ReactNode }) => (
  <div className="flex flex-col gap-y-3 sm:flex-row sm:items-center sm:justify-between">
    {props.children}
  </div>
);

export { NavbarTwoColumns };
