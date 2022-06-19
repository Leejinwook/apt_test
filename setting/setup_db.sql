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

create table if not exists car_info(id int not null AUTO_INCREMENT, carid varchar(50) NOT NULL, carnumber varchar(50) NOT NULL,speed int,latitude varchar(50),longitude varchar(50),time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,primary key(id));
create table if not exists car_engin(id int not null AUTO_INCREMENT, carid varchar(50) NOT NULL, engin_status varchar(20) NOT NULL DEFAULT "STOP", time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, primary key(id));

select engin_status from car_engin where carid = "09e7b07a-eeb6-11ec-acf2-acde48001122" and engin_status = "START_REQ" order by id desc limit 1;