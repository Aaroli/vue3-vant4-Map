/*
 * @Description: 
 * @Version: 1.0
 * @Author: AaroLi
 * @Date: 2024-01-16 01:41:37
 * @LastEditors: AaroLi
 * @LastEditTime: 2024-01-17 10:25:31
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
					config.headers['Authorization'] = 'Bearer ' + 'eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6IjgxOTAzOTY5LWQ0NzEtNDgxYS04NjhlLTE2NGQ3NTc1M2I2MSJ9.9G1prSdTnUVALS7NQuVyaP_UM9dQmRN2W4w835XSABHV_C31RdDL9zSgFI9ooNZIgTieZH9DcOWwbMGm9qfLKQ'
					// if (getSession('TOKEN')) {
					// 	config.headers['Authorization'] = 'Bearer ' + getSession('TOKEN')
					// }
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
