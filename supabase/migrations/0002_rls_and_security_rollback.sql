-- =============================================================================
-- ROLLBACK: 0002_rls_and_security_rollback.sql
-- =============================================================================
-- Run this to revert 0002_rls_and_security.sql
-- WARNING: This disables all RLS protections — only for emergency rollback

BEGIN;

DO $$
DECLARE
  t TEXT;
  tables TEXT[] := ARRAY[
    'campaigns', 'contacts', 'campaign_contacts', 'templates',
    'settings', 'account_alerts', 'bots', 'flows', 'bot_conversations',
    'bot_messages', 'conversation_variables', 'ai_agents', 'ai_tools',
    'tool_executions', 'flow_executions', 'node_executions'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I_service_role ON %I', t, t);
    EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;

COMMIT;
