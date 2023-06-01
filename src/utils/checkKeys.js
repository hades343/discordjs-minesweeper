function checkKeys(object, keys) {
	const missingKeys = [];

	for (const key of keys) {
		if (!(key in object)) {
			missingKeys.push(key);
		}
	}

	return missingKeys;
}

export { checkKeys };
