export PG_DATABASE=postgres
export PG_TABLESPACE=schipdata
export PG_TABLESPACE_LOCATION=/app/pgdata
export PG_RO_ROLE=readonly
export PG_RW_ROLE=readwrite
export PG_USERS='[{"username":"mdct_app","password":"@p9P@5s","roles":["readwrite","readonly"]},{"username":"mdct_ro","password":"R09P@5s","roles":["readonly"]},{"username":"schip","password":"schip","roles":["readonly"]},{"username":"schipannualreports","password":"schipannualreports","roles":["readonly"]}]'
