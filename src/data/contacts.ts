import type { Contact } from '../types/contact';

/**
 * Fictional seed data. It is deliberately uneven so the UI gets exercised:
 *  - Customer has zero contacts            -> empty board column
 *  - Several records have no notes/labels  -> missing optional fields
 *  - One record has no owner               -> blank required string
 *  - One record has very long values       -> truncation and label overflow
 */
export const SEED_CONTACTS: Contact[] = [
  {
    id: 'c-001',
    name: 'Amara Okafor',
    email: 'amara.okafor@northwind.example',
    company: 'Northwind Logistics',
    role: 'Head of Operations',
    owner: 'Daniel Reyes',
    labels: ['Warm intro', 'Logistics'],
    stage: 'Lead',
    notes: 'Met at the Lisbon freight summit. Interested in a pilot on the Rotterdam route.',
  },
  {
    id: 'c-002',
    name: 'Tomás Álvarez',
    email: 'tomas@harborlight.example',
    company: 'Harborlight Coffee',
    role: 'Founder',
    owner: 'Priya Nair',
    labels: ['Retail', 'Inbound'],
    stage: 'Prospect',
    notes: 'Asked for pricing for 12 locations. Follow up after the Q4 menu launch.',
  },
  {
    id: 'c-003',
    name: 'Priya Raman',
    email: 'priya.raman@lumenhealth.example',
    company: 'Lumen Health',
    role: 'VP of Product',
    owner: 'Daniel Reyes',
    labels: ['Healthcare', 'Champion'],
    stage: 'Qualified',
    notes: 'Budget approved for next fiscal year. Legal review of the data processing terms is pending.',
  },
  {
    id: 'c-004',
    name: 'Jonas Eriksson',
    email: 'jonas.eriksson@fjordworks.example',
    company: 'Fjordworks',
    role: 'CTO',
    owner: 'Maya Chen',
    labels: [],
    stage: 'Lead',
    notes: 'Downloaded the integration guide twice.',
  },
  {
    id: 'c-005',
    name: 'Mei-Ling Chow',
    email: 'meiling.chow@orchard-and-vine.example',
    company: 'Orchard & Vine',
    role: 'Procurement Manager',
    owner: 'Maya Chen',
    labels: ['Retail', 'Renewal risk'],
    stage: 'Qualified',
    notes: 'Wants a three-year term with a price cap. Needs sign-off from finance.',
  },
  {
    id: 'c-006',
    name: 'Oluwaseun Adebayo-Hartmann',
    email: 'oluwaseun.adebayo-hartmann@brightwater-utilities.example',
    company: 'Brightwater Municipal Infrastructure & Utilities Partnership',
    role: 'Senior Director of Digital Transformation and Citizen Services',
    owner: 'Priya Nair',
    labels: ['Public sector', 'Long cycle', 'Tender', 'Needs security review', 'Multi-site'],
    stage: 'Prospect',
    notes:
      'Procurement runs through a formal tender process. Expect a 6–9 month cycle, a security questionnaire, and a pilot across two districts before any wider rollout is considered.',
  },
  {
    id: 'c-007',
    name: 'Sofia Marchetti',
    email: 'sofia@marchetti-studio.example',
    company: 'Marchetti Studio',
    role: 'Creative Director',
    owner: 'Daniel Reyes',
    labels: ['Agency'],
    stage: 'Lead',
    // notes intentionally missing
  },
  {
    id: 'c-008',
    name: 'Elliot Brandt',
    email: 'elliot.brandt@quarrybank.example',
    company: 'Quarry Bank',
    role: 'Analyst',
    owner: 'Maya Chen',
    labels: [],
    stage: 'Qualified',
    // no labels, no notes
  },
  {
    id: 'c-009',
    name: 'Hana Kobayashi',
    email: 'hana.kobayashi@tidepool.example',
    company: 'Tidepool Robotics',
    role: 'Partnerships Lead',
    owner: '', // unassigned
    labels: ['Partner', 'Hardware'],
    stage: 'Prospect',
    notes: 'Referred by Tomás. Not yet assigned to an owner.',
  },
  {
    id: 'c-010',
    name: 'Rafael Santos',
    email: 'rafael.santos@verdant-grid.example',
    company: 'Verdant Grid',
    role: 'Chief Revenue Officer',
    owner: 'Priya Nair',
    labels: ['Energy', 'Executive sponsor'],
    stage: 'Qualified',
    notes: 'Verbal yes on scope. Waiting on procurement paperwork.',
  },
];
