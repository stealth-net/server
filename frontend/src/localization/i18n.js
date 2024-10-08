import en_US from './locales/en_US';
import uk_UA from './locales/uk_UA';
import uk_GA from './locales/uk_GA';
import be_BY from './locales/be_BY';
import be_LA from './locales/be_LA';
import be_PL from './locales/be_PL';
import ru_RU from './locales/ru_RU';

const translations = {
  en_US,
  uk_UA,
  uk_GA,
  be_BY,
  be_LA,
  be_PL,
  ru_RU
}

let currentLanguage = localStorage.getItem('language');
if (!currentLanguage) {
  currentLanguage = 'en_US';
  localStorage.setItem('language', currentLanguage);
}

export const setLanguage = (language) => {
  if (translations[language]) {
    currentLanguage = language;
  } else {
    console.warn(`Language '${language}' not supported. Falling back to default.`);
  }
}

export const t = (key, params = {}) => {
  let translation = translations[currentLanguage][key];
  
  if (translation === undefined) {
    console.warn(`Translation key '${key}' not found for language '${currentLanguage}'.`);
    return key;
  }

  return Object.entries(params).reduce((str, [key, value]) => 
    str.replace(new RegExp(`{{${key}}}`, 'g'), value), translation);
}

export const getCurrentLanguage = () => currentLanguage;
export const getSupportedLanguages = () => Object.keys(translations);