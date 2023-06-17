import m, { Component } from "mithril"
import { UserList } from "../models/User"

const UserListComp: Component = {
	oninit: () => { UserList.loadList(1) },
	view: function() {
		return m(".user-list", UserList.list.map((user) => {
			return m(".user-list-item", user.username + " " + user.register_date.toDate() + " " + user.permissions)
		}))
	}
}

export default UserListComp
