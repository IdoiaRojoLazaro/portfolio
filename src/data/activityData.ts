export type ActivityRole = 'lead' | 'developer';

export const activityEntries = [
  {
    date: '2026-02-07',
    title: 'Migration from AWS RDS to Aurora',
    category: 'project',
    role: 'lead' as ActivityRole,
    description:
      'Planned and executed the migration of our core relational database from AWS RDS to Amazon Aurora. Coordinated a cross-team maintenance window to ensure minimal disruption, communicated with stakeholders, and managed the migration process to enhance scalability, reliability, and query performance.',
    tags: ['aws', 'aurora', 'database', 'cloud', 'scalability'],
  },
  {
    date: '2026-01-26',
    title: 'Critical database query optimization',
    category: 'performance',
    role: 'lead' as ActivityRole,
    description:
      'Optimized slow-running queries in core services, reducing response times from several seconds to fractions of a second. Deployment was performed outside working hours with zero downtime, ensuring uninterrupted availability for users and therapists.',
    tags: ['database', 'optimization', 'performance', 'availability'],
  },
  {
    date: '2026-01-15',
    title: 'Core React platform high-impact optimizations',
    category: 'performance',
    role: 'lead' as ActivityRole,
    description: `Led the implementation of advanced code-splitting and compression strategies across Admin, Support, Therapist, and User apps. Achieved up to 89% reduction in initial data transfer, decreased loading times (up to 60% faster), and reduced infrastructure costs by 70–80%. Enhanced accessibility for global users through bandwidth savings, faster app navigation, and improved experience on slow networks.`,
    tags: [
      'react',
      'code-splitting',
      'compression',
      'performance',
      'infrastructure',
      'scalability',
    ],
  },
  {
    date: '2025-12-16',
    title: 'Automated web smoke tests for sprint releases',
    category: 'quality',
    role: 'lead' as ActivityRole,
    description:
      'Released the first suite of automated smoke tests for the patient web during pre-release QA. Automated 81% of critical flows, reducing manual testing by 81 minutes per deployment and freeing up QA resources for more strategic tasks.',
    tags: ['testing', 'automation', 'quality', 'web', 'qa', 'efficiency'],
  },
  {
    date: '2025-10-23',
    title: 'Unified feature flag management with PostHog',
    category: 'architecture',
    role: 'lead' as ActivityRole,
    description:
      'Implemented feature flags across backend, frontend, and mobile platforms using PostHog as a unified solution for Product and Tech teams. Enabled targeted rollouts, A/B testing, rapid feature toggling, and gradual launches—all controlled in real-time by product managers for safer, faster delivery.',
    tags: [
      'feature flags',
      'posthog',
      'architecture',
      'product',
      'backend',
      'frontend',
      'mobile',
    ],
  },
  {
    date: '2025-04-15',
    title: 'Trunk-based development adoption',
    category: 'process',
    role: 'lead' as ActivityRole,
    description:
      'Team transition to trunk-based development with feature flags. 60% reduction in merge conflicts.',
    tags: ['git', 'workflow', 'team'],
  },
  {
    date: '2023-03-15',
    title: 'Migration from GitHub to GitLab with unified quality gates',
    category: 'process',
    role: 'lead' as ActivityRole,
    description:
      'Unified all company projects onto GitLab, migrating repositories from GitHub and standardizing workflows. Integrated quality gates for automated code review, testing, and compliance to ensure consistent software quality across squads.',
    tags: [
      'gitlab',
      'github',
      'migration',
      'quality gates',
      'process improvement',
      'devops',
    ],
  },
];
