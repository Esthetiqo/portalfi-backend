import { Img, Section, Text } from '@react-email/components';
import { Wrapper } from './ui/wrapper';

interface PasswordChangedEmailProps {
  previewText: string;
  heading: string;
  buttonHref: string;
  buttonLabel: string;
  infoTitle: string;
  bulletDateTime: string;
  bulletLocation: string;
  bulletNotYou: string;
  metaHint: string;
  footerRightsText: string;
}

export const PasswordChangedEmail = ({
  previewText,
  heading,
  buttonHref,
  buttonLabel,
  infoTitle,
  bulletDateTime,
  bulletLocation,
  bulletNotYou,
  metaHint,
  footerRightsText,
}: PasswordChangedEmailProps) => {
  return (
    <Wrapper
      previewText={previewText}
      bannerUrl="https://placedog.net/801"
      buttonHref={buttonHref}
      buttonLabel={buttonLabel}
      subtitle={metaHint}
      heading=""
      footerRightsText={footerRightsText}
      overImageContent={
        <div className="flex h-full w-full flex-col items-center justify-between pt-[6em] text-center">
          <Text className="text-portalfi-base-white w-[10em] text-2xl font-bold">
            {heading}
          </Text>
          <Img
            src="https://placedog.net/90/90"
            alt="Password updated"
            className="mx-auto mb-[40%] h-[90px] w-[90px] rounded-full object-cover"
          />
        </div>
      }
    >
      <Section className="mt-8 space-y-3 text-left">
        <Text className="text-portalfi-base-white text-center text-xs font-bold tracking-wide">
          {infoTitle}
        </Text>
        <ul className="text-portalfi-base-400 mx-auto max-w-[26em] list-disc space-y-1 pl-5 text-sm leading-relaxed">
          <li>{bulletDateTime}</li>
          <li>{bulletLocation}</li>
          <li>{bulletNotYou}</li>
        </ul>
      </Section>
    </Wrapper>
  );
};
