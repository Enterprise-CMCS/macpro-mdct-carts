[
  {
    "name": "api",
    "image": "${image}",
    "essential": true,
    "environment": [
      {
        "name": "POSTGRES_HOST",
        "value": "${postgres_host}"
      },
      {
        "name": "POSTGRES_DB",
        "value": "${postgres_db}"
      },
      {
        "name": "POSTGRES_USER",
        "value": "${postgres_user}"
      },
      {
        "name": "POSTGRES_PASSWORD",
        "value": "${postgres_password}"
      },
      {
        "name": "DATABASE",
        "value": "postgres"
      }
    ],
    "portMappings": [
      {
        "containerPort": 8000
      }
    ]
  }
]
