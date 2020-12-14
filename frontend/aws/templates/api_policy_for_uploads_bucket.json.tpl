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
        }
    ]
}