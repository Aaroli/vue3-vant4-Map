/*
 * @Description: 
 * @Version: 1.0
 * @Author: AaroLi
 * @Date: 2024-01-16 01:41:37
 * @LastEditors: AaroLi
 * @LastEditTime: 2024-01-22 05:52:04
 */
import axios from "axios";
import { showToast } from "vant";
import { getSession } from "@/util/util";

const $globalHttp = () => {
	return {
		install: () => {
			// 超时时间
			axios.defaults.timeout = 5000;
			// http请求拦截器
			axios.interceptors.request.use(
				(config) => {
					if (getSession('TOKEN')) {
						config.headers['Authorization'] = 'Bearer ' + getSession('TOKEN')
					}
					return config;
				},
				(error) => {
					return Promise.reject(error);
				}
			);

			// http响应拦截器
			axios.interceptors.response.use(
				(data) => {
					// 请求后的处理

					if (data.data.code == "50005") {
						showToast("token已失效");
					}
					return data.data;
				},
				(error) => {
					if (!error.response) {
						let res = {
							code: -1,
							msg: "网络断开了，请检查网络状况。",
						};
						return Promise.reject(res);
					}

					return Promise.reject(error.response.data);
				}
			);
		},
	};
};

export {
	$globalHttp
};
