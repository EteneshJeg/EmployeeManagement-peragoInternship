export interface Position {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  children?: Position[];
}

export function generateUniqueId(): string {
  return "id-" + Math.random().toString(36).substr(2, 9);
}

export function findParent(items: Position[], id: string): Position | undefined {
  for (const item of items) {
    if (item.id === id) {
      return item;
    }
    if (item.children) {
      const found = findParent(item.children, id);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}
