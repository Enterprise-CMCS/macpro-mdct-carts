--Clear any data that may exist in the tables for the dates we want to work with
delete from schip.tbl21e
where cast("SubmissionDate" as date) = '4/1/2020' or cast("SubmissionDate" as date) = '4/1/2019'

delete from schip.tbl64_21e
where cast("SubmissionDate" as date) = '4/1/2020' or cast("SubmissionDate" as date) = '4/1/2019'

--Manually import the data from CSV files
--Run the same 2 select queries below against the master DB then export the results to CSV
--Import the CSVs (make sure to select Headers and that NULL is the string for NULL values)

--Verify the data was imported
select *
from schip.tbl21e
where cast("SubmissionDate" as date) = '4/1/2020' or cast("SubmissionDate" as date) = '4/1/2019'

select *
from schip.tbl64_21e
where cast("SubmissionDate" as date) = '4/1/2020' or cast("SubmissionDate" as date) = '4/1/2019'