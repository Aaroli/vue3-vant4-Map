/*
 * @Description: 
 * @Version: 1.0
 * @Author: AaroLi
 * @Date: 2023-12-30 15:40:52
 * @LastEditors: AaroLi
 * @LastEditTime: 2024-01-16 02:04:17
 */
import { getAddersslist, getRegionList, getPointInfo, getSingleUrl, getUserInfo, getWxAuth } from "@/api/My";
export default defineStore('useMy', {
	state: () => ({
		companyName: "海岸",
		companyNum: "0", //总数
		coordinate: [120.05, 30.04], //定位坐标
	}),
	getters: {},
	actions: {
		SET_COMPANY_NAME(data) {
			this.companyName = data;
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
	},
});
