import { TConditionNode, TColumnOperation, GeoPoint } from 'pa-typings';

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

export function isContinuous(type: string): boolean {
  return (
    type === 'Integer' ||
    type === 'Numeric' ||
    type === 'Duration' ||
    type === 'DateTime'
  );
}

export function isBoolean(type: string): boolean {
  return type == 'Bool';
}

export function isGeoPoint(arg: unknown): arg is GeoPoint {
  return arg instanceof Object && 'latitude' in arg && 'longitude' in arg && 'elevation' in arg;
}

export function geoToString(value: GeoPoint, stringify = (v: number) => String(v)) {
  const { latitude, longitude, elevation } = value;
  return `{${[latitude, longitude, elevation].map(stringify).join('; ')}}`;
}

export function getTConditionValue(value: unknown, type?: string) {
  const isNumericValue = type ? isContinuous(type) || isBoolean(type) : typeof value != 'string';
  if (isNumericValue) {
    return { dVal: Number(value) };
  } else if (type == 'String') {
    const val = value == null ? undefined : String(value);
    return { val };
  } else {
    const val = type == 'Geo' && isGeoPoint(value) ? geoToString(value) : String(value);
    return { val };
  }
}
