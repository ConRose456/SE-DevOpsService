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