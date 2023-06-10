import m from "mithril";
import UserList from "./views/UserList"
import ShareList from "./views/ShareList"

m.route(document.body, "/users", {
	"/users": UserList,
	"/files": ShareList,
	// temporary stub
	"/login": ShareList
})
