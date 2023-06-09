import m, { Component } from "mithril"
import UserModel from "../models/User"

const UserList: Component = {
	oninit: UserModel.loadList,
	view: function() {
		return m(".user-list", UserModel.list.map((user) => {
			return m(".user-list-item", user.username + " " + user.register_date.toDate() + " " + user.permissions)
		}))
	}
}

export default UserList
