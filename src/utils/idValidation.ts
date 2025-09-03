


export const normalizeId = (id: any): string => {
  if (id === null || id === undefined) {
    throw new Error('ID cannot be null or undefined');
  }
  
  const stringId = String(id).trim();
  if (stringId === '') {
    throw new Error('ID cannot be empty');
  }
  
  return stringId;
};


export const isValidId = (id: any): id is string => {
  return typeof id === 'string' && id.trim() !== '';
};


export const hasValidIds = (obj: any, idFields: readonly string[]): boolean => {
  return idFields.every(field => isValidId(obj[field]));
};


export const normalizeObjectIds = <T extends Record<string, any>>(
  obj: T, 
  idFields: readonly (keyof T)[]
): T => {
  const normalized = { ...obj };
  idFields.forEach(field => {
    if (field in normalized) {
      normalized[field] = normalizeId(normalized[field]) as T[keyof T];
    }
  });
  return normalized;
};


export const REQUIRED_ID_FIELDS = {
  USER: ['id'] as const,
  SHOPPING_LIST: ['id', 'userId'] as const,
  SHOPPING_LIST_ITEM: ['id', 'shoppingListId'] as const,
} as const;


export const validateEntityIds = {
  user: (user: any) => hasValidIds(user, REQUIRED_ID_FIELDS.USER),
  shoppingList: (list: any) => hasValidIds(list, REQUIRED_ID_FIELDS.SHOPPING_LIST),
  shoppingListItem: (item: any) => hasValidIds(item, REQUIRED_ID_FIELDS.SHOPPING_LIST_ITEM),
};


export const normalizeEntityIds = {
  user: (user: any) => normalizeObjectIds(user, REQUIRED_ID_FIELDS.USER),
  shoppingList: (list: any) => normalizeObjectIds(list, REQUIRED_ID_FIELDS.SHOPPING_LIST),
  shoppingListItem: (item: any) => normalizeObjectIds(item, REQUIRED_ID_FIELDS.SHOPPING_LIST_ITEM),
};
