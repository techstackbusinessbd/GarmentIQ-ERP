/**
 * =============================================================================
 * [EN] User Table Row Actions Component (UserTableActions)
 * [BN] ইউজার টেবিল রো অ্যাকশনস কম্পোনেন্ট (UserTableActions) (রুল ০৭, ১৫ ও ২১)
 * =============================================================================
 * [EN] Reference: docs/requirements/srs/SRS_00B_AUTH.md
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens), Rule 21 (Component-based)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Unlock, Lock, KeyRound, SlidersHorizontal, Eye, RotateCcw } from 'lucide-react';
import type { User } from '@/types';
import { usePermission } from '@/features/privileges';

/** [EN] UserTableActions properties contract / [BN] অ্যাকশন বাটন প্রপার্টিজ */
export interface UserTableActionsProps {
  readonly user: User;
  readonly onToggleLock: (user: User) => void;
  readonly onDeactivate: (user: User) => void;
  readonly onRestore?: (user: User) => void;
  readonly onPurge?: (user: User) => void;
}

/**
 * [EN] Isolated action buttons for user table rows with granular RBAC gates
 * [BN] সুনির্দিষ্ট আরবিএসি অনুমতি দ্বারা সুরক্ষিত ব্যবহারকারী টেবিল অ্যাকশন বাটনসমূহ
 */
export const UserTableActions: React.FC<UserTableActionsProps> = ({
  user,
  onToggleLock,
  onDeactivate,
  onRestore,
  onPurge,
}) => {
  const navigate = useNavigate();
  const { hasPermission, isSuperAdmin } = usePermission();

  const isSuper =
    user.roles?.some((r) => r === 'ROLE_SUPER_ADMIN' || r === 'SUPER_ADMIN') ||
    user.username === 'superadmin';

  const canEdit = isSuperAdmin || hasPermission('USER:EDIT');
  const canDelete = isSuperAdmin || hasPermission('USER:DELETE');
  const canRestore = isSuperAdmin || hasPermission('USER:RESTORE');
  const canPurge = isSuperAdmin || hasPermission('USER:PURGE');
  const canLock = isSuperAdmin || hasPermission('USER:LOCK');
  const canResetPassword =
    isSuperAdmin ||
    hasPermission('USER:RESET_PASSWORD') ||
    hasPermission('PASSWORD_RESET:EXECUTE') ||
    hasPermission('PASSWORD_RESET:MENU');
  const canManageSpecialPermissions =
    isSuperAdmin ||
    hasPermission('USER:SPECIAL_PERMISSION') ||
    hasPermission('ROLE:MENU') ||
    hasPermission('ROLE:EDIT');

  // [EN] For soft-deleted accounts in Trash, show Restore and Purge controls
  // [BN] ট্র্যাশে থাকা অ্যাকাউন্টের ক্ষেত্রে রিস্টোর ও পার্জ অপশন প্রদর্শন
  if (user.isDeleted || user.deleted) {
    return (
      <div className="flex items-center justify-end gap-1">
        {canRestore && onRestore && (
          <button
            type="button"
            onClick={() => onRestore(user)}
            title="Restore User"
            className="p-1.5 text-brand-accent hover:bg-brand-accent/10 rounded-[3px] transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
          </button>
        )}
        {canPurge && onPurge && !isSuper && (
          <button
            type="button"
            onClick={() => onPurge(user)}
            title="Permanently Purge User"
            className="p-1.5 text-status-danger hover:bg-status-danger-bg rounded-[3px] transition-colors cursor-pointer"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    );
  }

  const hasAnyAction = canEdit || canDelete || canLock || canResetPassword || canManageSpecialPermissions;

  if (!hasAnyAction) {
    return (
      <div className="flex items-center justify-end">
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-text-muted px-1.5 py-0.5 rounded bg-surface-muted/50 border border-border-subtle/50">
          <Eye size={11} className="text-text-muted" />
          <span>View Only</span>
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-1">
      {canLock && !isSuper && (
        <button
          type="button"
          onClick={() => onToggleLock(user)}
          title={user.status === 'LOCKED' ? 'Unlock Account' : 'Lock Account'}
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-semibold rounded-[3px] transition-colors cursor-pointer shadow-2xs ${
            user.status === 'LOCKED'
              ? 'text-status-warning bg-status-warning-bg hover:brightness-95 border border-status-warning-border'
              : 'text-text-muted hover:text-status-warning hover:bg-status-warning-bg border border-transparent'
          }`}
        >
          {user.status === 'LOCKED' ? (
            <>
              <Unlock size={11} className="text-status-warning" />
              <span>Unlock</span>
            </>
          ) : (
            <Lock size={12} />
          )}
        </button>
      )}

      {canResetPassword && (
        <button
          type="button"
          onClick={() => navigate(`/app/admin/users/${user.id}/reset-password`)}
          title="Reset Password"
          className="p-1.5 text-text-muted hover:text-status-warning hover:bg-status-warning-bg rounded-[3px] transition-colors cursor-pointer"
        >
          <KeyRound size={13} />
        </button>
      )}

      {canManageSpecialPermissions && (
        <button
          type="button"
          onClick={() => navigate(`/app/admin/users/${user.id}/special-permissions`)}
          title="Configure User Special Permissions & Clearances"
          className="p-1.5 text-text-muted hover:text-brand-accent hover:bg-brand-accent/10 rounded-[3px] transition-colors cursor-pointer"
        >
          <SlidersHorizontal size={13} />
        </button>
      )}

      {canEdit && (
        <button
          type="button"
          onClick={() => navigate(`/app/admin/users/${user.id}/edit`)}
          title="Edit User"
          className="p-1.5 text-text-muted hover:text-text-primary hover:bg-surface-muted rounded-[3px] transition-colors cursor-pointer"
        >
          <Edit2 size={13} />
        </button>
      )}

      {canDelete && !isSuper && (
        <button
          type="button"
          onClick={() => onDeactivate(user)}
          title="Deactivate User"
          className="p-1.5 text-text-muted hover:text-status-danger hover:bg-status-danger-bg rounded-[3px] transition-colors cursor-pointer"
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  );
};

export default UserTableActions;
