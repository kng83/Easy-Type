--create trigger


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
    --/
      --TODO
 	  -- new.ticket_msg[1].user_id:=2;
 	    "ticket".ticket_msg[1].user_msg:= 'jakis tekst',
 	
 
    return new;
   
end $$;

--Drop trigger when exists
DROP TRIGGER IF exists measure_time_trigger on "ticket";
create trigger measure_time_trigger
before insert or update on "ticket"
for each row execute procedure measure_time();


