export interface ContentRow {
  h1: string;
  intro: string;
  metadataDescription?: string;
  headingCount: number;
  kind: string;
  location?: string;
  family?: string;
  focus?: string;
  primarySummary?: string;
  answer?: string;
  primaryLinks?: string;
  secondarySummary?: string;
}
export interface ContentIssue { code: string; field: string; reason: string; oldCopy: string; }
export function normalizeCopy(value: unknown): string;
export function contentFamily(title: string): string;
export function namesFamily(copy: string, family: string): boolean;
export function auditContent(row: ContentRow): ContentIssue[];
