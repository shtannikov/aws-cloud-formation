# Task

## What to do

The purpose of this module is to get knowledge about CloudFormation and prepare a CloudFormation template (YAML or JSON based) with the whole AWS architecture you will need to complete future modules.
After that all resources will be handled by CloudFormation and you will be able to easily delete the resources when you don't need them and create at any time. Such automation could save your budget.

In the next modules you will be able to scale your CloudFormation template by adding new resources.

The AWS architecture that should be implemented with Cloud Formation template is below:

![cf-app-infrastructure](https://github.com/shtannikov/aws-cloud-formation/assets/31800676/7a14b2f9-556a-4d7b-944c-6dde2dbc7039)

### Sub-task 1 – Create a Cloud Formation template

1. Add a S3 bucket:
   - Use _AWS::S3::Bucket_ resource type.
   - The name doesn't include uppercase characters.
   - The name includes your full name.
   - The name begins with a letter.
2. Add a VPC:
   - Use _AWS::EC2::VPC_ resource type.
   - The name should follow this convention _\<ProjectName\>-Network_ (note that the name is set using keypair tag and this requirement does not apply to the resource Logical ID).
   - The CIDR block should be _10.0.0.0/16_.
   - Add an InternetGateway in the VPC:
      - Use _AWS::EC2::InternetGateway_.
      - The name should follow this convention _\<ProjectName\>-InternetGateway_ (note that the name is set using keypair tag and this requirement does not apply to the resource Logical ID).
      - Attach _AWS::EC2::InternetGateway_ to the _\<ProjectName\>-Network_ VPC using _AWS::EC2::VPCGatewayAttachment_.
   - Add a Public Subnet A in the VPC:
      - Use _AWS::EC2::Subnet_ resource type.
      - The name should follow this convention _\<ProjectName\>-PublicSubnet-A_ (note that the name is set using keypair tag and this requirement does not apply to the resource Logical ID).
      - The CIDR block should be _10.0.11.0/24_.
      - Availability zone should be set up using _[GetAZs](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-getavailabilityzones.html)_.
      - Assign _\<ProjectName\>-PublicSubnet-A_ to the _\<ProjectName\>-Network_ VPC.
   - Add a Public Subnet B in the VPC:
      - Use _AWS::EC2::Subnet_ resource type.
      - The name should follow this convention _\<ProjectName\>-PublicSubnet-B_ (note that the name is set using keypair tag and this requirement does not apply to the resource Logical ID).
      - The CIDR block should be _10.0.12.0/24_.
      - Availability zone should be set up using _[GetAZs](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-getavailabilityzones.html)_.
      - Assign _\<ProjectName\>-PublicSubnet-B_ to the _\<ProjectName\>-Network_ VPC.
   - Set up public routing:
      - Add route table using _AWS::EC2::RouteTable_.
      - The name should follow this convention _<ProjectName>-RouteTable_ (note that the name is set using keypair tag and this requirement does not apply to the resource Logical ID).
      - Assign _<ProjectName>-PublicRouteTable_ to the _\<ProjectName\>-Network_ VPC.
      - Add route using _AWS::EC2::Route_ (note that route should be created after internet gateway).
      - Assign _<ProjectName>-RouteTable_ and _\<ProjectName\>-InternetGateway_ for created route.
      - Set up destination CIDR block for created route.
      - Add subnet associations with route table for _\<ProjectName\>-PublicSubnet-A_ and _\<ProjectName\>-PublicSubnet-B_ using _AWS::EC2::SubnetRouteTableAssociation_.
3. Add a Linux-based EC2 instance:
   - Add and configure a security group so that:
     - Use _AWS::EC2::SecurityGroup_ resource type.
     - The name should follow this convention _\<ProjectName\>-SecGr1_. (note that the name is set using keypair tag and this requirement does not apply to the resource Logical ID).
     - Assign _\<ProjectName\>-SecGr1_ to the _\<ProjectName\>-Network_ VPC.
     - It allows access over HTTP/HTTPS from anywhere (better use _AWS::EC2::SecurityGroupIngress_ resource type for that).
     - It allows SSH connections from your IP address only.
     - Note: If you plan to deploy the application to some other port, then you need to add one more _AWS::EC2::SecurityGroupIngress_ resource type for that port. (Ex. TCP 8080 for backend app)
   - Add launch template for EC2:
     - Use _AWS::EC2::LaunchTemplate_ resource type.
     - The name should follow this convention _\<ProjectName\>-LaunchTemplate_. (note that the name is set using keypair tag and this requirement does not apply to the resource Logical ID).
     - Add parameter for AMI (use custom AMI with your application that was created in [EC2](../ec2/README.md) module). More info about Cloud Formation parameters can be found [here](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html).
     - The parameter name should follow this convention _\<ProjectName\>-AMI_.
     - Set up the instance AMI using _\<ProjectName\>-AMI_ parameter.
     - Add parameter for instance type (use free-tier instance type). More info about Cloud Formation parameters can be found [here](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html).
     - The parameter name should follow this convention _\<ProjectName\>-InstanceType_.
     - Set up the instance type using _\<ProjectName\>-InstanceType_ parameter.
   - Add an auto-scaling group:
     - Use _AWS::AutoScaling::AutoScalingGroup_ resource type.
     - The name should follow this convention _\<ProjectName\>-AutoScalingGroup_ (note that the name is set using keypair tag and this requirement does not apply to the resource Logical ID).
     - Assign _\<ProjectName\>-LaunchTemplate_ to the _\<ProjectName\>-AutoScalingGroup_ ASG.
     - Assign _\<ProjectName\>-PublicSubnet-A_ and _\<ProjectName\>-PublicSubnet-B_ subnets.
     - Scale out when CPU usage is more than 50%.
   - Add an application load balancer to the auto-scaling group:
     - Use _AWS::ElasticLoadBalancingV2::LoadBalancer_ resource type.
     - The name should follow this convention _\<ProjectName\>-LoadBalancer_ (note that the name is set using keypair tag and this requirement does not apply to the resource Logical ID).
     - Assign _\<ProjectName\>-PublicSubnet-A_ and _\<ProjectName\>-PublicSubnet-B_ subnets.
     - Set up ALB listener using _AWS::ElasticLoadBalancingV2::Listener_.
     - Set up ALB target group using _AWS::ElasticLoadBalancingV2::TargetGroup_.
