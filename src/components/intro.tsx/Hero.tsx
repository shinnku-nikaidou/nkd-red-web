import { GradientText } from "@/components/GradientText";
import { Section } from "@/components/Section";

const Hero = () => (
  <Section>
    <div className="flex flex-col items-center md:flex-row md:justify-between md:gap-x-24">
      <div>
        <h1 className="text-3xl font-bold">
          Hi there, I'm <GradientText>shinnku</GradientText> 👋
        </h1>

        <p className="mt-6 text-xl leading-9">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
          <a className="text-cyan-400 hover:underline" href="/">
            malesuada
          </a>
          nisi tellus, non imperdiet nisi tempor at. Lorem ipsum dolor sit amet,
          <a className="text-cyan-400 hover:underline" href="/">
            consectetur
          </a>
          adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.
        </p>
      </div>

      <div className="shrink-0">
        <img
          className="h-64 w-64"
          src="/assets/images/avatar.jpg"
          alt="Shinnku's Avatar image"
          loading="lazy"
        />
      </div>
    </div>
  </Section>
);

export { Hero };
