import m, { Component } from "mithril";
import { permissions, PermissionID } from "../models/Auth"

export declare namespace PermissionWidget {
	interface Attrs {
		// pass these by reference
		perms: PermissionID[]
		flag?: { changed: boolean }

		readonly?: boolean
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
					class: vnode.attrs.readonly ? "form-readonly" : "",
					onchange: (e: Event) => {
						let tg = e.target as HTMLInputElement
						if (tg != undefined) {
							if (tg.checked) {
								vnode.attrs.perms.push(permId)
							} else {
								vnode.attrs.perms.splice(vnode.attrs.perms.indexOf(permId), 1)
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
