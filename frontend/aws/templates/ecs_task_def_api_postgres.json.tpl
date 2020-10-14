[
  {
    "name": "api_postgres",
    "image": "${image}",
    "essential": true,
    "command": ["gunicorn", "carts.wsgi:application", "--bind", "0.0.0.0:8000"],
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
      },
      {
        "name": "POSTGRES_API_URL",
        "value": "${postgres_api_url}"
      },
      {
        "name": "S3_UPLOADS_BUCKET_NAME",
        "value": "${s3_uploads_bucket_name}"
      }
    ],
    "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
            "awslogs-group": "${cloudwatch_log_group}",
            "awslogs-region": "us-east-1",
            "awslogs-stream-prefix": "${cloudwatch_stream_prefix}"
        }
    },
    "portMappings": [
      {
        "containerPort": 8000
      }
    ]
  }
]
