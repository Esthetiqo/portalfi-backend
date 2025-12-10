import { Img, Section } from '@react-email/components';
import * as React from 'react';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <Section className="-mx-8 mb-8 text-center">
      <div>
        <Img
          src="https://placedog.net/500"
          alt={title}
          className="mx-auto block w-full max-w-full align-middle"
        />
      </div>
    </Section>
  );
};
