/*
 * @Description: 
 * @Version: 1.0
 * @Author: AaroLi
 * @Date: 2023-12-30 15:40:52
 * @LastEditors: AaroLi
 * @LastEditTime: 2024-01-08 10:46:36
 */
import { showToast } from "vant";
import wx from "weixin-js-sdk"; //引入WX sdk

// 判断是否还是一个对象
const isObject = (obj) => {
	return Object.prototype.toString.call(obj) === "[object Object]";
};

// 扁平化对象
const getObjKeys = (obj) => {
	let result = {}; // 用于保存扁平化后的对象
	const helpLoop = (obj) => {
		const objKeys = Object.keys(obj);
		for (let i = 0; i < objKeys.length; i++) {
			if (typeof obj[objKeys[i]] == "object") {
				helpLoop(obj[objKeys[i]]);
			} else {
				result[objKeys[i]] = obj[objKeys[i]];
			}
		}
	};
	helpLoop(obj);

	return result;
};

// 比较两个对象差异
const comparisonObject = (objPre, objNext) => {
	if (Object.keys(objPre).length == 0 || !objPre || !objNext) return false;
	const tempPre = getObjKeys(objPre);
	const tempNext = getObjKeys(objNext);
	// 数组去重
	let keys = [];
	keys.push(...Object.keys(tempPre));
	keys.push(...Object.keys(tempNext));
	keys = [...new Set(keys)];
	for (let i = 0; i < keys.length; i++) {
		if (tempPre[keys[i]] != tempNext[keys[i]]) {
			return keys[i];
		}
	}
	return false;
};

/*
ele:要插入的元素（父元素要设置相对定位）
cloneEl：要克隆的元素
cssStyles：克隆时去掉不克隆的样式
*/
const isElementHidden = (ele = "", cloneEl = "", cssStyles = []) => {
	if (!ele || !cloneEl) {
		return false;
	}
	const clonedNode = cloneEl.cloneNode(true);
	const allStyle = cloneEl.computedStyleMap();
	for (const [prop, val] of allStyle) {
		if (!cssStyles.includes(prop)) {
			clonedNode.style[prop] = val;
		}
	}
	clonedNode.className = "";
	clonedNode.style.visibility = "hidden";
	clonedNode.style.position = "absolute";
	clonedNode.setAttribute("id", "ellipt_hidden__node___id");
	ele.appendChild(clonedNode);
	const differ = clonedNode.offsetHeight > ele.offsetHeight;
	ele.removeChild(clonedNode);
	return differ;
};

// 防抖
const debounce = (fn, time) => {
	let timer = null
	return (...args) => {
		const context = this
		if (timer) {
			clearTimeout(timer)
		}
		timer = setTimeout(() => {
			fn.call(context, ...args)
		}, time)
	}
}
// 设置session
const setSession = (attr, value) => {
	try {
		window.sessionStorage.setItem(attr, value)
	} catch (error) {
		console.log('设置失败')
	}
}

// 获取session
const getSession = (attr) => {
	return window.sessionStorage.getItem(attr) || ''
}

// 设置企业名称
const setCompanyName = (data) => {
	$globalStore.useMy.SET_COMPANY_NAME(data);
};
// 设置企业项目数量
const setCompanyNum = (data) => {
	$globalStore.useMy.SET_COMPANY_NUM(data);
};
// TODO 微信打开三方地图  需求没明确说要  暂留一个口子 @yl
const navigationWx = (addressInfo) => {
	const { lat, lng, name, address } = addressInfo
	// const {debug ,timestamp} = info
	wx.config({
		beta: true,
		debug: res.debug,
		appId: res.appId,
		timestamp: res.timestamp,
		nonceStr: res.nonceStr,
		signature: res.signature,
		// jsApiList: res.jsApiList
		jsApiList: ["checkJsApi", "openLocation"],
		success(res) {
			//   Toast(res);
		},
	});
	wx.ready(function () {
		wx.openLocation({
			type: "gcj02",
			latitude: lat,
			longitude: lng,
			name: name,
			scale: 18,
			address: address || ''
		});
	})
}
// 判断是否微信
const isWx = () => {
	var ua = navigator.userAgent.toLowerCase();
	if (/micromessenger/.test(ua)) {
		return new Promise(resolve => {
			wx.miniProgram.getEnv(function (res) {
				if (res.miniprogram) {
					// 小程序环境
					resolve("mini-wx");
				} else {
					// 微信环境
					resolve("wx");
				}
			});
		});
	} else {
		// 不在微信环境
		return new Promise(resolve => {
			resolve("no-wx");
		});
	}
}
//   百度或 高德地图
const navToMap = (addressInfo, type) => {
	const { lat, lng, name, address } = addressInfo
	const addressStr = address || ''
	const systemSetting = {
		// 腾讯地图Key
		txKey: 'xxxxxxxx',
		// 跳转App公共地址
		mapUrlConfig: {
			baidu: 'baidumap://map/walknavi',
			gaode: {
				ios: 'iosamap://navi',
				android: 'androidamap://viewMap'
			},
			tengxun: 'qqmap://map/marker'
		}
	}
	let url
	const u = navigator.userAgent
	//判断ios
	const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
	//判断Android
	const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
	if (!isIOS && !isAndroid) {
		return showToast("此设备暂不支持")
	}
	if (type === 1) {
		// 百度
		url = `${systemSetting.mapUrlConfig.baidu}?destination=${lat},${lng}&title=${name}&content=${addressStr}&output=html&coord_type=gcj02&src=test`
	} else if (type === 3) {
		url = `${systemSetting.mapUrlConfig.tengxun}?marker=coord:${lat},${lng};title:${name};addr:${addressStr}&referer=${systemSetting.txKey}`
	} else {
		// 高德
		let params = `?sourceApplication=mingyue&poiname=${name}&lat=${lat}&lon=${lng}&dev=0&t=2`
		const { android, ios } = systemSetting.mapUrlConfig.gaode
		url = (isAndroid ? android : ios) + params
	}
	if (url) {
		window.location.href = url
	}
}
export { isObject, comparisonObject, isElementHidden, debounce, getSession, setSession, setCompanyNum, setCompanyName, navigationWx, isWx, navToMap };
