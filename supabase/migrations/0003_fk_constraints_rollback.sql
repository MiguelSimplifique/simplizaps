-- =============================================================================
-- ROLLBACK: 0003_fk_constraints_rollback.sql
-- =============================================================================
-- Run this to revert 0003_fk_constraints_and_triggers.sql

BEGIN;

-- Remove FK constraints
ALTER TABLE campaigns DROP CONSTRAINT IF EXISTS fk_campaigns_template_id;
ALTER TABLE bots DROP CONSTRAINT IF EXISTS fk_bots_flow_id;

-- Remove indexes
DROP INDEX IF EXISTS idx_campaigns_template_id;
DROP INDEX IF EXISTS idx_bots_flow_id;

-- Remove triggers
DROP TRIGGER IF EXISTS trg_campaigns_updated_at ON campaigns;
DROP TRIGGER IF EXISTS trg_contacts_updated_at ON contacts;
DROP TRIGGER IF EXISTS trg_templates_updated_at ON templates;
DROP TRIGGER IF EXISTS trg_settings_updated_at ON settings;
DROP TRIGGER IF EXISTS trg_bots_updated_at ON bots;
DROP TRIGGER IF EXISTS trg_flows_updated_at ON flows;
DROP TRIGGER IF EXISTS trg_bot_conversations_updated_at ON bot_conversations;
DROP TRIGGER IF EXISTS trg_ai_agents_updated_at ON ai_agents;
DROP TRIGGER IF EXISTS trg_flow_executions_updated_at ON flow_executions;

-- Note: update_updated_at_column() function kept (harmless, may be used elsewhere)

COMMIT;
