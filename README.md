# RifRaf
RifRaf is a Social Media App made with Next.js and AWS made to compare with platforms like TikTok and Instagram.

# Tech Stack
To Run/Build this application will require all of the following tools/packages and their required dependencies:

* Node Package Manager
* Next
* React, React Player, and React Icons
* AWS-SDK
* HandBrake

# Other Knowledge Needed
You will not be able to use this application with its current configurations at all without working knowledge of AWS, especially with the following tools:

* S3
* Route 53
* CloudFront
* Lambda
* IAM

Lambda is required for helping with running serverless Next.js backend operations. If you prefer to use a server, you will need to deploy it separately using whatever system you want, and change all AWS SDK logic to something else (Like Axios for example) for managing APIs. If you would like to use the tools above you will need working knowledge on how to configure S3 or Amplify for deployments, Route 53 for DNS, and Cloudfront for traffic management. IAM is required to get any of these to work, as S3 will always be the data storage center unless you are using your own.
