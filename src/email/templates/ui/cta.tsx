import { Button, Section, Text } from '@react-email/components';

export interface CtaProps {
  buttonHref: string;
  buttonLabel: string;
  subtitle: string;
}

export const Cta = ({ buttonHref, buttonLabel, subtitle }: CtaProps) => (
  <Section className="mt-4 text-center">
    <Button
      href={buttonHref}
      className="bg-portalfi-primary-700 hover:bg-portalfi-primary-600 text-portalfi-base-white inline-block rounded-full px-8 py-3 text-sm font-medium"
    >
      {buttonLabel}
    </Button>
    <Text className="text-portalfi-base-400 mt-4 text-xs">{subtitle}</Text>
  </Section>
);
