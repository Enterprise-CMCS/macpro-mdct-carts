[
  {
    "name": "ui",
    "image": "${image}",
    "essential": true,
    "environment": [
      {
        "name": "API_POSTGRES_URL",
        "value": "${api_url}"
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
        "containerPort": 80
      }
    ]
  }
]
