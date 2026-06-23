import React from 'react';
import { getJurisdictionsAction, getSuppressionsAction } from '@/app/actions';
import SettingsManager from '@/components/SettingsManager';

export const revalidate = 0; // Disable caching for settings

export default async function SettingsPage() {
  const [jurisdictions, suppressions] = await Promise.all([
    getJurisdictionsAction(),
    getSuppressionsAction(),
  ]);

  const envs = {
    resendFrom: process.env.RESEND_FROM || 'hello@theadustore.com',
    ownerDigestEmail: process.env.OWNER_DIGEST_EMAIL || 'info@TheADUStore.com',
    physicalAddress: process.env.PHYSICAL_ADDRESS || '123 ADU Way, Irvine, CA 92618',
    adminEmail: process.env.ADMIN_EMAIL || 'admin@theadustore.com',
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-display text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Configure compliance rules, physical mailing address, and local jurisdiction laws.</p>
      </div>

      <SettingsManager 
        initialJurisdictions={jurisdictions} 
        initialSuppressions={suppressions} 
        envs={envs}
      />
    </div>
  );
}
