#!/bin/bash

aws s3 cp /app/build s3://cartsui-cloudfront-origin --recursive
