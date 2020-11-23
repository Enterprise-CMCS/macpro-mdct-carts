UPDATE	carts_api_section
SET    	contents = 

select jsonb_set(contents, 
				 '{section, subsections, 0, parts, 0, fieldset, questions, 0, answer, 0, entry, 0}', 'null')
from carts_api_section
WHERE contents->'section'->>'id' = '2020-00' and contents->'section'->'subsections'->'parts'->'fieldset'->'questions'->>'id' = '2020-00-a-01-04'

and contents->'section'->'subsections'->'parts'->'fieldset'->'questions'->'answer'->>'entry' = 'Alaskan Name'
