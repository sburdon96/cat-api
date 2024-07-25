// Same as User, could belong in a shared module if this cuts across multiple domains
export interface Cat {
  name: string;
  subscriptionActive: boolean;
  breed: string;
  pouchSize: PouchSize;
}

export type PouchSize = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export const PouchSizeCost: Record<PouchSize, number> = {
  A: 55.5,
  B: 59.5,
  C: 62.75,
  D: 66.0,
  E: 69.0,
  F: 71.25,
};
