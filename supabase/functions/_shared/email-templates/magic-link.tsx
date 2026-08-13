/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import { BrandHeader, Signature, mainStyle, containerStyle, headingStyle, textStyle, buttonStyle, noteStyle } from './brand.tsx'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({ confirmationUrl }: MagicLinkEmailProps) => (
  <Html lang="nb" dir="ltr">
    <Head />
    <Preview>Innloggingslenken din</Preview>
    <Body style={mainStyle}>
      <Container style={containerStyle}>
        <BrandHeader />
        <Heading style={headingStyle}>Logg inn</Heading>
        <Text style={textStyle}>Klikk på knappen under for å logge inn. Lenken utløper om kort tid.</Text>
        <Section style={{ margin: '24px 0' }}>
          <Button style={buttonStyle} href={confirmationUrl}>
            Logg inn
          </Button>
        </Section>
        <Text style={noteStyle}>Har du ikke bedt om denne lenken, kan du se bort fra e-posten.</Text>
        <Signature />
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail
