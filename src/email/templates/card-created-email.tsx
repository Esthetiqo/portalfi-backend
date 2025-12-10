import { Section, Text } from '@react-email/components';
import { Wrapper } from './ui/wrapper';

interface CardCreatedEmailProps {
  previewText: string;
  heading: string;
  subtitle: string;
  buttonHref: string;
  buttonLabel: string;
  intro: string;
  details: string;
  metaHint: string;
  footerRightsText: string;
}

export const CardCreatedEmail = ({
  previewText,
  heading,
  subtitle,
  buttonHref,
  buttonLabel,
  intro,
  details,
  metaHint,
  footerRightsText,
}: CardCreatedEmailProps) => {
  return (
    <Wrapper
      previewText={previewText}
      bannerUrl="https://placedog.net/808"
      buttonHref={buttonHref}
      buttonLabel={buttonLabel}
      subtitle={metaHint}
      heading={heading}
      footerRightsText={footerRightsText}
    >
      <Section className="mt-4 space-y-4 text-center">
        <Text className="text-portalfi-base-400 text-sm leading-relaxed">
          {subtitle}
        </Text>
        <Text className="text-portalfi-base-400 text-sm leading-relaxed">
          {intro}
        </Text>
        <Text className="text-portalfi-base-400 text-sm leading-relaxed">
          {details}
        </Text>
      </Section>
    </Wrapper>
  );
};
