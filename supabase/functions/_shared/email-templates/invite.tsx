/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import { BrandHeader, Signature, mainStyle, containerStyle, headingStyle, textStyle, buttonStyle, noteStyle } from './brand.tsx'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({ confirmationUrl }: InviteEmailProps) => (
  <Html lang="nb" dir="ltr">
    <Head />
    <Preview>Du har fått en invitasjon</Preview>
    <Body style={mainStyle}>
      <Container style={containerStyle}>
        <BrandHeader />
        <Heading style={headingStyle}>Du er invitert</Heading>
        <Text style={textStyle}>
          Du har fått en invitasjon til å opprette konto. Klikk på knappen under for å komme i gang.
        </Text>
        <Section style={{ margin: '24px 0' }}>
          <Button style={buttonStyle} href={confirmationUrl}>
            Godta invitasjonen
          </Button>
        </Section>
        <Text style={noteStyle}>Var ikke dette ment for deg, kan du se bort fra e-posten.</Text>
        <Signature />
      </Container>
    </Body>
  </Html>
)

export default InviteEmail
