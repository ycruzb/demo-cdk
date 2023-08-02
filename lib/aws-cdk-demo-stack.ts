import {Stack, StackProps, Expiration, Duration, CfnOutput, aws_cognito as cognito, aws_appsync as appsync, aws_lambda as lambda, aws_dynamodb as ddb} from 'aws-cdk-lib';
import { Construct } from 'constructs';


export class AwsCdkDemoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /* const userPool = new cognito.UserPool(this, 'cdk-demo-user-pool', {
      selfSignUpEnabled: true,
      accountRecovery: cognito.AccountRecovery.PHONE_AND_EMAIL,
      userVerification: {
        emailStyle: cognito.VerificationEmailStyle.CODE,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      }
    })

    const userPoolClient = new cognito.UserPoolClient(this, 'cdk-demo-user-pool-client', {
      userPool,
    }) */

    const api = new appsync.GraphqlApi(this, 'cdk-demo-api', {
      name: 'cdk-demo-api',
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ALL,
      },
      schema: appsync.SchemaFile.fromAsset('./graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: Expiration.after(Duration.days(365))
          }
        },
        /* additionalAuthorizationModes: [{
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool,
          }
        }] */
      },
    })

    const pagesLambda = new lambda.Function(this, 'AppSyncPagesHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('./lambdas'),
      memorySize: 1024,
    })

    const pagesLambdaDataSource = new appsync.LambdaDataSource(this, 'AppSyncPagesDataSource', {
      api,
      lambdaFunction: pagesLambda,
    })

    pagesLambdaDataSource.createResolver('createPage', {
      typeName: 'Mutation',
      fieldName: 'createPage',
    })
    pagesLambdaDataSource.createResolver('updatePage', {
      typeName: 'Mutation',
      fieldName: 'updatePage',
    })
    pagesLambdaDataSource.createResolver('deletePage', {
      typeName: 'Mutation',
      fieldName: 'deletePage',
    })

    pagesLambdaDataSource.createResolver('getAllPages', {
      typeName: 'Query',
      fieldName: 'getAllPages',
    })
    pagesLambdaDataSource.createResolver('getPagesByCategory', {
      typeName: 'Query',
      fieldName: 'getPagesByCategory',
    })

    const pagesTable = new ddb.Table(this, 'PagesTable', {
      partitionKey: {
        name: 'url',
        type: ddb.AttributeType.STRING,
      },
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
    })

    pagesTable.addGlobalSecondaryIndex({
      indexName: 'pagesByCategory',
      partitionKey: {
        name: 'category',
        type: ddb.AttributeType.STRING,
      },
    })
    

    pagesTable.grantFullAccess(pagesLambda)

    pagesLambda.addEnvironment('PAGES_TABLE', pagesTable.tableName)

    new CfnOutput(this, 'GraphQLAPIURL', {
      value: api.graphqlUrl
    })

    new CfnOutput(this, 'AppSyncAPIKey', {
      value: api.apiKey || ''
    })

    new CfnOutput(this, 'ProjectRegion', {
      value: this.region
    })

    /* new CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId
    })

    new CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId
    }) */

  }
}
