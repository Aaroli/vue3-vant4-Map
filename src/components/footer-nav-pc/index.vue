<template>
	<div class="footer_nav">
		<div class="img" @click="hasLegendClick"></div>
		<div class="title" @click="hasLegendClick" v-text="useMy.$state.companyName"></div>
		<div class="right__nav">
			<div class="right__nav_img">
				<img class="imgIcon" :src="getImg()" />
			</div>
			<div class="num__lable">项目总数</div>
			<div class="num__num">{{ numberWithCommas(useMy.$state.companyNum) }}</div>
		</div>
	</div>
</template>

<script setup name="footerNavPc">
import { getSession } from "@/util/util";
import img1 from '@/assets/images/i_compny1.png'
import img2 from '@/assets/images/i_compny2.png'
import img3 from '@/assets/images/i_compny3.png'
import img4 from '@/assets/images/i_compny4.png'
import img5 from '@/assets/images/i_compny5.png'
const { useMy } = $globalStore;
const router = useRouter();
const num = ref('356142')
const text = ref('')
const getImg = () => {
	const map = {
		'全部': img1,
		'万家': img1,
		'新城': img2,
		'海岸': img3,
		'浙中南': img4,
		'萧山滨弘': img5,
	};
	return map[useMy.$state.companyName] || "";
}
const numberWithCommas = (x) => {
	if (x == 0) return 0
	if (!x) return
	x = x.toString();
	var pattern = /(-?\d+)(\d{3})/;
	while (pattern.test(x))
		x = x.replace(pattern, "$1,$2");
	return x;
}
// 唤起图例事件
const hasLegendClick = () => {
	$globalEventBus.emit('LegendClick', true);
}
onMounted(() => {
})
</script>
<style lang="less" scoped>
.footer_nav {
	display: flex;
	// justify-content: space-between;
	position: relative;
}

.right__nav {
	position: relative;
	width: 122px;
	height: 20px;
	line-height: 20px;
	background: #0D79FD;
	border-radius: 6px;
	margin-top: 2px;
	margin-right: 2px;
	// float: right;
	display: flex;
	position: absolute;
	right: 2px;

	&_img {
		position: relative;
		width: 16px;
		height: 16px;
		background: #FFFFFF;
		border-radius: 6px;
		margin: 2px 0 0 2px;

		.imgIcon {
			position: absolute;
			width: 12px;
			height: 12px;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}
	}
}

.img {
	width: 12px;
	height: 12px;
	margin-top: 7.5px;
	margin-left: 9.5px;
	background-image: url("~@/assets/images/Group 427319587.png");
	background-size: 100% 100%;
	cursor: pointer;
}

.title {
	height: 12px;
	font-size: 6px;
	font-weight: 500;
	color: #48535A;
	margin-left: 5px;
	margin-top: 6px;
	line-height: 12px;
	padding-top: 1px;
	cursor: pointer;
}

.num__lable {
	margin: 0 0 0 2px;
	font-size: 7px;
	font-weight: 500;
	color: #FFFFFF;
}

.num__num {
	// position: absolute;
	// right: 75px;
	margin-left: 10px;
	font-size: 9px;
	font-weight: normal;
	color: #FFFFFF;
	// float: right;
}
</style>