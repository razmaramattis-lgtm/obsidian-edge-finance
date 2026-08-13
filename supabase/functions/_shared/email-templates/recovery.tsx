/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import { BrandHeader, Signature, mainStyle, containerStyle, headingStyle, textStyle, buttonStyle, noteStyle } from './brand.tsx'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({ confirmationUrl }: RecoveryEmailProps) => (
  <Html lang="nb" dir="ltr">
    <Head />
    <Preview>Tilbakestill passordet ditt</Preview>
    <Body style={mainStyle}>
      <Container style={containerStyle}>
        <BrandHeader />
        <Heading style={headingStyle}>Tilbakestill passordet</Heading>
        <Text style={textStyle}>
          Vi mottok en forespørsel om å tilbakestille passordet ditt. Klikk på knappen under for å velge et nytt.
        </Text>
        <Section style={{ margin: '24px 0' }}>
          <Button style={buttonStyle} href={confirmationUrl}>
            Velg nytt passord
          </Button>
        </Section>
        <Text style={noteStyle}>Har du ikke bedt om dette, kan du se bort fra e-posten. Passordet endres ikke.</Text>
        <Signature />
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail
