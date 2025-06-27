## DevOpsService
This is the back end graphwl service for DevOpsCDK project.

### Build
To build the project run:

`npm run build`

When testing you can run:

`npm run test`

To update the schema type definitions you need to run the following command:

`npm run build:graphql`

### Dev Server
To start the dev server run this command then vist https://studio.apollographql.com/sandbox/explorer. You will need to enter the localhost domain you dev server is running on the the top left of the page. You will be able to send queries to the back end service using the graphql playground. This can be used to test the schema and resovler out puts.

`npm run start`

You will need to have deployed to beta before running the back end dev server so you have data to read and write:

Secret keys can be found in the written report:
```
export AWS_ACCESS_KEY_ID=your_access_key_id
export AWS_SECRET_ACCESS_KEY=your_secret_access_key
export AWS_DEFAULT_REGION=eu-west-2
```

You will also need to export some env variables:
```
export LOCAL_SECRET=<some test secret>
export STAGE=Beta
export CLOUDFORMATION_DOMAIN=https://d1bp0xz6hl332p.cloudfront.net
```