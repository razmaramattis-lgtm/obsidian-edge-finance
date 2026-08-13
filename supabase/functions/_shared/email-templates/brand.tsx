/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import { Hr, Img, Link, Section, Text } from 'npm:@react-email/components@0.0.22'

export const LOGO_URL = 'https://avargo.no/logo.png'
export const CONTACT_EMAIL = 'kontakt@avargo.no'
export const CONTACT_PHONE = '98 64 23 91'

export const BrandHeader = () => (
  <Section style={{ padding: '4px 0 24px' }}>
    <Img src={LOGO_URL} alt="Avargo Regnskap AS" width="150" style={{ display: 'block', border: 0 }} />
  </Section>
)

export const Signature = () => (
  <>
    <Text style={sigText}>
      Hilsen
      <br />
      <strong>Avargo Regnskap AS</strong>
      <br />
      tlf. {CONTACT_PHONE}
      <br />
      <Link href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#1b5e4b', textDecoration: 'none' }}>
        {CONTACT_EMAIL}
      </Link>
    </Text>
    <Hr style={{ borderColor: '#dff5ef', margin: '24px 0 12px' }} />
    <Text style={replyNote}>Du kan svare direkte på denne e-posten – den går rett til {CONTACT_EMAIL}.</Text>
  </>
)

const sigText = { fontSize: '15px', color: '#232d2a', lineHeight: 1.7, margin: '28px 0 0' }
const replyNote = { fontSize: '12px', color: '#6b7a75', lineHeight: 1.6, margin: 0 }

export const mainStyle = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif' }
export const containerStyle = { maxWidth: '560px', margin: '0 auto', padding: '28px 32px' }
export const headingStyle = { fontSize: '22px', fontWeight: 700 as const, color: '#1b5e4b', margin: '0 0 18px' }
export const textStyle = { fontSize: '15px', color: '#232d2a', lineHeight: 1.7, margin: '0 0 16px' }
export const buttonStyle = {
  backgroundColor: '#1b5e4b',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 600 as const,
  borderRadius: '999px',
  padding: '14px 28px',
  textDecoration: 'none',
  display: 'inline-block',
}
export const noteStyle = { fontSize: '13px', color: '#6b7a75', lineHeight: 1.6, margin: '20px 0 0' }
