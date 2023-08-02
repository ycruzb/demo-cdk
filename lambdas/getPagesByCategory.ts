const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function getPagesByCategory(category: string) {
  let params = {
    TableName: process.env.PAGES_TABLE,
    IndexName: 'pagesByCategory',
    KeyConditionExpression: 'category = :category',
    ExpressionAttributeValues: { ':category': category }
  }

  try {
    const data = await docClient.query(params).promise();
    return data.Items;
  } catch (error) {
    console.log('DynamoDB Error: ', error);
    return null;
  }
}

export default getPagesByCategory