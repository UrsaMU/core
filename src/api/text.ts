export interface TextEntry {
  name: string;
  category: string;
  body: string;
}

export const textDB = new Map<string, TextEntry[]>();

export const addText = (cat: string, entry: TextEntry) => {
  if (textDB.has(cat)) {
    textDB.get(cat)!.push(entry);
  } else {
    textDB.set(cat, []);
    textDB.get(cat)!.push(entry);
  }
};
