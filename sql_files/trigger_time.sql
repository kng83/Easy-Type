--create trigger
use alarm_db;

--Functio for counting
create or replace function counter_trigger ()
returns trigger language plpgsql as $$
begin
    new.counter:= new.tid+ 1;
    return new;
end $$;

--Drop trigger when exists
DROP TRIGGER IF exists counter on "ticket";
create trigger counter
before insert or update on "ticket"
for each row execute procedure counter_trigger();


/* Here is funtion and trigger creation. It's used to measure time from begginin of emergency to end of emergancy */
--create trigger for counting total time of fail
--trigger is used to measure total time of emergancy
create or replace function measure_time ()
returns trigger language plpgsql as $$
begin
	--/
	if new.status = 'resolved' then 
		new.end_at:= current_timestamp(35)::timestamptz ;
     	new.total_time:=  age(new.end_at,new.created_at);
 	end if;
 
    return new;
   
end $$;

--Drop trigger when exists
DROP TRIGGER IF exists measure_time_trigger on "ticket";
create trigger measure_time_trigger
before insert or update on "ticket"
for each row execute procedure measure_time();


/*-------------------------------------------------------------------------------------
  End of ticket_notes gives resolved to ticket 100% means that emergancy is resolved
--------------------------------------------------------------------------------------*/

--Create Function

create or replace function end_ticket_notes ()
returns trigger language plpgsql as $$
declare 
	one int;
begin
	--/
	if new.pc_status = 100 then 
		UPDATE "ticket" t
			SET status = 'pending resolved'
			WHERE t.tid = new.tn_id;
 	end if;
 	
 	one:=  sum(tn.stop_time) from ticket_notes tn where tn.tn_id = new.tn_id;
 	
-- 
	update "ticket"  t
 		set total_stop_time = one
 		WHERE t.tid = new.tn_id;
 	
    return new;
   
end $$;

--Drop trigger when exists
DROP TRIGGER IF exists end_ticket_notes_trigger on "ticket_notes";
create trigger end_ticket_notes_trigger
after insert or update on "ticket_notes"
for each row execute procedure end_ticket_notes();


