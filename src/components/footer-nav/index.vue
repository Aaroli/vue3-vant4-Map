<template>
	<div class="footer_nav">
		<div class="img"></div>
		<div class="title" v-text="useMy.$state.companyName"></div>
		<div class="right__nav">
			<div class="right__nav_img">
				<img class="imgIcon" :src="getImg()" />
			</div>
			<div class="num__lable">项目总数</div>
			<div class="num__num">{{ numberWithCommas(useMy.$state.companyNum) }}</div>
		</div>
	</div>
</template>

<script setup name="footerNav">
import img1 from '@/assets/images/i_compny1.png'
import img2 from '@/assets/images/i_compny2.png'
import img3 from '@/assets/images/i_compny3.png'
import img4 from '@/assets/images/i_compny4.png'
import img5 from '@/assets/images/i_compny5.png'
const { useMy } = $globalStore;
const num = ref('356142')
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
	width: 243px;
	height: 40px;
	line-height: 40px;
	background: #0D79FD;
	border-radius: 12px;
	margin-top: 4px;
	margin-right: 4px;
	// float: right;
	display: flex;
	position: absolute;
	right: 4px;

	&_img {
		position: relative;
		width: 32px;
		height: 32px;
		background: #FFFFFF;
		border-radius: 12px;
		margin: 4px 0 0 4px;

		.imgIcon {
			position: absolute;
			width: 23px;
			height: 23px;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}
	}
}

.img {
	width: 24px;
	height: 24px;
	margin-top: 12px;
	margin-left: 18.5px;
	background-image: url("~@/assets/images/Group 427319587.png");
	background-size: 100% 100%;
}

.title {
	height: 24px;
	font-size: 12px;
	font-weight: 500;
	color: #48535A;
	margin-left: 5px;
	margin-top: 12px;
	line-height: 24px;
	padding-top: 2px;
}

.num__lable {
	margin: 0 0 0 4px;
	font-size: 14px;
	font-weight: 500;
	color: #FFFFFF;
}

.num__num {
	position: absolute;
	// right: 12px;
	left: 110px;
	font-size: 18px;
	font-weight: normal;
	color: #FFFFFF;
	// float: right;
}
</style>