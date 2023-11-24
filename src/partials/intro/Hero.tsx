import { GradientText } from "@/components/GradientText";
import { HeroAvatar } from "@/components/intro.tsx/HeroAvatar";
import { Section } from "@/components/Section";

const Hero = () => (
  <Section>
    <HeroAvatar
      title={
        <>
          Hi there, I'm <GradientText>shinnku</GradientText> 👋
        </>
      }
      description={
        <>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
          <a className="text-cyan-400 hover:underline" href="/">
            malesuada
          </a>
          nisi tellus, non imperdiet nisi tempor at. Lorem ipsum dolor sit amet,
          <a className="text-cyan-400 hover:underline" href="/">
            consectetur
          </a>
          adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.
        </>
      }
      avatar={
        <img
          className="h-80 w-64"
          src="/assets/images/avatar.svg"
          alt="Avatar image"
          loading="lazy"
        />
      }
    />
  </Section>
);

export { Hero };
