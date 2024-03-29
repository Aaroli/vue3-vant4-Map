/*
 * @Description: 
 * @Version: 1.0
 * @Author: AaroLi
 * @Date: 2023-12-30 15:40:52
 * @LastEditors: AaroLi
 * @LastEditTime: 2024-01-26 12:06:23
 */
import { getAddersslist, getRegionList, getPointInfo, getPointInfoList, queryFuzzy, getSingleUrl, getUserInfo, getWxAuth } from "@/api/My";
export default defineStore('useMy', {
	state: () => ({
		companyName: "万家",
		companyNum: "0", //总数
		adcdName: '',
		coordinate: [], //定位坐标
		centerCoordinate: null, //更新中心点坐标
		inputValue: null, //输入框名称
		companyType: null, //公司列表
		zomChange: '', //zoomchange
		typeChange: '全部', //类别事件暂存
	}),
	getters: {},
	actions: {
		SET_COMPANY_NAME(data) {
			this.companyName = data;
		},
		SET_COMPANY_ZOOM(data) {
			this.zomChange = data;
		},
		SET_USER_TYPE(data) {
			this.typeChange = data;
		},
		SET_INPUT_VALUE(data) {
			this.inputValue = data;
		},
		SET_COMPANY_TYPE(data) {
			this.companyType = data;
		},
		SET_CENTER_COORDINATE(data) {
			this.centerCoordinate = data;
		},
		SET_ADCD_NAME(data) {
			this.adcdName = data;
		},
		SET_COMPANY_NUM(data) {
			this.companyNum = data;
		},
		SET_COORDINATE(data) {
			this.coordinate = data;
		},
		async getAddersslist(params) {
			let url = $globalRequestUrl({
				url: getAddersslist,
			});

			try {
				const rep = await $globalRequest(url, params, { method: "GET" });
				return rep;
			} catch (error) {
				return error;
			}
		},
		async getWxAuth(params) {
			let url = $globalRequestUrl({
				url: getWxAuth,
			});

			try {
				const rep = await $globalRequest(url, params, { method: "POST" });
				return rep;
			} catch (error) {
				return error;
			}
		},
		async getUserInfo(params) {
			let url = $globalRequestUrl({
				url: getUserInfo,
			});

			try {
				const rep = await $globalRequest(url, params, { method: "GET" });
				return rep;
			} catch (error) {
				return error;
			}
		},
		async getSingleUrl(params) {
			let url = $globalRequestUrl({
				url: getSingleUrl,
			});

			try {
				const rep = await $globalRequest(url, params, { method: "GET" });
				return rep;
			} catch (error) {
				return error;
			}
		},
		async getRegionList(params) {
			let url = $globalRequestUrl({
				url: getRegionList,
			});

			try {
				const rep = await $globalRequest(url, params, { method: "POST" });
				return rep;
			} catch (error) {
				return error;
			}
		},
		async getPointInfo(params) {
			let url = $globalRequestUrl({
				url: getPointInfo,
			});

			try {
				const rep = await $globalRequest(url, params, { method: "POST" });
				return rep;
			} catch (error) {
				return error;
			}
		},
		async getPointInfoList(params) {
			let url = $globalRequestUrl({
				url: getPointInfoList,
			});

			try {
				const rep = await $globalRequest(url, params, { method: "GET" });
				return rep;
			} catch (error) {
				return error;
			}
		},
		async queryFuzzy(params) {
			let url = $globalRequestUrl({
				url: queryFuzzy,
			});

			try {
				const rep = await $globalRequest(url, params, { method: "GET" });
				return rep;
			} catch (error) {
				return error;
			}
		},
	},
});
