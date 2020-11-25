UPDATE	carts_api_section
SET    	contents = jsonb_set(contents, 
				 '{section, subsections, 0, parts, 0, questions, 1, answer, entry}', '"separate_chip"')
WHERE contents->'section'->>'id' = '2020-00' and contents->'section'->>'state' = 'KS'

update carts_api_state
	set program_type = 'separate_chip'
where code = 'KS'