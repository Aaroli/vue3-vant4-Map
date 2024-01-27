<!--
 * @Description: 
 * @Version: 1.0
 * @Author: AaroLi
 * @Date: 2024-01-03 09:38:41
 * @LastEditors: AaroLi
 * @LastEditTime: 2024-01-27 03:55:34
-->
<template>
  <div class="header__nav">
    <div class="header__left" @click="closeLegend">
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
  
<script setup name="headerNav">
import wx from "weixin-js-sdk"; //引入WX sdk
import { autofocusFn } from '@/util/ceshi'
import { setSession, setlocal, getlocal, removelocal, getSession, setCoordinate, setCompanyName, setAdcdName, setSearchType, setCompanyZoom, setCenterValue, setCompanyType, setInputValue } from "@/util/util";
import i_search from '@/assets/images/i_search.png'
import { showToast } from "vant";
import { useCitySearch, lazyAMapApiLoaderInstance } from "@vuemap/vue-amap";
const { useMy } = $globalStore
const router = useRouter();
const emit = defineEmits(["handleSearch", "cityChange", 'setDataSearch', 'stausChange', "initData", "initDatas", "clearData"]);

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
  setSession('companyName', useMy.$state.companyName == '全部' ? '' : useMy.$state.companyName)
  setSession('adcdName', cityName.value),
    setSession('typeChange', isChange.value)
  const res = await useMy.getSingleUrl();
  console.log('res.code', res.code)
  if (res?.code === 200) {
    window.location = res.qw_auth_url
  } else {
    showToast(res.msg);
  }
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
const onConfirm = ({ selectedOptions }) => {
  keyWord.value = ''
  if (selectedOptions[0]?.text) {
    cityName.value = selectedOptions[0]?.text;
    emit("cityChange", cityName.value == loctionName.value.slice(0, -1) ? true : false, cityName.value == '全部' ? '' : cityName.value);
  }
  setAdcdName(cityName.value)
  showPicker.value = false;
};
// 重置
const reset = () => {
  isChange.value = 0;
  isOtherChange.value = null;
};
// 类别 => 确定
const hasConfirm = () => {
  setCompanyZoom('')
  let value = ''
  if (isChange.value == 0) {
    value = ''
  } else if (isChange.value == 1) {
    value = '案场'
  } else if (isChange.value == 2) {
    value = '项目'
  }
  setSearchType(value == '' ? '全部' : value);
  const arr = columns.value.filter(item => item.text == loctionName.value.slice(0, -1))
  emit("stausChange", value, arr.length > 0 ? true : false);
  itemRef.value.toggle();
};
// 搜索事件
const hasSearch = () => {
  $globalEventBus.emit('LegendClick', false);
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
// 获取行政区划列表
const getDivisionList = async (v) => {
  const res = await useMy.getRegionList({ egion: v == '全部' ? '' : v });
  if (res?.code === 200) {
    if (res.data && res.data.length > 0) {
      res.data.forEach(v => {
        v.text = v.xmproject;
        v.value = v.xmproject;
      });
      res.data.unshift({ xmproject: '全部', text: '全部', value: '全部' });
      columns.value = res.data;
      if (useMy.$state.adcdName) {
        cityName.value = useMy.$state.adcdName
        emit("initData", useMy.$state.companyName, useMy.$state.companyName == '' ? '' : useMy.$state.adcdName)
        keyWord.value = useMy.$state.inputValue
        isChange.value = 0;
        isOtherChange.value = 0;
      } else {
        const arr = res.data.filter(item => item.text == loctionName.value.slice(0, -1))
        // const arr = [];
        arr.length > 0 ? emit("initData", useMy.$state.companyName, useMy.$state.companyName == '' ? '' : arr[0].xmproject, true) : emit("initData", useMy.$state.companyName, '', false);
        arr.length > 0 && useMy.$state.companyName != '' ? cityName.value = arr[0].text : cityName.value = '全部';
        // if (arr.length == 0) {
        //   setCompanyName('');
        // }
        const searchParams = new URLSearchParams(window.location.search);
        // const code = searchParams.get('code');
        // if (code && getSession('adcdName')) {
        //   cityName.value = getSession('adcdName');
        // }
        // if (code && getSession('typeChange')) {
        //   isChange.value = getSession('typeChange');
        // }
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
const getDivisionListss = async (v) => {
  const res = await useMy.getRegionList({ egion: v });
  if (res?.code === 200) {
    if (res.data && res.data.length > 0) {
      res.data.forEach(v => {
        v.text = v.xmproject;
        v.value = v.xmproject;
      });
      columns.value = res.data;
    }
    emit("storeList", 0);
    if (res.data && res.data.length == 0) {
      emit("clearData", true);
    }
  } else {
    showToast(res.msg);
  }
}
$globalEventBus.on("adcdChange", eventData => {
  isChange.value = 0
  getDivisionList(eventData)
});
$globalEventBus.on("loginIn", eventData => {
  hasUser(eventData);
});
$globalEventBus.on("cityName", eventData => {
  cityName.value = eventData
});
$globalEventBus.on("zoomChange", eventData => {
  getDivisionLists('')
  cityName.value = eventData
  emit("initData", '', '', false)
});
onBeforeMount(async () => {
  await initWx();
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get('code');
  if (code && getSession('companyName')) {
    cityName.value = getSession('adcdName');
    isChange.value = Number(getSession('typeChange'));
    getDivisionListss(getSession('companyName'))
  } else {
    lazyAMapApiLoaderInstance.then(() => {
      useCitySearch().then(res => {
        const { getLocalCity } = res;
        getLocalCity().then(cityResult => {
          loctionName.value = cityResult.city || '未知'
          getDivisionList(useMy.$state.companyName);
        })
      })
    })
  }

})
const initWx = async () => {
  const res = await $globalStore.useMy.getWxAuth({ url: window.location.href });
  if (res?.code === 200) {
    wx.config({
      beta: true,
      debug: false,
      appId: res.appId,
      timestamp: res.timestamp,
      nonceStr: res.nonceStr,
      signature: res.signature,
      // jsApiList: res.jsApiList
      jsApiList: ["checkJsApi", "openLocation", "getLocation"],
      success(res) {
        showToast(res)
      },
    });
    wx.ready(function () {
      wx.getLocation({
        type: "gcj02",
        success: function (res) {
          console.log('自身定位：', [res.longitude, res.latitude]);
          setCoordinate([res.longitude, res.latitude]);
          setlocal('Coordinate', [res.longitude, res.latitude])
          setlocal('CoordinateTimer', new Date())
        }
      });
    })
  } else {
    showToast(res.msg);
  }
}
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
  } else {
    showToast(res.msg);
  }
};
// 更新地图事件
const updateMap = (v) => {
  isChange.value = 0
  isOtherChange.value = null
  cityName.value = v.xmproject
  setAdcdName(v.xmproject)
  keyWord.value = v.searchValue
  setCompanyName(v.egion == '全部' ? '' : v.egion)
  getDivisionLists(v.egion == '全部' ? '' : v.egion)
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
  height: 50px;
  line-height: 50px;
  z-index: 2;
  background: #FFFFFF;
  border-radius: 0px 0px 12px 12px;
}

.header__left {
  width: 107.5px;
  height: 35px;
  line-height: 35px;
  display: flex;
  margin-top: 8px;
  margin-left: 12px;
  font-size: 12px;
  font-weight: 600;
  color: #383E44;
}

.fl6 {
  margin-left: 6.5px;
  display: flex;
}

:deep(.header__right .van-field) {
  width: 203.5px;
  height: 35px;
  background: #F3F3F3;
  border-radius: 8px;
  margin-top: 8px;
}

:deep(.van-dropdown-menu__title:after) {
  display: none;
}

:deep(.van-cell__value) {
  margin-top: -4px;
  margin-left: -8px;
}

.pt36 {
  padding-top: 10px;
  margin-left: 2px;
}

:deep(.van-dropdown-menu__bar) {
  height: 34px;
  box-shadow: none;
  background: none;
  padding: 0px;
}

:deep(.van-dropdown-menu__title) {
  padding: 0px;
  font-size: 12px;
  font-weight: 600;
  color: #383E44;
  margin-top: 2px;
}

.ml4 {
  margin-left: 4px;
}

.handleButton {
  display: flex;
  justify-content: space-between;
  height: 44px;
  line-height: 44px;
}

.font {
  font-size: 16px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  color: #171B1F;
  border: none;
}

.header__right {
  display: flex;
}

.user {
  width: 24px;
  height: 24px;
  margin-top: 11.5px;
  margin-left: 12px;
  background-image: url("~@/assets/images/i_user.png");
  background-size: 100% 100%;
}

.Category__box {
  height: 202px;
  background: #FFFFFF;
  padding-top: 12px;


  .title {
    font-size: 15px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    color: #161A1D;
    margin-left: 16px;
    margin-bottom: 18px;
  }
}

:deep(.van-dropdown-item__content) {
  border-radius: 0px 0px 12px 12px;
}



.clickBox {
  display: flex;
  text-align: center;
  margin-bottom: 50px;
  margin-left: 16px;

  div {
    width: 110px;
    height: 36px;
    line-height: 36px;
    border-radius: 20px;
    font-size: 14px;
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
  margin-left: 16px;

  div {
    width: 160px;
    height: 40px;
    line-height: 40px;
    border-radius: 20px;
    font-size: 15px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
  }

  &_left {
    border: 1px solid #979797;
    color: #565B60;
  }

  &_right {
    background: #0D79FD;
    box-shadow: 0px 10px 20px 0px rgba(13, 121, 253, 0.07);
    color: #FFFFFF;
    margin-left: 22.5px;
  }
}

.appBox {
  height: 100vh;
  overflow: hidden;
}

.list {
  height: 92%;
  overflow: auto;
}

:deep(.van-cell__title) {
  padding-left: 15px;
}

:deep(.appBox .van-field__body) {
  padding-left: 10px;
}
</style>