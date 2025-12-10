import { Button, Hr, Section, Text } from '@react-email/components';
import * as React from 'react';

interface FooterProps {
  rightsText: string;
}

export const Footer: React.FC<FooterProps> = ({ rightsText }) => {
  return (
    <Section className="mt-8 text-center">
      <Hr className="!border-t-portalfi-base-700 mb-8 mt-4" />

      <table width="100%" cellPadding={0} cellSpacing={0} className="mb-4">
        <tbody>
          <tr>
            <td align="center">
              <table cellPadding={0} cellSpacing={0}>
                <tbody>
                  <tr>
                    <td>
                      <Button href="https://x.com/PortalFi">
                        <img src="https://placedog.net/44" alt="PortalFi" />
                      </Button>
                    </td>
                    <td width="12">&nbsp;</td>
                    <td>
                      <Button href="https://twitter.com/PortalFi">
                        <img src="https://placedog.net/44" alt="PortalFi" />
                      </Button>
                    </td>
                    <td width="12">&nbsp;</td>
                    <td>
                      <Button href="https://gitbook.com/PortalFi">
                        <img src="https://placedog.net/44" alt="PortalFi" />
                      </Button>
                    </td>
                    <td width="12">&nbsp;</td>
                    <td>
                      <Button href="https://medium.com/PortalFi">
                        <img src="https://placedog.net/44" alt="PortalFi" />
                      </Button>
                    </td>
                    <td width="12">&nbsp;</td>
                    <td>
                      <Button href="https://discord.com/PortalFi">
                        <img src="https://placedog.net/44" alt="PortalFi" />
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      <Text className="text-portalfi-base-400 text-xs">
        {rightsText} &nbsp;
        <span className="text-portalfi-base-white font-semibold">
          @PortalFi
        </span>
      </Text>
    </Section>
  );
};
