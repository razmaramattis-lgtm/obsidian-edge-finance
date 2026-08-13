import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Img, Link, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  reset_link?: string
  recipient_email?: string
}

const Email = ({ reset_link = '#', recipient_email = '' }: Props) => (
  <Html lang="nb" dir="ltr">
    <Head />
    <Preview>Tilbakestill passordet ditt hos Avargo</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src="https://avargo.no/logo.png" alt="Avargo Regnskap AS" width="150" style={{ display: 'block', border: 0, margin: '0 0 24px' }} />
        <Heading style={h1}>Tilbakestill passord</Heading>
        <Text style={p}>Hei! Vi mottok en forespørsel om å tilbakestille passordet på kontoen din.</Text>
        <Text style={p}>Klikk på knappen under for å velge et nytt passord. Lenken kan kun brukes én gang.</Text>
        <Section style={{ textAlign: 'center', margin: '28px 0' }}>
          <Button href={reset_link} style={btn}>Velg nytt passord</Button>
        </Section>
        <Text style={small}>Hvis du ikke ba om dette, kan du se bort fra e-posten.</Text>
        <Text style={sig}>
          Hilsen<br />
          <strong>Avargo Regnskap AS</strong><br />
          tlf. 98 64 23 91<br />
          <Link href="mailto:kontakt@avargo.no" style={{ color: '#1b5e4b', textDecoration: 'none' }}>kontakt@avargo.no</Link>
        </Text>
        <Hr style={hr} />
        <Text style={footer}>Sendt til {recipient_email}. Du kan svare direkte på denne e-posten – den går rett til kontakt@avargo.no.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Tilbakestill passordet ditt',
  displayName: 'Passord-tilbakestilling',
  previewData: { reset_link: 'https://avargo.no/auth/bekreft?to=example', recipient_email: 'bruker@eksempel.no' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { maxWidth: '540px', margin: '0 auto', padding: '28px 32px' }
const h1 = { color: '#1b5e4b', fontSize: '22px', margin: '0 0 20px' }
const p = { fontSize: '15px', color: '#232d2a', lineHeight: 1.6, margin: '0 0 14px' }
const btn = { background: '#1b5e4b', color: '#ffffff', padding: '14px 28px', borderRadius: '999px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }
const small = { fontSize: '13px', color: '#64748b', margin: '20px 0 0', lineHeight: 1.6 }
const hr = { borderColor: '#e2e8f0', margin: '24px 0' }
const sig = { fontSize: '15px', color: '#232d2a', lineHeight: 1.7, margin: '28px 0 0' }
const footer = { fontSize: '12px', color: '#94a3b8', textAlign: 'center' as const }
