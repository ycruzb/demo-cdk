const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import { Page } from "./types";
const { v4: uuid } = require('uuid');

async function createPage(page: Page) {
  if (!page.id) {
    page.id = uuid();
  }
  const params = {
    TableName: process.env.PAGES_TABLE,
    Item: page,
  }
  try {
    await docClient.put(params).promise();
    return page;
  } catch (error) {
    console.log('DynamoDB Error: ', error);
    return null;
  }
}

export default createPage