
with MCHIP as (
	Select a."StateCode"
		  ,a."SubmissionDate"
		  ,sum(a."LineTotal") as "Line7Total"
	from (
		SELECT a."StateCode"
				,a."SubmissionDate"
				,a."AgeRange"
				,a."LineNumber"
				,sum(COALESCE(a."Column1",0) + COALESCE(a."Column2",0) + COALESCE(a."Column3",0) + COALESCE(a."Column4",0) + COALESCE(a."Column5",0)) as "LineTotal"
			FROM schip.tbl64_21E a
			where a."LineNumber" like '7%' and EXTRACT(month from a."SubmissionDate") = 4
			group by a."StateCode", a."SubmissionDate", a."AgeRange", a."LineNumber"
	) a
	where EXTRACT(year from a."SubmissionDate") = 2020 or EXTRACT(year from a."SubmissionDate") = (2020 - 1)
	group by a."StateCode", a."SubmissionDate"
)

, MedicaidCHIP as (
	select a."id"
		  ,a."StateCode"
		  ,a."program"
		  ,(Select MCHIP."Line7Total" from MCHIP where MCHIP."StateCode" = a."StateCode" and EXTRACT(year from MCHIP."SubmissionDate") = 2020) as "CurrentYear"
		  ,(Select MCHIP."Line7Total" from MCHIP where MCHIP."StateCode" = a."StateCode" and EXTRACT(year from MCHIP."SubmissionDate") = (2020 - 1)) as "PrevYear"
	from (
		Select distinct MCHIP."StateCode"
			  ,'2020-02-a-01' as id
			  ,'Medicaid expansion CHIP' as program
		from MCHIP
	) a
)

, SCHIP as (
	Select a."StateCode"
		  ,a."SubmissionDate"
		  ,sum(a."LineTotal") as "Line7Total"
	from (
		SELECT e."StateCode"
				,e."SubmissionDate"
				,e."ProgramCode"
				,e."AgeRange"
				,e."LineNumber"
				,sum(COALESCE(e."Column1",0) + COALESCE(e."Column2",0) + COALESCE(e."Column3",0) + COALESCE(e."Column4",0) + COALESCE(e."Column5",0)) as "LineTotal"
			FROM schip.tbl21E e
			where e."LineNumber" like '7%' and EXTRACT(month from e."SubmissionDate") = 4
			group by e."StateCode", e."SubmissionDate", e."ProgramCode", e."AgeRange", e."LineNumber"
	) a
	where EXTRACT(year from a."SubmissionDate") = 2020 or EXTRACT(year from a."SubmissionDate") = (2020 - 1)
	group by a."StateCode", a."SubmissionDate"
)

, SeparateCHIP as (
	select a."id"
		  ,a."StateCode"
		  ,a."program"
		  ,(Select SCHIP."Line7Total" from SCHIP where SCHIP."StateCode" = a."StateCode" and EXTRACT(year from SCHIP."SubmissionDate") = 2020) as "CurrentYear"
		  ,(Select SCHIP."Line7Total" from SCHIP where SCHIP."StateCode" = a."StateCode" and EXTRACT(year from SCHIP."SubmissionDate") = (2020 - 1)) as "PrevYear"
	from (
		Select distinct SCHIP."StateCode"
			  ,'2020-02-a-01' as id
			  ,'Separate CHIP' as program
		from SCHIP
	) a
)

Select * from MedicaidCHIP

UNION

Select * from SeparateCHIP