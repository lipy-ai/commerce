import { deepEqual } from "fast-equals";

export function diffById<T extends { id: string }>(oldArr: T[], newArr: T[]) {
	const added: T[] = [];
	const updated: { old: T; updated: T }[] = [];
	const deleted: T[] = [];

	const oldMap = new Map(oldArr.map((o) => [o.id, o]));
	const newMap = new Map(newArr.map((n) => [n.id, n]));

	// Detect additions and updates
	for (const [id, newItem] of newMap) {
		const oldItem = oldMap.get(id);
		if (!oldItem) {
			added.push(newItem);
		} else if (!deepEqual(oldItem, newItem)) {
			updated.push({ old: oldItem, updated: newItem });
		}
	}

	// Detect deletions
	for (const [id, oldItem] of oldMap) {
		if (!newMap.has(id)) {
			deleted.push(oldItem);
		}
	}

	return { added, updated, deleted };
}
