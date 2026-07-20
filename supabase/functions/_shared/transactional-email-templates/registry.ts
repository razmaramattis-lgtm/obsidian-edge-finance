import type { ComponentType } from 'npm:react@18.3.1'
import { template as adminContactNotification } from './admin-contact-notification.tsx'
import { template as passwordReset } from './password-reset.tsx'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: any) => string)
  displayName?: string
  previewData?: Record<string, any>
  to?: string | ((data: any) => string)
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  'admin-contact-notification': adminContactNotification,
  'password-reset': passwordReset,
}
