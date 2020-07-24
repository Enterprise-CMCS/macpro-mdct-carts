[
  {
    "name": "api_sqlserver",
    "image": "${image}",
    "essential": true,
    "command": ["gunicorn", "hello_django.wsgi:application", "--bind", "0.0.0.0:8000"],
    "environment": [
      {
        "name": "SQLSERVER_HOST",
        "value": "${sqlserver_host}"
      },
      {
        "name": "SQLSERVER_DB",
        "value": "${sqlserver_db}"
      },
      {
        "name": "SQLSERVER_USER",
        "value": "${sqlserver_user}"
      },
      {
        "name": "SQLSERVER_PASSWORD",
        "value": "${sqlserver_password}"
      },
      {
        "name": "DATABASE",
        "value": "sqlserver"
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
