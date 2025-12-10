import { Section, Text } from '@react-email/components';
import { Wrapper } from './ui/wrapper';

interface CardFrozenBySystemEmailProps {
  previewText: string;
  heading: string;
  buttonHref: string;
  buttonLabel: string;
  intro: string;
  details: string;
  stepGoToCards: string;
  stepGoToSettings: string;
  stepTapUnfreeze: string;
  metaHint: string;
  footerRightsText: string;
}

export const CardFrozenBySystemEmail = ({
  previewText,
  heading,
  buttonHref,
  buttonLabel,
  intro,
  details,
  stepGoToCards,
  stepGoToSettings,
  stepTapUnfreeze,
  metaHint,
  footerRightsText,
}: CardFrozenBySystemEmailProps) => {
  return (
    <Wrapper
      previewText={previewText}
      bannerUrl="https://placedog.net/828"
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
        <Text className="text-portalfi-base-400 text-sm leading-relaxed">
          {details}
        </Text>
        <ul className="text-portalfi-base-400 list-disc space-y-1 pl-6 text-sm leading-relaxed">
          <li>{stepGoToCards}</li>
          <li>{stepGoToSettings}</li>
          <li>{stepTapUnfreeze}</li>
        </ul>
      </Section>
    </Wrapper>
  );
};
