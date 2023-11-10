import { GradientText } from "@/components/GradientText";
import { Newsletter } from "@/components/Newsletter";
import { Section } from "@/components/Section";

const CTA = () => (
  <Section>
    <Newsletter
      title={
        <>
          感谢你能看到这里 by<GradientText> Shinnku </GradientText>
        </>
      }
      description=""
    />
  </Section>
);

export { CTA };
