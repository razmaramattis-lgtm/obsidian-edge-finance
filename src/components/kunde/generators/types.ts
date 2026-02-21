export interface FormField {
  id: string;
  label: string;
  type: "text" | "select" | "number" | "checkbox" | "textarea";
  options?: string[];
  defaultValue?: string | number | boolean;
  placeholder?: string;
  helpText?: string;
}

export interface FieldGroup {
  title: string;
  description?: string;
  fields: FormField[];
}

export interface Section {
  id: string;
  title: string;
  content: (form: Record<string, any>) => string;
}

export interface GeneratorConfig {
  id: string;
  title: string;
  subtitle: string;
  documentCategory: string;
  fieldGroups: FieldGroup[];
  sections: Section[];
  defaultValues: Record<string, any>;
}
