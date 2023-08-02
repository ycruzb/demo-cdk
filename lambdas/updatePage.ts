const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

type Params = {
  TableName: string | undefined,
  Key: string | {},
  ExpressionAttributeValues: any,
  ExpressionAttributeNames: any,
  UpdateExpression: string,
  ReturnValues: string,
}

async function updatePage(page: any) {
  let params: Params = {
    TableName: process.env.PAGES_TABLE,
    Key: { id: page.id },
    UpdateExpression: '',
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {},
    ReturnValues: 'UPDATED_NEW',
  }
  let prefix = 'set '
  let attributes = Object.keys(page)
  for (let i = 0; i < attributes.length; i++) {
    let attribute = attributes[i]
    if (attribute !== 'id') {
      params['UpdateExpression'] += prefix + '#' + attribute + ' = :' + attribute
      params['ExpressionAttributeValues'][':' + attribute] = page[attribute]
      params['ExpressionAttributeNames']['#' + attribute] = attribute
      prefix = ', '
    }
  }
  try {
    await docClient.update(params).promise()
    return page
  } catch (error) {
    console.log('DynamoDB Error: ', error)
    return null
  }
}

export default updatePage