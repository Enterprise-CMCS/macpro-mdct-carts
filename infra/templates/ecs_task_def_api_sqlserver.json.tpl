[
  {
    "name": "api_sqlserver",
    "image": "${image}",
    "essential": true,
    "command": ["gunicorn", "hello_django.wsgi:application", "--bind", "0.0.0.0:8001"],
    "portMappings": [
      {
        "containerPort": 8001
      }
    ]
  }
]
