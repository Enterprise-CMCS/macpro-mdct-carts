const query = `select distinct on (state_id, year_to_modify, type_of_enrollment, index_to_update)
                  filter_id as "filterId", state_id as "stateId", year_to_modify as "yearToModify", 
                  type_of_enrollment as "typeOfEnrollment", index_to_update as "indexToUpdate",
                  enrollment_count as "enrollmentCount", id as "oldId"
                from stg_enrollment_counts
                order by state_id, year_to_modify, type_of_enrollment, index_to_update, id desc`;

const typeMap = {
  "Medicaid Expansion CHIP": "medicaid_exp_chip",
  "Separate CHIP": "separate_chip",
};

const migration = {
  name: "SEDS CHIP Enrollment Data",
  query,
  tableNameBuilder: (stage) => `${stage}-stg-enrollment-counts`,
  transform: (rows) => {
    const createdTime = new Date().toLocaleString();
    rows.map((row) => {
      row.pk = `${row.stateId}-${row.yearToModify}`;
      row.entryKey = `${typeMap[row.typeOfEnrollment]}-${row.indexToUpdate}`;
      row.createdTime = createdTime;
    });
    return rows;
  },
  keys: ["pk", "entryKey"],
};

module.exports = migration;
