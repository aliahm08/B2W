insert into public.organizations (id, clerk_org_id, name, slug, primary_contact_email)
values
  ('11111111-1111-1111-1111-111111111111', 'org_consult_01', 'Northwind Advisory', 'northwind-advisory', 'ops@northwind.example'),
  ('22222222-2222-2222-2222-222222222222', 'org_consult_02', 'Hinterland Foods', 'hinterland-foods', 'owner@hinterland.example')
on conflict (id) do nothing;

insert into public.profiles (id, clerk_user_id, organization_id, email, full_name, role, is_internal)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'user_admin_01', null, 'admin@example.com', 'Portal Admin', 'admin', true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'user_team_01', null, 'team@example.com', 'Delivery Lead', 'team', true),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'user_client_01', '11111111-1111-1111-1111-111111111111', 'client.editor@northwind.example', 'Northwind Editor', 'client_editor', false),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'user_client_02', '11111111-1111-1111-1111-111111111111', 'client.viewer@northwind.example', 'Northwind Viewer', 'client_viewer', false)
on conflict (id) do nothing;

insert into public.proposals (
  id, organization_id, title, status, summary, scope, pricing, assumptions, due_date, created_by
)
values
  (
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'Q2 Growth Systems Engagement',
    'sent',
    'Proposal covering CRM cleanup, sales reporting, and client communications workflow.',
    'Discovery, implementation planning, dashboard rollout, and operator training.',
    '$18,500 fixed fee plus optional retainers.',
    'Client provides CRM access, weekly stakeholder reviews, and one operating owner.',
    now()::date + 10,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
  )
on conflict (id) do nothing;

insert into public.deliverables (
  id, organization_id, proposal_id, title, description, version, uploaded_by
)
values
  (
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    'Discovery Readout',
    'Initial findings and operating priorities from the first discovery phase.',
    'v1',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
  )
on conflict (id) do nothing;

insert into public.comments (
  id, organization_id, proposal_id, deliverable_id, body, author_profile_id
)
values
  (
    '55555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    null,
    'Please clarify the implementation sequence for the CRM cleanup and reporting handoff.',
    'cccccccc-cccc-cccc-cccc-cccccccccccc'
  )
on conflict (id) do nothing;
