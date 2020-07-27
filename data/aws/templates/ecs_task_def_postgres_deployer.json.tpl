[
  {
    "name": "postgres_deployer",
    "image": "${image}",
    "essential": true,
    "environment": [
      {
        "name": "POSTGRES_HOST",
        "value": "${postgres_host}"
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
        "name": "POSTGRES_DB",
        "value": "${postgres_db}"
      }
    ],
    "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
            "awslogs-group": "${cloudwatch_log_group}",
            "awslogs-region": "us-east-1",
            "awslogs-stream-prefix": "${cloudwatch_stream_prefix}"
        }
    }
  }
]
