-- =============================================================================
-- Rollback: 0004_campaign_contacts_fk_rollback.sql
-- =============================================================================

BEGIN;

ALTER TABLE campaign_contacts
  DROP CONSTRAINT IF EXISTS fk_campaign_contacts_contact_id;

DROP INDEX IF EXISTS idx_campaign_contacts_contact_id;

COMMIT;
