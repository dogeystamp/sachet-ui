import api from "../services/api"
import { PropertyValidatorError, f, validatedPlainToClass } from "@marcj/marshal"
import "reflect-metadata"
import "moment"

export enum Permissions {
	CREATE,
	MODIFY,
	DELETE,
	LOCK,
	LIST,
	READ,
	ADMIN
}

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
	list: [] as Share[],
	loadList: async function() {
		const result = await api.request<{ data: Share[] }>({
			method: "GET",
			url: "http://localhost:5000/files",
			params: {
				"page": "1",
				"per_page": "300"
			}
		})

		ShareModel.list = result.data.map((raw: any) => {
			return validatedPlainToClass(Share, raw)
		});
	}
}

type ShareModel = typeof ShareModel

export default ShareModel
