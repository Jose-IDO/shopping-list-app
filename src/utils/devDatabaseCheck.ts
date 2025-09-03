

import { validateDatabase } from './databaseValidator';


export const checkDatabaseConsistency = async (): Promise<void> => {

  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  try {

    const response = await fetch('http://localhost:3001/db');
    if (!response.ok) {
      return;
    }

    const database = await response.json();
    const validationResult = validateDatabase(database);

    if (!validationResult.isValid) {
      return;
    }
  } catch (error) {
    return;
  }
};


export const fixDatabaseIssues = async (): Promise<boolean> => {
  if (process.env.NODE_ENV !== 'development') {
    return false;
  }

  try {
    const response = await fetch('http://localhost:3001/db');
    if (!response.ok) {
      return false;
    }

    const database = await response.json();
    const validationResult = validateDatabase(database);

    if (validationResult.isValid) {
      return true;
    }

    if (!validationResult.fixedData) {
      return false;
    }

    const fixResponse = await fetch('http://localhost:3001/db', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validationResult.fixedData),
    });

    if (fixResponse.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};


if (process.env.NODE_ENV === 'development') {
  (window as any).checkDatabaseConsistency = checkDatabaseConsistency;
  (window as any).fixDatabaseIssues = fixDatabaseIssues;
}
