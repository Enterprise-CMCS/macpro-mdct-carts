[
  {
    "name": "ui",
    "image": "${image}",
    "essential": true,
    "environment": [
      {
        "name": "API_URL",
        "value": "${api_url}"
      }
    ],
    "portMappings": [
      {
        "containerPort": 80
      }
    ]
  }
]
