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

Lambda is needed for helping with running serverless Next.js backend operations. If you prefer to use a server, you will need to deploy the Next.js server, and change all AWS SDK logic to something else (Like Axios for example) for managing APIs. If you would like to use the tools above you will need working knowledge on how to configure S3 or Amplify for deployments, Route 53 for DNS, and Cloudfront for traffic management. IAM is required to get any of these to work, as S3 will always be the data storage center unless you are using your own.

# Final Notes
You will need to set up your own .env file and variables as those are not included in this project. If you do not want to use AWS remember that Next.js is a FullStack framework... So you really don't need to change much.

If you are confused on what to install to get this running initially then you can paste this README into a chat with AI (like Copilot, it is on EVERY windows device now, or you can use it on https://copilot.microsoft.com/), and use the following as a prompt:

"I need help with getting this cloned app from GitHub working for testing. To make this simpler, I would like your help in the following areas:

* What would I run to install the dependencies for the packages listed above in the Tech Stack section using [Insert Terminal Type Here (ex. PowerShell or BASH)]? And also, how would I proceed with running/building the application for testing?
* How would I deploy this application using AWS S3, Route 53, and CloudFront based on the description given above in the Other Knowledge Needed section?
* How can I set up Next.js APIs with Lambda?

Thank you for checking out the project, and as every React app README ends, HAPPY HACKING!!!
