create extension if not exists "pgcrypto";

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  clerk_org_id text unique,
  name text not null,
  slug text not null unique,
  primary_contact_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  organization_id uuid references public.organizations(id) on delete set null,
  email text not null unique,
  full_name text,
  role text not null check (role in ('admin', 'team', 'client_editor', 'client_viewer')),
  is_internal boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  status text not null check (status in ('draft', 'sent', 'viewed', 'approved', 'revision_requested', 'closed')) default 'draft',
  summary text,
  scope text,
  pricing text,
  assumptions text,
  due_date date,
  sent_at timestamptz,
  approved_at timestamptz,
  revision_requested_at timestamptz,
  revision_notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.proposal_attachments (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  content_type text,
  file_size_bytes bigint,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.deliverables (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  proposal_id uuid references public.proposals(id) on delete set null,
  title text not null,
  description text,
  version text not null default 'v1',
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.deliverable_files (
  id uuid primary key default gen_random_uuid(),
  deliverable_id uuid not null references public.deliverables(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  content_type text,
  file_size_bytes bigint,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  proposal_id uuid references public.proposals(id) on delete cascade,
  deliverable_id uuid references public.deliverables(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  body text not null,
  author_profile_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint comments_subject_check check (
    (proposal_id is not null and deliverable_id is null) or
    (proposal_id is null and deliverable_id is not null)
  )
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete set null,
  actor_profile_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  audience text not null check (audience in ('landing', 'client')),
  submission_type text not null,
  template_key text not null,
  notification_email text not null default 'info@b2w-ai.com',
  contact_name text not null,
  contact_email text not null,
  company text,
  phone text,
  website text,
  subject text,
  message text not null,
  project_name text,
  project_area text,
  source_page text,
  source_path text,
  source_url text,
  referrer text,
  submitted_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists organizations_set_updated_at on public.organizations;
create trigger organizations_set_updated_at before update on public.organizations
for each row execute procedure public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists proposals_set_updated_at on public.proposals;
create trigger proposals_set_updated_at before update on public.proposals
for each row execute procedure public.set_updated_at();

drop trigger if exists deliverables_set_updated_at on public.deliverables;
create trigger deliverables_set_updated_at before update on public.deliverables
for each row execute procedure public.set_updated_at();

drop trigger if exists comments_set_updated_at on public.comments;
create trigger comments_set_updated_at before update on public.comments
for each row execute procedure public.set_updated_at();
