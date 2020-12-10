/* CHECK CHANGES TO STATES
SELECT contents#>>'{section, subsections, 4, parts, 1, questions, 3, answer, options, 2}'
FROM carts_api_section
WHERE 	contents->'section'->>'id' = '2020-03'

SELECT contents#>>'{section, subsections, 4, parts, 1, questions, 5, answer, options, 2}'
FROM carts_api_section
WHERE 	contents->'section'->>'id' = '2020-03'
*/

--Add N/A response option to Section 3E, Question 4 for States
UPDATE carts_api_section
SET contents = jsonb_set(contents,
		'{section, subsections, 4, parts, 1, questions, 3, answer, options, 2}',
		'{"value": "na", "label": "N/A"}')
WHERE contents->'section'->>'id' = '2020-03';

--Add N/A response option to Section 3E, Question 6 for States
UPDATE carts_api_section
SET contents = jsonb_set(contents,
		'{section, subsections, 4, parts, 1, questions, 5, answer, options, 2}',
		'{"value": "na", "label": "N/A"}')
WHERE contents->'section'->>'id' = '2020-03';

--Add N/A response option to Section 3E, Question 4 for Section Schema
UPDATE carts_api_sectionbase
SET contents = jsonb_set(contents,
		'{section, subsections, 4, parts, 1, questions, 3, answer, options, 2}',
		'{"value": "na", "label": "N/A"}')
WHERE contents->'section'->>'id' = '2020-03';

--Add N/A response option to Section 3E, Question 6 for Section Schema
UPDATE carts_api_sectionbase
SET contents = jsonb_set(contents,
		'{section, subsections, 4, parts, 1, questions, 5, answer, options, 2}',
		'{"value": "na", "label": "N/A"}')
WHERE contents->'section'->>'id' = '2020-03';