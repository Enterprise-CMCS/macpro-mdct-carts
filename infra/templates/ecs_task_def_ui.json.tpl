[
  {
    "name": "ui",
    "image": "${image}",
    "essential": true,
    "environment": [
      {
        "name": "API_POSTGRES_URL",
        "value": "${api_postgres_url}"
      },
      {
        "name": "API_SQLSERVER_URL",
        "value": "${api_sqlserver_url}"
      }
    ],
    "portMappings": [
      {
        "containerPort": 80
      }
    ]
  }
]
