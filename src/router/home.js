/*
 * @Description: 
 * @Version: 1.0
 * @Author: AaroLi
 * @Date: 2023-12-29 16:20:34
 * @LastEditors: AaroLi
 * @LastEditTime: 2024-01-01 09:47:33
 */
import login from "@/views/login.vue";
import Map from "@/views/Map.vue";
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
];

export { routes };
