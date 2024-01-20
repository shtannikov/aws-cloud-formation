#!/bin/bash
yum install -y httpd
systemctl start httpd.service
systemctl enable httpd.service

sudo aws s3 cp --recursive s3://shtannikov-website /var/www/html