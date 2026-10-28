/**
 * =============================================================================
 * [EN] Multi-Tenant Client Factory Management Page (ClientsPage)
 * [BN] মাল্টি-টেন্যান্ট ক্লায়েন্ট ফ্যাক্টরি ব্যবস্থাপনা পেজ (ClientsPage) (রুল ০৭ ও ১৫)
 * =============================================================================
 * [EN] Reference: Approved Architecture Specification (2026-10-21)
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 17 (Premium), Rule 20 (Tokens)
 * [BN] ক্লায়েন্ট গার্মেন্টস কারখানা অনবোর্ডিং, লাইসেন্সিং টায়ার ও টেন্যান্ট মনিটরিং।
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Tenant } from '@/types';
import { clientService } from '../services/clientService';
import { ClientTable } from '../components/ClientTable';

export const ClientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await clientService.getAllTenants(true);
      // [EN] Filter out internal root/system tenant from client factory directory
      // [BN] ইন্টারনাল সিস্টেম রুট টেন্যান্ট ফিল্টার আউট করে শুধু প্রকৃত ক্লায়েন্ট প্রতিষ্ঠান রাখা
      const clientOnly = data.filter((t) => t.tenantCode !== 'SYSTEM' && t.subscriptionTier !== 'PLATFORM_ROOT');
      setClients(clientOnly);
    } catch {
      // Graceful fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleEditClient = (client: Tenant) => {
    navigate(`/app/admin/clients/${client.id}/edit`);
  };

  return (
    <div className="w-full">
      <ClientTable
        clients={clients}
        isLoading={isLoading}
        onRefresh={fetchClients}
        onEditClient={handleEditClient}
      />
    </div>
  );
};

export default ClientsPage;

