import { createFileRoute } from '@tanstack/react-router';
import { ResultsList } from '@/features/brandguard/results';
import { pageHead } from '@/features/brandguard/metadata';
export const Route = createFileRoute('/review')({head:()=>pageHead('Human review','Review pending NovaTech content and record approvals, rejections or change requests.'),component:()=> <ResultsList review/>});
