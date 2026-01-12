import { supabase } from '../lib/supabase';

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'ARCHIVE';
export type AuditEntity = 'PROJECT' | 'STEP' | 'AGENCY' | 'SECTOR';

export const useAudit = () => {
  const logAction = async (
    action: AuditAction,
    entity: AuditEntity,
    entityId: string,
    details?: any
  ) => {
    try {
      await supabase.from('audit_logs').insert([
        {
          action,
          entity,
          entity_id: entityId,
          details,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Failed to log audit action:', error);
      // We don't want to block the user action if logging fails
    }
  };

  return { logAction };
};
