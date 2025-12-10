import { Section, Text } from '@react-email/components';
import { Wrapper } from './ui/wrapper';

interface PaymentReceivedEmailProps {
  previewText: string;
  heading: string;
  buttonHref: string;
  buttonLabel: string;
  intro: string;
  amountLabel: string;
  amount: string;
  sourceLabel: string;
  source: string;
  detailsHint: string;
  footerRightsText: string;
}

export const PaymentReceivedEmail = ({
  previewText,
  heading,
  buttonHref,
  buttonLabel,
  intro,
  amountLabel,
  amount,
  sourceLabel,
  source,
  detailsHint,
  footerRightsText,
}: PaymentReceivedEmailProps) => {
  return (
    <Wrapper
      previewText={previewText}
      bannerUrl="https://placedog.net/803"
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
          • {sourceLabel}: {source}
        </Text>
      </Section>
    </Wrapper>
  );
};
