import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from '@/features/brandguard/dashboard';
import { pageHead } from '@/features/brandguard/metadata';
export const Route = createFileRoute("/")({
  head: () => pageHead('Dashboard', 'BrandGuard AI — the NovaTech brand governance dashboard. Track content checks and publishing decisions.'),
  component: Dashboard,
});
