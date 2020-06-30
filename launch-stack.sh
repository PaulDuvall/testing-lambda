#!/bin/bash
# sudo chmod +x *.sh
# ./launch-stack.sh

AWS_REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone | sed 's/\(.*\)[a-z]/\1/')

MYNAME=${1:-pmd}
PROJECTNAME=${2:-lambda}
TMPDIR=${3:-.tmp-gitrepo}   
S3BUCKET=${4:-$PROJECTNAME-$MYNAME}
SAMSTACK=${5:-$PROJECTNAME-$MYNAME-$AWS_REGION}
CFNSTACK=${6:-$PROJECTNAME-$MYNAME}
PIPELINEYAML=${7:-pipeline.yml}
OTHER=${8:-iam-branch}

sudo rm -rf $TMPDIR
mkdir $TMPDIR
cd $TMPDIR
git clone https://github.com/PaulDuvall/testing-lambda.git


aws s3api list-buckets --query 'Buckets[?starts_with(Name, `'$OTHER'`) == `true`].[Name]' --output text | xargs -I {} aws s3 rb s3://{} --force

aws s3api list-buckets --query 'Buckets[?starts_with(Name, `'$S3BUCKET'`) == `true`].[Name]' --output text | xargs -I {} aws s3 rb s3://{} --force


sleep 20

aws cloudformation delete-stack --stack-name $SAMSTACK

aws cloudformation wait stack-delete-complete --stack-name $SAMSTACK

aws cloudformation delete-stack --stack-name $CFNSTACK

aws cloudformation wait stack-delete-complete --stack-name $CFNSTACK


cd testing-lambda


aws cloudformation create-stack --stack-name $CFNSTACK --capabilities CAPABILITY_NAMED_IAM --disable-rollback --template-body file://$PIPELINEYAML