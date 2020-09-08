Declare @currentYear as integer

Set @currentYear = 2016;

with MCHIP as (
	Select StateCode
		  ,SubmissionDate
		  ,sum(LineTotal) as Line7Total
	from (
		SELECT [StateCode]
				,[SubmissionDate]
				,[AgeRange]
				,[LineNumber]
				,sum(IsNull([Column1],0) + IsNull([Column2],0) + IsNull([Column3],0) + IsNull([Column4],0) + IsNull([Column5],0)) as LineTotal
			FROM [SCHIP].[dbo].[tbl64_21E]
			where LineNumber like '7%' and MONTH(SubmissionDate) = 4
			group by StateCode, SubmissionDate, AgeRange, LineNumber
	) a
	where YEAR(SubmissionDate) = @currentYear or YEAR(SubmissionDate) = (@currentYear - 1)
	group by StateCode, SubmissionDate
)

, MedicaidCHIP as (
	select a.id
		  ,a.StateCode
		  ,a.Program
		  ,(Select Line7Total from MCHIP where MCHIP.StateCode = a.StateCode and YEAR(MCHIP.SubmissionDate) = @currentYear) as CurrentYear
		  ,(Select Line7Total from MCHIP where MCHIP.StateCode = a.StateCode and YEAR(MCHIP.SubmissionDate) = (@currentYear - 1)) as PrevYear
	from (
		Select distinct StateCode
			  ,'2020-02-a-01' as id
			  ,'Medicaid expansion CHIP' as Program
		from MCHIP
	) a
)

, SCHIP as (
	Select StateCode
		  ,SubmissionDate
		  ,sum(LineTotal) as Line7Total
	from (
		SELECT [StateCode]
				,[SubmissionDate]
				,[ProgramCode]
				,[AgeRange]
				,[LineNumber]
				,sum(IsNull([Column1],0) + IsNull([Column2],0) + IsNull([Column3],0) + IsNull([Column4],0) + IsNull([Column5],0)) as LineTotal
			FROM [SCHIP].[dbo].[tbl21E]
			where LineNumber like '7%' and MONTH(SubmissionDate) = 4
			group by StateCode, SubmissionDate, ProgramCode, AgeRange, LineNumber
	) a
	where YEAR(SubmissionDate) = @currentYear or YEAR(SubmissionDate) = (@currentYear - 1)
	group by StateCode, SubmissionDate
)

, SeparateCHIP as (
	select a.id
		  ,a.StateCode
		  ,a.Program
		  ,(Select Line7Total from SCHIP where SCHIP.StateCode = a.StateCode and YEAR(SCHIP.SubmissionDate) = @currentYear) as CurrentYear
		  ,(Select Line7Total from SCHIP where SCHIP.StateCode = a.StateCode and YEAR(SCHIP.SubmissionDate) = (@currentYear - 1)) as PrevYear
	from (
		Select distinct StateCode
			  ,'2020-02-a-01' as id
			  ,'Separate CHIP' as Program
		from SCHIP
	) a
)

Select * from MedicaidCHIP

UNION

Select * from SeparateCHIP