import {AppSyncEvent} from './types';
import createPage from './createPage';
import deletePage from './deletePage';
import updatePage from './updatePage';
import getAllPages from './getAllPages';
import getPagesByCategory from './getPagesByCategory';


exports.handler = async (event: AppSyncEvent) => {
  switch (event.info.fieldName) {
    case 'createPage':
      return await createPage(event.arguments.page);
    case 'updatePage':
      return await updatePage(event.arguments.page);
    case 'deletePage':
      return await deletePage(event.arguments.pageId);
    case 'getAllPages':
      return await getAllPages();
    case 'getPagesByCategory':
      return await getPagesByCategory(event.arguments.category);
    
    default:
      return 'Unknown field, unable to resolve';
  }
}