--Section 3c, Part 1, Question 1: Add new hint text
/*
SELECT contents#>'{section, subsections, 0, parts, 0, text}'
FROM carts_api_section
WHERE 	contents->'section'->>'id' = '2020-05' 
*/

--State Forms Section 5 Part 1
UPDATE	carts_api_section
SET    	contents = jsonb_set(contents, 
				 '{section, subsections, 0, parts, 0, text}', '"Please type your answers in only. Do not copy and paste your answers."')
WHERE 	contents->'section'->>'id' = '2020-05' ;

--State Forms Section 5 Part 2
UPDATE	carts_api_section
SET    	contents = jsonb_set(contents, 
				 '{section, subsections, 0, parts, 1, text}', '"Please type your answers in only. Do not copy and paste your answers."')
WHERE 	contents->'section'->>'id' = '2020-05' ;

--Master Form
UPDATE	carts_api_sectionbase
SET    	contents = jsonb_set(contents, 
				 '{section, subsections, 0, parts, 0, text}', '"Please type your answers in only. Do not copy and paste your answers."')
WHERE 	contents->'section'->>'id' = '2020-05' ;

UPDATE	carts_api_sectionbase
SET    	contents = jsonb_set(contents, 
				 '{section, subsections, 0, parts, 1, text}', '"Please type your answers in only. Do not copy and paste your answers."')
WHERE 	contents->'section'->>'id' = '2020-05' ;