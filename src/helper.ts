import { TConditionNode, TColumnOperation } from 'pa-typings';

export function joinConditions(op: TColumnOperation, conditions: TConditionNode[]): TConditionNode {
  if (conditions.length === 0) {
    return {};
  }
  if (conditions.length === 1) {
    return conditions[0];
  }
  return {
    op,
    children: conditions
  };
}

export function joinAnd(conditions: TConditionNode[]): TConditionNode {
  return joinConditions(TColumnOperation.co_AND, conditions);
}

export function joinOr(conditions: TConditionNode[]): TConditionNode {
  return joinConditions(TColumnOperation.co_OR, conditions);
}

const BASE_DATE = Date.UTC(1899, 11, 30);
const S_PER_DAY = 24 * 3600;
const MS_PER_DAY = S_PER_DAY * 1000;
export function variantToDate(daysAfterBaseDate: number, dateOnly?: boolean): Date {
  const ms = dateOnly ? MS_PER_DAY * Math.trunc(daysAfterBaseDate) : Math.round(MS_PER_DAY * daysAfterBaseDate);
  return new Date(BASE_DATE + ms);
}
