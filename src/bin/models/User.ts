import api from "../services/api"
import { PropertyValidatorError, f, validatedPlainToClass } from "@marcj/marshal"
import "reflect-metadata"
import "moment"
import Pager from "../services/pagination";
import Auth from "./Auth";

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

export const UserList = {
	pager: new Pager<User>({ per_page: 12, url: "/users" }),
	list: [] as User[],
	loadList: async function(page: number = 1) {
		await UserList.pager.loadPage(page)

		UserList.list = UserList.pager.data.map((user: User) => {
			return validatedPlainToClass(User, user)
		});
	},
	reload: async function() {
		if (UserList.pager.page == null) {
			await UserList.loadList(1)
			Auth.addLogoutHook(() => {
				UserList.list = []
			})
		}
		else {
			await UserList.loadList(UserList.pager.page)
		}
	}
}

type UserList = typeof UserList

export const loadUser = async (username: string) => {
	const resp = await api.request<User>({ url: "/users/" + username, method: "GET" })
	return validatedPlainToClass(User, resp)
}

export class UserModel {
	constructor(username: string) {
		this.loadMeta(username)
		Auth.addLogoutHook(() => {
			this.meta = null
		})
	}
	loadMeta = async (username: string) => {
		try {
			const resp = await api.request<User>({ url: "/users/" + username, method: "GET" })
			this.meta = validatedPlainToClass(User, resp)
		} catch (e) {
			if (e.code == 403) {
				this.meta = null
			}
		}
	}
	meta: User
	delete = async function() {
		await api.request({
			url: "/users/" + this.meta.username,
			method: "DELETE"
		})
	}
}

