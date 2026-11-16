import { createFileRoute } from '@tanstack/react-router';
import { ResultDetails } from '@/features/brandguard/results';
import { pageHead } from '@/features/brandguard/metadata';
export const Route = createFileRoute('/results/$id')({head:()=>pageHead('Content analysis and review','Review content, accept corrections, and record a human publishing decision.'),component:Details});
function Details(){const {id}=Route.useParams();return <ResultDetails id={id}/>;}
