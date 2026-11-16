export const categories = ['Approved terminology', 'Prohibited phrases', 'Approved facts', 'Required disclaimers', 'Visual identity', 'Logo guidelines'] as const;
export type Rule = { id: string; category: string; name: string; pattern: string; replacement: string; severity: 'critical' | 'warning' | 'info'; explanation: string };
export type Issue = { id: string; ruleId: string; ruleName: string; severity: Rule['severity']; text: string; suggestion: string; explanation: string; start: number; end: number };
export type Submission = { id: string; title: string; content_type: string; content: string; status: string; issues: Issue[]; rules_snapshot: Rule[]; reviewer: string; comments: string; reviewed_at: string | null; created_at: string };
const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export function analyze(content: string, rules: Rule[]): Issue[] {
  return rules.flatMap(rule => {
    if (rule.category === 'Visual identity' || rule.category === 'Logo guidelines') return [];
    const base = { ruleId: rule.id, ruleName: rule.name, severity: rule.severity, suggestion: rule.replacement, explanation: rule.explanation };
    if (rule.category === 'Required disclaimers') {
      return rule.replacement && !content.toLowerCase().includes(rule.replacement.toLowerCase()) ? [{ ...base, id: `${rule.id}-missing`, text: 'Missing disclaimer', start: -1, end: -1 }] : [];
    }
    if (!rule.pattern.trim()) return [];
    const expression = new RegExp(`(?<![\\p{L}\\p{N}])${escape(rule.pattern)}(?![\\p{L}\\p{N}])`, 'giu');
    return [...content.matchAll(expression)].map(match => ({ ...base, id: `${rule.id}-${match.index}`, text: match[0], start: match.index, end: match.index + match[0].length }));
  });
}
export function correct(content: string, issue: Issue) {
  if (issue.start === -1) return `${content.trim()}\n\n${issue.suggestion}`;
  return content.slice(0, issue.start) + issue.suggestion + content.slice(issue.end);
}
export function metrics(rows: Submission[]) {
 return { total: rows.length, pending: rows.filter(s => s.status === 'Awaiting review').length, approved: rows.filter(s => s.status === 'Approved').length, rejected: rows.filter(s => s.status === 'Rejected').length, violations: rows.reduce((n,s) => n + s.issues.length,0) };
}
