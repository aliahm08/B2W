import 'server-only';
import { redirect } from 'next/navigation';
import type { AppRole, AuthContext } from '@/lib/types';

export function canManagePortal(context: AuthContext) {
  return context.role === 'admin' || context.role === 'team';
}

export function canApproveProposal(context: AuthContext) {
  return context.role === 'client_editor';
}

export function canComment(context: AuthContext) {
  return context.role === 'admin' || context.role === 'team' || context.role === 'client_editor' || context.role === 'client_viewer';
}

export function canViewOrganization(context: AuthContext, organizationId: string | null) {
  if (context.isInternal) {
    return true;
  }

  return Boolean(context.organizationId && organizationId && context.organizationId === organizationId);
}

export function requirePortalRole(context: AuthContext, allowed: AppRole[]) {
  if (!allowed.includes(context.role)) {
    redirect('/unauthorized');
  }
}

export function requireAdminOrTeam(context: AuthContext) {
  requirePortalRole(context, ['admin', 'team']);
}
