import m, { Component } from "mithril"
import Auth, { permissions } from "../models/Auth"

const HomeView: Component = {
	view: () => {
		return [
			m("p", "Welcome to Sachet!"),
			Auth.permissions.length > 0 ?
				m("p", "You can currently:",
				  Auth.permissions.map((perm) => {
					  return m("li", permissions[perm].desc)
				  })
				) :
				m("p", "You currently have no permissions. Contact an administrator for more details.")
		]
	}
}

export default HomeView
