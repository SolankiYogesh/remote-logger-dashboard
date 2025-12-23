-- Function to delete packages (logs) inactive for more than 10 days
create or replace function delete_inactive_packages()
returns void
language plpgsql
security definer
as $$
begin
  delete from public.logs
  where package_name in (
    select package_name
    from public.logs
    group by package_name
    having max(created_at) < now() - interval '10 days'
  );
end;
$$;

-- You can schedule this function using pg_cron if enabled:
-- select cron.schedule('0 0 * * *', 'select delete_inactive_packages()');

-- Or just run this query manually/periodically:
-- select delete_inactive_packages();
