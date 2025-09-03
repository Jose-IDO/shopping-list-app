

import { validateEntityIds, normalizeEntityIds } from './idValidation';

export interface DatabaseValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fixedData?: any;
}


export const validateDatabase = (database: any): DatabaseValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  let fixedData: any = { ...database };


  if (database.users && Array.isArray(database.users)) {
    database.users.forEach((user: any, index: number) => {
      if (!validateEntityIds.user(user)) {
        errors.push(`User at index ${index} has invalid ID: ${user.id}`);

        fixedData.users[index] = normalizeEntityIds.user(user);
      }
    });
  } else {
    warnings.push('No users found in database');
  }


  if (database.shoppingLists && Array.isArray(database.shoppingLists)) {
    database.shoppingLists.forEach((list: any, index: number) => {
      if (!validateEntityIds.shoppingList(list)) {
        errors.push(`Shopping list at index ${index} has invalid IDs: id=${list.id}, userId=${list.userId}`);

        fixedData.shoppingLists[index] = normalizeEntityIds.shoppingList(list);
      }
    });
  } else {
    warnings.push('No shopping lists found in database');
  }


  if (database.items && Array.isArray(database.items)) {
    database.items.forEach((item: any, index: number) => {
      if (!validateEntityIds.shoppingListItem(item)) {
        errors.push(`Item at index ${index} has invalid IDs: id=${item.id}, shoppingListId=${item.shoppingListId}`);

        fixedData.items[index] = normalizeEntityIds.shoppingListItem(item);
      }


      if (!item.name || item.name.trim() === '') {
        errors.push(`Item at index ${index} is missing required 'name' field`);
      }
      if (item.quantity === undefined || item.quantity === null) {
        errors.push(`Item at index ${index} is missing required 'quantity' field`);
      }
      if (!item.category || item.category.trim() === '') {
        errors.push(`Item at index ${index} is missing required 'category' field`);
      }
    });
  } else {
    warnings.push('No items found in database');
  }


  if (database.shoppingLists && database.items) {
    const listIds = new Set(database.shoppingLists.map((list: any) => String(list.id)));
    const userIds = new Set(database.users?.map((user: any) => String(user.id)) || []);

    database.items.forEach((item: any, index: number) => {
      if (!listIds.has(String(item.shoppingListId))) {
        errors.push(`Item at index ${index} references non-existent shopping list: ${item.shoppingListId}`);
      }
    });

    database.shoppingLists.forEach((list: any, index: number) => {
      if (!userIds.has(String(list.userId))) {
        errors.push(`Shopping list at index ${index} references non-existent user: ${list.userId}`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    fixedData: errors.length > 0 ? fixedData : undefined,
  };
};


export const validateEntity = (entity: any, type: 'user' | 'shoppingList' | 'shoppingListItem'): DatabaseValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!validateEntityIds[type](entity)) {
    errors.push(`${type} has invalid IDs`);
    return {
      isValid: false,
      errors,
      warnings,
      fixedData: normalizeEntityIds[type](entity),
    };
  }


  if (type === 'shoppingListItem') {
    if (!entity.name || entity.name.trim() === '') {
      errors.push('Item is missing required "name" field');
    }
    if (entity.quantity === undefined || entity.quantity === null) {
      errors.push('Item is missing required "quantity" field');
    }
    if (!entity.category || entity.category.trim() === '') {
      errors.push('Item is missing required "category" field');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};


export const logValidationResults = (result: DatabaseValidationResult): void => {
  console.group('🔍 Database Validation Results');
  
  if (result.isValid) {
    console.log('✅ Database is valid!');
  } else {
    console.error('❌ Database has errors:');
    result.errors.forEach(error => console.error(`  • ${error}`));
  }

  if (result.warnings.length > 0) {
    console.warn('⚠️ Warnings:');
    result.warnings.forEach(warning => console.warn(`  • ${warning}`));
  }

  if (result.fixedData) {
    console.log('🔧 Fixed data available - use result.fixedData to update database');
  }

  console.groupEnd();
};
