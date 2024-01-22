/*
 * @Description: 
 * @Version: 1.0
 * @Author: AaroLi
 * @Date: 2023-12-29 16:20:34
 * @LastEditors: AaroLi
 * @LastEditTime: 2024-01-22 08:27:26
 */
import login from "@/views/login.vue";
import Map from "@/views/Map.vue";
import Search from "@/views/Search.vue";
const routes = [
	{
		path: "/login",
		name: "login",
		component: login,
		meta: {},
	},
	{
		path: "/map",
		name: "Map",
		component: Map,
		meta: {
			isKeepAlive: false,
		},
	},
	{
		path: "/Search",
		name: "Search",
		component: Search,
		meta: {
			isKeepAlive: false,
		},
	},
];

export { routes };
