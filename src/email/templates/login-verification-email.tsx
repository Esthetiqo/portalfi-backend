import { Button, Section, Text } from '@react-email/components';
import { Wrapper } from './ui/wrapper';

interface LoginVerificationEmailProps {
  previewText: string;
  heading: string;
  buttonHref: string;
  buttonLabel: string;
  intro: string;
  details: string;
  codeLabel: string;
  code: string;
  expiresText: string;
  footerRightsText: string;
}

export const LoginVerificationEmail = ({
  previewText,
  heading,
  buttonHref,
  buttonLabel,
  intro,
  details,
  code,
  expiresText,
  footerRightsText,
}: LoginVerificationEmailProps) => {
  return (
    <Wrapper
      previewText={previewText}
      bannerUrl="https://placedog.net/801"
      buttonHref={buttonHref}
      buttonLabel={buttonLabel}
      subtitle={expiresText}
      heading=""
      footerRightsText={footerRightsText}
      showCta={false}
      overImageContent={
        <Section className="flex h-full w-full flex-col items-center justify-center px-8 text-center">
          <Text className="text-portalfi-base-white mb-4 text-2xl font-semibold">
            {heading}
          </Text>
          <Text className="text-portalfi-base-400 mb-6 text-sm leading-relaxed">
            {intro}
          </Text>
          <Text className="text-portalfi-base-400 mb-6 text-sm leading-relaxed">
            {details}
          </Text>
          <Text
            className="text-portalfi-base-white text-3xl font-medium tracking-[0.25em]"
            style={{
              fontFamily:
                'Ubuntu, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
          >
            {code}
          </Text>
        </Section>
      }
    >
      <Section className="mt-8 space-y-4 text-center">
        <Button
          href={buttonHref}
          className="bg-portalfi-primary-700 hover:bg-portalfi-primary-600 text-portalfi-base-white inline-block w-full rounded-full py-3 text-sm font-medium"
        >
          {buttonLabel}
        </Button>
        <Text className="text-portalfi-base-400 mt-2 text-xs">
          {expiresText}
        </Text>
        <Button
          href={buttonHref}
          className="bg-portalfi-base-dark-400 text-portalfi-base-white mt-4 inline-block w-full rounded-full py-3 text-sm font-medium"
        >
          Send Again
        </Button>
      </Section>
    </Wrapper>
  );
};
