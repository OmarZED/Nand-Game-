export { validateLevel1 } from './validateLevel1';
export { validateLevel2 } from './validateLevel2';
export { validateLevel3 } from './validateLevel3';
export { validateLevel4 } from './validateLevel4';
export { validateLevel5 } from './validateLevel5';
export { validateLevel6 } from './validateLevel6';
export { validateLevel7 } from './validateLevel7';
export { validateLevel8 } from './validateLevel8';
export { validateLevel9 } from './validateLevel9';
export{validateLevelHalfAdder }from'./validateLevelHalfAdder';

/**
 * Dynamically resolve the validator function based on the level ID
//  * @param {string} levelId - The level ID (e.g., 'level1', 'level2')
//  * @returns {Promise<Function|null>} The validator function or null if not found
//  */
export const getValidator = async (levelId) => {
  try {
    // Dynamically import the validator module
    const module = await import(`./validate${capitalize(levelId)}.js`);
    return module.default;
  } catch (error) {
    console.error(`No validator found for level: ${levelId}`);
    return null;
  }
};

/**
 * Helper function to capitalize the first letter of a string
//  * @param {string} str - The input string
//  * @returns {string} The capitalized string
//  */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}