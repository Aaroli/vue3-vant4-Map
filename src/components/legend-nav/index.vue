<!--
 * @Description: 
 * @Version: 1.0
 * @Author: AaroLi
 * @Date: 2024-01-03 11:27:10
 * @LastEditors: AaroLi
 * @LastEditTime: 2024-01-18 07:29:06
-->
<template>
	<div class="legend_nav">
		<!-- <div class="legend__nav" @click="handleChange" v-if="legendShow">
			<img class="imgIcon" :src="img1" />
		</div> -->
		<div class="box">
			<div class="tab-content" ref="stateDom">
				<div class="tab-content-box">
					<!-- <div class="allBox" :class="isChange === 0 ? 'activeBox' : ''" @click="change('', 0)">全部</div> -->
					<p v-for="item in legendList" :key="item.id" :class="isChange === item.id ? 'activeBox' : ''"
						@click="change(item, item.id)"><span :class="getClass(item.id)"></span>{{ item.name }}</p>
					<!-- <div class="closeBox">
						<van-icon name="arrow-up" size="20" @click="handleChange" />
					</div>-->
				</div>
			</div>
			<div class="triangle" v-if="isTriangleShow">
			</div>
		</div>
	</div>
</template>

<script setup name="legendNav">
import { setCompanyNum, setCompanyName } from "@/util/util";
const { useMy } = $globalStore
import { showToast } from "vant";
import img1 from '@/assets/images/i_company.png'
import { nextTick } from "vue";
const emit = defineEmits(["textChange", "selectList"]);
const stateDom = ref(null);
const legendShow = ref(true);
const isTriangleShow = ref(false);
const isChange = ref(1);
const legendList = ref([
	// {
	// 	id: 1,
	// 	name: '万家',
	// 	num: '110426'
	// },
	// {
	// 	id: 2,
	// 	name: '新城',
	// 	num: '126012'
	// },
	// {
	// 	id: 3,
	// 	name: '海岸',
	// 	num: '6012'
	// },
	// {
	// 	id: 4,
	// 	name: '浙中南',
	// 	num: '542'
	// },
	// {
	// 	id: 5,
	// 	name: '萧山滨弘',
	// 	num: '302'
	// },
])
const handleChange = () => {
	const map = {
		'海岸': 1,
		'万家': 2,
		'新城': 3,
		'浙中南': 4,
		'萧山滨弘': 5,
	};
	isChange.value = map[useMy.$state.companyName] || 1
	if (stateDom.value && stateDom.value.style.maxHeight) {
		emit("textChange", false);
		legendShow.value = true;
		stateDom.value.style.maxHeight = null;
		isTriangleShow.value = false
	} else {
		emit("textChange", true);
		legendShow.value = false;
		isTriangleShow.value = true
		if (stateDom.value) {
			stateDom.value.style.maxHeight = stateDom.value.scrollHeight + "px";
		}
	}
}
const getClass = (v) => {
	const map = {
		0: '',
		1: 'span1',
		2: 'span2',
		3: 'span3',
		4: 'span4',
		5: 'span5',

	};
	return map[v] || "";
}
const change = (v, id) => {
	$globalEventBus.emit('adcdChange', v.name);
	setCompanyName(v.name)
	setCompanyNum(0)
	emit("selectList", v.name);
	isChange.value = id;
};
// 获取列表数据
const getList = async () => {
	const res = await useMy.getAddersslist();
	if (res?.code === 200) {
		res.data.forEach(v => {
			v.name = v.regionName;
		});
		legendList.value = res.data;
	} else {
		showToast(res.msg);
	}
};
$globalEventBus.on("LegendClick", eventData => {
	handleChange();
});
onMounted(() => {
	// $globalConfigure(() => {
	getList();
	// });
});
</script>
<style lang="less" scoped>
.legend__nav {
	position: relative;
	width: 41.5px;
	height: 41.5px;
	background: #FFFFFF;
	box-shadow: 0px 5px 10px 0px rgba(13, 121, 253, 0.07);
	border-radius: 12px;
	float: right;
}

.imgIcon {
	position: absolute;
	width: 23px;
	height: 23px;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}

.tab-content {
	position: relative;
	margin: 0 auto;
	width: 124px;
	background: #f2f6fc;
	max-height: 0;
	overflow: hidden;
	transition: max-height 0.5s ease-out;
	background: #FFFFFF;
	box-shadow: 0px 5px 10px 0px rgba(13, 121, 253, 0.07);
	border-radius: 12px;

	.tab-content-box {
		padding-top: 12px;

		p {
			display: flex;
			padding: 0;
			margin: 0px 5px 5px 5px;
			padding: 7px 16px;
		}

		font-size: 14px;
		font-family: PingFangSC,
		PingFang SC;
		font-weight: 400;
		color: #48535A;
	}
}

.triangle {
	width: 0px;
	height: 0px;
	border: 10px solid transparent;
	border-top-color: #FFFFFF;
	margin: auto;
}

.span1,
.span2,
.span3,
.span4,
.span5 {
	display: block;
	width: 8px;
	height: 8px;
	border-radius: 50%;
	margin-right: 8px;
	margin-top: 7px;
}

.span1 {
	background: linear-gradient(180deg, #0D79FD 0%, #9DC9FF 100%);
	box-shadow: 0px 0px 2px 0px rgba(13, 121, 253, 0.2);
}

.span2 {
	background: linear-gradient(180deg, #28C3CD 0%, #92EFF5 100%);
	box-shadow: 0px 0px 4px 0px rgba(63, 227, 220, 0.2);
}

.span3 {
	background: linear-gradient(180deg, #0047FF 0%, #A99CF5 100%);
	box-shadow: 0px 0px 4px 0px rgba(0, 77, 255, 0.2);
}

.span4 {
	background: linear-gradient(180deg, #EFB051 0%, #FFE298 100%);
	box-shadow: 0px 0px 4px 0px rgba(251, 181, 69, 0.2);
}

.span5 {
	background: linear-gradient(180deg, #850DFD 0%, #D49DFF 100%);
	box-shadow: 0px 0px 4px 0px rgba(158, 23, 255, 0.2);
}

.allBox,
.closeBox {
	text-align: center;
	padding: 5px 0px;

}

.allBox {
	margin: 5px;
}

.activeBox {
	background: #EEF6FF;
	box-shadow: 0px 5px 10px 0px rgba(13, 121, 253, 0.07);
	border-radius: 8px;
	border: 1px solid #007BFF;
}

.closeBox {
	padding: 3px 0 0 0;
	margin: 0 5px;
	border-top: 1px solid #D2D9E3;
}
</style>