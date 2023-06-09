import api from "../services/api"
import { PropertyValidatorError, f, validatedPlainToClass } from "@marcj/marshal"
import "reflect-metadata"
import "moment"

export enum Permissions {
	CREATE,
	MODIFY,
	DELETE,
	LOCK,
	LIST,
	READ,
	ADMIN
}

export class User {
	@f.primary()
	username: string;
	@f.moment()
	register_date: moment.Moment
	@f.validator((perms: any) => {
		for (const perm of perms) {
			if (Permissions[perm] === undefined) {
				return new PropertyValidatorError("invalid_perm", `Invalid permission name: ${perm}`)
			}
		}
	})
	permissions: Permissions[]
}

const UserModel = {
	list: [] as User[],
	loadList: async function() {
		const result = await api.request<{ data: User[] }>({
			method: "GET",
			url: "http://localhost:5000/users",
			params: {
				"page": "1",
				"per_page": "300"
			}
		})

		UserModel.list = result.data.map((raw: any) => {
			return validatedPlainToClass(User, raw)
		});
	}
}

type UserModel = typeof UserModel

export default UserModel
