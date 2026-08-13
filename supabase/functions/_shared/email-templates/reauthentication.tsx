/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import { Body, Container, Head, Heading, Html, Preview, Text } from 'npm:@react-email/components@0.0.22'
import { BrandHeader, Signature, mainStyle, containerStyle, headingStyle, textStyle, noteStyle } from './brand.tsx'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="nb" dir="ltr">
    <Head />
    <Preview>Bekreftelseskoden din</Preview>
    <Body style={mainStyle}>
      <Container style={containerStyle}>
        <BrandHeader />
        <Heading style={headingStyle}>Bekreft identiteten din</Heading>
        <Text style={textStyle}>Bruk koden under for å bekrefte identiteten din:</Text>
        <Text style={codeStyle}>{token}</Text>
        <Text style={noteStyle}>Koden utløper om kort tid. Har du ikke bedt om den, kan du se bort fra e-posten.</Text>
        <Signature />
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const codeStyle = {
  fontSize: '28px',
  letterSpacing: '6px',
  fontWeight: 700 as const,
  color: '#1b5e4b',
  background: '#dff5ef',
  borderRadius: '12px',
  padding: '16px 20px',
  textAlign: 'center' as const,
  margin: '8px 0 0',
}
