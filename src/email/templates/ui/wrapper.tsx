import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import * as React from 'react';
import { Cta } from './cta';
import { Footer } from './footer';

interface WrapperProps {
  previewText?: string;
  bannerUrl: string;
  heading: string;
  buttonHref: string;
  buttonLabel: string;
  subtitle: string;
  footerRightsText: string;
  children: React.ReactNode;
  overImageContent?: React.ReactNode;
  showCta?: boolean;
}

export const Wrapper = ({
  previewText,
  bannerUrl = 'https://placedog.net/500',
  heading,
  buttonHref,
  buttonLabel,
  subtitle,
  footerRightsText,
  children,
  overImageContent,
  showCta = true,
}: WrapperProps) => {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              portalfi: {
                base: {
                  white: '#FFFFFF',
                  50: '#F8F8F8',
                  100: '#F3F3F3',
                  200: '#E9E9E9',
                  300: '#DFDFDF',
                  400: '#C8C8C8',
                  500: '#AEAEAE',
                  550: '#808080',
                  600: '#545454',
                  650: '#484848',
                  700: '#39393A',
                  750: '#2C2C2C',
                  800: '#1F1F1F',
                  850: '#1C1C1D',
                  900: '#141414',
                },
                'base-dark': {
                  50: '#9294A9',
                  100: '#3C3D4D',
                  200: '#2C2D39',
                  300: '#23242E',
                  400: '#1F222D',
                  500: '#1C1E29',
                  600: '#1A1C25',
                  700: '#15161E',
                },
                primary: {
                  50: '#E5EEFD',
                  100: '#CCDFFE',
                  200: '#AED0FF',
                  300: '#8EB7EF',
                  400: '#669CE5',
                  500: '#4285DF',
                  600: '#266FD2',
                  700: '#105FC9',
                },
                secondary: {
                  50: '#FAEB7A',
                  100: '#EBDA58',
                  200: '#DBC731',
                  300: '#C7B638',
                  400: '#B49B1D',
                  500: '#A08810',
                  600: '#7D6A09',
                  700: '#5C4D00',
                },
                success: {
                  50: '#BBF1C6',
                  100: '#A9DEB4',
                  200: '#69C57D',
                  300: '#43B75D',
                  400: '#3DA755',
                  500: '#308242',
                  600: '#256533',
                  700: '#1C4D27',
                },
                danger: {
                  50: '#FDECEC',
                  100: '#F7A9A7',
                  200: '#F4827E',
                  300: '#EE443F',
                  400: '#D93E39',
                  500: '#A9302D',
                  600: '#832523',
                  700: '#641D1A',
                },
              },
            },
            fontFamily: {
              satoshi: ['Satoshi', 'system-ui', 'sans-serif'],
            },
          },
        },
      }}
    >
      <Html>
        <Head>
          <link href="https://fonts.cdnfonts.com/css/ubuntu" rel="stylesheet" />
          <style>
            {`
              @font-face {
                font-family: 'Satoshi';
                font-style: normal;
                font-weight: 400;
                src: local('Satoshi'), url('https://fonts.cdnfonts.com/s/85546/Satoshi-Regular.woff') format('woff');
              }
              @font-face {
                font-family: 'Satoshi';
                font-style: italic;
                font-weight: 400;
                src: local('Satoshi'), url('https://fonts.cdnfonts.com/s/85546/Satoshi-Italic.woff') format('woff');
              }
              @font-face {
                font-family: 'Satoshi';
                font-style: normal;
                font-weight: 300;
                src: local('Satoshi'), url('https://fonts.cdnfonts.com/s/85546/Satoshi-Light.woff') format('woff');
              }
              @font-face {
                font-family: 'Satoshi';
                font-style: italic;
                font-weight: 300;
                src: local('Satoshi'), url('https://fonts.cdnfonts.com/s/85546/Satoshi-LightItalic.woff') format('woff');
              }
              @font-face {
                font-family: 'Satoshi';
                font-style: normal;
                font-weight: 500;
                src: local('Satoshi'), url('https://fonts.cdnfonts.com/s/85546/Satoshi-Medium.woff') format('woff');
              }
              @font-face {
                font-family: 'Satoshi';
                font-style: italic;
                font-weight: 500;
                src: local('Satoshi'), url('https://fonts.cdnfonts.com/s/85546/Satoshi-MediumItalic.woff') format('woff');
              }
              @font-face {
                font-family: 'Satoshi';
                font-style: normal;
                font-weight: 700;
                src: local('Satoshi'), url('https://fonts.cdnfonts.com/s/85546/Satoshi-Bold.woff') format('woff');
              }
              @font-face {
                font-family: 'Satoshi';
                font-style: italic;
                font-weight: 700;
                src: local('Satoshi'), url('https://fonts.cdnfonts.com/s/85546/Satoshi-BoldItalic.woff') format('woff');
              }
              @font-face {
                font-family: 'Satoshi';
                font-style: normal;
                font-weight: 900;
                src: local('Satoshi'), url('https://fonts.cdnfonts.com/s/85546/Satoshi-Black.woff') format('woff');
              }
              @font-face {
                font-family: 'Satoshi';
                font-style: italic;
                font-weight: 900;
                src: local('Satoshi'), url('https://fonts.cdnfonts.com/s/85546/Satoshi-BlackItalic.woff') format('woff');
              }
            `}
          </style>
        </Head>
        {previewText ? <Preview>{previewText}</Preview> : null}

        <Body className="bg-portalfi-base-dark-500 text-portalfi-base-50 font-satoshi">
          <Container className="bg-portalfi-base-dark-700 mx-auto my-10 max-w-xl overflow-hidden rounded-xl shadow">
            <Section className="relative aspect-[390/480]">
              <Img
                src={bannerUrl}
                alt={previewText}
                className="absolute top-0 h-full w-full object-cover"
              />
              {overImageContent ? (
                <div className="absolute inset-0">{overImageContent}</div>
              ) : null}
            </Section>
            <div className="px-8 pb-8">
              <Heading className="text-portalfi-base-white text-center text-2xl font-semibold">
                {heading}
              </Heading>
              {children}
              {showCta ? (
                <Cta
                  buttonHref={buttonHref}
                  buttonLabel={buttonLabel}
                  subtitle={subtitle}
                />
              ) : null}
              <Footer rightsText={footerRightsText} />
            </div>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};
