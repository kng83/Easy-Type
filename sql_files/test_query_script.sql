

select * from "user";

select * from job j ;

explain select * from ticket t ;

select  * from ticket;

insert into "ticket"(reporting_title ,reporting_user_id,status) values ('add 4',1,'pending');

update  "ticket"
    set ticket_msg[2].user_msg = 'jakis tekst 2',
    	ticket_msg[2].new_msg_ts = current_timestamp(35)::timestamptz,
	    ticket_msg[2].user_id = 3
where tid = 4;

update "ticket"
set status = 'resolved' 
where tid = 10;


UPDATE  "ticket" SET ticket_msg = array_append(ticket_msg,'new item') where tid = 10;

select * from ticket t where t.tid = 4;





ALTER TABLE public.ticket ADD created_at timestamp WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

CREATE TYPE ticket_status AS ENUM ('resolved','pending','not resolved','rejected','pending resolved');
alter TYPE ticket_status add Value 'pending resolved' after 'rejected';

ALTER TABLE public.ticket ADD status ticket_status;




update "ticket"  
set status = 'resolved'
where status = 'pending resolved';

update "ticket_notes"
set machine_status = 'working'
where machine_status is null ;


select row_to_json("user") as some from "user"; 

select * from ticket t1 join ticket_notes t2 on  t1.tid=1 AND t1.tid = t2.tn_id;


with cte as (
select
	json_build_object( 'messages', (t.reporting_title ), 'id', (t.tid )) as my_ticket
	--(t.message ,t.id )
from
	ticket t where t.tid =4
),
cte_2 as (
select 
	json_build_object('ticket_notes',(tn.machine_status) ,'id',(tn.user_msg )) as my_ticket_notes
from 
	ticket_notes tn  where tn.tn_id = 4
)
select json_build_object('query_results',json_agg(cte)) from cte
full join Cte_2 on null= null;





insert into ticket_notes (
		tn_id ,
		user_msg, 
		users_list,
		pc_status ,
		reporting_user_id,
	    stop_time,machine_status )
 values (4,
		'2 This is 13 fault',
		array['Pawel Kenig',
		'kot',
		'robo bobo'],
		 100,
		 4,
		 50,
		'not working');

select sum(tn.stop_time) from ticket_notes tn where tn.tn_id =4;


select * from "user";
-- ticket
select * from ticket_notes tn where tn.tn_id =4;
--ticket delete
DELETE FROM ticket_notes tn WHERE tn.reporting_user_id >4;


select * from public."user" u 


select * from ticket t1 join ticket_notes t2 on  t1.tid=3 AND t1.tid = t2.tn_id;

SELECT * FROM ticket_notes tn where 'Pawel Kenig'= any(tn.users_list) ;

ALTER TABLE public.ticket_notes ADD pc_status smallint check(pc_status>=0 AND pc_status<=100);

ALTER TABLE public.ticket_notes ADD reporting_user_id int references alarm_db.public."user".uid;
--ALTER TABLE public.ticket_notes ADD CONSTRAINT ticket_notes_fk FOREIGN KEY (reporting_user_id) REFERENCES public."user"(uid);

select * , concat(u.first_name ,' ',u.last_name ) as fullname from "user" u;

--create view
CREATE VIEW v_user as select * , concat(u.first_name ,' ',u.last_name ) as fullname from "user" u;

select * from "user";
select * from v_user vu ;

insert into "user" (first_name ,last_name ,role) values ('pawel','dong',2);




