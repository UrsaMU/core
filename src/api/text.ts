export interface TextEntry {
  name: string;
  category: string;
  body: string;
  visible?: boolean;
  lock?: string;
  desc?: string;
}

export type ITextDB = { [key: string]: any };

const textDB: ITextDB = {};
export { textDB };
