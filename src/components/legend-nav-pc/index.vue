<!--
 * @Description: 
 * @Version: 1.0
 * @Author: AaroLi
 * @Date: 2024-01-03 11:27:10
 * @LastEditors: AaroLi
 * @LastEditTime: 2024-01-26 08:05:32
-->
<template>
	<div class="legend_nav">
		<div class="box">
			<div class="tab-content" ref="stateDom">
				<div class="tab-content-box">
					<p v-for="item in legendList" :key="item.index" :class="isChange === item.index ? 'activeBox' : ''"
						@click="change(item, item.index)"><span :class="getClass(item.index)"></span>{{ item.name }}
						<van-icon v-if="isChange === item.index" name="success" class="icon" color="#007BFF" />
					</p>
				</div>
			</div>
			<div class="triangle" v-if="isTriangleShow">
			</div>
		</div>
	</div>
</template>

<script setup name="legendNavPc">
import { setCompanyNum, setCompanyName, setAdcdName, setCompanyZoom, getSession, removeSession } from "@/util/util";
const { useMy } = $globalStore
import { showToast } from "vant";
import img1 from '@/assets/images/i_company.png'
import { nextTick } from "vue";
const emit = defineEmits(["textChange", "selectList"]);
const stateDom = ref(null);
const legendShow = ref(true);
const resultType = ref([]); //图例的map数组
const isTriangleShow = ref(false);
const isChange = ref(0);
const legendList = ref([
])
const handleChange = () => {
	isChange.value = resultType.value[useMy.$state.companyName] || 0
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
		0: 'span20',
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
	};
	return map[v] || "";
}
const change = (v, id) => {
	if (v.name == '全部') {
		$globalEventBus.emit('cityName', '全部')
	}
	$globalEventBus.emit('adcdChange', v.name == '全部' ? '' : v.name);
	$globalEventBus.emit('setZoom', 15);
	setAdcdName('')
	setCompanyZoom('')
	setCompanyName(v.name == '全部' ? '' : v.name)
	setCompanyNum(0)
	emit("selectList", v.name == '全部' ? '' : v.name);
	isChange.value = id;
};
// 获取列表数据
const getList = async () => {
	const res = await useMy.getAddersslist();
	if (res?.code === 200) {
		res.data.unshift({ id: 0, regionName: '全部' });
		res.data.forEach((v, index) => {
			v.index = index
			v.name = v.regionName;
		});
		legendList.value = res.data;
		if (legendList.value && legendList.value[1].name) {
			setCompanyName(legendList.value[1].name)
		}
		resultType.value = legendList.value.reduce((acc, cur) => {
			acc[cur.regionName] = cur.index;
			return acc;
		}, { '全部': 0 });
		const searchParams = new URLSearchParams(window.location.search);
		const code = searchParams.get('code');
		if (code && getSession('companyName')) {
			setCompanyName(getSession('companyName'));
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
	getList();
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