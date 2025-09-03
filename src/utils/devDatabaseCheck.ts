

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
    console.error('Database fixing is only available in development mode');
    return false;
  }

  try {
    const response = await fetch('http://localhost:3001/db');
    if (!response.ok) {
      console.error('Could not fetch database');
      return false;
    }

    const database = await response.json();
    const validationResult = validateDatabase(database);

    if (validationResult.isValid) {
      console.log('Database is already valid, no fixes needed');
      return true;
    }

    if (!validationResult.fixedData) {
      console.error('No fixed data available');
      return false;
    }


    console.log('Applying database fixes...');
    

    const fixResponse = await fetch('http://localhost:3001/db', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validationResult.fixedData),
    });

    if (fixResponse.ok) {
      console.log('Database fixes applied successfully');
      return true;
    } else {
      console.error('Failed to apply database fixes');
      return false;
    }
  } catch (error) {
    console.error('Database fix failed:', error);
    return false;
  }
};


if (process.env.NODE_ENV === 'development') {
  (window as any).checkDatabaseConsistency = checkDatabaseConsistency;
  (window as any).fixDatabaseIssues = fixDatabaseIssues;
  
  console.log('Development database utilities available:');
  console.log('  • checkDatabaseConsistency() - Validate database');
  console.log('  • fixDatabaseIssues() - Fix database issues (use with caution)');
}
