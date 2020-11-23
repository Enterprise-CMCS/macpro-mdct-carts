UPDATE	carts_api_section
SET    	contents = jsonb_set(contents, 
				 '{section, subsections, 0, parts, 0, questions, 1, answer, options, 0}', '{"label": "Both Medicaid Expansion CHIP and Separate CHIP", "value": "combo"}')
--FROM 	carts_api_section
WHERE 	contents->'section'->>'id' = '2020-00' 