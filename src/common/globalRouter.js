/*
 * @Description: 
 * @Version: 1.0
 * @Author: AaroLi
 * @Date: 2024-01-03 09:33:21
 * @LastEditors: AaroLi
 * @LastEditTime: 2024-01-03 09:33:21
 */
import { createRouter, createWebHashHistory } from "vue-router";

let routes = [
	{
		path: "/",
		redirect: "/map",
		// redirect: "/login",
		name: "App",
	},
	{
		path: "/:pathMatch(.*)*",
		name: "404",
		component: () => import("@/views/404"),
	},
];

routes = $globalRouterModules(routes); // 加载模块路由

const $globalRouter = createRouter({
	history: createWebHashHistory(),
	routes,
});

$globalExpandRouter($globalRouter, routes); // 添加路由扩展

export { $globalRouter };
