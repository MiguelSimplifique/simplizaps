-- =============================================================================
-- Migration: 0004_campaign_contacts_fk.sql
-- Story: 1.5 (FK Constraints — gap D3 from QA review)
-- =============================================================================
-- Purpose:
--   Add missing FK constraint: campaign_contacts.contact_id → contacts(id)
--   This was listed in Story 1.5 AC but omitted from 0003 migration.
--
-- Strategy:
--   ON DELETE SET NULL — contact_id is nullable by design (bulk dispatch can
--   create campaign_contacts from CSV without a matching contacts row).
--   Nullifying on contact deletion is safe and preserves campaign history.
--
-- Idempotent: DROP CONSTRAINT IF EXISTS guards
-- Rollback:   see 0004_campaign_contacts_fk_rollback.sql
-- =============================================================================

BEGIN;

ALTER TABLE campaign_contacts
  DROP CONSTRAINT IF EXISTS fk_campaign_contacts_contact_id;

ALTER TABLE campaign_contacts
  ADD CONSTRAINT fk_campaign_contacts_contact_id
  FOREIGN KEY (contact_id)
  REFERENCES contacts(id)
  ON DELETE SET NULL
  DEFERRABLE INITIALLY DEFERRED;

-- Index for FK column (performance on JOIN/lookup)
CREATE INDEX IF NOT EXISTS idx_campaign_contacts_contact_id
  ON campaign_contacts(contact_id)
  WHERE contact_id IS NOT NULL;

COMMIT;
