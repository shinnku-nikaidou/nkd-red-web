type INavMenuItemProps = {
  href: string;
  children: string;
  target?: "_blank" | "_self" | "_parent" | "_top" | string;
};

const NavMenuItem = (props: INavMenuItemProps) => (
  <li className="hover:text-blue-400">
    <a href={props.href} target={props.target || "_blank"}>
      {props.children}
    </a>
  </li>
);

export { NavMenuItem };
