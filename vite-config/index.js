/*
 * @Description: 
 * @Version: 1.0
 * @Author: AaroLi
 * @Date: 2024-01-12 10:29:50
 * @LastEditors: AaroLi
 * @LastEditTime: 2024-01-12 17:50:54
 */
import { resolve, join, extname } from "path";
import fs from "fs";
import postCssPxToRem from "postcss-pxtorem";

// 加载插件模块
const loadPluginModules = async () => {
	return new Promise(async (success) => {
		const modulesPath = resolve(__dirname, "plugins");
		const fileNames = fs.readdirSync(modulesPath);
		let modulesImprot = [];
		fileNames.forEach(async (item) => {
			const filePath = join(modulesPath, item);
			if (
				fs.statSync(filePath).isFile() &&
				[".js"].includes(extname(filePath))
			) {
				modulesImprot.push(import(`./plugins/${item}`));
			}
		});

		const modules = await Promise.all(modulesImprot);
		success(modules);
	});
};

// 基本配置
const baseCfg = (viteEnv = {}) => {
	const { VITE_BASE_URL } = viteEnv;
	return {
		envDir: "vite-env",
		base: './',
		resolve: {
			alias: {
				"@": resolve("./src"),
				"~@": resolve("./src"),
			},
			extensions: [".js", ".mjs", ".vue", ".json", ".less", ".css"],
		},
		server: {
			host: "0.0.0.0", // 服务器主机名，如果允许外部访问，可设置为"0.0.0.0"
			port: 9161,
			open: false,
			cors: true,
			proxy: {
				'/api/': {
					target: 'http://61.169.37.106:9167/api/',
					changeOrigin: true,
					rewrite: (p) => p.replace(/^\/api/, ''),
				}
			}
		},
		build: {
			outDir: "dist",
			minify: "terser",
			rollupOptions: {
				output: {
					chunkFileNames: "js/[name]-[hash].js", // 引入文件名的名称
					entryFileNames: "js/[name]-[hash].js", // 包的入口文件名称
					assetFileNames: "[ext]/[name]-[hash].[ext]", // 资源文件像 字体，图片等
				},
			},
		},
		css: {
			postcss: {
				plugins: [
					postCssPxToRem({
						rootValue: 37.5, // 自适应，px>rem转换
						propList: ["*"], // 需要转换的属性，这里选择全部都进行转换
						selectorBlackList: ["norem"], // 过滤掉norem-开头的class，不进行rem转换
					}),
				],
			},
		},
	};
};

// 插件配置
const pluginCfg = async (viteEnv = {}) => {
	const modulesArr = [];
	const modules = await loadPluginModules();
	modules.forEach((item) => {
		const funcs = Object.values(item);
		funcs.forEach((it) => {
			modulesArr.push(it(viteEnv));
		});
	});
	return modulesArr;
};

export { baseCfg, pluginCfg };
