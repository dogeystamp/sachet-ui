import { f, validatedPlainToClass } from "@marcj/marshal"
import "reflect-metadata"
import "moment"
import Pager from "../services/pagination";
import api from "../services/api";

export class Share {
	@f.primary().uuid()
	share_id: string;
	@f.moment()
	create_date: moment.Moment
	@f
	locked: boolean
	@f
	owner_name: string
	@f
	file_name: string
}

const ShareModel = {
	page: new Pager<Share>({ per_page: 3, url: "/files" }),
	list: [] as Share[],
	loadList: async function(page: number = 1) {
		await ShareModel.page.loadPage(page)
		ShareModel.list = ShareModel.page.data.map((share: Share) => {
			return validatedPlainToClass(Share, share)
		})
	}
}

type ShareModel = typeof ShareModel

export default ShareModel

export const loadShare = async (shareId: string) => {
	const resp = await api.request<Share>({ url: "/files/" + shareId, method: "GET" })
	return validatedPlainToClass(Share, resp)
}
