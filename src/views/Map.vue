<!--
 * @Description: 
 * @Version: 1.0
 * @Author: AaroLi
 * @Date: 2024-01-03 09:33:21
 * @LastEditors: AaroLi
 * @LastEditTime: 2024-01-16 07:59:34
-->
<template>
	<div class="app">
		<!-- 导航栏 -->
		<div class="header_body">
			<header-nav v-if="phoneType()" :leftArrow="false" @handleSearch="handleSearch" @cityChange="cityChange"
				@stausChange="stausChange" @initData="initData" titelText="首页"></header-nav>
			<header-nav-pc v-if="!phoneType()" :leftArrow="false" @handleSearch="handleSearch" @cityChange="cityChange"
				@stausChange="stausChange" @initData="initData" titelText="首页"></header-nav-pc>
		</div>
		<!-- 地图容器 -->
		<el-amap @update:zoom="onUpdatedZoom" v-model:center="center" :zoom="zoom">
			<!-- 地图标记 -->
			<el-amap-marker :visible="textVisible" v-for="marker in markers" :key="marker.id" :position="marker.position"
				:offset="[-50, -35]" :iconSize="[5, 5]" @click="(e) => { clickArrayMarker(marker, e) }">
				<div class="marker-content">
					<div class="title">{{ marker.name }}</div>
				</div>
			</el-amap-marker>
			<el-amap-marker v-for="marker in markers" :key="marker.id" :position="marker.position"
				:icon="getImgType(marker.type)" :iconSize="[5, 5]" @click="(e) => { clickArrayMarker(marker, e) }" />
			<!-- 比例尺 -->
			<el-amap-control-scale :visible="ScaleVisible" />
			<!-- 缩放控件 -->
			<el-amap-control-tool-bar :visible="ScalinVisible" />
			<!-- 地图类型切换 -->
			<el-amap-control-map-type :visible="MapStatusvisible" />
			<!-- 定位 -->
			<!-- <el-amap-control-geolocation :visible="true" @complete="aaa" /> -->
		</el-amap>
		<!-- 底部 -->
		<div class="footer_body" v-if="phoneType()">
			<footer-nav></footer-nav>
		</div>
		<div class="footer_body_pc" v-if="!phoneType()">
			<footer-nav-pc></footer-nav-pc>
		</div>
		<div class="legend_body">
			<legend-nav @textChange="textChange" @selectList="selectList" />
		</div>

		<!-- 地图信息 -->
		<van-overlay :show="mapDetailShow" z-index="3" @click="mapDetailShow = false">
			<div class="wrapper" @click.stop>
				<div class="block">
					<van-icon name="cross" size="20" class="closeBtn" @click="mapDetailShow = false" />
					<div class="Maptitle">{{ locationObj.title }}</div>
					<div class="Mapcontant">{{ locationObj.contant }}</div>
					<div class="Mapdistanc">{{ locationObj.distanc }}</div>
					<img class="Mapimg" :src="getImgType('title')" />
					<div v-if="!getSession('TOKEN')" class="Mapbtn" @click="navigateLine">到这里去</div>
					<div v-if="!getSession('TOKEN')" class="Maptips">查看更多详情<span class="span" @click="hasUser">去登录</span>
					</div>
					<div v-if="getSession('TOKEN')" class="Mapinfo">
						<div class="Mapinfo_box">
							<div>项目主任：<span>{{ locationObj.name }}</span></div>
							<div class="ml585">联系方式：<span>{{ locationObj.phone }}</span></div>
						</div>
						<div class="Mapinfo_box mt15">
							<div>项目面积：<span>{{ locationObj.mj }}</span></div>
							<div class="ml385">物业费：<span>{{ locationObj.wyf }}</span></div>
						</div>
					</div>
					<div v-if="getSession('TOKEN')" class="Mapbtns" @click="navigateLine">到这里去</div>
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
import { getSession, navigationWx, isWx, navToMap, setCompanyNum, phoneType, calcDistance, initWx } from "@/util/util";
import { useCitySearch, lazyAMapApiLoaderInstance } from "@vuemap/vue-amap";
import { showToast } from "vant";
const { useMy } = $globalStore
const router = useRouter();
import img1 from '@/assets/images/point_blue.png'
import img2 from '@/assets/images/point_green.png'
import img3 from '@/assets/images/point_purple.png'
import img4 from '@/assets/images/point_red.png'
import img5 from '@/assets/images/point_yellow.png'
import img_mag_title from '@/assets/images/img_mag_title.png'

const mapDetailShow = ref(false) //地图prop
const loading = ref(false) //地图loading
const searchInfo = ref({
	egion: '', //公司列表
	xmproject: '', //区划
	type: '', //类型
})
// 地图标记
const markers = ref([
	// { id: 1, object: '万家', position: [120.01, 30.040], type: '1', title: '富阳旅游项目', locationObj: { title: '富阳旅游项目', name: '张涵', phone: '17232111322', mj: '21.5万㎡', wyf: '1.9元/㎡/月', type: 'title1', contant: '浙江省杭州市富阳区富春路3201室', distanc: '8.6KM' } },
	// { id: 2, object: '新城', position: [120.012, 30.080], type: '2', title: '基村招商项目', locationObj: { title: '基村招商项目', name: '建华', phone: '17247987412', mj: '30.72万㎡', wyf: '2.4元/㎡/月', type: 'title1', contant: '浙江省杭州市富阳区吉村路320室', distanc: '12.15KM' } },
	// { id: 3, object: '海岸', position: [120.036, 30.060], type: '3', title: '春江度假项目', locationObj: { title: '春江度假项目', name: '汪明', phone: '18647619988', mj: '60.72万㎡', wyf: '3.6元/㎡/月', type: 'title1', contant: '浙江省杭州市富阳区春江路204铺', distanc: '14.74KM' } },
	// { id: 4, object: '浙中南', position: [120.032, 30.019], type: '4', title: '唐家物业项目', locationObj: { title: '唐家物业项目', name: '李萧', phone: '18647618189', mj: '20.12万㎡', wyf: '2.6元/㎡/月', type: 'title1', contant: '浙江省杭州市富阳区自在路32号', distanc: '14.51KM' } },
	// { id: 5, object: '萧山滨弘', position: [120.009, 30.001], type: '5', title: '自在村园项目', locationObj: { title: '自在村园项目', name: '张健', phone: '18647618284', mj: '12.32万㎡', wyf: '1.6元/㎡/月', type: 'title1', contant: '浙江省杭州市富阳区陈家路', distanc: '12.3KM' } },
	// { id: 6, object: '万家', position: [120.07, 30.0441], type: '1', title: '李山镇乡项目', locationObj: { title: '李山镇乡项目', name: '李潇', phone: '14777061444', mj: '40.22万㎡', wyf: '7.6元/㎡/月', type: 'title1', contant: '浙江省杭州市富阳区灵山区', distanc: '11.8KM' } },
	// { id: 7, object: '新城', position: [120.072, 30.080], type: '2', title: '桥头招商项目', locationObj: { title: '桥头招商项目', name: '吴枝', phone: '18644110012', mj: '24.42万㎡', wyf: '4.6元/㎡/月', type: 'title1', contant: '浙江省杭州市富阳区唐家路32号', distanc: '10.91KM' } },
	// { id: 8, object: '海岸', position: [120.069, 30.060], type: '3', title: '东洲赵家项目', locationObj: { title: '东洲赵家项目', name: '李渺', phone: '15247860031', mj: '33.12万㎡', wyf: '3.6元/㎡/月', type: 'title1', contant: '浙江省杭州市富阳区自在路76号', distanc: '19.57KM' } },
	// { id: 9, object: '浙中南', position: [120.072, 30.019], type: '4', title: '家装物业项目', locationObj: { title: '家装物业项目', name: '沈红', phone: '14777966321', mj: '15.72万㎡', wyf: '2.53元/㎡/月', type: 'title1', contant: '浙江省杭州市富阳区陈家路96号', distanc: '17.34KM' } },
	// { id: 10, object: '萧山滨弘', position: [120.099, 30.001], type: '5', title: '森林公园项目', locationObj: { title: '森林公园项目', name: '晓蓉', phone: '14247562211', mj: '70.72万㎡', wyf: '2.2元/㎡/月', type: 'title1', contant: '浙江省杭州市富阳区灵山31号', distanc: '17.32KM' } },
])
const markersAll = ref([
	// { id: 1, object: '万家', position: [120.01, 30.040], type: '1', title: '富阳旅游项目', locationObj: { title: '富阳旅游项目', name: '张涵', phone: '17232111322', mj: '21.5万㎡', wyf: '1.9元/㎡/月', type: 'title1', contant: '浙江省杭州市富阳区富春路3201室', distanc: '8.6KM' } },
	// { id: 2, object: '新城', position: [120.012, 30.080], type: '2', title: '基村招商项目', locationObj: { title: '基村招商项目', name: '建华', phone: '17247987412', mj: '30.72万㎡', wyf: '2.4元/㎡/月', type: 'title1', contant: '浙江省杭州市富阳区吉村路320室', distanc: '12.15KM' } },
	// { id: 3, object: '海岸', position: [120.036, 30.060], type: '3', title: '春江度假项目', locationObj: { title: '春江度假项目', name: '汪明', phone: '18647619988', mj: '60.72万㎡', wyf: '3.6元/㎡/月', type: 'title1', contant: '浙江省杭州市富阳区春江路204铺', distanc: '14.74KM' } },
	// { id: 4, object: '浙中南', position: [120.032, 30.019], type: '4', title: '唐家物业项目', locationObj: { title: '唐家物业项目', name: '李萧', phone: '18647618189', mj: '20.12万㎡', wyf: '2.6元/㎡/月', type: 'title1', contant: '浙江省杭州市富阳区自在路32号', distanc: '14.51KM' } },
	// { id: 5, object: '萧山滨弘', position: [120.009, 30.001], type: '5', title: '自在村园项目', locationObj: { title: '自在村园项目', name: '张健', phone: '18647618284', mj: '12.32万㎡', wyf: '1.6元/㎡/月', type: 'title1', contant: '浙江省杭州市富阳区陈家路', distanc: '12.3KM' } },
	// { id: 6, object: '万家', position: [120.07, 30.0441], type: '1', title: '李山镇乡项目', locationObj: { title: '李山镇乡项目', name: '李潇', phone: '14777061444', mj: '40.22万㎡', wyf: '7.6元/㎡/月', type: 'title1', contant: '浙江省杭州市富阳区灵山区', distanc: '11.8KM' } },
	// { id: 7, object: '新城', position: [120.072, 30.080], type: '2', title: '桥头招商项目', locationObj: { title: '桥头招商项目', name: '吴枝', phone: '18644110012', mj: '24.42万㎡', wyf: '4.6元/㎡/月', type: 'title1', contant: '浙江省杭州市富阳区唐家路32号', distanc: '10.91KM' } },
	// { id: 8, object: '海岸', position: [120.069, 30.060], type: '3', title: '东洲赵家项目', locationObj: { title: '东洲赵家项目', name: '李渺', phone: '15247860031', mj: '33.12万㎡', wyf: '3.6元/㎡/月', type: 'title1', contant: '浙江省杭州市富阳区自在路76号', distanc: '19.57KM' } },
	// { id: 9, object: '浙中南', position: [120.072, 30.019], type: '4', title: '家装物业项目', locationObj: { title: '家装物业项目', name: '沈红', phone: '14777966321', mj: '15.72万㎡', wyf: '2.53元/㎡/月', type: 'title1', contant: '浙江省杭州市富阳区陈家路96号', distanc: '17.34KM' } },
	// { id: 10, object: '萧山滨弘', position: [120.099, 30.001], type: '5', title: '森林公园项目', locationObj: { title: '森林公园项目', name: '晓蓉', phone: '14247562211', mj: '70.72万㎡', wyf: '2.2元/㎡/月', type: 'title1', contant: '浙江省杭州市富阳区灵山31号', distanc: '17.32KM' } },
])
const zoom = ref(12)
// 比例尺
const ScaleVisible = ref(false)
// 文本标记
const textVisible = ref(true)
// 缩放控件
const ScalinVisible = ref(false)
// 地图类型切换
const MapStatusvisible = ref(false)
// 地图中心点
const center = ref([120.05, 30.04])
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
	address: '杭州市西湖区武林广场'
})
// 地图事件
const onUpdatedZoom = (e) => {
	// console.log('地图缩放事件')
}

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
	locationObj.value = {
		title: marker.name ? marker.name : '暂无数据',
		name: marker.leaderName ? marker.leaderName : '暂无数据',
		phone: '暂无数据',
		mj: '暂无数据',
		wyf: '暂无数据',
		// mj: '--万㎡',
		// wyf: '--元/㎡/月',
		contant: marker.addr ? marker.addr : '暂无数据',
		distanc: `${calcDistance(useMy.$state.coordinate[1], useMy.$state.coordinate[0], marker.position[1], marker.position[0])}KM` || '暂无数据',
		lat: marker.latitude,
		lng: marker.longitude,
		addressName: marker.name,
		address: marker.addr
	}
	mapDetailShow.value = true
}
// 登录
const hasUser = async () => {
	const res = await useMy.getSingleUrl();
	if (res?.code === 200) {
		window.location = res.qw_auth_url
	} else {
		showToast(res.msg);
	}
	// router.push({ name: "login" });
};
const handleSearch = (v) => {
	loading.value = true
	setTimeout(() => {
		if (v != '') {
			markers.value = markers.value.filter((value) => {
				return value.title.match(v);
			});
		} else {
			markers.value = markersAll.value;
		}
		loading.value = false

	}, 3000);
};
// 区划选中事件
const cityChange = (v) => {
	searchInfo.value.xmproject = v
	getMarkList();
}
// 初始化没值的时候 赋值有值的数据
const initData = (egion, xmproject) => {
	searchInfo.value.egion = egion;
	searchInfo.value.xmproject = xmproject;
	searchInfo.value.type = '';
	getMarkList();
}
// 类型切换事件
const stausChange = (v) => {
	searchInfo.value.type = v
	getMarkList();
}
// 显示地图文本标记事件
const textChange = async (v) => {
	// textVisible.value = v
}
// 筛选点事件
const selectList = (v) => {
	searchInfo.value.egion = v
	// getMarkList();
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
		// lat: '30.061333',
		// lng: '120.001',
		// name: 'A',
		// address: '杭州市西湖区武林广场'
	}
}
// 获取点的数组 
const getMarkList = async () => {
	markers.value = [];
	const res = await useMy.getPointInfo(searchInfo.value);
	if (res?.code === 200) {
		res.data.forEach(v => {
			v.position = [v.longitude, v.latitude],
				v.type = useMy.$state.companyName
		});
		markers.value = res.data;
		setCompanyNum(res.data.length);
		if (markers.value && markers.value.length > 0) {
			center.value = [markers.value[0].longitude, markers.value[0].latitude]
		}
	} else {
		showToast(res.msg);
	}
}
// 获取用户信息
const queryUserInfo = async (v) => {
	const res = await useMy.getUserInfo({ code: v });
	if (res?.code === 200) {
		setSession("TOKEN", res.token);
		showToast('授权成功');
	} else {
		showToast(res.msg);
	}
}
onBeforeMount(() => {
	initWx();
	lazyAMapApiLoaderInstance.then(() => {
		useCitySearch().then(res => {
			const { getLocalCity } = res;
			getLocalCity().then(cityResult => {
				center.value = cityResult.bounds.getCenter().toArray()
				console.log('cityResult', cityResult)
			})
		})
	})
})
onMounted(() => {
	const searchParams = new URLSearchParams(window.location.search);
	const code = searchParams.get('code');
	// console.log('code', code)
	if (code) {
		queryUserInfo(code);
	}
})
</script>


<style scoped>
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
	width: 100.5px;
	height: 30.5px;
	line-height: 28.5px;
	font-size: 14px;
	font-weight: 500;
	color: #0D79FD;
	background-image: url("~@/assets/images/prop.png");
	background-size: 100% 100%;
	text-align: center;
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

.closeBtn {
	float: right;
	margin: 12px 27.5px 0 0;
}

.Maptitle {
	width: 225px;
	height: 24px;
	font-size: 18px;
	font-weight: 500;
	color: #383E44;
	margin: 28.5px 0 16.5px 18px;
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

.Mapdistanc {
	font-size: 13px;
	font-weight: 400;
	color: #7A868D;
	margin-left: 18px;
}

.Mapimg {
	width: 64.5px;
	height: 62px;
	position: absolute;
	right: 18px;
	top: 41px;
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

.Mapbtns {
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

.Mapinfo {
	width: 294.5px;
	height: 70px;
	margin-left: 18px;
	padding-top: 14px;
	border-top: 1px solid #D9D9D9;
	margin-top: 6px;
}

.Mapinfo_box {
	display: flex;
	font-size: 13px;
	font-weight: 400;
	color: #8D8D8D;
	white-space: nowrap;
	width: 50%;

	span {
		color: #3F454A;
		font-weight: 500;
	}
}

.mt15 {
	margin-top: 10px;
}

.ml585 {
	margin-left: 20px;
}

.ml385 {
	margin-left: 38.5px;
}

:deep(.amap-geolocation) {
	bottom: 90px !important;
}
</style>