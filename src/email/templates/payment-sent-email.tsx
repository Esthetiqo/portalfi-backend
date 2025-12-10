import { Section, Text } from '@react-email/components';
import { Wrapper } from './ui/wrapper';

interface PaymentSentEmailProps {
  previewText: string;
  heading: string;
  buttonHref: string;
  buttonLabel: string;
  intro: string;
  amountLabel: string;
  amount: string;
  destinationLabel: string;
  destination: string;
  detailsHint: string;
  footerRightsText: string;
}

export const PaymentSentEmail = ({
  previewText,
  heading,
  buttonHref,
  buttonLabel,
  intro,
  amountLabel,
  amount,
  destinationLabel,
  destination,
  detailsHint,
  footerRightsText,
}: PaymentSentEmailProps) => {
  return (
    <Wrapper
      previewText={previewText}
      bannerUrl="https://placedog.net/804"
      buttonHref={buttonHref}
      buttonLabel={buttonLabel}
      subtitle={detailsHint}
      heading={heading}
      footerRightsText={footerRightsText}
    >
      <Section className="mt-4 space-y-4 text-center">
        <Text className="text-portalfi-base-400 text-sm leading-relaxed">
          {intro}
        </Text>
        <Text className="text-portalfi-base-400 text-sm leading-relaxed">
          • {amountLabel}: {amount}
        </Text>
        <Text className="text-portalfi-base-400 text-sm leading-relaxed">
          • {destinationLabel}: {destination}
        </Text>
      </Section>
    </Wrapper>
  );
};
