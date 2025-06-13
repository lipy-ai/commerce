type RecursivelyReplaceNullWithUndefined<T> = T extends null
	? undefined
	: T extends Date
		? T
		: {
				[K in keyof T]: T[K] extends (infer U)[]
					? RecursivelyReplaceNullWithUndefined<U>[]
					: RecursivelyReplaceNullWithUndefined<T[K]>;
			};

export function nullsToUndefined<T>(
	obj: T,
): RecursivelyReplaceNullWithUndefined<T> {
	if (obj === null) {
		return undefined as any;
	}

	if (obj?.constructor.name === "Object") {
		for (const key in obj) {
			obj[key] = nullsToUndefined(obj[key]) as any;
		}
	}
	return obj as any;
}
