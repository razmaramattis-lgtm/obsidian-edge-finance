/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import { BrandHeader, Signature, mainStyle, containerStyle, headingStyle, textStyle, buttonStyle, noteStyle } from './brand.tsx'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({ recipient, confirmationUrl }: SignupEmailProps) => (
  <Html lang="nb" dir="ltr">
    <Head />
    <Preview>Bekreft e-postadressen din</Preview>
    <Body style={mainStyle}>
      <Container style={containerStyle}>
        <BrandHeader />
        <Heading style={headingStyle}>Bekreft e-postadressen din</Heading>
        <Text style={textStyle}>
          Takk for at du oppretter konto. Bekreft adressen {recipient} ved å klikke på knappen under.
        </Text>
        <Section style={{ margin: '24px 0' }}>
          <Button style={buttonStyle} href={confirmationUrl}>
            Bekreft e-postadresse
          </Button>
        </Section>
        <Text style={noteStyle}>Har du ikke opprettet konto hos oss, kan du se bort fra denne e-posten.</Text>
        <Signature />
      </Container>
    </Body>
  </Html>
)

export default SignupEmail
