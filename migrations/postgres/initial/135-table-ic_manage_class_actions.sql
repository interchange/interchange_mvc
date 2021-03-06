--
-- Copyright (C) 2008-2010 End Point Corporation, http://www.endpoint.com/
--
-- This program is free software: you can redistribute it and/or modify
-- it under the terms of the GNU General Public License as published by
-- the Free Software Foundation, either version 2 of the License, or
-- (at your option) any later version.
--
-- This program is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
-- GNU General Public License for more details.
--
-- You should have received a copy of the GNU General Public License
-- along with this program. If not, see: http://www.gnu.org/licenses/ 
--
BEGIN;
SET client_min_messages='ERROR';

CREATE SEQUENCE ic_manage_class_actions_id_seq;

CREATE TABLE ic_manage_class_actions (
    id                      INTEGER DEFAULT nextval('ic_manage_class_actions_id_seq'::regclass) NOT NULL PRIMARY KEY,

    date_created            TIMESTAMP NOT NULL DEFAULT timeofday()::TIMESTAMP,
    created_by              VARCHAR(32) NOT NULL,
    last_modified           TIMESTAMP NOT NULL,
    modified_by             VARCHAR(32) NOT NULL,

    class_code              VARCHAR(100) NOT NULL
                                CONSTRAINT fk_class_code
                                REFERENCES ic_manage_classes(code)
                                ON DELETE RESTRICT
                                ON UPDATE CASCADE,

    code                    VARCHAR(100) NOT NULL,
    display_label           VARCHAR(255) NOT NULL,
    is_primary              BOOLEAN NOT NULL,

    UNIQUE(class_code, code),
    UNIQUE(class_code, display_label)
);

CREATE TRIGGER ic_manage_class_actions_last_modified
    BEFORE INSERT OR UPDATE ON ic_manage_class_actions
    FOR EACH ROW
    EXECUTE PROCEDURE ic_update_last_modified();

COPY ic_manage_class_actions (class_code, code, display_label, is_primary, date_created, created_by, last_modified, modified_by) FROM stdin;
TimeZones	Add	Add	t	2009-04-17 07:33:12.814683	schema	2009-04-17 07:33:12.814683	schema
TimeZones	List	List	t	2009-04-17 07:33:12.814683	schema	2009-04-17 07:33:12.814683	schema
TimeZones	DetailView	Details	f	2009-04-17 07:33:12.814683	schema	2009-04-17 07:33:12.814683	schema
TimeZones	Drop	Drop	f	2009-04-17 07:33:12.814683	schema	2009-04-17 07:33:12.814683	schema
TimeZones	Properties	Properties	f	2009-04-17 07:33:12.814683	schema	2009-04-17 07:33:12.814683	schema
Users	Add	Add	t	2009-04-17 07:33:12.814683	schema	2009-04-17 07:33:12.814683	schema
Users	List	List	t	2009-04-17 07:33:12.814683	schema	2009-04-17 07:33:12.814683	schema
Users	DetailView	Details	f	2009-04-17 07:33:12.814683	schema	2009-04-17 07:33:12.814683	schema
Users	Drop	Drop	f	2009-04-17 07:33:12.814683	schema	2009-04-17 07:33:12.814683	schema
Users	Properties	Properties	f	2009-04-17 07:33:12.814683	schema	2009-04-17 07:33:12.814683	schema
Roles	Add	Add	t	2009-04-17 07:33:12.814683	schema	2009-04-17 07:33:12.814683	schema
Roles	List	List	t	2009-04-17 07:33:12.814683	schema	2009-04-17 07:33:12.814683	schema
Roles	DetailView	Details	f	2009-04-17 07:33:12.814683	schema	2009-04-17 07:33:12.814683	schema
Roles	Drop	Drop	f	2009-04-17 07:33:12.814683	schema	2009-04-17 07:33:12.814683	schema
Roles	Properties	Properties	f	2009-04-17 07:33:12.814683	schema	2009-04-17 07:33:12.814683	schema
RightTypes	Add	Add	t	2009-04-17 07:33:12.814683	schema	2009-04-17 07:33:12.814683	schema
RightTypes	List	List	t	2009-04-17 07:33:12.814683	schema	2009-04-17 07:33:12.814683	schema
RightTypes	DetailView	Details	f	2009-04-17 07:33:12.814683	schema	2009-04-17 07:33:12.814683	schema
RightTypes	Drop	Drop	f	2009-04-17 07:33:12.814683	schema	2009-04-17 07:33:12.814683	schema
RightTypes	Properties	Properties	f	2009-04-17 07:33:12.814683	schema	2009-04-17 07:33:12.814683	schema
Rights	Add	Add	t	2009-04-17 07:33:12.814683	schema	2009-04-17 07:33:12.814683	schema
Rights	DetailView	Details	f	2009-04-17 07:33:12.814683	schema	2009-04-17 07:33:12.814683	schema
Rights	Drop	Drop	f	2009-04-17 07:33:12.814683	schema	2009-04-17 07:33:12.814683	schema
Rights	Properties	Properties	f	2009-04-17 07:33:12.814683	schema	2009-04-17 07:33:12.814683	schema
Files__Properties	Properties	Properties	f	2010-11-17 10:55:43.00000	schema	2010-11-17 10:55:43.00000	schema
Files__Properties	Drop	Drop	f	2010-11-17 10:55:43.00000	schema	2010-11-17 10:55:43.00000	schema
Files__Properties	Add	Add	f	2010-11-17 10:55:43.00000	schema	2010-11-17 10:55:43.00000	schema
\.

INSERT INTO ic_right_targets (created_by, modified_by, right_id, ref_obj_pk) (
    SELECT
        'schema',
        'schema',
        3,
        id
    FROM
        ic_manage_class_actions
    WHERE
        class_code IN ('RightTypes', 'TimeZones')
);

INSERT INTO ic_right_targets (created_by, modified_by, right_id, ref_obj_pk) (
    SELECT
        'schema',
        'schema',
        4,
        id
    FROM
        ic_manage_class_actions
    WHERE
        class_code IN ('Roles', 'Users', 'Rights')
);

INSERT INTO ic_right_targets (created_by, modified_by, right_id, ref_obj_pk) (
    SELECT
        'schema',
        'schema',
        5,
        id
    FROM
        ic_manage_class_actions
    WHERE
        class_code IN ('Files__Properties')
);

--ROLLBACK;
COMMIT;
