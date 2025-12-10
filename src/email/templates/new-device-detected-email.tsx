import { Section, Text } from '@react-email/components';
import { Wrapper } from './ui/wrapper';

interface NewDeviceDetectedEmailProps {
  previewText: string;
  heading: string;
  buttonHref: string;
  buttonLabel: string;
  intro: string;
  confirmText: string;
  secureHint: string;
  footerRightsText: string;
}

export const NewDeviceDetectedEmail = ({
  previewText,
  heading,
  buttonHref,
  buttonLabel,
  intro,
  confirmText,
  secureHint,
  footerRightsText,
}: NewDeviceDetectedEmailProps) => {
  return (
    <Wrapper
      previewText={previewText}
      bannerUrl="https://placedog.net/802"
      buttonHref={buttonHref}
      buttonLabel={buttonLabel}
      subtitle={secureHint}
      heading={heading}
      footerRightsText={footerRightsText}
    >
      <Section className="mt-4 space-y-4 text-center">
        <Text className="text-portalfi-base-400 text-sm leading-relaxed">
          {intro}
        </Text>
        <Text className="text-portalfi-base-400 text-sm leading-relaxed">
          {confirmText}
        </Text>
      </Section>
    </Wrapper>
  );
};
