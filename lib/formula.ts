import { create, all } from 'mathjs';

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
