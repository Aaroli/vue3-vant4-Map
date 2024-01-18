<!--
 * @Description: 
 * @Version: 1.0
 * @Author: AaroLi
 * @Date: 2024-01-18 03:15:50
 * @LastEditors: AaroLi
 * @LastEditTime: 2024-01-18 08:02:01
-->
<template>
    <div class="app">
        <van-search v-model="value" update:model-value clearable :right-icon="i_search" left-icon=""
            @click-right-icon="handleSearch" placeholder="请输入城市-项目查询" @search="handleSearch" @clear="clearList">
            <template #left>
                <van-icon color="#7D7D7D" size="0.6rem" class="icon" name="arrow-left" @click="routerCallBack" />
            </template>
        </van-search>
        <div class="list">
            <van-cell icon="location-o" v-for="(item, index) in list" :key="index" :title="item.searchValue"
                @click="updateMap(item)" />
        </div>
    </div>
</template>

<script setup name="Search">
import i_search from '@/assets/images/i_search.png'
import { getSession, setSession, setCompanyName, setAdcdName, setCenterValue, setCompanyType, setInputValue } from "@/util/util";
import { showToast } from "vant";
const { useMy } = $globalStore
const router = useRouter();
const value = ref('');
const list = ref([])

const routerCallBack = () => {
    router.back();
}
const handleSearch = async (v) => {
    // 要判断一下当前的公司和地市是不是跟这条记录一样，如果一样，就直接定位到那个项目就行了，
    // 如果不一样，那要切换项目和地市，并刷新当前项目和地市的数据，并定位到当前选的项目，管理那个查询字段要清空（如果当前有选过的话）
    // loading.value = true
    const res = await useMy.queryFuzzy({ name: value.value });
    if (res?.code === 200) {
        console.log('res', res)
        res.data.forEach(v => {
            v.searchValue = `${v.xmproject}-${v.name}`
        });
        list.value = res.data
        // loading.value = false
    } else {
        // loading.value = false
        showToast(res.msg);
    }
};
// 更新地图事件
const updateMap = (v) => {
    setCompanyName(v.egion)
    setAdcdName(v.xmproject)
    setCenterValue([v.longitude, v.latitude])
    setInputValue(v.searchValue)
    // setCompanyType(map[v.egion] || 1)
    router.back();
    // 地市名称  v.xmproject
    // 公司  v.egion
    // 中心点 [v.longitude,v.latitude]
    // 输入框名称 v.searchValue
}
// 清除数据 更新视图
const clearList = () => {
    list.value = []
}
onMounted(() => {
    setAdcdName(null)
    setCenterValue(null)
    // setCompanyType(null)
    setInputValue(null)
})
</script>


<style scoped lang="less">
.icon {
    margin-right: 4px;
}

； .app {
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
</style>