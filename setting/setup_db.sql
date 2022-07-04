create user 'XXXX' identified by 'XXXX';
grant all privileges on *.* to 'XXXX'@'localhost' identified by 'XXXX' with grant option;
flush privileges;
alter user 'XXXX'@'%' identified with mysql_native_password by 'XXXX';

create database if not exists car_db;
use car_db;
create table if not exists car_info(
    id int not null AUTO_INCREMENT,
    carid varchar(50) NOT NULL,
    carnumber varchar(50) NOT NULL,
    speed int,
    door varchar(10),
    latitude varchar(50),
    longitude varchar(50),
    time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    primary key(id)
);

create table if not exists car_engin(
    id int not null AUTO_INCREMENT,
    carid varchar(50) NOT NULL,
    engin_status varchar(20) NOT NULL DEFAULT "STOP",
    time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    primary key(id)
);

create table if not exists user(
    id int not null AUTO_INCREMENT,
    email varchar(50) NOT NULL,
    password varchar(20) NOT NULL,
    carnumber varchar(50) NOT NULL,
    carid varchar(50) NOT NULL,
    time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    primary key(id)
);

create table if not exists car_info(id int not null AUTO_INCREMENT, carid varchar(50) NOT NULL, carnumber varchar(50) NOT NULL, speed int, door varchar(10), latitude varchar(50), longitude varchar(50), time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, primary key(id));
create table if not exists car_engin(id int not null AUTO_INCREMENT, carid varchar(50) NOT NULL, engin_status varchar(20) NOT NULL DEFAULT "STOP", time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, primary key(id));
create table if not exists user(id int not null AUTO_INCREMENT, email varchar(50) NOT NULL, password varchar(20) NOT NULL, carnumber varchar(50) NOT NULL, carid varchar(50) NOT NULL, time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, primary key(id));

select engin_status from car_engin where carid = "09e7b07a-eeb6-11ec-acf2-acde48001122" and engin_status = "START_REQ" order by id desc limit 1;


-- Sample Datas ---

+----+--------------------------------------+-----------+-------+-----------+------------+---------------------+
| id | carid                                | carnumber | speed | latitude  | longitude  | time                |
+----+--------------------------------------+-----------+-------+-----------+------------+---------------------+
|  1 | 09e7b07a-eeb6-11ec-acf2-acde48001122 | 38SS4798  |    95 | 37.562566 | 126.832801 | 2022-06-18 16:16:19 |
+----+--------------------------------------+-----------+-------+-----------+------------+---------------------+

insert into car_info(carid, carnumber, speed, door, latitude, longitude) values ('9e7965d1-b64d-4d3e-a7ff-dd71502911a6', '38노4798', 61, '00000', '37.562563', '126.832802');
insert into car_info(carid, carnumber, speed, door, latitude, longitude) values ('9e7965d1-b64d-4d3e-a7ff-dd71502911a6', '38노4798', 62, '00000', '37.562523', '126.832843');
insert into car_info(carid, carnumber, speed, door, latitude, longitude) values ('9e7965d1-b64d-4d3e-a7ff-dd71502911a6', '38노4798', 63, '00000', '37.562234', '126.832845');
insert into car_info(carid, carnumber, speed, door, latitude, longitude) values ('9e7965d1-b64d-4d3e-a7ff-dd71502911a6', '38노4798', 45, '00000', '37.562544', '126.832824');
insert into car_info(carid, carnumber, speed, door, latitude, longitude) values ('9e7965d1-b64d-4d3e-a7ff-dd71502911a6', '38노4798', 32, '00000', '37.562522', '126.832234');
insert into car_info(carid, carnumber, speed, door, latitude, longitude) values ('9e7965d1-b64d-4d3e-a7ff-dd71502911a6', '38노4798', 10, '00000', '37.562253', '126.832812');
insert into car_info(carid, carnumber, speed, door, latitude, longitude) values ('9e7965d1-b64d-4d3e-a7ff-dd71502911a6', '38노4798', 0, '10000', '37.562385', '126.832900');
insert into car_info(carid, carnumber, speed, door, latitude, longitude) values ('9e7965d1-b64d-4d3e-a7ff-dd71502911a6', '38노4798', 0, '11010', '37.562385', '126.832900');
insert into car_info(carid, carnumber, speed, door, latitude, longitude) values ('9e7965d1-b64d-4d3e-a7ff-dd71502911a6', '38노4798', 50, '11010', '37.562385', '126.832900');

SELECT id, carid, carnumber, speed, door, latitude, longitude, time FROM (SELECT * FROM car_info WHERE carid = (SELECT carid FROM user WHERE email = ?) ORDER BY id DESC LIMIT 5) A ORDER BY id;
SELECT id, carid, carnumber, speed, door, latitude, longitude, time FROM car_info WHERE carid = (SELECT carid FROM user WHERE email = ?) ORDER BY id DESC LIMIT 30

insert into car_engin(carid, engin_status) values ('9e7965d1-b64d-4d3e-a7ff-dd71502911a6', 'START');