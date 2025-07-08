export interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
  stats: Record<string, number>;
  types: string[];
}
