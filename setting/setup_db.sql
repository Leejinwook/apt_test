create user 'carhacker' identified by 'xxxxxxxx'
grant all privileges on *.* to 'carhacker';
create database if not exists car_db;
use car_db;
create table if not exists car_info(
    carid varchar(50) NOT NULL,
    carnumber varchar(50) NOT NULL,
    speed int,
    latitude varchar(50),
    longitude varchar(50),
    time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    primary key(carid)
);


