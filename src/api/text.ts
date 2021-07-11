export interface TextEntry {
  name: string;
  category: string;
  body: string;
}

export const textDB = new Map<string, TextEntry[]>();

export const addCategory = (cat: string) => {
  if (!textDB.has(cat.toLowerCase())) textDB.set(cat.toLowerCase(), []);
};

export const addText = (cat: string, entry: TextEntry) => {
  if (textDB.has(cat)) {
    textDB.get(cat)!.push(entry);
  } else {
    throw new Error("Category doesn't exist.");
  }
};
