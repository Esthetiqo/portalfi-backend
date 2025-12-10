import { Section, Text } from '@react-email/components';
import { Wrapper } from './ui/wrapper';

interface CardFrozenByUserEmailProps {
  previewText: string;
  heading: string;
  buttonHref: string;
  buttonLabel: string;
  intro: string;
  online: string;
  pos: string;
  atm: string;
  metaHint: string;
  footerRightsText: string;
}

export const CardFrozenByUserEmail = ({
  previewText,
  heading,
  buttonHref,
  buttonLabel,
  intro,
  online,
  pos,
  atm,
  metaHint,
  footerRightsText,
}: CardFrozenByUserEmailProps) => {
  return (
    <Wrapper
      previewText={previewText}
      bannerUrl="https://placedog.net/827"
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
          <li>{online}</li>
          <li>{pos}</li>
          <li>{atm}</li>
        </ul>
      </Section>
    </Wrapper>
  );
};
