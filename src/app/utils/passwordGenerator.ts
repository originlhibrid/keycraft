// Common, memorable words for passphrases
// Removed commonWords array

const symbols = '!@#$%^&*';
const numbers = '0123456789';

// Base words to get synonyms for
const baseWords = [
  'happy', 'strong', 'bright', 'quick', 'calm',
  'brave', 'wise', 'kind', 'free', 'pure'
];

async function getRandomWord(): Promise<string> {
  const randomBase = baseWords[Math.floor(Math.random() * baseWords.length)];
  const url = `https://wordsapiv1.p.rapidapi.com/words/${randomBase}/synonyms`;
  
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'eaecf8e815msh22bd5b7f9114d62p182083jsn6f8876fbfc88',
      'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (data.synonyms && data.synonyms.length > 0) {
      // Get a random synonym from the list
      const randomIndex = Math.floor(Math.random() * data.synonyms.length);
      return data.synonyms[randomIndex];
    }
    
    // If no synonyms found, return the base word
    return randomBase;
  } catch (error) {
    console.error('Error fetching word:', error);
    // Fallback to the base word if API fails
    return randomBase;
  }
}

export const generatePassphrase = async (
  wordCount: number = 4,
  includeNumbers: boolean = true,
  includeSymbols: boolean = false
): Promise<string> => {
  const selectedWords: string[] = [];
  
  // Generate base passphrase
  for (let i = 0; i < wordCount; i++) {
    const word = await getRandomWord();
    // Capitalize first letter
    selectedWords.push(word.charAt(0).toUpperCase() + word.slice(1));
  }

  // Add a random number if requested
  if (includeNumbers) {
    const randomNum = numbers.charAt(Math.floor(Math.random() * numbers.length));
    selectedWords.push(randomNum);
  }

  // Add a random symbol if requested
  if (includeSymbols) {
    const randomSymbol = symbols.charAt(Math.floor(Math.random() * symbols.length));
    selectedWords.push(randomSymbol);
  }

  // Shuffle the array to make the position of numbers and symbols random
  for (let i = selectedWords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selectedWords[i], selectedWords[j]] = [selectedWords[j], selectedWords[i]];
  }

  return selectedWords.join('-');
};

export const generateAlphanumeric = (
  length: number,
  includeUppercase: boolean,
  includeNumbers: boolean,
  includeSymbols: boolean
): string => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let chars = lowercase;
  if (includeUppercase) chars += uppercase;
  if (includeNumbers) chars += numbers;
  if (includeSymbols) chars += symbols;

  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
