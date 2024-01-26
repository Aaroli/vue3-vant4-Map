/*
 * @Description: 
 * @Version: 1.0
 * @Author: AaroLi
 * @Date: 2024-01-03 09:33:21
 * @LastEditors: AaroLi
 * @LastEditTime: 2024-01-26 12:14:27
 */
import VueDompurifyHtml from 'vue-dompurify-html'; // 替代v-html插件防止xss
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { isObject } from '@/util/util'; // 导出工具类
import '@/assets/style/index.less'; // 引入项目样式文件
import 'vant/lib/index.css'; // 引入vant样式文件
import 'amfe-flexible'; // 导入适配
import { initAMapApiLoader } from '@vuemap/vue-amap'
import '@vuemap/vue-amap/dist/style.css'
// import Vconsole from 'vconsole'
// let vConsole = new Vconsole()
// 初始化地图
initAMapApiLoader({
	key: 'cf616969abaa80500e97eb21ea98a6f8',
	securityJsCode: 'b57f705b8c77f095e75caa4a62250669'
})
// 远程国际化-会和本地国际化合并
const getLang = async () => {
	const res = await $globalStore.useCommon.getLang();
	if (res?.code === 20000) {
		if (isObject(res) && isObject(res?.data)) {
			Object.keys(res?.data).forEach((key) => {
				$globalLang.global.mergeLocaleMessage(key, res?.data[key]);
			});
		}
	}
};

// 处理url
const handleLoadUrl = () => {
	const url = window.location.href;
	const match = url.match(/#([^?]+)/);
	const path = match ? match[1] : url.substring(url.indexOf('#') + 2);
	return path;
};

const $globalReady = {
	install: (app) => {
		//初始化请求
		app.use($globalHttp());

		// 实例化pinia
		const pinia = createPinia()
		pinia.use(piniaPluginPersistedstate) // 持久化
		app.use(pinia);
		app.use($globalRegisterStore);

		// 路由初始化
		app.use($globalRouter);

		// 初始化语言
		app.use($globalLang);
		// app.use(vConsole)
		// 依赖注入
		app.provide('$provideLang', getLang);
		app.provide('$provideLoadUrl', handleLoadUrl);

		// 导入插件
		app.use(VueDompurifyHtml);
	},
};

export { $globalReady };
