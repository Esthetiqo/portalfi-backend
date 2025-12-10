import { Section, Text } from '@react-email/components';
import { Wrapper } from './ui/wrapper';

interface WelcomeEmailProps {
  previewText: string;
  heading: string;
  buttonHref: string;
  buttonLabel: string;
  subtitle: string;
  bodyIntro: string;
  bodyDetails: string;
  footerRightsText: string;
}

export const WelcomeEmail = ({
  previewText,
  heading,
  buttonHref,
  buttonLabel,
  subtitle,
  bodyIntro,
  bodyDetails,
  footerRightsText,
}: WelcomeEmailProps) => {
  return (
    <Wrapper
      previewText={previewText}
      bannerUrl="https://placedog.net/800"
      buttonHref={buttonHref}
      buttonLabel={buttonLabel}
      subtitle={subtitle}
      heading={heading}
      footerRightsText={footerRightsText}
    >
      <Section className="mt-4 space-y-4 text-center">
        <Text className="text-portalfi-base-400 text-sm leading-relaxed">
          {bodyIntro}
        </Text>
        <Text className="text-portalfi-base-400 text-sm leading-relaxed">
          {bodyDetails}
        </Text>
      </Section>
    </Wrapper>
  );
};
