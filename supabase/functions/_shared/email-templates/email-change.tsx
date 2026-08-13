/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import { BrandHeader, Signature, mainStyle, containerStyle, headingStyle, textStyle, buttonStyle, noteStyle } from './brand.tsx'

interface EmailChangeEmailProps {
  siteName: string
  // oldEmail is the user's current address (HookData.OldEmail).
  oldEmail: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({ oldEmail, newEmail, confirmationUrl }: EmailChangeEmailProps) => (
  <Html lang="nb" dir="ltr">
    <Head />
    <Preview>Bekreft endring av e-postadresse</Preview>
    <Body style={mainStyle}>
      <Container style={containerStyle}>
        <BrandHeader />
        <Heading style={headingStyle}>Bekreft ny e-postadresse</Heading>
        <Text style={textStyle}>
          Du har bedt om å endre e-postadressen din fra {oldEmail} til {newEmail}. Bekreft endringen ved å klikke under.
        </Text>
        <Section style={{ margin: '24px 0' }}>
          <Button style={buttonStyle} href={confirmationUrl}>
            Bekreft endringen
          </Button>
        </Section>
        <Text style={noteStyle}>Har du ikke bedt om dette, kan du se bort fra e-posten.</Text>
        <Signature />
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail
