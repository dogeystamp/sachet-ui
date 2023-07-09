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
		// pass this by reference
		perms: PermissionID[]
	}
}

export const PermissionWidget: Component<PermissionWidget.Attrs> = {
	view: (vnode) => {
		if (vnode.attrs.perms === undefined) {
			vnode.attrs.perms = []
		}
		return Object.keys(permissions).map((permId: PermissionID) => {
			return [
				m("label.form-label", permissions[permId]),
				m("input[type=checkbox].form-checkbox"),
			]
		})
	},
}
