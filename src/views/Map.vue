<!--
 * @Description: 
 * @Version: 1.0
 * @Author: AaroLi
 * @Date: 2024-01-03 09:33:21
 * @LastEditors: AaroLi
 * @LastEditTime: 2024-01-27 03:57:54
-->
<template>
	<div class="app">
		<!-- 导航栏 -->
		<div class="header_body">
			<header-nav v-if="phoneType()" :leftArrow="false" @handleSearch="handleSearch" @cityChange="cityChange"
				@stausChange="stausChange" @initData="initData" @initDatas="initDatas" @storeList="setDataSearch"
				@clearData="clearData" titelText="首页"></header-nav>
			<header-nav-pc v-if="!phoneType()" :leftArrow="false" @handleSearch="handleSearch" @cityChange="cityChange"
				@stausChange="stausChange" @initData="initData" @initDatas="initDatas" titelText="首页"></header-nav-pc>
		</div>
		<!-- 地图容器 -->
		<el-amap ref="mapRef" @update:zoom="onUpdatedZoom" @zoomend="zoomend" @zoomstart="onMapChange"
			v-model:center="center" :zoom="zoom" @click="closeLegend">
			<el-amap-marker v-if="!phoneType()" :visible="textVisible" v-for="marker in markers" :key="marker.id"
				:position="marker.position" :offset="[0, 0]" @click="(e) => { clickArrayMarker(marker, e) }">
				<div class="marker-content_pc">
					<div class="title">{{ marker.name }}</div>
					<div class="img"><img :src="img1" /></div>
				</div>
			</el-amap-marker>
			<el-amap-layer-labels :collision="false" :allowCollision="false">
				<el-amap-label-marker :visible="labelOptions.visible" v-for="marker in markers" :key="marker.id"
					:position="marker.position" :text="marker.text" :icon="labelOptions.icon"
					@click="(e) => { clickArrayMarker(marker, e) }" />
			</el-amap-layer-labels>
			<!-- 比例尺 -->
			<el-amap-control-scale :visible="ScaleVisible" />
			<!-- 缩放控件 -->
			<el-amap-control-tool-bar :visible="ScalinVisible" />
			<!-- 地图类型切换 -->
			<el-amap-control-map-type :visible="MapStatusvisible" />
		</el-amap>
		<!-- 底部 -->
		<div class="footer_body" v-if="phoneType()">
			<footer-nav></footer-nav>
		</div>
		<div class="footer_body_pc" v-if="!phoneType()">
			<footer-nav-pc></footer-nav-pc>
		</div>
		<div class="legend_body" v-if="phoneType()">
			<legend-nav @textChange="textChange" @selectList="selectList" />
		</div>
		<div class="legend_body_pc" v-if="!phoneType()">
			<legend-nav-pc @textChange="textChange" @selectList="selectList" />
		</div>

		<!-- 地图信息 -->
		<van-overlay :show="mapDetailShow" z-index="3" @click="mapDetailShow = false">
			<div class="wrapper" @click.stop>
				<div class="block" v-if="phoneType()">
					<van-icon name="cross" size="20" class="closeBtn" @click="mapDetailShow = false" />
					<div class="Maptitle">{{ locationObj.title }}</div>
					<div class="Mapcontant">{{ locationObj.contant }}</div>
					<div class="Mapdistanc">离你 {{ locationObj.distanc }}</div>
					<img class="Mapimg" :src="getImgType('title')" />
					<div v-if="!getSession('TOKEN')" class="Mapbtn" @click="navigateLine">到这里去</div>
					<div v-if="!getSession('TOKEN')" class="Maptips">查看更多详情<span class="span" @click="hasUser">去登录</span>
					</div>
					<div v-if="getSession('TOKEN')" class="Mapinfo">
						<div class="Mapinfo_box" v-for="(item, index) in locationObj.infoList" :key="index">
							<div>{{ `${item.fieldTitle}：` }}<span>{{ item.fieldValue }}</span><van-icon
									v-if="checkPhoneNumber(item.fieldValue)" size="16" style="transform: rotate(-110deg);"
									color="blue" name="phone-o" @click="handleTel(item.fieldValue)" /></div>
						</div>
						<!--  -->
					</div>
					<div v-if="getSession('TOKEN')" class="Mapbtns" @click="navigateLine">到这里去</div>
				</div>
				<div class="block_pc" v-if="!phoneType()">
					<van-icon name="cross" size="20" class="closeBtn_pc" @click="mapDetailShow = false" />
					<div class="Maptitle_pc">{{ locationObj.title }}</div>
					<div class="Mapcontant_pc">{{ locationObj.contant }}</div>
					<div class="Mapdistanc_pc">离你 {{ locationObj.distanc }}</div>
					<img class="Mapimg_pc" :src="getImgType('title')" />
					<div v-if="!getSession('TOKEN')" class="Mapbtn_pc" @click="navigateLine">到这里去</div>
					<div v-if="!getSession('TOKEN')" class="Maptips_pc">查看更多详情<span class="span" @click="hasUser">去登录</span>
					</div>
					<div v-if="getSession('TOKEN')" class="Mapinfo_pc">
						<div class="Mapinfo_box_pc" v-for="(item, index) in locationObj.infoList" :key="index">
							<div>{{ `${item.fieldTitle}：` }}<span>{{ item.fieldValue }}</span><van-icon size="15"
									v-if="checkPhoneNumber(item.fieldValue)" name="phone-o"
									@click="handleTel(item.fieldValue)" /></div>
						</div>
					</div>
					<div v-if="getSession('TOKEN')" class="Mapbtns_pc" @click="navigateLine">到这里去</div>
				</div>
			</div>
		</van-overlay>
		<!-- loading -->
		<van-overlay :show="loading" z-index="4">
			<div class="wrapper">
				<van-loading size="30px" text-size="18px" class="mdl">拼命加载中...</van-loading>
			</div>
		</van-overlay>
		<!-- 导航 -->
		<van-action-sheet v-model:show="isShowSheet" title="使用地图打开" :actions="sheetList" cancel-text="取消"
			description="如果点击无响应，可能是您还没有安装该APP" close-on-click-action @select="handleSheetSelect" />
	</div>
</template>

<script setup name="Map">
import { getSession, setlocal, getlocal, removelocal, removeSession, setSession, navigationWx, setAdcdName, setCompanyZoom, setCenterValue, debounce, setCompanyName, isPCFun, isWx, navToMap, setCompanyNum, phoneType, calcDistance, checkPhoneNumber } from "@/util/util";
import { ElAmap, useCitySearch, useGeolocation, lazyAMapApiLoaderInstance } from "@vuemap/vue-amap";
import { showToast } from "vant";
const { useMy } = $globalStore
const router = useRouter();
import img1 from '@/assets/images/point_blue.png'
import img2 from '@/assets/images/point_green.png'
import img3 from '@/assets/images/point_purple.png'
import img4 from '@/assets/images/point_red.png'
import img5 from '@/assets/images/point_yellow.png'
import img_mag_title from '@/assets/images/img_mag_title.png'
const mapRef = ref();
const labelOptions = ref({
	visible: true,
	position: [121.5495395, 31.21515044],
	text: {
		content: '测试content',
		direction: 'top',
		style: {
			fontSize: 15,
			fillColor: '#fff',
			strokeColor: 'rgba(255,0,0,0.5)',
			strokeWidth: 2,
			padding: [3, 10],
			backgroundColor: 'yellow',
			borderColor: '#ccc',
			borderWidth: 3,
		}
	},
	icon: {
		image: 'https://a.amap.com/jsapi_demos/static/images/poi-marker.png',
		anchor: 'bottom-center',
		size: [25, 34],
		clipOrigin: [279, 0],
		clipSize: [50, 68]
	}
});

const mapDetailShow = ref(false) //地图prop
const loading = ref(false) //地图loading
const searchInfo = ref({
	egion: '', //公司列表
	xmproject: '', //区划
	manage: '', //类型
})
// 地图标记
const markers = ref([])
const markersAll = ref([])
const zoom = ref(12)
const zoomLever = ref(0)
const iszoomChange = ref(false)
const hasAllChange = ref(false)
// 比例尺
const ScaleVisible = ref(false)
// 文本标记
const textVisible = ref(true)
// 缩放控件
const ScalinVisible = ref(true)
// 地图类型切换
const MapStatusvisible = ref(false)
// 地图中心点
const center = ref([120.199675, 30.263458])
// 企微定位
const enterprisecenter = ref([120.199675, 30.263458])
const locationObj = ref({
	title: '富阳旅游项目',
	name: '张涵',
	phone: '17232111322',
	mj: '21.5万㎡',
	wyf: '1.9元/㎡/月',
	type: 'title1',
	contant: '浙江省杭州市富阳区富春路3201室',
	distanc: '8.6KM',
	lat: '30.061333',
	lng: '120.001',
	name: 'A',
	address: '杭州市西湖区武林广场',
	infoList: []
})
const getImgType = (v) => {
	const map = {
		'全部': '',
		'万家': img1,
		'新城': img2,
		'海岸': img3,
		'浙中南': img4,
		'萧山滨弘': img5,
		'title': img_mag_title,
	};
	return map[v] || "";
}
// marker点击事件
const clickArrayMarker = async (marker) => {
	$globalEventBus.emit('LegendClick', false);
	let zb = ''
	isPCFun() == true || useMy.$state.coordinate.length == 0 ? zb = enterprisecenter.value : zb = useMy.$state.coordinate
	if (getSession('TOKEN')) {
		const res = await useMy.getPointInfoList({ id: marker.id });
		if (res?.code === 200) {
			locationObj.value = {
				title: marker.name ? marker.name : '暂无数据',
				contant: marker.addr ? marker.addr : '暂无数据',
				distanc: `${calcDistance(zb[1], zb[0], marker.position[1], marker.position[0])}KM` || '暂无数据',
				lat: marker.latitude,
				lng: marker.longitude,
				addressName: marker.name,
				address: marker.addr,
				infoList: res.data
			}
			mapDetailShow.value = true
		} else {
			showToast(res.msg);
		}
	} else {
		locationObj.value = {
			title: marker.name ? marker.name : '暂无数据',
			contant: marker.addr ? marker.addr : '暂无数据',
			distanc: `${calcDistance(zb[1], zb[0], marker.position[1], marker.position[0])}KM` || '暂无数据',
			lat: marker.latitude,
			lng: marker.longitude,
			addressName: marker.name,
			address: marker.addr,
			infoList: []
		}
		mapDetailShow.value = true
	}
}
// 登录
const hasUser = async () => {
	$globalEventBus.emit('loginIn', 0);
};
// 拨打电话
const handleTel = (v) => {
	window.location.href = `tel:${v}`;
}
const handleSearch = async (v) => {
	loading.value = true
	const res = await useMy.queryFuzzy({ name: v });
	if (res?.code === 200) {
		loading.value = false
	} else {
		loading.value = false
		showToast(res.msg);
	}
};
// 区划选中事件
const cityChange = (status, v) => {
	searchInfo.value.xmproject = v
	getMarkList(status);
}
// 初始化没值的时候 赋值有值的数据
const initData = (egion, xmproject, isMycity) => {
	searchInfo.value.egion = egion == '全部' ? '' : egion;
	searchInfo.value.xmproject = xmproject;
	searchInfo.value.manage = '';
	getMarkList(isMycity);
}
const initDatas = async (egion, xmproject, list) => {
	loading.value = true
	searchInfo.value.egion = egion == '全部' ? '' : egion;;
	searchInfo.value.xmproject = xmproject;
	searchInfo.value.manage = '';
	markers.value = [];
	const res = await useMy.getPointInfo(searchInfo.value);
	if (res?.code === 200) {
		res.data.forEach(v => {
			v.position = [v.longitude, v.latitude],
				v.type = useMy.$state.companyName,
				v.text = {
					content: v.name,
					direction: 'top',
					style: {
						fontSize: 15,
						fillColor: '#fff',
						strokeWidth: 0,
						padding: [1, 5],
						backgroundColor: '#A94D36',
						borderColor: '',
						borderWidth: 0,
					}
				}
		});
		zoom.value = 12
		markers.value = res.data;
		setCompanyNum(res.data.length);
		center.value = list
		loading.value = false;
	} else {
		loading.value = false;
		showToast(res.msg);
	}
}
// 没数据清理缓存
const clearData = () => {
	markers.value = [];
	showToast('暂无数据');
}
// 类型切换事件
const stausChange = (v, isCity) => {
	searchInfo.value.manage = v
	getMarkList(isCity);
}
// 显示地图文本标记事件
const textChange = async (v) => {
}
// 筛选点事件
const selectList = (v) => {
	searchInfo.value.egion = v
}
// 关闭图例事件
const closeLegend = () => {
	$globalEventBus.emit('LegendClick', false);
}
const isShowSheet = ref(false)
const sheetList = [
	{
		name: '百度地图',
		id: 1,
	},
	{
		name: '高德地图',
		id: 2,
	},
	{
		name: '腾讯地图',
		id: 3,
	}
]

const navigateLine = () => {
	isWx().then((res) => {
		if (res !== 'no-wx') {
			navigationWx(getLocation())
		} else {
			isShowSheet.value = true
		}
	})
}
// 选择导航
const handleSheetSelect = (action) => {
	navToMap(getLocation(), action.id)
}

// 获取位置信息
const getLocation = () => {
	return {
		lat: locationObj.value.lat,
		lng: locationObj.value.lng,
		name: locationObj.value.addressName,
		address: locationObj.value.address
	}
}
// 获取点的数组 
const getMarkList = async (v) => {
	loading.value = true;
	markers.value = [];
	const res = await useMy.getPointInfo(searchInfo.value);
	if (res?.code === 200) {
		res.data.forEach(v => {
			v.position = [v.longitude, v.latitude],
				v.type = useMy.$state.companyName,
				v.text = {
					content: v.name,
					direction: 'top',
					style: {
						fontSize: 15,
						fillColor: '#fff',
						strokeWidth: 0,
						padding: [1, 5],
						backgroundColor: '#A94D36',
						borderColor: '',
						borderWidth: 0,
					}
				}
		});
		markers.value = res.data;
		setCompanyNum(res.data.length);
		if (markers.value && markers.value.length > 0) {
			center.value = [markers.value[0].longitude, markers.value[0].latitude]
		}
		if (useMy.$state.centerCoordinate) {
			center.value = useMy.$state.centerCoordinate
		}
		if (v && v == true) {
			if (useMy.$state.coordinate.length == 0) {
				// 获取定位失败 优先取getlocal的缓存
				if (getlocal('Coordinate')) {
					center.value = getlocal('Coordinate')
				} else if (isPCFun()) {
					center.value = enterprisecenter.value
				} else {
					if (markers.value && markers.value.length > 0) {
						center.value = [markers.value[0].longitude, markers.value[0].latitude]
					} else {
						center.value = [120.199675, 30.263458]
					}
				}
			} else {
				center.value = useMy.$state.coordinate
				zoom.value = 12
			}

		}
		if (v == false) {
			if (markers.value && markers.value.length > 0) {
				center.value = [markers.value[0].longitude, markers.value[0].latitude]
			}
		}
		loading.value = false;
	} else {
		showToast(res.msg);
		loading.value = false;
	}
}
// 获取用户信息
const queryUserInfo = async (v) => {
	const res = await useMy.getUserInfo({ code: v });
	if (res?.code === 200) {
		setSession("TOKEN", res.token);
		showToast('授权成功');
		setlocal('isLoginSucc', true)
		console.log('setisLogin', true)
		console.log('setisLogin---', getlocal('isLoginSucc'))
	} else {
		removelocal('isLoginSucc')
		showToast(res.msg);
	}
}
onBeforeMount(() => {
	const searchParams = new URLSearchParams(window.location.search);
	const code = searchParams.get('code');
	if (code && getSession('companyName')) {

	} else {
		lazyAMapApiLoaderInstance.then(() => {
			if (isPCFun()) {
				useGeolocation({
					enableHighAccuracy: true,
					needAddress: true
				}).then(res => {
					const { getCurrentPosition } = res;
					getCurrentPosition().then(currentPosition => {
						enterprisecenter.value = currentPosition.position.toArray()
						setlocal('Coordinate', enterprisecenter.value)
					});
				})
			}
			useCitySearch().then(res => {
				const { getLocalCity } = res;
				getLocalCity().then(cityResult => {
					center.value = cityResult.bounds.getCenter().toArray()
				})
			})
		})
	}
})
//页面回刷 保存历史记录信息
const setDataSearch = async () => {
	// loading.value = true;
	markers.value = [];
	let companyName = getSession('companyName') == '全部' || getSession('companyName') == '' ? '' : getSession('companyName');
	let adcdName = getSession('adcdName') ? getSession('adcdName') : ''
	let typeChange = ''
	const map = {
		'0': '',
		'1': '案场',
		'2': '项目',
	};
	typeChange = map[getSession('typeChange')] || "";
	// 设置管理的筛选条件 赋值用
	// $globalEventBus.emit('userChange', { cityName: companyName, isChange: typeChange })
	let data = {
		egion: companyName,
		xmproject: adcdName,
		manage: typeChange,
	}
	console.log('data---------------', data)
	const res = await useMy.getPointInfo(data);
	if (res?.code === 200) {
		console.log('res.data', res.data)
		res.data.forEach(v => {
			v.position = [v.longitude, v.latitude],
				v.type = useMy.$state.companyName,
				v.text = {
					content: v.name,
					direction: 'top',
					style: {
						fontSize: 15,
						fillColor: '#fff',
						strokeWidth: 0,
						padding: [1, 5],
						backgroundColor: '#A94D36',
						borderColor: '',
						borderWidth: 0,
					}
				}
		});
		markers.value = res.data;
		setCompanyNum(res.data.length);
		if (markers.value && markers.value.length > 0) {
			center.value = [markers.value[0].longitude, markers.value[0].latitude]
			// if (mapRef.value) {
			// 	mapRef.value.$$getInstance().setCenter(center.value)
			// }
		}
		loading.value = false;
		removeSession('companyName')
		removeSession('adcdName')
		removeSession('typeChange')
	} else {
		showToast(res.msg);
		loading.value = false;
		removeSession('companyName')
		removeSession('adcdName')
		removeSession('typeChange')
	}
}
// 判断地图放大还是缩小
const onMapChange = (event) => {
	if (hasAllChange.value == true) return
	const newZoom = event.target.getZoom(); // 获取新的缩放级别
	if (newZoom > zoomLever.value) {
		// iszoomChange.value = true
		// // 地图放大
		// console.log('地图放大');
	} else if (newZoom < zoomLever.value) {
		// 地图缩小
		// iszoomChange.value = false
		console.log('地图缩小');
	} else {
		// 缩放级别未改变
		// iszoomChange.value = false
		console.log('缩放级别未改变');
	}
	zoomLever.value = newZoom; // 更新旧的缩放级别
}
// 地图事件
const onUpdatedZoom = (e) => {
	$globalEventBus.emit('LegendClick', false);
	if (iszoomChange.value == true) return
	if (useMy.$state.companyName == '全部' || useMy.$state.companyName == '') return
	if (Math.round(e) <= 5) {
		setCompanyZoom('全部')
		setCompanyName('')
		iszoomChange.value = false
		$globalEventBus.emit('zoomChange', '全部')
	}
}
// 完成事件
const zoomend = () => {
	// console.log('1', 1)
	if (iszoomChange.value == true) return iszoomChange.value = false
}
$globalEventBus.on("setZoom", eventData => {
	zoom.value = eventData
	iszoomChange.value = true
	// hasAllChange.value = true
	mapRef.value.$$getInstance().setZoom(12)
	// mapRef.value.$$getInstance().setZoom(12).resize();
	// hasAllChange.value = false
});
onMounted(() => {
	const searchParams = new URLSearchParams(window.location.search);
	const code = searchParams.get('code');
	console.log('getlocal', getlocal('isLoginSucc'))
	console.log('code', code)
	if (code && !getSession('TOKEN')) {
		queryUserInfo(code);
	} else if (code == null && getlocal('isLoginSucc') == true) {
		$globalEventBus.emit('loginIn', 0);
	}
})
</script>


<style scoped lang="less">
.app {
	width: 100%;
	height: 100%;
}

:deep(.amap-icon img) {
	width: 34px;
	height: 39px;
}



:deep(.amap-logo) {
	display: none;
	opacity: 0 !important;
}

:deep(.amap-copyright) {
	opacity: 0;
}

.marker-content {
	width: 120.5px;
	height: 33.5px;
	line-height: 30.5px;
	font-size: 14px;
	font-weight: 500;
	color: #0D79FD;
	background-image: url("~@/assets/images/prop.png");
	background-size: 100% 100%;
	text-align: center;
}

.marker-contents {
	width: 150.5px;
	height: 33.5px;
	line-height: 30.5px;
	font-size: 14px;
	font-weight: 500;
	color: #0D79FD;
	background-image: url("~@/assets/images/prop.png");
	background-size: 100% 100%;
	text-align: center;
}

.marker-content_pc {
	width: 35.5px;
	height: 10px;
	line-height: 9px;
	font-size: 4px;
	font-weight: 500;
	color: #0D79FD;
	background-image: url("~@/assets/images/prop.png");
	background-size: 100% 100%;
	text-align: center;

	.title {
		padding: 0px 0 0px 0;
	}

	.img {
		img {
			width: 12px;
			height: 12px;
			padding-left: 10px;
			padding-top: 1px;
		}

	}
}

.title {
	padding: 0px 0 0px 0;
}

.wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
}

.block {
	width: 330px;
	min-height: 253px;
	background: #FFFFFF;
	border-radius: 8px;
	position: relative;
}

.block_pc {
	width: 150px;
	height: 120px;
	background: #FFFFFF;
	border-radius: 4px;
	position: relative;
}

.closeBtn {
	float: right;
	margin: 12px 27.5px 0 0;
}

.closeBtn_pc {
	float: right;
	margin: 6px 10px 0 0;
	cursor: pointer;
}

.Maptitle {
	width: 225px;
	font-size: 18px;
	font-weight: 500;
	color: #383E44;
	margin: 28.5px 0 14px 18px;
}

.Maptitle_pc {
	width: 100px;
	font-size: 9px;
	font-weight: 500;
	color: #383E44;
	margin: 9px 0 6.5px 9px;
}

.Mapcontant {
	width: 225px;
	font-size: 13px;
	font-weight: 400;
	color: #7A868D;
	margin-bottom: 14px;
	margin-left: 18px;
	word-wrap: break-word;
	word-break: break-all;
}

.Mapcontant_pc {
	width: 100px;
	font-size: 6.5px;
	font-weight: 400;
	color: #7A868D;
	margin-bottom: 5px;
	margin-left: 9px;
	word-wrap: break-word;
	word-break: break-all;
}

.Mapdistanc {
	font-size: 13px;
	font-weight: 400;
	color: #7A868D;
	margin-left: 18px;
}

.Mapdistanc_pc {
	font-size: 6.5px;
	font-weight: 400;
	color: #7A868D;
	margin-left: 9px;
}

.Mapimg {
	width: 64.5px;
	height: 62px;
	position: absolute;
	right: 18px;
	top: 41px;
}

.Mapimg_pc {
	width: 32.5px;
	height: 31px;
	position: absolute;
	right: 9px;
	top: 15px;
}

.Mapbtn,
.Mapbtns {
	width: 259.5px;
	height: 36px;
	line-height: 36px;
	background: #0D79FD;
	box-shadow: 0px 5px 10px 0px rgba(13, 121, 253, 0.07);
	border-radius: 18px;
	margin-left: 33px;
	margin-top: 37.5px;
	text-align: center;
	font-size: 14px;
	font-family: PingFangSC, PingFang SC;
	font-weight: 400;
	color: #FFFFFF;
	margin-bottom: 10px;
}

.Mapbtn_pc,
.Mapbtns_pc {
	width: 115px;
	height: 16px;
	line-height: 16px;
	background: #0D79FD;
	cursor: pointer;
	box-shadow: 0px 2.5px 5px 0px rgba(13, 121, 253, 0.07);
	border-radius: 9px;
	margin-left: 16px;
	margin-top: 18px;
	text-align: center;
	font-size: 7px;
	font-family: PingFangSC, PingFang SC;
	font-weight: 400;
	color: #FFFFFF;
	margin-bottom: 5px;
}

.Mapbtns,
.Mapbtns_pc {
	margin-top: 0px;
}

.Maptips {
	margin-top: 20.5px;
	margin-left: 90.5px;
	font-size: 15px;
	font-family: PingFangSC, PingFang SC;
	font-weight: 400;
	color: #7A868D;

	.span {
		color: #0D79FD;
		font-weight: 600;
		margin-left: 3px;
	}
}

.Maptips_pc {
	margin-top: 10.5px;
	margin-left: 40.5px;
	font-size: 7.5px;
	font-family: PingFangSC, PingFang SC;
	font-weight: 400;
	cursor: pointer;
	color: #7A868D;

	.span {
		color: #0D79FD;
		font-weight: 600;
		margin-left: 3px;
	}
}

.Mapinfo {
	width: 294.5px;
	// height: 70px;
	margin-left: 18px;
	padding-top: 14px;
	border-top: 1px solid #D9D9D9;
	margin-top: 6px;
	margin-bottom: 4px;
	padding-bottom: 10px;
}

.Mapinfo_pc {
	width: 140;
	// height: 35px;
	margin-left: 9px;
	padding-top: 7px;
	border-top: 0.5px solid #D9D9D9;
	margin-top: 3px;
}

.Mapinfo_box {
	font-size: 13px;
	font-weight: 400;
	color: #8D8D8D;
	// white-space: nowrap;
	width: 100%;
	margin-bottom: 3.5px;
	word-wrap: break-word;
	word-break: break-all;

	span {
		color: #3F454A;
		font-weight: 500;
	}
}

.Mapinfo_box_pc {
	font-size: 13px;
	font-weight: 400;
	color: #8D8D8D;
	// white-space: nowrap;
	width: 100%;
	margin-bottom: 2px;
	word-wrap: break-word;
	word-break: break-all;

	span {
		color: #3F454A;
		font-weight: 500;
	}
}

.mt15 {
	margin-top: 10px;
}

.mt15_pc {
	margin-top: 5px;
}

.ml585 {
	margin-left: 20px;
}

.ml585_pc {
	margin-left: 10px;
}

.ml385 {
	margin-left: 38.5px;
}

.ml385_pc {
	margin-left: 17.5px;
}

:deep(.amap-geolocation) {
	bottom: 90px !important;
}

:deep(.amap-toolbar) {
	bottom: 70px !important;
}
</style>