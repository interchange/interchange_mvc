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

CREATE VIEW ic_file_resources_tree_view AS
    SELECT 
        tree.id, 
        tree.parent_id, 
        (tree."level" - 1) AS "level", 
        tree.branch, 
        tree.pos 
    FROM 
        connectby(
            'ic_file_resources'::text,
            'id'::text,
            'parent_id'::text,
            'branch_order, lookup_value'::text,
            (1)::text,
             0,
             '~'::text
         ) tree(id integer, parent_id integer, "level" integer, branch text, pos integer)
     ORDER BY tree.pos
;

--ROLLBACK;
COMMIT;
