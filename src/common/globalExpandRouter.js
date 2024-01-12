// 加载模块配置的路由缓存配置
const $globalRouterModules = (routes) => {
	let routesArr = [...routes];
	let pathArr = [];
	let nameArr = [];
	const modulesRouter = import.meta.glob("../router/*.js", {
		eager: true,
	});

	for (const [key, value] of Object.entries(modulesRouter)) {
		const moduleName = key.replace(/^\.\.\/(.*)\.\w+$/, "$1").split("/")[1];
		if (moduleName && value) {
			for (const [, valueChild] of Object.entries(value)) {
				valueChild.forEach((item, index) => {
					pathArr.includes(item.path)
						? console.error(`模块${moduleName}的路由地址${item.path}存在重复`)
						: pathArr.push(item.path);
						nameArr.includes(item.name)
						? console.error(`模块${moduleName}的路由名${item.name}存在重复`)
						: nameArr.push(item.name);
					item.meta &&
						(item.meta.subMsgKey = `app_keep_alive_bus_${index}_${moduleName}`);
				});
				routesArr.splice(1, 0, ...valueChild);
			}
		}
	}
	return routesArr;
};

// 获取发消息的key
const getBusKey = (name, path, data) => {
	const [res] = data.filter((item) => {
		return name ? [name].includes(item.name) : [path].includes(item.path);
	});
	const { meta = {} } = res || {};
	const {
		isKeepAlive = false,
		isRouterKeepAlive = false,
		subMsgKey = "",
	} = meta;
	const uniId = new Date().getTime();
	const resMsgKey = isRouterKeepAlive ? `${subMsgKey}_${uniId}` : "";
	const busKey = isKeepAlive ? subMsgKey : "";
	const resKey = resMsgKey || busKey;
	resKey && $globalStore.useCommon.SET_SUB_MSG_KEY(resKey);
	return resKey;
};

// 添加扩展方法
const $globalExpandRouter = (router, routes) => {
	// 扩展push方法
	const routerPush = router.push;
	router.push = (location) => {
		const { name = "", path = "" } = location;
		const subMsgKey = getBusKey(name, path, routes);
		return routerPush.call(this, location).then(() => {
			subMsgKey && $globalEventBus.emit(subMsgKey);
		});
	};

	// 扩展replace方法
	const routerReplace = router.replace;
	router.replace = (location) => {
		const { name = "", path = "" } = location;
		const subMsgKey = getBusKey(name, path, routes);
		return routerReplace.call(this, location).then(() => {
			subMsgKey && $globalEventBus.emit(subMsgKey);
		});
	};
};

export { $globalRouterModules, $globalExpandRouter };
