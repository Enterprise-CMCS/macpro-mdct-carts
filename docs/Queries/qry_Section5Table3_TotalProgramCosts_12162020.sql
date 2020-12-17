--Change response type for Section 5, Part 2, Table 3 (Question 8)
/*  Select statement to check the data we are changing
--2020 Total program costs
SELECT contents#>'{section, subsections, 0, parts, 1, questions, 8, fieldset_info, rows, 0, 1, formula}'
FROM carts_api_section
WHERE 	contents->'section'->>'id' = '2020-05'
--2021 Total program costs
SELECT contents#>'{section, subsections, 0, parts, 1, questions, 8, fieldset_info, rows, 0, 2, formula}'
FROM carts_api_section
WHERE 	contents->'section'->>'id' = '2020-05'
--2022 Total program costs
SELECT contents#>'{section, subsections, 0, parts, 1, questions, 8, fieldset_info, rows, 0, 3, formula}'
FROM carts_api_section
WHERE 	contents->'section'->>'id' = '2020-05'
--2020 Federal share
SELECT contents#>'{section, subsections, 0, parts, 1, questions, 8, fieldset_info, rows, 2, 1, formula}'
FROM carts_api_section
WHERE 	contents->'section'->>'id' = '2020-05'
--2020 State share
SELECT contents#>'{section, subsections, 0, parts, 1, questions, 8, fieldset_info, rows, 3, 1, formula}'
FROM carts_api_section
WHERE 	contents->'section'->>'id' = '2020-05'
*/

--2020 Total program costs
UPDATE carts_api_section
SET contents = jsonb_set(contents, 
				 '{section, subsections, 0, parts, 1, questions, 8, fieldset_info, rows, 0, 1, formula}', '"<0> + <1> + <2> + <3> + <4> + <5> + <6> + <7> + <8> + <9> + <10>"')
WHERE 	contents->'section'->>'id' = '2020-05';
--2021 Total program costs
UPDATE carts_api_section
SET contents = jsonb_set(contents, 
				 '{section, subsections, 0, parts, 1, questions, 8, fieldset_info, rows, 0, 2, formula}', '"<0> + <1> + <2> + <3> + <4> + <5> + <6> + <7> + <8> + <9> + <10>"')
WHERE 	contents->'section'->>'id' = '2020-05';
--2022 Total program costs
UPDATE carts_api_section
SET contents = jsonb_set(contents, 
				 '{section, subsections, 0, parts, 1, questions, 8, fieldset_info, rows, 0, 3, formula}', '"<0> + <1> + <2> + <3> + <4> + <5> + <6> + <7> + <8> + <9> + <10>"')
WHERE 	contents->'section'->>'id' = '2020-05';

--2020 Federal share
UPDATE carts_api_section
SET contents = jsonb_set(contents, 
				 '{section, subsections, 0, parts, 1, questions, 8, fieldset_info, rows, 2, 1, formula}', '"(<0> / 100) * (<1> + <2> + <3> + <4> + <5> + <6> + <7> + <8> + <9> + <10> + <11>)"')
WHERE 	contents->'section'->>'id' = '2020-05';
--2021 Federal share
UPDATE carts_api_section
SET contents = jsonb_set(contents, 
				 '{section, subsections, 0, parts, 1, questions, 8, fieldset_info, rows, 2, 2, formula}', '"(<0> / 100) * (<1> + <2> + <3> + <4> + <5> + <6> + <7> + <8> + <9> + <10> + <11>)"')
WHERE 	contents->'section'->>'id' = '2020-05';
--2022 Federal share
UPDATE carts_api_section
SET contents = jsonb_set(contents, 
				 '{section, subsections, 0, parts, 1, questions, 8, fieldset_info, rows, 2, 3, formula}', '"(<0> / 100) * (<1> + <2> + <3> + <4> + <5> + <6> + <7> + <8> + <9> + <10> + <11>)"')
WHERE 	contents->'section'->>'id' = '2020-05';

--2020 State share
UPDATE carts_api_section
SET contents = jsonb_set(contents, 
				 '{section, subsections, 0, parts, 1, questions, 8, fieldset_info, rows, 3, 1, formula}', 
				 '"<0> + <1> + <2> + <3> + <4> + <5> + <6> + <7> + <8> + <9> + <10> - ((<11> / 100) * (<12> + <13> + <14> + <15> + <16> + <17> + <18> + <19> + <20> + <21> + <22>))"')
WHERE 	contents->'section'->>'id' = '2020-05';
--2021 State share
UPDATE carts_api_section
SET contents = jsonb_set(contents, 
				 '{section, subsections, 0, parts, 1, questions, 8, fieldset_info, rows, 3, 2, formula}', 
				 '"<0> + <1> + <2> + <3> + <4> + <5> + <6> + <7> + <8> + <9> + <10> - ((<11> / 100) * (<12> + <13> + <14> + <15> + <16> + <17> + <18> + <19> + <20> + <21> + <22>))"')
WHERE 	contents->'section'->>'id' = '2020-05';
--2022 State share
UPDATE carts_api_section
SET contents = jsonb_set(contents, 
				 '{section, subsections, 0, parts, 1, questions, 8, fieldset_info, rows, 3, 3, formula}', 
				 '"<0> + <1> + <2> + <3> + <4> + <5> + <6> + <7> + <8> + <9> + <10> - ((<11> / 100) * (<12> + <13> + <14> + <15> + <16> + <17> + <18> + <19> + <20> + <21> + <22>))"')
WHERE 	contents->'section'->>'id' = '2020-05';