<!--
 * @Description: 
 * @Version: 1.0
 * @Author: AaroLi
 * @Date: 2024-01-03 09:38:41
 * @LastEditors: AaroLi
 * @LastEditTime: 2024-01-16 07:48:24
-->
<template>
  <div class="header__nav">
    <div class="header__left">
      <!-- <div @click="showPicker = true">{{ cityName }} <van-icon name="arrow-down" color="#A6B2C3" size="17"
          style="vertical-align: middle;" /></div> -->
      <div @click="showPicker = true">{{ cityName }} <van-icon name="arrow-down" color="#A6B2C3" size="17"
          style="vertical-align: middle;" /></div>
      <div class="fl6">
        <van-dropdown-menu ref="menuRef" style="display: flex;">
          <van-dropdown-item title="类别" ref="itemRef">
            <div class="Category__box">
              <div class="title">类别</div>
              <div class="clickBox">
                <div :class="isChange === 1 ? 'activeBox' : ''" @click="change(isChange === 1 ? null : 1)">实管</div>
                <div :class="isOtherChange === 1 ? 'activeBox' : ''" @click="otherChange(isOtherChange === 1 ? null : 1)"
                  class="ml18">前期</div>
              </div>
              <div class="btn">
                <div class="btn_left" @click="reset">重置</div>
                <div class="btn_right" @click="hasConfirm">确定</div>
              </div>
            </div>
          </van-dropdown-item>
          <van-icon class="pt36 " name="arrow-down" color="#A6B2C3" size="17" style="vertical-align: middle;" />
        </van-dropdown-menu>
      </div>
    </div>
    <div class="header__right ml4">
      <van-field v-model="keyWord" :right-icon="i_search" placeholder="城市-项目" @click-right-icon="hasSearch" />
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
  </div>
</template>
  
<script setup name="headerNavPc">
import i_search from '@/assets/images/i_search.png'
import { showToast } from "vant";
import { useCitySearch, lazyAMapApiLoaderInstance } from "@vuemap/vue-amap";
const { useMy } = $globalStore
const router = useRouter();
const emit = defineEmits(["handleSearch", "cityChange", 'stausChange', "initData"]);

const keyWord = ref('');
const itemRef = ref(null);
const menuRef = ref(null);
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
const isChange = ref(1);
const isOtherChange = ref(1);
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
  if (selectedOptions[0]?.text) {
    cityName.value = selectedOptions[0]?.text;
    emit("cityChange", cityName.value);
  }
  showPicker.value = false;
};
// 重置
const reset = () => {
  isChange.value = null;
  isOtherChange.value = null;
};
// 类别 => 确定
const hasConfirm = () => {
  let searchValue = []
  if (isChange.value) {
    isOtherChange.value ? searchValue = ['实管', '前期'] : searchValue = ['实管']
  } else if (isOtherChange.value) {
    isOtherChange.value ? searchValue = ['前期'] : searchValue = ['前期']
  } else {
    searchValue = []
  }
  emit("stausChange", searchValue.join(','));
  itemRef.value.toggle();
};
// 搜索事件
const hasSearch = () => {
  // console.log('length',length)
  emit("handleSearch", keyWord.value);
};
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
      const arr = res.data.filter(item => item.text == loctionName.value.slice(0, -1))
      arr.length > 0 ? emit("initData", arr[0].egion, arr[0].xmproject) : emit("initData", res.data[0].egion, res.data[0].xmproject);
      arr.length > 0 ? cityName.value = arr[0].text : cityName.value = res.data[0].text;
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
$globalEventBus.on("adcdChange", eventData => {
  getDivisionList(eventData)
});
onBeforeMount(() => {
  lazyAMapApiLoaderInstance.then(() => {
    useCitySearch().then(res => {
      const { getLocalCity } = res;
      getLocalCity().then(cityResult => {
        cityName.value = cityResult.city || '未知'
        loctionName.value = cityResult.city || '未知'
        getDivisionList('海岸');
      })
    })
  })
})
onMounted(() => {
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get('code');
  if (code) {
    queryUserInfo(code);
  }
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
  height: 101px;
  background: #FFFFFF;
  padding-top: 6px;


  .title {
    font-size: 7.5px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    color: #161A1D;
    margin-left: 8px;
    margin-bottom: 9px;
  }
}

:deep(.van-dropdown-item__content) {
  border-radius: 0px 0px 6px 6px;
}

.clickBox {
  display: flex;
  text-align: center;
  margin-bottom: 25px;
  margin-left: 8px;

  div {
    width: 55px;
    height: 18px;
    line-height: 18px;
    border-radius: 10px;
    font-size: 7px;
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
  margin-left: 8px;

  div {
    width: 80px;
    height: 20px;
    line-height: 20px;
    border-radius: 10px;
    font-size: 7.5px;
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