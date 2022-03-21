{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "s3:*",
            "Resource": [
                "${uploads_bucket_arn}/*",
                "${uploads_bucket_arn}"
            ]
        },
        {
            "Effect": "Allow",
            "Action": "execute-api:Invoke",
            "Resource": "arn:aws:execute-api:us-east-1:635052997545:y5pywiyrb7/*/POST/prince"
        }
    ]
}