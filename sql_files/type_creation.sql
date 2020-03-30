
/*type creation*/
CREATE TYPE ticket_status AS ENUM ('resolved','pending','not resolved','rejected','pending resolved');
--here is add new enum type
alter TYPE ticket_status add Value 'pending resolved' after 'rejected';

--creating super type for holding user_message, user_id, stand_time, status 

CREATE TYPE T_ticket_msg AS (new_msg_ts timestamp current_timestamp, user_msg varchar(256),user_id int, stand_time interval);
drop type t_ticket_msg;

--change column type
--if you want to change some type first change the type to text type
alter table "ticket"
	alter column "ticket_msg" drop default,
	alter column "ticket_msg" TYPE text using ticket_msg::text;
	

--change the table
alter table "ticket"
	alter column "ticket_msg" drop default,
	alter column "ticket_msg" TYPE t_ticket_msg[] using ticket_msg::t_ticket_msg[];


 alter type t_ticket_msg
 ALTER ATTRIBUTE new_msg_ts  TYPE timestamp(6) current_timestamp;

ALTER TYPE t_ticket_msg ADD ATTRIBUTE msg_ts timestamptz NOT NULL DEFAULT Current_Timestamp;



--search in array for certain value 
SELECT * FROM ticket_notes tn where 'kot'= any(tn.users_list) ;



CREATE TYPE ts_1 AS  (new_msg_ts timestamp current_timestamp,some_id int);


CREATE TYPE t_resp_req AS ENUM ('request','response');

CREATE TYPE t_machine_status AS ENUM ('working','not working','temp working');
