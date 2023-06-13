import api from "../services/api"
import { PropertyValidatorError, f, validatedPlainToClass } from "@marcj/marshal"
import "reflect-metadata"
import "moment"
import Pager from "../services/pagination";

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

const UserList = {
	page: new Pager<User>({ per_page: 3, url: "/users" }),
	list: [] as User[],
	loadList: async function(page: number = 1) {
		await UserList.page.loadPage(page)

		UserList.list = UserList.page.data.map((user: User) => {
			return validatedPlainToClass(User, user)
		});
	}
}

type UserList = typeof UserList

export default UserList
