import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  company_name?: string | null
  org_number?: string | null
  contact_person?: string | null
  email?: string | null
  phone?: string | null
  industry?: string | null
  revenue_target?: string | null
  message?: string | null
  section_label?: string | null
  package_name?: string | null
  source?: string | null
}

const Email = (p: Props) => (
  <Html lang="nb" dir="ltr">
    <Head />
    <Preview>Ny henvendelse fra {p.company_name || p.contact_person || 'ukjent avsender'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>📬 Ny henvendelse</Heading>
          {p.section_label ? <Text style={sub}>Avdeling: {p.section_label}</Text> : null}
        </Section>

        <Section style={card}>
          <Text style={label}>Selskap</Text>
          <Text style={value}>{p.company_name || 'Ikke oppgitt'}</Text>
          {p.org_number ? <Text style={meta}>Org.nr: {p.org_number}</Text> : null}
          {p.industry ? <Text style={meta}>Bransje: {p.industry}</Text> : null}
        </Section>

        <Section style={card}>
          <Text style={label}>Kontaktperson</Text>
          <Text style={value}>{p.contact_person || 'Ikke oppgitt'}</Text>
          {p.email ? <Text style={meta}>E-post: {p.email}</Text> : null}
          {p.phone ? <Text style={meta}>Telefon: {p.phone}</Text> : null}
        </Section>

        {p.package_name ? (
          <Section style={card}>
            <Text style={label}>Pakke</Text>
            <Text style={value}>{p.package_name}</Text>
          </Section>
        ) : null}

        {p.revenue_target ? (
          <Section style={card}>
            <Text style={label}>Omsetningsmål</Text>
            <Text style={value}>{p.revenue_target}</Text>
          </Section>
        ) : null}

        {p.message ? (
          <Section style={messageBox}>
            <Text style={label}>Melding</Text>
            <Text style={messageText}>{p.message}</Text>
          </Section>
        ) : null}

        <Hr style={hr} />
        <Text style={footer}>
          Sendt fra kontaktskjemaet på avargo.no{p.source ? ` · Kilde: ${p.source}` : ''}
          <br />Avargo Regnskap AS · tlf. 98 64 23 91 · kontakt@avargo.no
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Props) =>
    `${d.section_label ? `[${d.section_label}] ` : ''}Ny henvendelse: ${d.company_name || d.contact_person || 'Ukjent'}`,
  displayName: 'Kontaktskjema — varsel til admin',
  previewData: {
    company_name: 'Eksempel AS',
    contact_person: 'Ola Nordmann',
    email: 'ola@eksempel.no',
    phone: '+47 999 88 777',
    message: 'Hei, kan vi få et tilbud?',
    section_label: 'Regnskap',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { maxWidth: '600px', margin: '0 auto', padding: '20px 24px' }
const header = { padding: '20px 0', borderBottom: '2px solid #1b5e4b' }
const h1 = { color: '#1b5e4b', fontSize: '22px', margin: '0' }
const sub = { color: '#60d1b1', fontSize: '13px', margin: '6px 0 0' }
const card = { background: '#f6f1e8', borderRadius: '10px', padding: '16px 20px', margin: '14px 0' }
const label = { fontSize: '12px', textTransform: 'uppercase' as const, letterSpacing: '0.5px', color: '#232d2a', margin: '0 0 6px', fontWeight: 600 }
const value = { fontSize: '16px', color: '#0f172a', margin: '0', fontWeight: 600 }
const meta = { fontSize: '13px', color: '#475569', margin: '4px 0 0' }
const messageBox = { background: '#dff5ef', borderLeft: '4px solid #1b5e4b', padding: '16px 20px', margin: '14px 0', borderRadius: '0 10px 10px 0' }
const messageText = { fontSize: '14px', color: '#232d2a', margin: '4px 0 0', whiteSpace: 'pre-wrap' as const, lineHeight: 1.6 }
const hr = { borderColor: '#e2e8f0', margin: '20px 0' }
const footer = { fontSize: '12px', color: '#94a3b8', textAlign: 'center' as const }
