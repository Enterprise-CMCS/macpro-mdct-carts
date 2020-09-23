USE [SCHIP]
GO

Declare @currentYear as integer

Set @currentYear = 2020;

with SCHIP as (
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
--select * from SCHIP

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

