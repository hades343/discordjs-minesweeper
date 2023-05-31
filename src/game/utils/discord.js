function createThread(forum, message, name, tags = []) {
	return forum.threads.create({
		name,
		autoArchiveDuration: 10080,
		message,
		appliedTags: tags,
	});
}

function getChannelById(client, id) {
	return client.channels.cache.get(id);
}

export { createThread, getChannelById };
