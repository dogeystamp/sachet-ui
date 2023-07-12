import m, { Component } from "mithril";

export const permissions = {
	"READ": {
		desc: "Read any share."
	},
	"LIST": {
		desc: "See the list of all shares on this server."
	},
	"CREATE": {
		desc: "Create shares / upload files."
	},
	"MODIFY": {
		desc: "Modify your own shares and their metadata."
	},
	"DELETE": {
		desc: "Delete any share."
	},
	"LOCK": {
		desc: "Lock/unlock any share."
	},
	"ADMIN": {
		desc: "Create users and change any user's permissions."
	},
}

export type PermissionID = keyof typeof permissions

export declare namespace PermissionWidget {
	interface Attrs {
		// pass these by reference
		perms: Set<PermissionID>
		flag: {changed: boolean}
	}
}

export const PermissionWidget: Component<PermissionWidget.Attrs> = {
	view: (vnode) => {
		if (vnode.attrs.perms === undefined) {
			vnode.attrs.perms = new Set;
		}
		return Object.keys(permissions).map((permId: PermissionID) => {
			return m("li.form-checkbox-li",
				m("input[type=checkbox].form-checkbox", {
					checked: vnode.attrs.perms.has(permId),
					onchange: (e: Event) => {
						let tg = e.target as HTMLInputElement
						if (tg != undefined) {
							if (tg.checked) {
								vnode.attrs.perms.add(permId)
							} else {
								vnode.attrs.perms.delete(permId)
							}
						}
						vnode.attrs.flag.changed = true
					}
				}),
				m("label.form-label", permissions[permId].desc),
			)
		})
	},
}
