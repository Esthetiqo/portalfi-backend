import { Section, Text } from '@react-email/components';
import { Wrapper } from './ui/wrapper';

interface CardActivatedEmailProps {
  previewText: string;
  heading: string;
  buttonHref: string;
  buttonLabel: string;
  intro: string;
  atm: string;
  online: string;
  metaHint: string;
  footerRightsText: string;
}

export const CardActivatedEmail = ({
  previewText,
  heading,
  buttonHref,
  buttonLabel,
  intro,
  atm,
  online,
  metaHint,
  footerRightsText,
}: CardActivatedEmailProps) => {
  return (
    <Wrapper
      previewText={previewText}
      bannerUrl="https://placedog.net/829"
      buttonHref={buttonHref}
      buttonLabel={buttonLabel}
      subtitle={metaHint}
      heading={heading}
      footerRightsText={footerRightsText}
    >
      <Section className="mt-4 space-y-4 text-left">
        <Text className="text-portalfi-base-400 text-sm leading-relaxed">
          {intro}
        </Text>
        <ul className="text-portalfi-base-400 list-disc space-y-1 pl-6 text-sm leading-relaxed">
          <li>{atm}</li>
          <li>{online}</li>
        </ul>
      </Section>
    </Wrapper>
  );
};
