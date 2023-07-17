import m, { Component } from "mithril"
import { User, UserList } from "../models/User"
import { formatDate } from "../services/util"
import PageList from "./PageList"
import Auth from "../models/Auth"

const UserListComp: Component = {
	onremove: () => {
		UserList.reset()
	},
	oncreate: () => {
		if (UserList.pager.page == null) {
			if (Auth.checkPerm("ADMIN", { redirect: true })) {
				UserList.reload()
			}
		}
	},
	view: () => [
		m(".entrylist",
			m("table.entrylist-table",
				m("tr.entrylist",
					m("th", "Username"),
					m("th", "Permissions"),
					m("th", "Registration date"),
				),
				UserList.list.map(user => {
					return m(
						m.route.Link,
						{
							href: "/users/" + user.username,
							selector: "tr.entrylist-row",
						},
						m("td", m(m.route.Link, {
							href: "/users/" + user.username,
							selector: "a.entrylist-link"
						}, user.username)),
						m("td", user.permissions.join(", ")),
						m("td", formatDate({ date: user.register_date }))
					)
				}),
			),
		),
		m(new PageList<User>, { listModel: UserList })
	]
}

export default UserListComp
