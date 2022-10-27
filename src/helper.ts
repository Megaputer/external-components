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
