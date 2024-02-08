import { all, create } from 'mathjs';

const animeFormula = 'formula-anime';
const mangaFormula = 'formula-manga';

export const DefaultFormula = '(art*0.3) + (story*0.4) + (sound*0.3)';

export const saveUserFormula = (type: string, formula: string) => {
  localStorage.setItem(type === 'anime' ? animeFormula : mangaFormula, formula);
};

export const getUserFormula = (type: string): string => {
  return localStorage.getItem(type === 'anime' ? animeFormula : mangaFormula) || DefaultFormula;
};

export const isFormulaValid = (formula: string): boolean => {
  try {
    const math = create(all);
    math.compile(formula);
    return true;
  } catch (err) {
    return false;
  }
};

export const calculateFormula = (formula: string, vars: { [v: string]: number }): number => {
  try {
    const math = create(all);
    return math.evaluate(formula, vars);
  } catch (err) {
    return 0;
  }
};

export const extractVarFromFormula = (formula: string): Array<string> => {
  return formula.match(/[a-zA-Z_]+/g) || [];
};
