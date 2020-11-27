--Change response type for Section 5, Part 3, Question 1
/*  Select statement to check the data we are changing
SELECT contents#>'{section, subsections, 0, parts, 2, questions, 0, questions, 0, questions, 0, type}'
FROM carts_api_section
WHERE 	contents->'section'->>'id' = '2020-05'
*/
--Part 3 2020 Response
UPDATE carts_api_section
SET contents = jsonb_set(contents, 
				 '{section, subsections, 0, parts, 2, questions, 0, questions, 0, questions, 0, type}', '"integer"')
WHERE 	contents->'section'->>'id' = '2020-05' 
--Part 3 2021 Response
UPDATE carts_api_section
SET contents = jsonb_set(contents, 
				 '{section, subsections, 0, parts, 2, questions, 0, questions, 0, questions, 1, type}', '"integer"')
WHERE 	contents->'section'->>'id' = '2020-05' 
--Part 3 2022 Response
UPDATE carts_api_section
SET contents = jsonb_set(contents, 
				 '{section, subsections, 0, parts, 2, questions, 0, questions, 0, questions, 2, type}', '"integer"')
WHERE 	contents->'section'->>'id' = '2020-05' 
--Part 4 2020 Response
UPDATE carts_api_section
SET contents = jsonb_set(contents, 
				 '{section, subsections, 0, parts, 3, questions, 0, questions, 0, questions, 0, type}', '"integer"')
WHERE 	contents->'section'->>'id' = '2020-05' 
--Part 4 2021 Response
UPDATE carts_api_section
SET contents = jsonb_set(contents, 
				 '{section, subsections, 0, parts, 3, questions, 0, questions, 0, questions, 1, type}', '"integer"')
WHERE 	contents->'section'->>'id' = '2020-05' 
--Part 4 2022 Response
UPDATE carts_api_section
SET contents = jsonb_set(contents, 
				 '{section, subsections, 0, parts, 3, questions, 0, questions, 0, questions, 2, type}', '"integer"')
WHERE 	contents->'section'->>'id' = '2020-05' 

