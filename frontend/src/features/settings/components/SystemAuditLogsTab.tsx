/**
 * =============================================================================
 * [EN] System & Security Audit Logs Tab Component (SystemAuditLogsTab.tsx)
 * [BN] সিস্টেম ও সিকিউরিটি অডিট লগ ট্যাব কম্পোনেন্ট (SystemAuditLogsTab.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 08 (TanStack Table), Rule 15 (Bilingual),
 *             Rule 17 (Enterprise UI), Rule 21 (Component-based)
 * [BN] সেটিংস পরিবর্তন, পাসওয়ার্ড রিসেট ও নিরাপত্তা ইভেন্টসমূহের সম্পূর্ণ অডিট ট্রেইল।
 */

import React, { useState, useEffect, useMemo } from 'react';
import { History, Download, RefreshCw, Filter, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Tenant } from '@/types';
import { DataTable, Button } from '@/components/ui';
import { clientService } from '@/features/clients/services/clientService';
import { auditLogService, type AuditLogEntry } from '../services/auditLogService';
import { useAuditLogColumns } from './useAuditLogColumns';
import { SearchableUserDropdown, type UserFilterOption } from './SearchableUserDropdown';

export const SystemAuditLogsTab: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('ALL');
  const [selectedActor, setSelectedActor] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const columns = useAuditLogColumns();

  const fetchLogs = async () => {
    setIsRefreshing(true);
    try {
      const data = await auditLogService.getAuditLogs();
      setLogs(data);
    } catch {
      toast.error('Failed to load audit logs.');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    clientService
      .getAllTenants()
      .then((data) => {
        if (Array.isArray(data)) setAvailableTenants(data);
      })
      .catch(() => {
        // Safe fallback when non-superadmin or offline
      });
  }, []);

  const handleExportCsv = () => {
    const csv = auditLogService.exportToCsv(filteredLogs);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `system_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Audit log export generated successfully.');
  };

  /** [EN] Build dynamic client filter options with unique client quantity / [BN] ক্লায়েন্ট সংখ্যাসহ ডাইনামিক ফিল্টার অপশন */
  const clientOptions = useMemo(() => {
    const map = new Map<string, { code: string; name: string }>();

    availableTenants.forEach((t) => {
      if (t.tenantCode) {
        map.set(t.tenantCode, {
          code: t.tenantCode,
          name: t.tenantName || t.companyName || t.tenantCode,
        });
      }
    });

    logs.forEach((log) => {
      const code = log.tenantCode || (log.tenantId ? log.tenantId : 'SYSTEM');
      if (!map.has(code)) {
        map.set(code, {
          code,
          name: log.tenantName || (code === 'SYSTEM' ? 'GarmentIQ Platform' : code),
        });
      }
    });

    if (!map.has('SYSTEM')) {
      map.set('SYSTEM', {
        code: 'SYSTEM',
        name: 'GarmentIQ Platform',
      });
    }

    return Array.from(map.values()).sort((a, b) => {
      if (a.code === 'SYSTEM') return -1;
      if (b.code === 'SYSTEM') return 1;
      return a.name.localeCompare(b.name);
    });
  }, [logs, availableTenants]);

  /** [EN] Build dynamic user filter options scoped by selected client / [BN] ক্লায়েন্ট স্কোপড ডাইনামিক ইউজার ফিল্টার অপশন */
  const userOptions: UserFilterOption[] = useMemo(() => {
    const map = new Map<string, UserFilterOption>();

    logs.forEach((log) => {
      if (log.actor) {
        const logClientCode = log.tenantCode || (log.tenantId ? log.tenantId : 'SYSTEM');
        if (selectedClient === 'ALL' || logClientCode === selectedClient) {
          if (!map.has(log.actor)) {
            const label = log.actorFullName
              ? `${log.actorFullName} (@${log.actor})`
              : `@${log.actor}`;
            map.set(log.actor, {
              username: log.actor,
              fullName: log.actorFullName,
              label,
              initial: (log.actorFullName || log.actor).charAt(0).toUpperCase(),
            });
          }
        }
      }
    });

    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [logs, selectedClient]);

  // Reset selected actor if it is no longer available in the current client scope
  useEffect(() => {
    if (selectedActor !== 'ALL') {
      const exists = userOptions.some((u) => u.username === selectedActor);
      if (!exists) {
        setSelectedActor('ALL');
      }
    }
  }, [selectedClient, userOptions, selectedActor]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchCategory = selectedCategory === 'ALL' || log.category === selectedCategory;
      const matchSeverity = selectedSeverity === 'ALL' || log.severity === selectedSeverity;
      const logClientCode = log.tenantCode || (log.tenantId ? log.tenantId : 'SYSTEM');
      const matchClient = selectedClient === 'ALL' || logClientCode === selectedClient;
      const matchActor = selectedActor === 'ALL' || log.actor === selectedActor;
      return matchCategory && matchSeverity && matchClient && matchActor;
    });
  }, [logs, selectedCategory, selectedSeverity, selectedClient, selectedActor]);

  const stats = useMemo(() => {
    return {
      total: logs.length,
      security: logs.filter((l) => l.category === 'SECURITY_POLICY' || l.category === 'AUTH_EVENT').length,
      critical: logs.filter((l) => l.severity === 'CRITICAL' || l.severity === 'WARNING').length,
      admin: logs.filter((l) => l.actorRole.includes('Admin') || l.actorRole.includes('ADMIN')).length,
    };
  }, [logs]);

  return (
    <div className="space-y-4">
      {/* Quick Audit Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-surface-card border border-border-subtle rounded-[4px] shadow-2xs">
          <div className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Total Audit Records</div>
          <div className="text-base font-mono font-bold text-text-primary mt-0.5">{stats.total}</div>
        </div>
        <div className="p-3 bg-surface-card border border-border-subtle rounded-[4px] shadow-2xs">
          <div className="text-[10px] font-semibold text-status-warning uppercase tracking-wider">Security Events</div>
          <div className="text-base font-mono font-bold text-status-warning mt-0.5">{stats.security}</div>
        </div>
        <div className="p-3 bg-surface-card border border-border-subtle rounded-[4px] shadow-2xs">
          <div className="text-[10px] font-semibold text-status-danger uppercase tracking-wider">Critical & Alerts</div>
          <div className="text-base font-mono font-bold text-status-danger mt-0.5">{stats.critical}</div>
        </div>
        <div className="p-3 bg-surface-card border border-border-subtle rounded-[4px] shadow-2xs">
          <div className="text-[10px] font-semibold text-brand-accent uppercase tracking-wider">Admin Actions</div>
          <div className="text-base font-mono font-bold text-brand-accent mt-0.5">{stats.admin}</div>
        </div>
      </div>

      {/* Enterprise TanStack DataTable */}
      <DataTable
        title="System & Security Audit Trail"
        subtitle="Immutable log of configuration edits, password resets, and access events for compliance and security audit."
        icon={<History size={16} className="text-brand-accent" />}
        columns={columns}
        data={filteredLogs}
        isLoading={isRefreshing}
        searchPlaceholder="Filter by actor, resource, mutation, IP..."
        initialPageSize={10}
        headerExtra={
          <span className="text-xs text-text-muted font-medium">
            Total:{' '}
            <span className="font-semibold text-text-primary">{filteredLogs.length}</span>
            {filteredLogs.length !== logs.length && (
              <span className="text-text-muted"> of {logs.length}</span>
            )}{' '}
            {logs.length === 1 ? 'Record' : 'Records'}
          </span>
        }
        headerActions={
          <div className="flex flex-wrap items-center gap-2">
            {/* Client / Tenant Filter */}
            <div className="flex items-center gap-1.5">
              <Building2 size={12} className="text-text-muted" />
              <select
                id="audit-client-filter"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="max-w-[200px] truncate px-2 py-1 text-xs bg-surface-card border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:outline-none cursor-pointer shadow-2xs font-medium"
                title="Filter by Client Organization"
              >
                <option value="ALL">All Clients ({clientOptions.length})</option>
                {clientOptions.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* User / Actor Searchable Dropdown */}
            <SearchableUserDropdown
              options={userOptions}
              selectedActor={selectedActor}
              onSelect={setSelectedActor}
            />

            {/* Category Filter */}
            <div className="flex items-center gap-1.5">
              <Filter size={12} className="text-text-muted" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2 py-1 text-xs bg-surface-card border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:outline-none cursor-pointer shadow-2xs font-medium"
              >
                <option value="ALL">All Categories</option>
                <option value="SECURITY_POLICY">Security Policy</option>
                <option value="USER_MANAGEMENT">User Management & Passwords</option>
                <option value="ROLE_MANAGEMENT">Role & Privilege Matrix</option>
                <option value="TENANT_MANAGEMENT">Factory Client Management</option>
                <option value="AUTO_CODE">Auto-Code Sequences</option>
                <option value="FACTORY_SHIFTS">Factory Shifts</option>
                <option value="CURRENCY_RATE">Forex & Rates</option>
                <option value="AUTH_EVENT">Authentication Events</option>
              </select>
            </div>

            {/* Severity Filter */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-2 py-1 text-xs bg-surface-card border border-border-subtle rounded-[4px] text-text-primary focus:border-brand-accent focus:outline-none cursor-pointer shadow-2xs font-medium"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="WARNING">Warning</option>
              <option value="SUCCESS">Success</option>
              <option value="INFO">Info</option>
            </select>

            <Button
              size="xs"
              variant="secondary"
              onClick={handleExportCsv}
              icon={<Download size={12} />}
            >
              Export
            </Button>

            <Button
              size="xs"
              variant="secondary"
              onClick={fetchLogs}
              disabled={isRefreshing}
              icon={<RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />}
            >
              Refresh
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default SystemAuditLogsTab;
