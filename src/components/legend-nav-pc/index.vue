<!--
 * @Description: 
 * @Version: 1.0
 * @Author: AaroLi
 * @Date: 2024-01-03 11:27:10
 * @LastEditors: AaroLi
 * @LastEditTime: 2024-01-24 07:47:10
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
						@click="change(item, item.id)"><span :class="getClass(item.id)"></span>{{ item.name }}
						<van-icon v-if="isChange === item.id" name="success" class="icon" color="#007BFF" />
					</p>
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

<script setup name="legendNavPc">
import { setCompanyNum, setCompanyName, setAdcdName, getSession, removeSession } from "@/util/util";
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
	let type = ''
	const map = {
		'海岸': 1,
		'万家': 2,
		'新城': 3,
		'浙中南': 4,
		'萧山滨弘': 5,
	};
	isChange.value = map[useMy.$state.companyName] || ''
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
const closeLegend = () => {
	if (stateDom.value) {
		stateDom.value.style.maxHeight = null;
		isTriangleShow.value = false
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
		6: 'span6',
		7: 'span7',
		8: 'span8',
		9: 'span9',
		10: 'span10',
		11: 'span11',
		12: 'span12',
		13: 'span13',
		14: 'span14',
		15: 'span15',
		16: 'span16',
		17: 'span17',
		18: 'span18',
		19: 'span19',
		20: 'span20',
	};
	return map[v] || "";
}
const change = (v, id) => {
	$globalEventBus.emit('adcdChange', v.name);
	setAdcdName(null)
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
		if (legendList.value && legendList.value[0].name) {
			setCompanyName(legendList.value[0].name)
		}
	} else {
		showToast(res.msg);
	}
};
$globalEventBus.on("LegendClick", eventData => {
	if (eventData == false) {
		closeLegend();
	} else {
		handleChange();
	}
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
	width: 20.5px;
	height: 20.5px;
	background: #FFFFFF;
	box-shadow: 0px 2.5px 5px 0px rgba(13, 121, 253, 0.07);
	border-radius: 6px;
	float: right;
}

.imgIcon {
	position: absolute;
	width: 13px;
	height: 13px;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}

.tab-content {
	margin: 0 auto;
	width: 62px;
	background: #f2f6fc;
	max-height: 0;
	overflow: hidden;
	transition: max-height 0.5s ease-out;
	background: #FFFFFF;
	box-shadow: 0px 5px 10px 0px rgba(13, 121, 253, 0.07);
	border-radius: 6px;

	.tab-content-box {
		padding-top: 6px;

		p {
			display: flex;
			padding: 0;
			margin: 0px 2.5px 2.5px 2.5px;
			padding: 3.5px 8px;
			cursor: pointer;
		}

		font-size: 7px;
		font-family: PingFangSC,
		PingFang SC;
		font-weight: 400;
		color: #48535A;
	}
}

.triangle {
	width: 0px;
	height: 0px;
	border: 5px solid transparent;
	border-top-color: #FFFFFF;
	margin: auto;
}

.span1,
.span2,
.span3,
.span4,
.span6,
.span7,
.span8,
.span9,
.span10,
.span11,
.span12,
.span13,
.span14,
.span15,
.span16,
.span17,
.span18,
.span19,
.span20,
.span5 {
	display: block;
	width: 4px;
	height: 4px;
	border-radius: 50%;
	margin-right: 4px;
	margin-top: 3.5px;
}

.span1 {
	background: linear-gradient(180deg, #0D79FD 0%, #9DC9FF 100%);
	box-shadow: 0px 0px 1px 0px rgba(13, 121, 253, 0.2);
}

.span2 {
	background: linear-gradient(180deg, #28C3CD 0%, #92EFF5 100%);
	box-shadow: 0px 0px 2px 0px rgba(63, 227, 220, 0.2);
}

.span3 {
	background: linear-gradient(180deg, #0047FF 0%, #A99CF5 100%);
	box-shadow: 0px 0px 2px 0px rgba(0, 77, 255, 0.2);
}

.span4 {
	background: linear-gradient(180deg, #EFB051 0%, #FFE298 100%);
	box-shadow: 0px 0px 2px 0px rgba(251, 181, 69, 0.2);
}

.span5 {
	background: linear-gradient(180deg, #850DFD 0%, #D49DFF 100%);
	box-shadow: 0px 0px 2px 0px rgba(158, 23, 255, 0.2);
}

.span6 {
	background: linear-gradient(180deg, #124f03 0%, #1d251a 100%);
	box-shadow: 0px 0px 2px 0px rgba(2, 84, 119, 0.2);
}

.span7 {
	background: linear-gradient(180deg, #91b966 0%, #215004 100%);
	box-shadow: 0px 0px 2px 0px rgba(158, 23, 255, 0.2);
}

.span8 {
	background: linear-gradient(180deg, #b2096e 0%, #08997f 100%);
	box-shadow: 0px 0px 2px 0px rgba(158, 23, 255, 0.2);
}

.span9 {
	background: linear-gradient(180deg, #850DFD 0%, #D49DFF 100%);
	box-shadow: 0px 0px 2px 0px rgba(158, 23, 255, 0.2);
}

.span10 {
	background: linear-gradient(180deg, #38066a 0%, #9dd9ff 100%);
	box-shadow: 0px 0px 2px 0px rgba(158, 23, 255, 0.2);
}

.span11 {
	background: linear-gradient(180deg, #0da1fd 0%, #0b50a5 100%);
	box-shadow: 0px 0px 2px 0px rgba(158, 23, 255, 0.2);
}

.span12 {
	background: linear-gradient(180deg, #b2074b 0%, #230c15 100%);
	box-shadow: 0px 0px 2px 0px rgba(158, 23, 255, 0.2);
}

.span13 {
	background: linear-gradient(180deg, #570606 0%, #0c0114 100%);
	box-shadow: 0px 0px 2px 0px rgba(158, 23, 255, 0.2);
}

.span14 {
	background: linear-gradient(180deg, #06348b 0%, #070c77 100%);
	box-shadow: 0px 0px 2px 0px rgba(158, 23, 255, 0.2);
}

.span15 {
	background: linear-gradient(180deg, #048151 0%, #0d7752 100%);
	box-shadow: 0px 0px 2px 0px rgba(158, 23, 255, 0.2);
}

.span16 {
	background: linear-gradient(180deg, #072d61 0%, #0d0460 100%);
	box-shadow: 0px 0px 2px 0px rgba(158, 23, 255, 0.2);
}

.span17 {
	background: linear-gradient(180deg, #86898c6f 0%, #b8b6ca 100%);
	box-shadow: 0px 0px 2px 0px rgba(158, 23, 255, 0.2);
}

.span18 {
	background: linear-gradient(180deg, #530951 0%, #a8a5c1 100%);
	box-shadow: 0px 0px 2px 0px rgba(158, 23, 255, 0.2);
}

.span19 {
	background: linear-gradient(180deg, #0c57c1 0%, #7d79a0 100%);
	box-shadow: 0px 0px 2px 0px rgba(158, 23, 255, 0.2);
}

.span20 {
	background: linear-gradient(180deg, #611c07 0%, #090435 100%);
	box-shadow: 0px 0px 2px 0px rgba(158, 23, 255, 0.2);
}

.allBox,
.closeBox {
	text-align: center;
	padding: 2.5px 0px;
	cursor: pointer;
}

.allBox {
	margin: 2.5px;
}

.activeBox {
	background: #EEF6FF;
	box-shadow: 0px 2.5px 5px 0px rgba(13, 121, 253, 0.07);
	border-radius: 4px;
	border: 0.5px solid #007BFF;
}

.closeBox {
	padding: 3px 0 0 0;
	margin: 0 2.5px;
	border-top: 0.5px solid #D2D9E3;
}
</style>