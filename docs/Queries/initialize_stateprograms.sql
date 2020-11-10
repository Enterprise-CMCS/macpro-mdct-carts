--Update the State Program Types according to the CHIP Program Structure by State May dated 6/11/2020

--first set all states to the combo program type
update carts_api_state
	set program_type = 'combo'
;
	
--now set the separate chip program types 
update carts_api_state
	set program_type = 'separate_chip'
where code in ('AK', 'HI', 'NM','ND', 'OH', 'MD', 'DC', 'SC', 'VT', 'NH', 'PR', 'AS', 'GU', 'VI')
;

--last set the medicaid expansion program types
update carts_api_state
	set program_type = 'medicaid_exp_chip'
where code in ('WA','CT')
;

--select * from carts_api_state