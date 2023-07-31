import m, { Component } from "mithril";

export declare namespace Preview {
	interface Attrs {
		mimeType: string
		blob: Blob
	}
}

const Preview: Component<Preview.Attrs> = {
	view: (vnode) => {
		const mimeType = vnode.attrs.mimeType
		const blob = vnode.attrs.blob

		if (mimeType.startsWith("image/")) {
			const blobUrl = window.URL.createObjectURL(blob)
			return m("a", { href: blobUrl }, m("img.thumbnail", { src: blobUrl })) 
		} else if (mimeType.startsWith("video/")) {
			return m("video.thumbnail[controls]", { src: window.URL.createObjectURL(blob) })
		} else if (mimeType.startsWith("audio/")) {
			return m("audio.thumbnail[controls]", { src: window.URL.createObjectURL(blob) })
		}
	}
}

export default Preview
