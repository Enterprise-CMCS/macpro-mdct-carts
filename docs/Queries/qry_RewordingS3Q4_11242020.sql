--Put the correct wording in for Section 3G, Question 4
UPDATE carts_api_section
SET contents = jsonb_set(contents, 
				 '{section, subsections, 6, parts, 0, questions, 5, label}', '"How many children (who were enrolled in Separate CHIP for at least 90 continuous days) received at least one preventative dental care service during FFY 2020?"')
WHERE 	contents->'section'->>'id' = '2020-03' 

