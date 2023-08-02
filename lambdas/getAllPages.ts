const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function getAllPages() {
  const params = {
    TableName: process.env.PAGES_TABLE,
  }
  try {
    const data = await docClient.scan(params).promise();
    return data.Items;
  } catch (error) {
    console.log('DynamoDB Error: ', error);
    return null;
  }
}

export default getAllPages