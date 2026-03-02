-- =============================================================================
-- Migration: 0003_fk_constraints_and_triggers.sql
-- Stories: 1.5 (FK Constraints)
-- =============================================================================
-- Purpose:
--   1. Add missing FK constraints (campaigns.template_id, bots.flow_id)
--   2. Add indexes for new FK columns
--   3. Add updated_at auto-trigger to all tables that have the column
--
-- FK strategy: ON DELETE SET NULL (safe — no cascade delete on business entities)
-- Idempotent: IF NOT EXISTS guards throughout
-- Rollback:   see 0003_fk_constraints_rollback.sql
-- =============================================================================

BEGIN;

-- =============================================================================
-- FOREIGN KEY CONSTRAINTS
-- =============================================================================

-- campaigns.template_id → templates(id)
-- ON DELETE SET NULL: deleting a template nullifies ref, campaign still exists
ALTER TABLE campaigns
  DROP CONSTRAINT IF EXISTS fk_campaigns_template_id;

ALTER TABLE campaigns
  ADD CONSTRAINT fk_campaigns_template_id
  FOREIGN KEY (template_id)
  REFERENCES templates(id)
  ON DELETE SET NULL
  DEFERRABLE INITIALLY DEFERRED;

-- bots.flow_id → flows(id)
-- ON DELETE SET NULL: deleting a flow disassociates bot, does not delete bot
ALTER TABLE bots
  DROP CONSTRAINT IF EXISTS fk_bots_flow_id;

ALTER TABLE bots
  ADD CONSTRAINT fk_bots_flow_id
  FOREIGN KEY (flow_id)
  REFERENCES flows(id)
  ON DELETE SET NULL
  DEFERRABLE INITIALLY DEFERRED;

-- =============================================================================
-- INDEXES FOR FK COLUMNS (performance)
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_campaigns_template_id ON campaigns(template_id)
  WHERE template_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_bots_flow_id ON bots(flow_id)
  WHERE flow_id IS NOT NULL;

-- =============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- (created in 0002 — ensure exists in case migrations run out of order)
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- APPLY updated_at TRIGGERS TO ALL TABLES
-- =============================================================================

-- campaigns
DROP TRIGGER IF EXISTS trg_campaigns_updated_at ON campaigns;
CREATE TRIGGER trg_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- contacts
DROP TRIGGER IF EXISTS trg_contacts_updated_at ON contacts;
CREATE TRIGGER trg_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- templates
DROP TRIGGER IF EXISTS trg_templates_updated_at ON templates;
CREATE TRIGGER trg_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- settings
DROP TRIGGER IF EXISTS trg_settings_updated_at ON settings;
CREATE TRIGGER trg_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- bots
DROP TRIGGER IF EXISTS trg_bots_updated_at ON bots;
CREATE TRIGGER trg_bots_updated_at
  BEFORE UPDATE ON bots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- flows
DROP TRIGGER IF EXISTS trg_flows_updated_at ON flows;
CREATE TRIGGER trg_flows_updated_at
  BEFORE UPDATE ON flows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- bot_conversations
DROP TRIGGER IF EXISTS trg_bot_conversations_updated_at ON bot_conversations;
CREATE TRIGGER trg_bot_conversations_updated_at
  BEFORE UPDATE ON bot_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ai_agents
DROP TRIGGER IF EXISTS trg_ai_agents_updated_at ON ai_agents;
CREATE TRIGGER trg_ai_agents_updated_at
  BEFORE UPDATE ON ai_agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- flow_executions
DROP TRIGGER IF EXISTS trg_flow_executions_updated_at ON flow_executions;
CREATE TRIGGER trg_flow_executions_updated_at
  BEFORE UPDATE ON flow_executions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- VERIFICATION QUERIES (run manually to confirm)
-- =============================================================================
-- -- Check FK constraints:
-- SELECT conname, conrelid::regclass, confrelid::regclass, confdeltype
-- FROM pg_constraint
-- WHERE contype = 'f'
--   AND conrelid::regclass::text IN ('campaigns', 'bots')
-- ORDER BY conrelid::regclass;
--
-- -- Check triggers:
-- SELECT trigger_name, event_object_table
-- FROM information_schema.triggers
-- WHERE trigger_schema = 'public'
--   AND trigger_name LIKE 'trg_%_updated_at'
-- ORDER BY event_object_table;

COMMIT;
