import { model, Schema } from 'mongoose';

const userSchema = new Schema({
	user_id: {
		type: String,
		required: true,
	},
	guild_id: {
		type: String,
		required: true,
	},
	score: {
		type: Number,
		default: 0,
	},
	games: {
		type: Number,
		default: 0,
	},
	wins: {
		type: Number,
		default: 0,
	},
	loses: {
		type: Number,
		default: 0,
	},
	wr: {
		type: Number,
		default: 0,
	},
});

userSchema.pre('save', function (next) {
	if (this.isModified('wins') || this.isModified('loses') || this.isModified('games')) {
		const wr = this.wins === 0 ? 0 : (this.wins / this.games) * 100;
		const completed = this.games - (this.games - this.wins - this.loses);

		this.wr = wr;
		this.score = (completed ** 0.5 * wr ** 1.33) / 10;
	}

	next();
});

const User = model('User', userSchema);

export { User };
