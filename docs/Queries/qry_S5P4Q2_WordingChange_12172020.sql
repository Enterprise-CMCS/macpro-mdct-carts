--Change response type for Section 5, Part 4, Question 1
/*  Select statement to check the data we are changing
SELECT contents#>'{section, subsections, 0, parts, 3, questions, 1, label}'
FROM carts_api_section
WHERE 	contents->'section'->>'id' = '2020-05'

SELECT contents#>'{section, subsections, 0, parts, 3, questions, 1, hint}'
FROM carts_api_section
WHERE 	contents->'section'->>'id' = '2020-05'
*/
--Question Text
UPDATE carts_api_section
SET contents = jsonb_set(contents, 
				 '{section, subsections, 0, parts, 3, questions, 1, label}', 
				 '"What was your per member per month (PMPM) cost based on the number of children eligible for Fee For Service in FFY 2020? What is your projected PMPM cost for FFY 2021 and 2022?"')
WHERE 	contents->'section'->>'id' = '2020-05';
--Hint Text
UPDATE carts_api_section
SET contents = jsonb_set(contents, 
				 '{section, subsections, 0, parts, 3, questions, 1, hint}', 
			     '"The per member per month cost will be the average cost per month to provide services to these enrollees. Round to the nearest whole number."')
WHERE 	contents->'section'->>'id' = '2020-05';
