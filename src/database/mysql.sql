CREATE SCHEMA IF NOT EXISTS `auth_system`;
USE `auth_system`;

CREATE TABLE
    IF NOT EXISTS `auth_system`.`users_tb` (
        `user_id` INT (11) NOT NULL AUTO_INCREMENT,
        `username` VARCHAR(45) NOT NULL,
        `password` VARCHAR(512) NOT NULL,
        `email` VARCHAR(45) NOT NULL,
        `first_name` VARCHAR(45) NOT NULL,
        `last_name` VARCHAR(45) NOT NULL,
        `date_created` VARCHAR(45) NOT NULL,
        `last_login` VARCHAR(45) NULL DEFAULT NULL,
        PRIMARY KEY (`user_id`)
    ) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARACTER
SET
    = utf8mb4;