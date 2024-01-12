/*
 * @Description: 
 * @Version: 1.0
 * @Author: AaroLi
 * @Date: 2024-01-03 09:33:21
 * @LastEditors: AaroLi
 * @LastEditTime: 2024-01-03 09:34:30
 */
import components from "unplugin-vue-components/vite"; // 全局导入组件库
import { VantResolver } from "unplugin-vue-components/resolvers"; // 导入内置库插件
import { VueAmapResolver } from '@vuemap/unplugin-resolver'
const Components = (viteEnv = {}) => {
	return components({
		resolvers: [VantResolver(), VueAmapResolver()], // 自动导入vant库
		dirs: ["src/components"],
		extensions: ["vue"], // 文件扩展名
	});
};

export { Components };