import { User } from '../../models/User.js';

async function getUserData(filter = {}) {
	let user = await User.findOne(filter);
	if (!user) {
		user = new User(filter);
		await user.save();
	}
	return user;
}

export { getUserData };
