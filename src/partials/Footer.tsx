import { Section } from "@/components/Section";
import { AppConfig } from "@/utils/AppConfig";

type IFooterCopyrightProps = {
  site_name: string;
};

const FooterCopyright = (props: IFooterCopyrightProps) => (
  <div className="border-t border-gray-600 pt-5">
    <div className="text-sm text-gray-200">
      © Copyright {new Date().getFullYear()} by {props.site_name}. Built with ♥
      <a
        className="text-cyan-400 hover:underline"
        href="https://astro.build/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Astro
      </a>
      .
    </div>
  </div>
);

const Footer = () => (
  <Section>
    <FooterCopyright site_name={AppConfig.site_name} />
  </Section>
);

export { Footer };
