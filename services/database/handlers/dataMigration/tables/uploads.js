const query = `select filename, aws_filename as "awsFilename", question_id as "questionId", uploaded_date as "uploadedDate", 
               uploaded_username as "uploadedUsername", uploaded_state as "uploadedState"
               from carts_api_uploadedfiles`;

const migration = {
  name: "Uploads",
  query,
  transform: (rows) => {
    rows.map((row) => {
      row.fileId = `${row.questionId.slice(0, 4)}-${row.questionId}_${
        row.awsFilename
      }`;
      row.uploadedDate = row.uploadedDate?.toString();
    });
    return rows;
  },
  tableNameBuilder: (stage) => `${stage}-uploads`,
  keys: ["uploadedState", "fileId"],
};

module.exports = migration;
