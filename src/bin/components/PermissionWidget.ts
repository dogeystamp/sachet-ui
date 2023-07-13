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
		desc: "Modify their own shares and their metadata."
	},
	"DELETE": {
		desc: "Delete any share."
	},
	"LOCK": {
		desc: "Lock/unlock any share."
	},
	"ADMIN": {
		desc: "Administrate the server."
	},
}

export type PermissionID = keyof typeof permissions

export declare namespace PermissionWidget {
	interface Attrs {
		// pass these by reference
		perms: PermissionID[]
		flag?: { changed: boolean }
	}
}

export const PermissionWidget: Component<PermissionWidget.Attrs> = {
	view: (vnode) => {
		if (vnode.attrs.perms === undefined) {
			vnode.attrs.perms = [];
		}
		return Object.keys(permissions).map((permId: PermissionID) => {
			return m("li.form-checkbox-li",
				m("input[type=checkbox].form-checkbox", {
					checked: vnode.attrs.perms.includes(permId),
					onchange: (e: Event) => {
						let tg = e.target as HTMLInputElement
						if (tg != undefined) {
							if (tg.checked) {
								vnode.attrs.perms.push(permId)
							} else {
								vnode.attrs.perms.splice(vnode.attrs.perms.indexOf(permId))
							}
						}
						if (vnode.attrs.flag !== undefined) {
							vnode.attrs.flag.changed = true
						}
					}
				}),
				m("label.form-label", permissions[permId].desc),
			)
		})
	},
}
