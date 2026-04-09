-- Migration: Limit eventos table to the 15 most recent records

-- 1. Initial cleanup: remove any alerts currently in the DB beyond the 15 most recent
DELETE FROM public.eventos
WHERE id NOT IN (
  SELECT id
  FROM public.eventos
  ORDER BY timestamp DESC
  LIMIT 15
);

-- 2. Create the cleanup function
-- This function deletes all but the top 15 most recent alerts.
-- We use id NOT IN to identify which records to remove.
CREATE OR REPLACE FUNCTION public.delete_old_alerts()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.eventos
  WHERE id NOT IN (
    SELECT id
    FROM public.eventos
    ORDER BY timestamp DESC
    LIMIT 15
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Create the trigger to run after each insert statement
-- Using AFTER INSERT FOR EACH STATEMENT is efficient for bulk inserts,
-- but the logic works correctly for single inserts as well.
DROP TRIGGER IF EXISTS tr_limit_alerts ON public.eventos;
CREATE TRIGGER tr_limit_alerts
AFTER INSERT ON public.eventos
FOR EACH STATEMENT
EXECUTE FUNCTION public.delete_old_alerts();
