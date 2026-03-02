-- =============================================================================
-- Migration: 0002_rls_and_security.sql
-- Stories: 1.1 (RLS), 1.2 (Settings protection)
-- =============================================================================
-- Purpose:
--   Enable Row Level Security on all 16 tables.
--   This is a single-tenant deployment using custom session auth.
--   The application uses service_role key (bypasses RLS by design).
--   RLS here protects against anonymous REST API access via anon key.
--
-- Policy strategy:
--   ALLOW service_role → all API routes (auth.role() = 'service_role')
--   DENY  anon / authenticated → no direct REST access without service key
--
-- Idempotent: safe to run multiple times (IF NOT EXISTS guards)
-- Rollback:   see 0002_rls_and_security_rollback.sql
-- =============================================================================

BEGIN;

-- =============================================================================
-- HELPER: updated_at auto-trigger (Story 1.5 dependency)
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 1. CAMPAIGNS
-- =============================================================================

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS campaigns_service_role ON campaigns;
CREATE POLICY campaigns_service_role ON campaigns
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- 2. CONTACTS
-- =============================================================================

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS contacts_service_role ON contacts;
CREATE POLICY contacts_service_role ON contacts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- 3. CAMPAIGN_CONTACTS
-- =============================================================================

ALTER TABLE campaign_contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS campaign_contacts_service_role ON campaign_contacts;
CREATE POLICY campaign_contacts_service_role ON campaign_contacts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- 4. TEMPLATES
-- =============================================================================

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS templates_service_role ON templates;
CREATE POLICY templates_service_role ON templates
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- 5. SETTINGS (Story 1.2 — protect key-value store from anon access)
-- =============================================================================

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS settings_service_role ON settings;
CREATE POLICY settings_service_role ON settings
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- 6. ACCOUNT_ALERTS
-- =============================================================================

ALTER TABLE account_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS account_alerts_service_role ON account_alerts;
CREATE POLICY account_alerts_service_role ON account_alerts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- 7. BOTS
-- =============================================================================

ALTER TABLE bots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS bots_service_role ON bots;
CREATE POLICY bots_service_role ON bots
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- 8. FLOWS
-- =============================================================================

ALTER TABLE flows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS flows_service_role ON flows;
CREATE POLICY flows_service_role ON flows
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- 9. BOT_CONVERSATIONS
-- =============================================================================

ALTER TABLE bot_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS bot_conversations_service_role ON bot_conversations;
CREATE POLICY bot_conversations_service_role ON bot_conversations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- 10. BOT_MESSAGES
-- =============================================================================

ALTER TABLE bot_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS bot_messages_service_role ON bot_messages;
CREATE POLICY bot_messages_service_role ON bot_messages
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- 11. CONVERSATION_VARIABLES
-- =============================================================================

ALTER TABLE conversation_variables ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS conversation_variables_service_role ON conversation_variables;
CREATE POLICY conversation_variables_service_role ON conversation_variables
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- 12. AI_AGENTS
-- =============================================================================

ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ai_agents_service_role ON ai_agents;
CREATE POLICY ai_agents_service_role ON ai_agents
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- 13. AI_TOOLS
-- =============================================================================

ALTER TABLE ai_tools ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ai_tools_service_role ON ai_tools;
CREATE POLICY ai_tools_service_role ON ai_tools
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- 14. TOOL_EXECUTIONS
-- =============================================================================

ALTER TABLE tool_executions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tool_executions_service_role ON tool_executions;
CREATE POLICY tool_executions_service_role ON tool_executions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- 15. FLOW_EXECUTIONS
-- =============================================================================

ALTER TABLE flow_executions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS flow_executions_service_role ON flow_executions;
CREATE POLICY flow_executions_service_role ON flow_executions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- 16. NODE_EXECUTIONS
-- =============================================================================

ALTER TABLE node_executions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS node_executions_service_role ON node_executions;
CREATE POLICY node_executions_service_role ON node_executions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- VERIFICATION QUERIES (run manually to confirm)
-- =============================================================================
-- SELECT schemaname, tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- ORDER BY tablename;
--
-- SELECT tablename, policyname, roles, cmd
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;

COMMIT;
