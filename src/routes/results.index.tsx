import { createFileRoute } from '@tanstack/react-router';
import { ResultsList } from '@/features/brandguard/results';
import { pageHead } from '@/features/brandguard/metadata';
export const Route = createFileRoute('/results/')({head:()=>pageHead('Analysis results','Inspect brand compliance findings and their configured source rules.'),component:ResultsList});
