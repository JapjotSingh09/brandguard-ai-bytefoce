import { createFileRoute } from '@tanstack/react-router';
import { Guidelines } from '@/features/brandguard/guidelines';
import { pageHead } from '@/features/brandguard/metadata';
export const Route = createFileRoute('/guidelines')({head:()=>pageHead('Brand guidelines','Configure NovaTech terminology, facts, disclaimers and visual identity standards.'),component:Guidelines});
