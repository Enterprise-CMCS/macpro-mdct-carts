--Section 3c, Part 1, Question 1: Add new hint text
/*
SELECT contents#>'{section, subsections, 2, parts, 0, questions, 0, hint}'
FROM carts_api_sectionbase
WHERE 	contents->'section'->>'id' = '2020-03' 
*/

--State Forms
UPDATE	carts_api_section
SET    	contents = jsonb_set(contents, 
				 '{section, subsections, 2, parts, 0, questions, 0, hint}', '"This question should only be answered in respect to Separate CHIP."')
WHERE 	contents->'section'->>'id' = '2020-03';

--Master Form
UPDATE	carts_api_sectionbase
SET    	contents = jsonb_set(contents, 
				 '{section, subsections, 2, parts, 0, questions, 0, hint}', '"This question should only be answered in respect to Separate CHIP."')
WHERE 	contents->'section'->>'id' = '2020-03';