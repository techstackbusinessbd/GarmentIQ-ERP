/**
 * =============================================================================
 * [EN] Factory Production Line Shifts Management Tab (FactoryShiftsTab.tsx)
 * [BN] কারখানা প্রোডাকশন লাইন শিফট ও কর্মঘণ্টা কনফিগারেশন ট্যাব (FactoryShiftsTab.tsx)
 * =============================================================================
 * [EN] Rules: Rule 07 (<300 lines), Rule 15 (Bilingual), Rule 20 (Tokens)
 * [BN] কাটিং ও সুইং লাইনের শিফট সময়সূচি, লাঞ্চ ব্রেক ও কার্যকরী কর্মঘণ্টা ব্যবস্থাপনা।
 */

import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Badge, TextInput } from '@/components/ui';
import { shiftService, type FactoryShift } from '../services/shiftService';

export const FactoryShiftsTab: React.FC = () => {
  const [shifts, setShifts] = useState<FactoryShift[]>([]);

  const [isAdding, setIsAdding] = useState(false);
  const [newShiftName, setNewShiftName] = useState('');
  const [newStartTime, setNewStartTime] = useState('06:00');
  const [newEndTime, setNewEndTime] = useState('14:00');
  const [newBreakMins, setNewBreakMins] = useState(45);

  const loadShifts = async () => {
    try {
      const data = await shiftService.getShifts();
      setShifts(data);
    } catch {
      toast.error('Failed to load factory shifts.');
    }
  };

  useEffect(() => {
    loadShifts();
  }, []);

  const calculateNetHours = (start: string, end: string, breakMins: number): string => {
    try {
      const startParts = start.split(':');
      const endParts = end.split(':');
      const sh = Number(startParts[0] ?? '0');
      const sm = Number(startParts[1] ?? '0');
      const eh = Number(endParts[0] ?? '0');
      const em = Number(endParts[1] ?? '0');
      let diffMinutes = (eh * 60 + em) - (sh * 60 + sm);
      if (diffMinutes < 0) diffMinutes += 24 * 60; // Cross midnight
      const netMinutes = Math.max(0, diffMinutes - breakMins);
      const hours = (netMinutes / 60).toFixed(1);
      return `${hours} hrs`;
    } catch {
      return '—';
    }
  };

  const handleToggleActive = (id: string) => {
    setShifts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
    toast.success('Shift activation status updated.');
  };

  const handleUpdateShift = (id: string, field: keyof FactoryShift, value: unknown) => {
    setShifts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleDeleteShift = async (id: string) => {
    try {
      await shiftService.deleteShift(id);
      setShifts((prev) => prev.filter((s) => s.id !== id));
      toast.success('Shift schedule removed from database.');
    } catch {
      toast.error('Failed to delete shift.');
    }
  };

  const handleAddShift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShiftName.trim()) {
      toast.error('Please enter a shift title.');
      return;
    }
    try {
      const created = await shiftService.createShift({
        name: newShiftName.trim(),
        startTime: newStartTime,
        endTime: newEndTime,
        breakMinutes: newBreakMins,
        isActive: true,
        type: 'REGULAR',
      });
      setShifts((prev) => [...prev, created]);
      setNewShiftName('');
      setIsAdding(false);
      toast.success('New factory shift saved to database.');
    } catch {
      toast.error('Failed to save shift.');
    }
  };

  return (
    <div className="bg-surface-card border border-border-subtle rounded-[6px] p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border-subtle gap-2">
        <div>
          <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={15} className="text-brand-accent" />
            <span>Production Line Shift Timing & Working Hours</span>
          </h2>
          <p className="text-[11px] text-text-muted mt-0.5">
            Configure factory sewing and cutting line shifts, lunch breaks, and net working hour baselines.
          </p>
        </div>
        <Button
          size="sm"
          variant={isAdding ? 'secondary' : 'primary'}
          onClick={() => setIsAdding((prev) => !prev)}
          icon={isAdding ? undefined : <Plus size={13} />}
        >
          {isAdding ? 'Cancel' : 'Add'}
        </Button>
      </div>

      {/* Add Shift Inline Drawer/Form */}
      {isAdding && (
        <form onSubmit={handleAddShift} className="p-4 rounded-[6px] bg-surface-muted/50 border border-brand-accent/30 space-y-3">
          <h3 className="text-xs font-bold text-text-primary">Create Production Shift Schedule</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="sm:col-span-1">
              <label className="block text-[11px] font-semibold text-text-secondary mb-1">Shift Name *</label>
              <TextInput
                required
                value={newShiftName}
                onChange={(e) => setNewShiftName(e.target.value)}
                placeholder="e.g. Shift 3 (Night)"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-text-secondary mb-1">Start Time</label>
              <TextInput
                type="time"
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-text-secondary mb-1">End Time</label>
              <TextInput
                type="time"
                value={newEndTime}
                onChange={(e) => setNewEndTime(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-text-secondary mb-1">Break (Mins)</label>
              <TextInput
                type="number"
                min={0}
                max={180}
                value={newBreakMins}
                onChange={(e) => setNewBreakMins(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button size="xs" variant="primary" type="submit">
              Save
            </Button>
          </div>
        </form>
      )}

      {/* Shifts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shifts.length === 0 ? (
          <div className="col-span-full py-10 text-center text-text-muted border border-dashed border-border-subtle rounded-[6px] bg-surface-card">
            <Clock size={24} className="mx-auto mb-2 text-text-muted/60" />
            <p className="text-xs font-semibold text-text-primary">No Production Shifts Configured</p>
            <p className="text-[11px] text-text-muted mt-0.5">Click 'Add' above to configure factory working hours.</p>
          </div>
        ) : (
          shifts.map((shift) => {
          const net = calculateNetHours(shift.startTime, shift.endTime, shift.breakMinutes);
          return (
            <div
              key={shift.id}
              className={`p-4 rounded-[6px] border transition-all ${
                shift.isActive
                  ? 'border-border-subtle bg-surface-card shadow-xs'
                  : 'border-border-subtle/50 bg-surface-muted/30 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                <input
                  type="text"
                  value={shift.name}
                  onChange={(e) => handleUpdateShift(shift.id, 'name', e.target.value)}
                  className="font-bold text-xs text-text-primary bg-transparent border-b border-transparent hover:border-border-subtle focus:border-brand-accent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleToggleActive(shift.id)}
                  className="cursor-pointer"
                  title="Toggle shift active status"
                >
                  <Badge variant={shift.isActive ? 'success' : 'neutral'}>
                    {shift.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div>
                  <span className="text-[10px] text-text-muted block">Start Time</span>
                  <input
                    type="time"
                    value={shift.startTime}
                    onChange={(e) => handleUpdateShift(shift.id, 'startTime', e.target.value)}
                    className="w-full font-mono text-xs text-text-primary bg-surface-base px-2 py-1 rounded border border-border-subtle focus:border-brand-accent focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-text-muted block">End Time</span>
                  <input
                    type="time"
                    value={shift.endTime}
                    onChange={(e) => handleUpdateShift(shift.id, 'endTime', e.target.value)}
                    className="w-full font-mono text-xs text-text-primary bg-surface-base px-2 py-1 rounded border border-border-subtle focus:border-brand-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-border-subtle text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-text-muted">Break:</span>
                  <input
                    type="number"
                    min={0}
                    max={180}
                    value={shift.breakMinutes}
                    onChange={(e) => handleUpdateShift(shift.id, 'breakMinutes', Number(e.target.value))}
                    className="w-14 font-mono text-xs text-text-primary bg-surface-base px-1.5 py-0.5 rounded border border-border-subtle text-center focus:border-brand-accent focus:outline-none"
                  />
                  <span className="text-[10px] text-text-muted">mins</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-brand-accent">{net}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteShift(shift.id)}
                    className="p-1 text-text-muted hover:text-status-danger transition-colors cursor-pointer"
                    title="Delete shift"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
};

export default FactoryShiftsTab;
