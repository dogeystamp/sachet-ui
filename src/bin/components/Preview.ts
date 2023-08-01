import m, { Component } from "mithril";

export declare namespace Preview {
	interface Attrs {
		mimeType: string
		blob: Blob
	}
	interface State {
		blobUrl: string
	}
}

const Preview: Component<Preview.Attrs, Preview.State> = {
	view: (vnode) => {
		const blob = vnode.attrs.blob
		const mimeType = vnode.attrs.mimeType
		if (vnode.state.blobUrl === undefined) {
			if (blob !== undefined) {
				vnode.state.blobUrl = window.URL.createObjectURL(blob)
			}
		}

		if (vnode.state.blobUrl === undefined) {
			return null
		}

		const blobUrl = vnode.state.blobUrl

		if (mimeType.startsWith("image/")) {
			return m("a", { href: blobUrl }, m("img.thumbnail", { src: blobUrl })) 
		} else if (mimeType.startsWith("video/")) {
			return m("video.thumbnail[controls]", { src: blobUrl })
		} else if (mimeType.startsWith("audio/")) {
			return m("audio.thumbnail[controls]", { src: blobUrl })
		}
	}
}

export default Preview
