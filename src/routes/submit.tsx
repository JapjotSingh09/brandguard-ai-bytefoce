import { createFileRoute } from '@tanstack/react-router';
import { SubmissionPage } from '@/features/brandguard/submission';
import { pageHead } from '@/features/brandguard/metadata';
export const Route = createFileRoute('/submit')({head:()=>pageHead('Submit content','Submit marketing content for traceable, rule-based brand compliance checks.'),component:SubmissionPage});
