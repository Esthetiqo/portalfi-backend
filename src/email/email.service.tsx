import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/render';
import nodemailer, { Transporter, SentMessageInfo } from 'nodemailer';
import * as React from 'react';
import { createEmailI18n } from '../common/lib/i18n/config';
import { normalizeLanguage } from '../common/lib/i18n/utils';
import {
  ActivityDetectedEmail,
  CardActivatedEmail,
  CardBlockedEmail,
  CardCreatedEmail,
  CardDeletedEmail,
  CardExpiredEmail,
  CardFrozenBySystemEmail,
  CardFrozenByUserEmail,
  CardPhysicalDeletedEmail,
  CardPhysicalShippedEmail,
  DepositFailedEmail,
  DepositSuccessfulEmail,
  InvitationReceivedEmail,
  KycCompletedEmail,
  KycNotCompletedEmail,
  LoginVerificationEmail,
  NewDeviceDetectedEmail,
  NewPhoneAddedEmail,
  PasswordChangedEmail,
  PaymentReceivedEmail,
  PaymentSentEmail,
  PhoneRemovedEmail,
  PreventiveAccountLockEmail,
  ReferralJoinedEmail,
  ReferralRewardEmail,
  TransactionDeclinedEmail,
  TwoFactorDisabledEmail,
  TwoFactorEnabledEmail,
  VerifyIdentityEmail,
  WelcomeEmail,
  WithdrawalFailedEmail,
  WithdrawalSuccessfulEmail,
} from './templates';

export enum EmailPreviewTemplate {
  Welcome = 'welcome',
  LoginVerification = 'loginVerification',
  PasswordChanged = 'passwordChanged',
  NewDeviceDetected = 'newDeviceDetected',
  NewPhoneAdded = 'newPhoneAdded',
  PhoneRemoved = 'phoneRemoved',
  TwoFactorDisabled = 'twoFactorDisabled',
  TwoFactorEnabled = 'twoFactorEnabled',
  ActivityDetected = 'activityDetected',
  PaymentReceived = 'paymentReceived',
  PaymentSent = 'paymentSent',
  DepositSuccessful = 'depositSuccessful',
  DepositFailed = 'depositFailed',
  WithdrawalFailed = 'withdrawalFailed',
  WithdrawalSuccessful = 'withdrawalSuccessful',
  CardBlocked = 'cardBlocked',
  CardCreated = 'cardCreated',
  CardPhysicalShipped = 'cardPhysicalShipped',
  CardPhysicalDeleted = 'cardPhysicalDeleted',
  CardActivated = 'cardActivated',
  CardFrozenByUser = 'cardFrozenByUser',
  CardFrozenBySystem = 'cardFrozenBySystem',
  CardDeleted = 'cardDeleted',
  CardExpired = 'cardExpired',
  InvitationReceived = 'invitationReceived',
  VerifyIdentity = 'verifyIdentity',
  KycCompleted = 'kycCompleted',
  KycNotCompleted = 'kycNotCompleted',
  PreventiveAccountLock = 'preventiveAccountLock',
  ReferralJoined = 'referralJoined',
  ReferralReward = 'referralReward',
  TransactionDeclined = 'transactionDeclined',
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.getOrThrow<string>('SMTP_HOST');
    const port = Number(this.configService.get<string>('SMTP_PORT') ?? '587');
    const secureEnv = this.configService.get<string>('SMTP_SECURE');
    const secure = secureEnv === 'true' || secureEnv === '1';

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: this.configService.getOrThrow<string>('SMTP_USER'),
        pass: this.configService.getOrThrow<string>('SMTP_PASS'),
      },
    });
  }

  async sendWelcomeEmail(to: string, name: string, language?: string) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('welcome.subject');
    const previewText = i18n.t('welcome.preview');
    const heading = i18n.t('welcome.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('welcome.cta.label');
    const subtitle = i18n.t('welcome.cta.subtitle');
    const bodyIntro = i18n.t('welcome.body.intro', { name });
    const bodyDetails = i18n.t('welcome.body.details');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <WelcomeEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        subtitle={subtitle}
        bodyIntro={bodyIntro}
        bodyDetails={bodyDetails}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`Example welcome email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async previewExampleEmail(
    name: string,
    language?: string,
    template: EmailPreviewTemplate = EmailPreviewTemplate.Welcome,
  ): Promise<string> {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const buttonHref = 'https://portalfi.com';
    const footerRightsText = i18n.t('footer.rights');

    let email: React.ReactElement;

    switch (template) {
      case EmailPreviewTemplate.LoginVerification: {
        const previewText = i18n.t('loginVerification.preview');
        const heading = i18n.t('loginVerification.heading');
        const buttonLabel = i18n.t('loginVerification.cta.label');
        const intro = i18n.t('loginVerification.body.intro', { name });
        const details = i18n.t('loginVerification.body.details');
        const codeLabel = i18n.t('loginVerification.body.codeLabel');
        const expiresText = i18n.t('loginVerification.meta.expires', {
          minutes: 5,
        });

        const sampleCode = '4356';

        email = (
          <LoginVerificationEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            details={details}
            codeLabel={codeLabel}
            code={sampleCode}
            expiresText={expiresText}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.PasswordChanged: {
        const previewText = i18n.t('passwordChanged.preview');
        const heading = i18n.t('passwordChanged.heading');
        const buttonLabel = i18n.t('passwordChanged.cta.label');
        const infoTitle = i18n.t('passwordChanged.body.title');
        const bulletDateTime = i18n.t('passwordChanged.body.bullets.dateTime', {
          dateTime: '8/20/25 — 14:35 UTC',
        });
        const bulletLocation = i18n.t('passwordChanged.body.bullets.location', {
          location: 'Valencia, Venezuela',
        });
        const bulletNotYou = i18n.t('passwordChanged.body.bullets.notYou');
        const metaHint = i18n.t('passwordChanged.meta.hint');

        email = (
          <PasswordChangedEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            infoTitle={infoTitle}
            bulletDateTime={bulletDateTime}
            bulletLocation={bulletLocation}
            bulletNotYou={bulletNotYou}
            metaHint={metaHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.NewDeviceDetected: {
        const previewText = i18n.t('newDeviceDetected.preview');
        const heading = i18n.t('newDeviceDetected.heading');
        const buttonLabel = i18n.t('newDeviceDetected.cta.label');
        const intro = i18n.t('newDeviceDetected.body.intro', { name });
        const confirmText = i18n.t('newDeviceDetected.body.confirm');
        const secureHint = i18n.t('newDeviceDetected.body.secureHint');

        email = (
          <NewDeviceDetectedEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            confirmText={confirmText}
            secureHint={secureHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.NewPhoneAdded: {
        const previewText = i18n.t('newPhoneAdded.preview');
        const heading = i18n.t('newPhoneAdded.heading');
        const buttonLabel = i18n.t('newPhoneAdded.cta.label');
        const intro = i18n.t('newPhoneAdded.body.intro', { name });
        const details = i18n.t('newPhoneAdded.body.details');
        const metaHint = i18n.t('newPhoneAdded.meta.hint');

        email = (
          <NewPhoneAddedEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            details={details}
            metaHint={metaHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.PhoneRemoved: {
        const previewText = i18n.t('phoneRemoved.preview');
        const heading = i18n.t('phoneRemoved.heading');
        const buttonLabel = i18n.t('phoneRemoved.cta.label');
        const intro = i18n.t('phoneRemoved.body.intro', { name });
        const details = i18n.t('phoneRemoved.body.details');
        const metaHint = i18n.t('phoneRemoved.meta.hint');

        email = (
          <PhoneRemovedEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            details={details}
            metaHint={metaHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.TwoFactorDisabled: {
        const previewText = i18n.t('twoFactorDisabled.preview');
        const heading = i18n.t('twoFactorDisabled.heading');
        const buttonLabel = i18n.t('twoFactorDisabled.cta.label');
        const intro = i18n.t('twoFactorDisabled.body.intro', { name });
        const details = i18n.t('twoFactorDisabled.body.details');
        const metaHint = i18n.t('twoFactorDisabled.meta.hint');

        email = (
          <TwoFactorDisabledEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            details={details}
            metaHint={metaHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.TwoFactorEnabled: {
        const previewText = i18n.t('twoFactorEnabled.preview');
        const heading = i18n.t('twoFactorEnabled.heading');
        const buttonLabel = i18n.t('twoFactorEnabled.cta.label');
        const intro = i18n.t('twoFactorEnabled.body.intro', { name });
        const details = i18n.t('twoFactorEnabled.body.details');
        const metaHint = i18n.t('twoFactorEnabled.meta.hint');

        email = (
          <TwoFactorEnabledEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            details={details}
            metaHint={metaHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.ActivityDetected: {
        const previewText = i18n.t('activityDetected.preview');
        const heading = i18n.t('activityDetected.heading');
        const buttonLabel = i18n.t('activityDetected.cta.label');
        const intro = i18n.t('activityDetected.body.intro', { name });
        const details = i18n.t('activityDetected.body.details');
        const metaHint = i18n.t('activityDetected.meta.hint');

        email = (
          <ActivityDetectedEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            details={details}
            metaHint={metaHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.PaymentReceived: {
        const previewText = i18n.t('paymentReceived.preview');
        const heading = i18n.t('paymentReceived.heading');
        const buttonLabel = i18n.t('paymentReceived.cta.label');
        const intro = i18n.t('paymentReceived.body.intro', { name });
        const amountLabel = i18n.t('paymentReceived.body.amountLabel');
        const sourceLabel = i18n.t('paymentReceived.body.sourceLabel');
        const detailsHint = i18n.t('paymentReceived.body.detailsHint');

        const sampleAmount = '1000$';
        const sampleSource = 'Dany Cova';

        email = (
          <PaymentReceivedEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            amountLabel={amountLabel}
            amount={sampleAmount}
            sourceLabel={sourceLabel}
            source={sampleSource}
            detailsHint={detailsHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.PaymentSent: {
        const previewText = i18n.t('paymentSent.preview');
        const heading = i18n.t('paymentSent.heading');
        const buttonLabel = i18n.t('paymentSent.cta.label');
        const intro = i18n.t('paymentSent.body.intro', { name });
        const amountLabel = i18n.t('paymentSent.body.amountLabel');
        const destinationLabel = i18n.t('paymentSent.body.destinationLabel');
        const detailsHint = i18n.t('paymentSent.body.detailsHint');

        const sampleAmount = '1000$';
        const sampleDestination = 'Dany Cova';

        email = (
          <PaymentSentEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            amountLabel={amountLabel}
            amount={sampleAmount}
            destinationLabel={destinationLabel}
            destination={sampleDestination}
            detailsHint={detailsHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.TransactionDeclined: {
        const previewText = i18n.t('transactionDeclined.preview');
        const heading = i18n.t('transactionDeclined.heading');
        const buttonLabel = i18n.t('transactionDeclined.cta.label');
        const intro = i18n.t('transactionDeclined.body.intro', { name });
        const amountLabel = i18n.t('transactionDeclined.body.amountLabel');
        const destinationLabel = i18n.t(
          'transactionDeclined.body.destinationLabel',
        );
        const detailsHint = i18n.t('transactionDeclined.body.detailsHint');

        const sampleAmount = '1000$';
        const sampleDestination = 'Dany Cova';

        email = (
          <TransactionDeclinedEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            amountLabel={amountLabel}
            amount={sampleAmount}
            destinationLabel={destinationLabel}
            destination={sampleDestination}
            detailsHint={detailsHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.DepositSuccessful: {
        const previewText = i18n.t('depositSuccessful.preview');
        const heading = i18n.t('depositSuccessful.heading');
        const buttonLabel = i18n.t('depositSuccessful.cta.label');
        const intro = i18n.t('depositSuccessful.body.intro', { name });
        const amountLabel = i18n.t('depositSuccessful.body.amountLabel');
        const methodLabel = i18n.t('depositSuccessful.body.methodLabel');
        const detailsHint = i18n.t('depositSuccessful.body.detailsHint');

        const sampleAmount = '1000$';
        const sampleMethod = 'Card';

        email = (
          <DepositSuccessfulEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            amountLabel={amountLabel}
            amount={sampleAmount}
            methodLabel={methodLabel}
            method={sampleMethod}
            detailsHint={detailsHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.DepositFailed: {
        const previewText = i18n.t('depositFailed.preview');
        const heading = i18n.t('depositFailed.heading');
        const buttonLabel = i18n.t('depositFailed.cta.label');
        const intro = i18n.t('depositFailed.body.intro', { name });
        const amountLabel = i18n.t('depositFailed.body.amountLabel');
        const methodLabel = i18n.t('depositFailed.body.methodLabel');
        const detailsHint = i18n.t('depositFailed.body.detailsHint');

        const sampleAmount = '1000$';
        const sampleMethod = 'Card';

        email = (
          <DepositFailedEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            amountLabel={amountLabel}
            amount={sampleAmount}
            methodLabel={methodLabel}
            method={sampleMethod}
            detailsHint={detailsHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.WithdrawalFailed: {
        const previewText = i18n.t('withdrawalFailed.preview');
        const heading = i18n.t('withdrawalFailed.heading');
        const buttonLabel = i18n.t('withdrawalFailed.cta.label');
        const intro = i18n.t('withdrawalFailed.body.intro', { name });
        const details = i18n.t('withdrawalFailed.body.details');
        const metaHint = i18n.t('withdrawalFailed.meta.hint');

        email = (
          <WithdrawalFailedEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            details={details}
            metaHint={metaHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.WithdrawalSuccessful: {
        const previewText = i18n.t('withdrawalSuccessful.preview');
        const heading = i18n.t('withdrawalSuccessful.heading');
        const buttonLabel = i18n.t('withdrawalSuccessful.cta.label');
        const intro = i18n.t('withdrawalSuccessful.body.intro', { name });
        const details = i18n.t('withdrawalSuccessful.body.details');
        const metaHint = i18n.t('withdrawalSuccessful.meta.hint');

        email = (
          <WithdrawalSuccessfulEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            details={details}
            metaHint={metaHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.InvitationReceived: {
        const previewText = i18n.t('invitationReceived.preview');
        const heading = i18n.t('invitationReceived.heading');
        const buttonLabel = i18n.t('invitationReceived.cta.label');
        const intro = i18n.t('invitationReceived.body.intro', { name });
        const details = i18n.t('invitationReceived.body.details');
        const metaHint = i18n.t('invitationReceived.meta.hint');

        email = (
          <InvitationReceivedEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            details={details}
            metaHint={metaHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.VerifyIdentity: {
        const previewText = i18n.t('verifyIdentity.preview');
        const heading = i18n.t('verifyIdentity.heading');
        const buttonLabel = i18n.t('verifyIdentity.cta.label');
        const intro = i18n.t('verifyIdentity.body.intro', { name });
        const details = i18n.t('verifyIdentity.body.details');
        const metaHint = i18n.t('verifyIdentity.meta.hint');

        email = (
          <VerifyIdentityEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            details={details}
            metaHint={metaHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.KycCompleted: {
        const previewText = i18n.t('kycCompleted.preview');
        const heading = i18n.t('kycCompleted.heading');
        const buttonLabel = i18n.t('kycCompleted.cta.label');
        const intro = i18n.t('kycCompleted.body.intro', { name });
        const details = i18n.t('kycCompleted.body.details');
        const metaHint = i18n.t('kycCompleted.meta.hint');

        email = (
          <KycCompletedEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            details={details}
            metaHint={metaHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.KycNotCompleted: {
        const previewText = i18n.t('kycNotCompleted.preview');
        const heading = i18n.t('kycNotCompleted.heading');
        const buttonLabel = i18n.t('kycNotCompleted.cta.label');
        const intro = i18n.t('kycNotCompleted.body.intro', { name });
        const details = i18n.t('kycNotCompleted.body.details');
        const metaHint = i18n.t('kycNotCompleted.meta.hint');

        email = (
          <KycNotCompletedEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            details={details}
            metaHint={metaHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.PreventiveAccountLock: {
        const previewText = i18n.t('preventiveAccountLock.preview');
        const heading = i18n.t('preventiveAccountLock.heading');
        const buttonLabel = i18n.t('preventiveAccountLock.cta.label');
        const intro = i18n.t('preventiveAccountLock.body.intro', { name });
        const details = i18n.t('preventiveAccountLock.body.details');
        const metaHint = i18n.t('preventiveAccountLock.meta.hint');

        email = (
          <PreventiveAccountLockEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            details={details}
            metaHint={metaHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.ReferralJoined: {
        const previewText = i18n.t('referralJoined.preview');
        const heading = i18n.t('referralJoined.heading');
        const buttonLabel = i18n.t('referralJoined.cta.label');
        const intro = i18n.t('referralJoined.body.intro', { name });
        const details = i18n.t('referralJoined.body.details');
        const metaHint = i18n.t('referralJoined.meta.hint');

        email = (
          <ReferralJoinedEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            details={details}
            metaHint={metaHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.ReferralReward: {
        const previewText = i18n.t('referralReward.preview');
        const heading = i18n.t('referralReward.heading');
        const buttonLabel = i18n.t('referralReward.cta.label');
        const intro = i18n.t('referralReward.body.intro', { name });
        const details = i18n.t('referralReward.body.details');
        const metaHint = i18n.t('referralReward.meta.hint');

        email = (
          <ReferralRewardEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            details={details}
            metaHint={metaHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.CardCreated: {
        const previewText = i18n.t('cardCreated.preview');
        const heading = i18n.t('cardCreated.heading');
        const buttonLabel = i18n.t('cardCreated.cta.label');
        const subtitle = i18n.t('cardCreated.body.subtitle');
        const intro = i18n.t('cardCreated.body.intro', { name });
        const details = i18n.t('cardCreated.body.details');
        const metaHint = i18n.t('cardCreated.meta.hint');

        email = (
          <CardCreatedEmail
            previewText={previewText}
            heading={heading}
            subtitle={subtitle}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            details={details}
            metaHint={metaHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.CardPhysicalShipped: {
        const previewText = i18n.t('cardPhysicalShipped.preview');
        const heading = i18n.t('cardPhysicalShipped.heading');
        const buttonLabel = i18n.t('cardPhysicalShipped.cta.label');
        const sampleDestination = 'Isla Turquesa – Neuquén – Valencia';
        const intro = i18n.t('cardPhysicalShipped.body.intro', {
          name,
          destination: sampleDestination,
        });
        const details = i18n.t('cardPhysicalShipped.body.details');
        const metaHint = i18n.t('cardPhysicalShipped.meta.hint');

        email = (
          <CardPhysicalShippedEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            details={details}
            metaHint={metaHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.CardPhysicalDeleted: {
        const previewText = i18n.t('cardPhysicalDeleted.preview');
        const heading = i18n.t('cardPhysicalDeleted.heading');
        const buttonLabel = i18n.t('cardPhysicalDeleted.cta.label');
        const intro = i18n.t('cardPhysicalDeleted.body.intro', {
          name,
          last4: '3572',
        });
        const details = i18n.t('cardPhysicalDeleted.body.details');
        const metaHint = i18n.t('cardPhysicalDeleted.meta.hint');

        email = (
          <CardPhysicalDeletedEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            details={details}
            metaHint={metaHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.CardActivated: {
        const previewText = i18n.t('cardActivated.preview');
        const heading = i18n.t('cardActivated.heading');
        const buttonLabel = i18n.t('cardActivated.cta.label');
        const intro = i18n.t('cardActivated.body.intro', { name });
        const atm = i18n.t('cardActivated.body.bullets.atm');
        const online = i18n.t('cardActivated.body.bullets.online');
        const metaHint = i18n.t('cardActivated.meta.hint');

        email = (
          <CardActivatedEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            atm={atm}
            online={online}
            metaHint={metaHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.CardFrozenByUser: {
        const previewText = i18n.t('cardFrozenByUser.preview');
        const heading = i18n.t('cardFrozenByUser.heading');
        const buttonLabel = i18n.t('cardFrozenByUser.cta.label');
        const intro = i18n.t('cardFrozenByUser.body.intro', { name });
        const online = i18n.t('cardFrozenByUser.body.bullets.online');
        const pos = i18n.t('cardFrozenByUser.body.bullets.pos');
        const atm = i18n.t('cardFrozenByUser.body.bullets.atm');
        const metaHint = i18n.t('cardFrozenByUser.meta.hint');

        email = (
          <CardFrozenByUserEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            online={online}
            pos={pos}
            atm={atm}
            metaHint={metaHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.CardFrozenBySystem: {
        const previewText = i18n.t('cardFrozenBySystem.preview');
        const heading = i18n.t('cardFrozenBySystem.heading');
        const buttonLabel = i18n.t('cardFrozenBySystem.cta.label');
        const intro = i18n.t('cardFrozenBySystem.body.intro', { name });
        const details = i18n.t('cardFrozenBySystem.body.details');
        const stepGoToCards = i18n.t('cardFrozenBySystem.body.steps.goToCards');
        const stepGoToSettings = i18n.t(
          'cardFrozenBySystem.body.steps.goToSettings',
        );
        const stepTapUnfreeze = i18n.t(
          'cardFrozenBySystem.body.steps.tapUnfreeze',
        );
        const metaHint = i18n.t('cardFrozenBySystem.meta.hint');

        email = (
          <CardFrozenBySystemEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            details={details}
            stepGoToCards={stepGoToCards}
            stepGoToSettings={stepGoToSettings}
            stepTapUnfreeze={stepTapUnfreeze}
            metaHint={metaHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.CardBlocked: {
        const previewText = i18n.t('cardBlocked.preview');
        const heading = i18n.t('cardBlocked.heading');
        const buttonLabel = i18n.t('cardBlocked.cta.label');
        const intro = i18n.t('cardBlocked.body.intro', { name });
        const details = i18n.t('cardBlocked.body.details');
        const metaHint = i18n.t('cardBlocked.meta.hint');

        email = (
          <CardBlockedEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            details={details}
            metaHint={metaHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.CardDeleted: {
        const previewText = i18n.t('cardDeleted.preview');
        const heading = i18n.t('cardDeleted.heading');
        const buttonLabel = i18n.t('cardDeleted.cta.label');
        const intro = i18n.t('cardDeleted.body.intro', { name });
        const details = i18n.t('cardDeleted.body.details');
        const metaHint = i18n.t('cardDeleted.meta.hint');

        email = (
          <CardDeletedEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            details={details}
            metaHint={metaHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.CardExpired: {
        const previewText = i18n.t('cardExpired.preview');
        const heading = i18n.t('cardExpired.heading');
        const buttonLabel = i18n.t('cardExpired.cta.label');
        const intro = i18n.t('cardExpired.body.intro', { name });
        const details = i18n.t('cardExpired.body.details');
        const metaHint = i18n.t('cardExpired.meta.hint');

        email = (
          <CardExpiredEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            intro={intro}
            details={details}
            metaHint={metaHint}
            footerRightsText={footerRightsText}
          />
        );
        break;
      }
      case EmailPreviewTemplate.Welcome:
      default: {
        const previewText = i18n.t('welcome.preview');
        const heading = i18n.t('welcome.heading');
        const buttonLabel = i18n.t('welcome.cta.label');
        const subtitle = i18n.t('welcome.cta.subtitle');
        const bodyIntro = i18n.t('welcome.body.intro', { name });
        const bodyDetails = i18n.t('welcome.body.details');

        email = (
          <WelcomeEmail
            previewText={previewText}
            heading={heading}
            buttonHref={buttonHref}
            buttonLabel={buttonLabel}
            subtitle={subtitle}
            bodyIntro={bodyIntro}
            bodyDetails={bodyDetails}
            footerRightsText={footerRightsText}
          />
        );
      }
    }

    return await render(email);
  }

  async sendNewPhoneAddedEmail(to: string, name: string, language?: string) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('newPhoneAdded.subject');
    const previewText = i18n.t('newPhoneAdded.preview');
    const heading = i18n.t('newPhoneAdded.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('newPhoneAdded.cta.label');
    const intro = i18n.t('newPhoneAdded.body.intro', { name });
    const details = i18n.t('newPhoneAdded.body.details');
    const metaHint = i18n.t('newPhoneAdded.meta.hint');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <NewPhoneAddedEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        details={details}
        metaHint={metaHint}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`New phone added email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async sendPhoneRemovedEmail(to: string, name: string, language?: string) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('phoneRemoved.subject');
    const previewText = i18n.t('phoneRemoved.preview');
    const heading = i18n.t('phoneRemoved.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('phoneRemoved.cta.label');
    const intro = i18n.t('phoneRemoved.body.intro', { name });
    const details = i18n.t('phoneRemoved.body.details');
    const metaHint = i18n.t('phoneRemoved.meta.hint');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <PhoneRemovedEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        details={details}
        metaHint={metaHint}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`Phone removed email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async sendTwoFactorDisabledEmail(
    to: string,
    name: string,
    language?: string,
  ) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('twoFactorDisabled.subject');
    const previewText = i18n.t('twoFactorDisabled.preview');
    const heading = i18n.t('twoFactorDisabled.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('twoFactorDisabled.cta.label');
    const intro = i18n.t('twoFactorDisabled.body.intro', { name });
    const details = i18n.t('twoFactorDisabled.body.details');
    const metaHint = i18n.t('twoFactorDisabled.meta.hint');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <TwoFactorDisabledEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        details={details}
        metaHint={metaHint}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`2FA disabled email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async sendTwoFactorEnabledEmail(to: string, name: string, language?: string) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('twoFactorEnabled.subject');
    const previewText = i18n.t('twoFactorEnabled.preview');
    const heading = i18n.t('twoFactorEnabled.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('twoFactorEnabled.cta.label');
    const intro = i18n.t('twoFactorEnabled.body.intro', { name });
    const details = i18n.t('twoFactorEnabled.body.details');
    const metaHint = i18n.t('twoFactorEnabled.meta.hint');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <TwoFactorEnabledEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        details={details}
        metaHint={metaHint}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`2FA enabled email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async sendActivityDetectedEmail(to: string, name: string, language?: string) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('activityDetected.subject');
    const previewText = i18n.t('activityDetected.preview');
    const heading = i18n.t('activityDetected.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('activityDetected.cta.label');
    const intro = i18n.t('activityDetected.body.intro', { name });
    const details = i18n.t('activityDetected.body.details');
    const metaHint = i18n.t('activityDetected.meta.hint');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <ActivityDetectedEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        details={details}
        metaHint={metaHint}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`Activity detected email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async sendInvitationReceivedEmail(
    to: string,
    name: string,
    language?: string,
  ) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('invitationReceived.subject');
    const previewText = i18n.t('invitationReceived.preview');
    const heading = i18n.t('invitationReceived.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('invitationReceived.cta.label');
    const intro = i18n.t('invitationReceived.body.intro', { name });
    const details = i18n.t('invitationReceived.body.details');
    const metaHint = i18n.t('invitationReceived.meta.hint');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <InvitationReceivedEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        details={details}
        metaHint={metaHint}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`Invitation received email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async sendVerifyIdentityEmail(to: string, name: string, language?: string) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('verifyIdentity.subject');
    const previewText = i18n.t('verifyIdentity.preview');
    const heading = i18n.t('verifyIdentity.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('verifyIdentity.cta.label');
    const intro = i18n.t('verifyIdentity.body.intro', { name });
    const details = i18n.t('verifyIdentity.body.details');
    const metaHint = i18n.t('verifyIdentity.meta.hint');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <VerifyIdentityEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        details={details}
        metaHint={metaHint}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`Verify identity email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async sendKycCompletedEmail(to: string, name: string, language?: string) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('kycCompleted.subject');
    const previewText = i18n.t('kycCompleted.preview');
    const heading = i18n.t('kycCompleted.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('kycCompleted.cta.label');
    const intro = i18n.t('kycCompleted.body.intro', { name });
    const details = i18n.t('kycCompleted.body.details');
    const metaHint = i18n.t('kycCompleted.meta.hint');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <KycCompletedEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        details={details}
        metaHint={metaHint}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`KYC completed email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async sendKycNotCompletedEmail(to: string, name: string, language?: string) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('kycNotCompleted.subject');
    const previewText = i18n.t('kycNotCompleted.preview');
    const heading = i18n.t('kycNotCompleted.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('kycNotCompleted.cta.label');
    const intro = i18n.t('kycNotCompleted.body.intro', { name });
    const details = i18n.t('kycNotCompleted.body.details');
    const metaHint = i18n.t('kycNotCompleted.meta.hint');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <KycNotCompletedEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        details={details}
        metaHint={metaHint}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`KYC not completed email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async sendPreventiveAccountLockEmail(
    to: string,
    name: string,
    language?: string,
  ) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('preventiveAccountLock.subject');
    const previewText = i18n.t('preventiveAccountLock.preview');
    const heading = i18n.t('preventiveAccountLock.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('preventiveAccountLock.cta.label');
    const intro = i18n.t('preventiveAccountLock.body.intro', { name });
    const details = i18n.t('preventiveAccountLock.body.details');
    const metaHint = i18n.t('preventiveAccountLock.meta.hint');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <PreventiveAccountLockEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        details={details}
        metaHint={metaHint}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`Preventive account lock email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async sendReferralJoinedEmail(to: string, name: string, language?: string) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('referralJoined.subject');
    const previewText = i18n.t('referralJoined.preview');
    const heading = i18n.t('referralJoined.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('referralJoined.cta.label');
    const intro = i18n.t('referralJoined.body.intro', { name });
    const details = i18n.t('referralJoined.body.details');
    const metaHint = i18n.t('referralJoined.meta.hint');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <ReferralJoinedEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        details={details}
        metaHint={metaHint}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`Referral joined email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async sendReferralRewardEmail(to: string, name: string, language?: string) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('referralReward.subject');
    const previewText = i18n.t('referralReward.preview');
    const heading = i18n.t('referralReward.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('referralReward.cta.label');
    const intro = i18n.t('referralReward.body.intro', { name });
    const details = i18n.t('referralReward.body.details');
    const metaHint = i18n.t('referralReward.meta.hint');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <ReferralRewardEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        details={details}
        metaHint={metaHint}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`Referral reward email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async sendWithdrawalSuccessfulEmail(
    to: string,
    name: string,
    language?: string,
  ) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('withdrawalSuccessful.subject');
    const previewText = i18n.t('withdrawalSuccessful.preview');
    const heading = i18n.t('withdrawalSuccessful.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('withdrawalSuccessful.cta.label');
    const intro = i18n.t('withdrawalSuccessful.body.intro', { name });
    const details = i18n.t('withdrawalSuccessful.body.details');
    const metaHint = i18n.t('withdrawalSuccessful.meta.hint');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <WithdrawalSuccessfulEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        details={details}
        metaHint={metaHint}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`Withdrawal successful email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async sendWithdrawalFailedEmail(to: string, name: string, language?: string) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('withdrawalFailed.subject');
    const previewText = i18n.t('withdrawalFailed.preview');
    const heading = i18n.t('withdrawalFailed.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('withdrawalFailed.cta.label');
    const intro = i18n.t('withdrawalFailed.body.intro', { name });
    const details = i18n.t('withdrawalFailed.body.details');
    const metaHint = i18n.t('withdrawalFailed.meta.hint');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <WithdrawalFailedEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        details={details}
        metaHint={metaHint}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`Withdrawal failed email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async sendCardExpiredEmail(to: string, name: string, language?: string) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('cardExpired.subject');
    const previewText = i18n.t('cardExpired.preview');
    const heading = i18n.t('cardExpired.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('cardExpired.cta.label');
    const intro = i18n.t('cardExpired.body.intro', { name });
    const details = i18n.t('cardExpired.body.details');
    const metaHint = i18n.t('cardExpired.meta.hint');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <CardExpiredEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        details={details}
        metaHint={metaHint}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`Card expired email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async sendCardDeletedEmail(to: string, name: string, language?: string) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('cardDeleted.subject');
    const previewText = i18n.t('cardDeleted.preview');
    const heading = i18n.t('cardDeleted.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('cardDeleted.cta.label');
    const intro = i18n.t('cardDeleted.body.intro', { name });
    const details = i18n.t('cardDeleted.body.details');
    const metaHint = i18n.t('cardDeleted.meta.hint');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <CardDeletedEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        details={details}
        metaHint={metaHint}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`Card deleted email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async sendCardBlockedEmail(to: string, name: string, language?: string) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('cardBlocked.subject');
    const previewText = i18n.t('cardBlocked.preview');
    const heading = i18n.t('cardBlocked.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('cardBlocked.cta.label');
    const intro = i18n.t('cardBlocked.body.intro', { name });
    const details = i18n.t('cardBlocked.body.details');
    const metaHint = i18n.t('cardBlocked.meta.hint');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <CardBlockedEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        details={details}
        metaHint={metaHint}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`Card blocked email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async sendCardCreatedEmail(to: string, name: string, language?: string) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('cardCreated.subject');
    const previewText = i18n.t('cardCreated.preview');
    const heading = i18n.t('cardCreated.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('cardCreated.cta.label');
    const subtitle = i18n.t('cardCreated.body.subtitle');
    const intro = i18n.t('cardCreated.body.intro', { name });
    const details = i18n.t('cardCreated.body.details');
    const metaHint = i18n.t('cardCreated.meta.hint');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <CardCreatedEmail
        previewText={previewText}
        heading={heading}
        subtitle={subtitle}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        details={details}
        metaHint={metaHint}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`Card created email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async sendCardPhysicalShippedEmail(
    to: string,
    name: string,
    destination: string,
    language?: string,
  ) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('cardPhysicalShipped.subject');
    const previewText = i18n.t('cardPhysicalShipped.preview');
    const heading = i18n.t('cardPhysicalShipped.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('cardPhysicalShipped.cta.label');
    const intro = i18n.t('cardPhysicalShipped.body.intro', {
      name,
      destination,
    });
    const details = i18n.t('cardPhysicalShipped.body.details');
    const metaHint = i18n.t('cardPhysicalShipped.meta.hint');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <CardPhysicalShippedEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        details={details}
        metaHint={metaHint}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`Card physical shipped email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async sendCardPhysicalDeletedEmail(
    to: string,
    name: string,
    last4: string,
    language?: string,
  ) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('cardPhysicalDeleted.subject');
    const previewText = i18n.t('cardPhysicalDeleted.preview');
    const heading = i18n.t('cardPhysicalDeleted.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('cardPhysicalDeleted.cta.label');
    const intro = i18n.t('cardPhysicalDeleted.body.intro', { name, last4 });
    const details = i18n.t('cardPhysicalDeleted.body.details');
    const metaHint = i18n.t('cardPhysicalDeleted.meta.hint');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <CardPhysicalDeletedEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        details={details}
        metaHint={metaHint}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`Card physical deleted email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async sendCardActivatedEmail(to: string, name: string, language?: string) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('cardActivated.subject');
    const previewText = i18n.t('cardActivated.preview');
    const heading = i18n.t('cardActivated.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('cardActivated.cta.label');
    const intro = i18n.t('cardActivated.body.intro', { name });
    const atm = i18n.t('cardActivated.body.bullets.atm');
    const online = i18n.t('cardActivated.body.bullets.online');
    const metaHint = i18n.t('cardActivated.meta.hint');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <CardActivatedEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        atm={atm}
        online={online}
        metaHint={metaHint}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`Card activated email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async sendCardFrozenByUserEmail(to: string, name: string, language?: string) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('cardFrozenByUser.subject');
    const previewText = i18n.t('cardFrozenByUser.preview');
    const heading = i18n.t('cardFrozenByUser.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('cardFrozenByUser.cta.label');
    const intro = i18n.t('cardFrozenByUser.body.intro', { name });
    const online = i18n.t('cardFrozenByUser.body.bullets.online');
    const pos = i18n.t('cardFrozenByUser.body.bullets.pos');
    const atm = i18n.t('cardFrozenByUser.body.bullets.atm');
    const metaHint = i18n.t('cardFrozenByUser.meta.hint');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <CardFrozenByUserEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        online={online}
        pos={pos}
        atm={atm}
        metaHint={metaHint}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`Card frozen by user email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async sendCardFrozenBySystemEmail(
    to: string,
    name: string,
    language?: string,
  ) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('cardFrozenBySystem.subject');
    const previewText = i18n.t('cardFrozenBySystem.preview');
    const heading = i18n.t('cardFrozenBySystem.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('cardFrozenBySystem.cta.label');
    const intro = i18n.t('cardFrozenBySystem.body.intro', { name });
    const details = i18n.t('cardFrozenBySystem.body.details');
    const stepGoToCards = i18n.t('cardFrozenBySystem.body.steps.goToCards');
    const stepGoToSettings = i18n.t(
      'cardFrozenBySystem.body.steps.goToSettings',
    );
    const stepTapUnfreeze = i18n.t('cardFrozenBySystem.body.steps.tapUnfreeze');
    const metaHint = i18n.t('cardFrozenBySystem.meta.hint');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <CardFrozenBySystemEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        details={details}
        stepGoToCards={stepGoToCards}
        stepGoToSettings={stepGoToSettings}
        stepTapUnfreeze={stepTapUnfreeze}
        metaHint={metaHint}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`Card frozen by system email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async sendDepositFailedEmail(
    to: string,
    name: string,
    amount: string,
    method: string,
    language?: string,
  ) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('depositFailed.subject');
    const previewText = i18n.t('depositFailed.preview');
    const heading = i18n.t('depositFailed.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('depositFailed.cta.label');
    const intro = i18n.t('depositFailed.body.intro', { name });
    const amountLabel = i18n.t('depositFailed.body.amountLabel');
    const methodLabel = i18n.t('depositFailed.body.methodLabel');
    const detailsHint = i18n.t('depositFailed.body.detailsHint');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <DepositFailedEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        amountLabel={amountLabel}
        amount={amount}
        methodLabel={methodLabel}
        method={method}
        detailsHint={detailsHint}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`Deposit failed email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async sendDepositSuccessfulEmail(
    to: string,
    name: string,
    amount: string,
    method: string,
    language?: string,
  ) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('depositSuccessful.subject');
    const previewText = i18n.t('depositSuccessful.preview');
    const heading = i18n.t('depositSuccessful.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('depositSuccessful.cta.label');
    const intro = i18n.t('depositSuccessful.body.intro', { name });
    const amountLabel = i18n.t('depositSuccessful.body.amountLabel');
    const methodLabel = i18n.t('depositSuccessful.body.methodLabel');
    const detailsHint = i18n.t('depositSuccessful.body.detailsHint');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <DepositSuccessfulEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        amountLabel={amountLabel}
        amount={amount}
        methodLabel={methodLabel}
        method={method}
        detailsHint={detailsHint}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`Deposit successful email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async sendTransactionDeclinedEmail(
    to: string,
    name: string,
    amount: string,
    destination: string,
    language?: string,
  ) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('transactionDeclined.subject');
    const previewText = i18n.t('transactionDeclined.preview');
    const heading = i18n.t('transactionDeclined.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('transactionDeclined.cta.label');
    const intro = i18n.t('transactionDeclined.body.intro', { name });
    const amountLabel = i18n.t('transactionDeclined.body.amountLabel');
    const destinationLabel = i18n.t(
      'transactionDeclined.body.destinationLabel',
    );
    const detailsHint = i18n.t('transactionDeclined.body.detailsHint');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <TransactionDeclinedEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        amountLabel={amountLabel}
        amount={amount}
        destinationLabel={destinationLabel}
        destination={destination}
        detailsHint={detailsHint}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`Transaction declined email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async sendPaymentSentEmail(
    to: string,
    name: string,
    amount: string,
    destination: string,
    language?: string,
  ) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('paymentSent.subject');
    const previewText = i18n.t('paymentSent.preview');
    const heading = i18n.t('paymentSent.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('paymentSent.cta.label');
    const intro = i18n.t('paymentSent.body.intro', { name });
    const amountLabel = i18n.t('paymentSent.body.amountLabel');
    const destinationLabel = i18n.t('paymentSent.body.destinationLabel');
    const detailsHint = i18n.t('paymentSent.body.detailsHint');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <PaymentSentEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        amountLabel={amountLabel}
        amount={amount}
        destinationLabel={destinationLabel}
        destination={destination}
        detailsHint={detailsHint}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`Payment sent email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async sendPaymentReceivedEmail(
    to: string,
    name: string,
    amount: string,
    source: string,
    language?: string,
  ) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('paymentReceived.subject');
    const previewText = i18n.t('paymentReceived.preview');
    const heading = i18n.t('paymentReceived.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('paymentReceived.cta.label');
    const intro = i18n.t('paymentReceived.body.intro', { name });
    const amountLabel = i18n.t('paymentReceived.body.amountLabel');
    const sourceLabel = i18n.t('paymentReceived.body.sourceLabel');
    const detailsHint = i18n.t('paymentReceived.body.detailsHint');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <PaymentReceivedEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        amountLabel={amountLabel}
        amount={amount}
        sourceLabel={sourceLabel}
        source={source}
        detailsHint={detailsHint}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`Payment received email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async sendNewDeviceDetectedEmail(
    to: string,
    name: string,
    language?: string,
  ) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('newDeviceDetected.subject');
    const previewText = i18n.t('newDeviceDetected.preview');
    const heading = i18n.t('newDeviceDetected.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('newDeviceDetected.cta.label');
    const intro = i18n.t('newDeviceDetected.body.intro', { name });
    const confirmText = i18n.t('newDeviceDetected.body.confirm');
    const secureHint = i18n.t('newDeviceDetected.body.secureHint');
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <NewDeviceDetectedEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        confirmText={confirmText}
        secureHint={secureHint}
        footerRightsText={footerRightsText}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`New device detected email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async sendLoginVerificationEmail(
    to: string,
    name: string,
    code: string,
    minutes = 5,
    language?: string,
  ) {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const subject = i18n.t('loginVerification.subject');
    const previewText = i18n.t('loginVerification.preview');
    const heading = i18n.t('loginVerification.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('loginVerification.cta.label');
    const intro = i18n.t('loginVerification.body.intro', { name });
    const codeLabel = i18n.t('loginVerification.body.codeLabel');
    const expiresText = i18n.t('loginVerification.meta.expires', { minutes });
    const footerRightsText = i18n.t('footer.rights');

    const from = this.configService.get<string>('SMTP_FROM');
    const email = (
      <LoginVerificationEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        codeLabel={codeLabel}
        code={code}
        expiresText={expiresText}
        footerRightsText={footerRightsText}
        details={''}
      />
    );

    const html: string = await render(email);

    const info: SentMessageInfo = await this.transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    this.logger.log(`Login verification email sent to ${to}`);
    this.logger.log(`SMTP response: ${info.messageId} ${info.response}`);
  }

  async previewLoginVerificationEmail(
    name: string,
    code: string,
    minutes = 5,
    language?: string,
  ): Promise<string> {
    const normalizedLanguage = normalizeLanguage(language ?? null);
    const i18n = await createEmailI18n(normalizedLanguage);

    const previewText = i18n.t('loginVerification.preview');
    const heading = i18n.t('loginVerification.heading');
    const buttonHref = 'https://portalfi.com';
    const buttonLabel = i18n.t('loginVerification.cta.label');
    const intro = i18n.t('loginVerification.body.intro', { name });
    const codeLabel = i18n.t('loginVerification.body.codeLabel');
    const expiresText = i18n.t('loginVerification.meta.expires', { minutes });
    const footerRightsText = i18n.t('footer.rights');

    const email = (
      <LoginVerificationEmail
        previewText={previewText}
        heading={heading}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        intro={intro}
        codeLabel={codeLabel}
        code={code}
        expiresText={expiresText}
        footerRightsText={footerRightsText}
        details={''}
      />
    );

    return await render(email);
  }
}
