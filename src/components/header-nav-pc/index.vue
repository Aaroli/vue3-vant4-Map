<!--
 * @Description: 
 * @Version: 1.0
 * @Author: AaroLi
 * @Date: 2024-01-03 09:38:41
 * @LastEditors: AaroLi
 * @LastEditTime: 2024-01-24 11:56:35
-->
<template>
   <div class="header__nav">
    <div class="header__left" @click="closeLegend">
      <!-- <div @click="showPicker = true">{{ cityName }} <van-icon name="arrow-down" color="#A6B2C3" size="17"
          style="vertical-align: middle;" /></div> -->
      <div @click="showPicker = true">{{ cityName }} <van-icon name="arrow-down" color="#A6B2C3" size="17"
          style="vertical-align: middle;" /></div>
      <div class="fl6">
        <van-dropdown-menu ref="menuRef" style="display: flex;">
          <van-dropdown-item title="管理" ref="itemRef">
            <div class="Category__box">
              <div class="title">类别</div>
              <div class="clickBox">
                <div :class="isChange === 0 ? 'activeBox' : ''" @click="change(0)">全部</div>
                <div :class="isChange === 1 ? 'activeBox' : ''" @click="change(1)" class="ml18">案场
                </div>
                <div :class="isChange === 2 ? 'activeBox' : ''" @click="change(2)" class="ml18">项目</div>
              </div>
              <div class="btn">
                <div class="btn_left" @click="reset">重置</div>
                <div class="btn_right" @click="hasConfirm">确定</div>
              </div>
            </div>
          </van-dropdown-item>
          <van-icon class="pt36" name="arrow-down" color="#A6B2C3" size="17" style="vertical-align: middle;" />
        </van-dropdown-menu>
      </div>
    </div>
    <div class="header__right ml4">
      <van-field v-model="keyWord" readonly :right-icon="i_search" @focus="hasSearch" placeholder="请输入项目名称"
        @click-right-icon="hasSearch" />
      <div class="user" @click="hasUser"></div>
    </div>
    <!-- <van-popup v-model:show="showPicker" position="bottom">
      <div class="handleButton">
        <van-button style="border: none; color: #969799" @click="handleOrgCancel" size="normal">取消</van-button>
        <div class="font" size="normal">
          城市地区
        </div>
        <van-button style="border: none; color: #6398fb" size="normal" @click="handleConfirm">确认</van-button>
      </div>
      <van-tree-select v-model:active-id="activeId" v-model:main-active-index="activeIndex" @click-nav="isMenuActive"
        height="55vw" :items="items" />
    </van-popup> -->
    <van-popup v-model:show="showPicker" position="bottom">
      <van-picker :columns="columns" @confirm="onConfirm" @cancel="showPicker = false" />
    </van-popup>
    <div>

    </div>
    <van-popup v-model:show="showRight" @opened="opened" position="right" :style="{ width: '100%', height: '100%' }">
      <div class="appBox">
        <van-search ref="inputRef" autofocus v-model="value" update:model-value clearable :right-icon="i_search"
          left-icon="" @click-right-icon="handleSearch" placeholder="请输入项目名称" @search="handleSearch" @clear="clearList">
          <template #left>
            <van-icon color="#7D7D7D" size="0.6rem" class="icon" name="arrow-left" @click="routerCallBack" />
          </template>
        </van-search>
        <div class="list">
          <van-cell icon="location-o" v-for="(item, index) in list" :key="index" :title="item.searchValue"
            @click="updateMap(item)" />
        </div>

      </div>
    </van-popup>
  </div>
</template>
  
<script setup name="headerNavPc">
import { autofocusFn } from '@/util/ceshi'
import { setSession, setCompanyName, setAdcdName, setCenterValue, setCompanyType, setInputValue, initWx } from "@/util/util";
import i_search from '@/assets/images/i_search.png'
import { showToast } from "vant";
import { useCitySearch, lazyAMapApiLoaderInstance } from "@vuemap/vue-amap";
const { useMy } = $globalStore
const router = useRouter();
const emit = defineEmits(["handleSearch", "cityChange", 'stausChange', "initData", "initDatas", "clearData"]);

const keyWord = ref('');
const itemRef = ref(null);
const menuRef = ref(null);
const aaa = ref(true);
const value = ref('');
const list = ref([])
const showRight = ref(false);
const inputRef = ref(null);
const cityName = ref('杭州市');
const loctionName = ref('');
const columns = ref([
  // { text: '杭州', value: 'Hangzhou' },
  // { text: '宁波', value: 'Ningbo' },
  // { text: '温州', value: 'Wenzhou' },
  // { text: '绍兴', value: 'Shaoxing' },
  // { text: '湖州', value: 'Huzhou' },
]);
const showPicker = ref(false);
const isChange = ref(0);
const isOtherChange = ref(0);
// 关闭图例事件
const closeLegend = () => {
  $globalEventBus.emit('LegendClick', false);
}
const change = (v) => {
  isChange.value = v;
};
const otherChange = (v) => {
  isOtherChange.value = v;
};
// 关闭事件
const handleOrgCancel = () => {
  showPicker.value = false;
};
const routerCallBack = () => {
  list.value = []
  value.value = ''
  showRight.value = false
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
const activeIndex = ref(0);
const activeId = ref(1);
const items = [
  {
    text: '浙江省',
    children: [
      { text: '西湖区', id: 1 },
      { text: '上城区', id: 2 },
      { text: '滨江区', id: 3 },
      { text: '下城区', id: 4 },
      { text: '余杭区', id: 5 },
      { text: '临安区', id: 6 },
      { text: '临平区', id: 7 },
      { text: '萧山区', id: 8 },
    ],
  },
  {
    text: '上海市',
    children: [
      { text: '黄浦区', id: 9 },
      { text: '徐汇区', id: 10 },
      { text: '长宁区', id: 11 },
      { text: '静安区', id: 12 },
      { text: '宝山区', id: 13 },
      { text: '普陀区', id: 14 },
      { text: '虹口区', id: 15 },
      { text: '杨浦区', id: 16 },
      { text: '嘉定区', id: 17 },
      { text: '金山区', id: 19 },
      { text: '松江区', id: 20 },
    ],
    badge: 8,
  },
  {
    text: '苏州市',
    children: [
      { text: '虎丘区', id: 21 },
      { text: '吴中区', id: 22 },
      { text: '相城区', id: 23 },
      { text: '姑苏区', id: 24 },
      { text: '吴江区', id: 25 },
    ],
    badge: 5,
  },
  {
    text: '成都市',
    children: [
      { text: '锦江区', id: 26 },
      { text: '青羊区', id: 27 },
      { text: '金牛区', id: 28 },
      { text: '武侯区', id: 29 },
      { text: '成华区', id: 30 },
    ],
    dot: true,
  },
]
// 确认
const handleConfirm = () => {
  const result = items.map(item => item.children);
  if (activeId.value != '') {
    cityName.value = result.flat(Infinity).find(v => v.id == activeId.value).text
  } else {
    cityName.value = items[activeIndex.value].text
  }
  showPicker.value = false;
};
const onConfirm = ({ selectedOptions }) => {
  keyWord.value = ''
  if (selectedOptions[0]?.text) {
    cityName.value = selectedOptions[0]?.text;
    emit("cityChange", cityName.value == loctionName.value.slice(0, -1) ? true : false, cityName.value);
  }
  showPicker.value = false;
};
// 重置
const reset = () => {
  isChange.value = 0;
  isOtherChange.value = null;
};
// 类别 => 确定
const hasConfirm = () => {
  let value = ''
  if (isChange.value == 0) {
    value = ''
  } else if (isChange.value == 1) {
    value = '案场'
  } else if (isChange.value == 2) {
    value = '项目'
  }
  emit("stausChange", value);
  itemRef.value.toggle();
};
// 搜索事件
const hasSearch = () => {
  $globalEventBus.emit('LegendClick', false);
  // router.push({ name: "Search" });
  list.value = []
  value.value = ''
  autofocusFn();
  showRight.value = true;

};
const opened = () => {
  if (inputRef.value) {
    const inputEl = inputRef.value.$el.querySelector('.van-field__control');
    inputEl.focus();
  }
}
// 切换父级区划事件
const isMenuActive = () => {
  activeId.value = '';
};
// 获取行政区划列表
const getDivisionList = async (v) => {
  const res = await useMy.getRegionList({ egion: v });
  if (res?.code === 200) {
    if (res.data && res.data.length > 0) {
      res.data.forEach(v => {
        v.text = v.xmproject;
        v.value = v.xmproject;
      });
      columns.value = res.data;
      if (useMy.$state.adcdName) {
        cityName.value = useMy.$state.adcdName
        emit("initData", useMy.$state.companyName, useMy.$state.adcdName)
        keyWord.value = useMy.$state.inputValue
        isChange.value = 0;
        isOtherChange.value = 0;
      } else {
        const arr = res.data.filter(item => item.text == loctionName.value.slice(0, -1))
        arr.length > 0 ? emit("initData", arr[0].egion, arr[0].xmproject, true) : emit("initData", res.data[0].egion, res.data[0].xmproject, false);
        arr.length > 0 ? cityName.value = arr[0].text : cityName.value = res.data[0].text;
      }
    }
    if (res.data && res.data.length == 0) {
      emit("clearData", true);
    }
  } else {
    showToast(res.msg);
  }
}
const getDivisionLists = async (v) => {
  const res = await useMy.getRegionList({ egion: v });
  if (res?.code === 200) {
    if (res.data && res.data.length > 0) {
      res.data.forEach(v => {
        v.text = v.xmproject;
        v.value = v.xmproject;
      });
      columns.value = res.data;
    }
    if (res.data && res.data.length == 0) {
      emit("clearData", true);
    }
  } else {
    showToast(res.msg);
  }
}
// // 获取用户信息
// const queryUserInfo = async (v) => {
//   const res = await useMy.getUserInfo({ code: v });
//   if (res?.code === 200) {
//     setSession("TOKEN", res.token);
//     showToast('授权成功');
//   } else {
//     showToast(res.msg);
//   }
// }
$globalEventBus.on("adcdChange", eventData => {
  getDivisionList(eventData)
});
onBeforeMount(() => {
  initWx();
  lazyAMapApiLoaderInstance.then(() => {
    useCitySearch().then(res => {
      const { getLocalCity } = res;
      getLocalCity().then(cityResult => {
        cityName.value = cityResult.city || '未知'
        loctionName.value = cityResult.city || '未知'
        getDivisionList(useMy.$state.companyName);
      })
    })
  })
})
const handleSearch = async (v) => {
  const res = await useMy.queryFuzzy({ name: value.value });
  if (res?.code === 200) {

    res.data.forEach(v => {
      v.searchValue = `${v.xmproject}-${v.name}`
    });
    list.value = res.data
    if (list.value && list.value.length == 0) {
      showToast('暂无相关数据');
    }
    // loading.value = false
  } else {
    // loading.value = false
    showToast(res.msg);
  }
};
// 更新地图事件
const updateMap = (v) => {
  isChange.value = 0
  isOtherChange.value = null
  cityName.value = v.xmproject
  keyWord.value = v.searchValue
  setCompanyName(v.egion)
  getDivisionLists(v.egion)
  emit("initDatas", v.egion, v.xmproject, [v.longitude, v.latitude])
  showRight.value = false
}
// 清除数据 更新视图
const clearList = () => {
  list.value = []
}
onMounted(() => {
})
</script>
<style lang="less" scoped>
.header__nav {
  position: fixed;
  display: flex;
  top: 0;
  width: 100%;
  height: 20px;
  line-height: 20px;
  z-index: 2;
  background: #FFFFFF;
  border-radius: 0px 0px 6px 6px;
}

.header__left {
  width: 53.25px;
  height: 17.5px;
  line-height: 17.5px;
  display: flex;
  margin-top: 1px;
  margin-left: 6px;
  font-size: 6px;
  font-weight: 600;
  color: #383E44;
  cursor: pointer;
}

.fl6 {
  margin-left: 8px;
  display: flex;
  cursor: pointer;
}

:deep(.van-field) {
  width: 200px;
  height: 10px;
  background: #F3F3F3;
  margin-top: 3px;
  border-radius: 2px;
}

:deep(.van-dropdown-menu__title:after) {
  display: none;
}

:deep(.van-icon__image) {
  width: 10px;
  height: 10px;
  cursor: pointer;
}

:deep(.van-cell__value) {
  font-size: 5px;
  margin-top: -12px;
  margin-left: 0px;
}

:deep(.van-cell) {
  padding: 7px;
}

.pt36 {
  padding-top: 7px;
  margin-left: 1px;
  cursor: pointer;
}

:deep(.van-dropdown-menu__bar) {
  height: 17px;
  box-shadow: none;
  background: none;
  padding: 0px;
}

:deep(.van-dropdown-menu__title) {
  padding: 0px;
  font-size: 6px;
  font-weight: 600;
  color: #383E44;
  margin-top: 1px;
}

:deep(.van-picker__toolbar) {
  height: 25px;
}

:deep(.van-picker__cancel) {
  font-size: 7px !important;
}

:deep(.van-picker__confirm) {
  font-size: 7px !important;
}

:deep(.van-picker-column .van-ellipsis) {
  font-size: 7px !important;
}

.ml4 {
  margin-left: 2px;
}

.handleButton {
  display: flex;
  justify-content: space-between;
  height: 22px;
  line-height: 22px;
}

.font {
  font-size: 8px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  color: #171B1F;
  border: none;
}

.header__right {
  display: flex;
}

.user {
  width: 12px;
  height: 12px;
  position: fixed;
  right: 4px;
  top: 4px;
  cursor: pointer;
  background-image: url("~@/assets/images/i_user.png");
  background-size: 100% 100%;
}

.Category__box {
  height: 60px;
  background: #FFFFFF;
  padding-top: 6px;


  .title {
    font-size: 5px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    color: #161A1D;
    margin-left: 8px;
    margin-bottom: 4px;
  }
}

:deep(.van-dropdown-item__content) {
  border-radius: 0px 0px 6px 6px;
}

.clickBox {
  display: flex;
  text-align: center;
  margin-bottom: 10px;
  margin-left: 8px;

  div {
    width: 40px;
    height: 10px;
    line-height: 10px;
    border-radius: 8px;
    font-size: 5px;
    background: #F1F1F1;
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    color: #667075;
  }

  .activeBox {
    background: #E8F2FF;
    color: #237EEE;
  }
}

.ml18 {
  margin-left: 9px;
}

.btn {
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;

  div {
    width: 40px;
    height: 10px;
    line-height: 10px;
    border-radius: 10px;
    font-size: 5px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
  }

  &_left {
    border: 1px solid #979797;
    color: #565B60;
  }

  &_right {
    background: #0D79FD;
    box-shadow: 0px 5px 10px 0px rgba(13, 121, 253, 0.07);
    color: #FFFFFF;
    margin-left: 11.25px;
  }
}
</style>