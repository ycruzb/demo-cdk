const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function deletePage(pageId: string) {
  const params = {
    TableName: process.env.PAGES_TABLE,
    Key: { id: pageId },
  }
  try {
    await docClient.delete(params).promise();
    return pageId;
  } catch (error) {
    console.log('DynamoDB Error: ', error);
    return null;
  }
}

export default deletePage