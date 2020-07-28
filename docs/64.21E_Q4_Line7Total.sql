USE [SCHIP]
GO

/****** Object:  View [dbo].[64.21E_Q4_Line7Total]    Script Date: 7/23/2020 9:49:45 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[64.21E_Q4_Line7Total] AS 
	Select StateCode
	  ,SubmissionDate
	  ,sum(LineTotal) as Line7Total
	from (
		SELECT [StateCode]
			  ,[SubmissionDate]
			  ,[TypeOfEligible]
			  ,[AgeRange]
			  ,[LineNumber]
			  ,sum(IsNull([Column1],0) + IsNull([Column2],0) + IsNull([Column3],0) + IsNull([Column4],0) + IsNull([Column5],0)) as LineTotal
		  FROM [SCHIP].[dbo].[tbl64_21E]
		  where LineNumber like '7%' and MONTH(SubmissionDate) = 4
		  group by StateCode, SubmissionDate, [TypeOfEligible], AgeRange, LineNumber
		  --order by [TypeOfEligible], AgeRange, LineNumber
	) a
	group by StateCode, SubmissionDate
GO


