alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.proposals enable row level security;
alter table public.proposal_attachments enable row level security;
alter table public.deliverables enable row level security;
alter table public.deliverable_files enable row level security;
alter table public.comments enable row level security;
alter table public.audit_logs enable row level security;

create or replace function public.jwt_role()
returns text
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'role', auth.jwt() -> 'public_metadata' ->> 'role', 'client_viewer');
$$;

create or replace function public.jwt_org_id()
returns text
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'org_id', auth.jwt() -> 'organization' ->> 'id');
$$;

create or replace function public.is_internal_role()
returns boolean
language sql
stable
as $$
  select public.jwt_role() in ('admin', 'team');
$$;

create or replace function public.current_profile_id()
returns uuid
language sql
stable
as $$
  select id
  from public.profiles
  where clerk_user_id = auth.jwt() ->> 'sub'
  limit 1;
$$;

create or replace function public.current_organization_id()
returns uuid
language sql
stable
as $$
  select id
  from public.organizations
  where clerk_org_id = public.jwt_org_id()
  limit 1;
$$;

create policy "internal can read organizations"
on public.organizations for select
using (public.is_internal_role());

create policy "internal can manage organizations"
on public.organizations for all
using (public.is_internal_role())
with check (public.is_internal_role());

create policy "users can read own profile"
on public.profiles for select
using (
  public.is_internal_role() or clerk_user_id = auth.jwt() ->> 'sub'
);

create policy "internal can manage profiles"
on public.profiles for all
using (public.is_internal_role())
with check (public.is_internal_role());

create policy "proposal read by tenant or internal"
on public.proposals for select
using (
  public.is_internal_role() or organization_id = public.current_organization_id()
);

create policy "internal can insert proposals"
on public.proposals for insert
with check (public.is_internal_role());

create policy "internal can fully update proposals"
on public.proposals for update
using (public.is_internal_role())
with check (public.is_internal_role());

create policy "client_editor can respond to proposal only"
on public.proposals for update
using (
  organization_id = public.current_organization_id() and public.jwt_role() = 'client_editor'
)
with check (
  organization_id = public.current_organization_id() and public.jwt_role() = 'client_editor'
);

create policy "proposal attachments read by tenant or internal"
on public.proposal_attachments for select
using (
  public.is_internal_role() or organization_id = public.current_organization_id()
);

create policy "internal can manage proposal attachments"
on public.proposal_attachments for all
using (public.is_internal_role())
with check (public.is_internal_role());

create policy "deliverable read by tenant or internal"
on public.deliverables for select
using (
  public.is_internal_role() or organization_id = public.current_organization_id()
);

create policy "internal can manage deliverables"
on public.deliverables for all
using (public.is_internal_role())
with check (public.is_internal_role());

create policy "deliverable files read by tenant or internal"
on public.deliverable_files for select
using (
  public.is_internal_role() or organization_id = public.current_organization_id()
);

create policy "internal can manage deliverable files"
on public.deliverable_files for all
using (public.is_internal_role())
with check (public.is_internal_role());

create policy "comments read by tenant or internal"
on public.comments for select
using (
  public.is_internal_role() or organization_id = public.current_organization_id()
);

create policy "tenant and internal can add comments"
on public.comments for insert
with check (
  public.is_internal_role() or organization_id = public.current_organization_id()
);

create policy "internal can manage comment updates"
on public.comments for update
using (public.is_internal_role())
with check (public.is_internal_role());

create policy "tenant and internal can read audit logs"
on public.audit_logs for select
using (
  public.is_internal_role() or organization_id = public.current_organization_id()
);

create policy "internal can insert audit logs"
on public.audit_logs for insert
with check (public.is_internal_role());

create policy "internal can manage storage objects"
on storage.objects for all
using (
  bucket_id = 'portal-files' and public.is_internal_role()
)
with check (
  bucket_id = 'portal-files' and public.is_internal_role()
);

create policy "tenant can read org-scoped storage objects"
on storage.objects for select
using (
  bucket_id = 'portal-files' and (
    public.is_internal_role() or
    split_part(name, '/', 1) = coalesce(public.current_organization_id()::text, '')
  )
);
