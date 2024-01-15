var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __glob = (map) => (path) => {
  var fn = map[path];
  if (fn)
    return fn();
  throw new Error("Module not found in bundle: " + path);
};
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// vite-config/plugins/unplugin-auto-import.js
var unplugin_auto_import_exports = {};
__export(unplugin_auto_import_exports, {
  AutoImport: () => AutoImport
});
import autoImport from "file:///E:/weibo/map/map/vue3-vant4-Map/vue3-vant4-Map/node_modules/.pnpm/unplugin-auto-import@0.17.3/node_modules/unplugin-auto-import/dist/vite.js";
var AutoImport;
var init_unplugin_auto_import = __esm({
  "vite-config/plugins/unplugin-auto-import.js"() {
    AutoImport = (viteEnv = {}) => {
      return autoImport({
        imports: [
          "vue",
          // 全局自动导入vue
          "vue-router",
          // 全局自动导入路由插件
          "vue-i18n",
          // 全局自动导入国际化插件
          "pinia",
          // 全局自动导入pinia
          {
            "@/common/globalInitialize": ["$globalReady"],
            // 全局自动导入初始化方法
            "@/common/globalStore": ["$globalStore", "$globalRegisterStore"],
            // 全局自动导入pinia处理函数
            "@/common/globalEventBus": ["$globalEventBus"],
            // 全局自动导入中央事件总线
            "@/common/globalLocales": ["$globalLang"],
            // 全局自动导入国际化方法
            "@/common/globalConfigure": ["$globalConfigure"],
            // 全局自动导入页面缓存初始化函数
            "@/common/globalHttp": ["$globalHttp"],
            // 全局自动导入请求拦截方法
            "@/common/globalRequest": ["$globalRequestUrl", "$globalRequest"],
            // 全局自动导入请求处理函数
            "@/common/globalConstant": ["$globalConstant"],
            // 全局自动导入常量
            "@/common/globalRouter": ["$globalRouter"],
            // 全局自动导入路由配置
            "@/common/globalExpandRouter": ["$globalRouterModules", "$globalExpandRouter"]
            // 全局自动导入路由处理方法
          }
        ]
      });
    };
  }
});

// vite-config/plugins/unplugin-vue-components.js
var unplugin_vue_components_exports = {};
__export(unplugin_vue_components_exports, {
  Components: () => Components
});
import components from "file:///E:/weibo/map/map/vue3-vant4-Map/vue3-vant4-Map/node_modules/.pnpm/unplugin-vue-components@0.26.0_vue@3.4.10/node_modules/unplugin-vue-components/dist/vite.js";
import { VantResolver } from "file:///E:/weibo/map/map/vue3-vant4-Map/vue3-vant4-Map/node_modules/.pnpm/unplugin-vue-components@0.26.0_vue@3.4.10/node_modules/unplugin-vue-components/dist/resolvers.js";
import { VueAmapResolver } from "file:///E:/weibo/map/map/vue3-vant4-Map/vue3-vant4-Map/node_modules/.pnpm/@vuemap+unplugin-resolver@2.0.0_unplugin-vue-components@0.26.0/node_modules/@vuemap/unplugin-resolver/dist/index.mjs";
var Components;
var init_unplugin_vue_components = __esm({
  "vite-config/plugins/unplugin-vue-components.js"() {
    Components = (viteEnv = {}) => {
      return components({
        resolvers: [VantResolver(), VueAmapResolver()],
        // 自动导入vant库
        dirs: ["src/components"],
        extensions: ["vue"]
        // 文件扩展名
      });
    };
  }
});

// vite-config/plugins/vite-plugin-copy.js
var vite_plugin_copy_exports = {};
__export(vite_plugin_copy_exports, {
  vitePluginCopy: () => vitePluginCopy
});
import { resolve, basename } from "path";
import fs from "fs";
var isDir, isFile, copyFile, copyFun, isObject, isArray, handleFile, viteConfig, vitePluginCopy;
var init_vite_plugin_copy = __esm({
  "vite-config/plugins/vite-plugin-copy.js"() {
    isDir = (dir) => {
      try {
        return fs.statSync(dir).isDirectory();
      } catch (_) {
        return false;
      }
    };
    isFile = (dir) => {
      try {
        return fs.statSync(dir).isFile();
      } catch (_) {
        return false;
      }
    };
    copyFile = (filePath, dist, file) => {
      const readStream = fs.createReadStream(filePath);
      const writeStrem = fs.createWriteStream(resolve(dist, file));
      readStream.pipe(writeStrem);
    };
    copyFun = (from, dist, fileName) => {
      if (!isDir(from) && !isFile(from))
        return;
      if (!isDir(dist)) {
        fs.mkdirSync(dist);
      }
      if (isDir(from)) {
        const dir = fs.readdirSync(from);
        dir.forEach((file) => {
          const filePath = resolve(from, file);
          fs.stat(filePath, (_, stat) => {
            if (stat.isFile()) {
              copyFile(filePath, dist, file);
            } else if (stat.isDirectory()) {
              copyFun(filePath, resolve(dist, file));
            }
          });
        });
      }
      if (isFile(from)) {
        const file = fileName || basename(from);
        copyFile(from, dist, file);
      }
    };
    isObject = (obj) => {
      return ["[object Object]"].includes(Object.prototype.toString.call(obj));
    };
    isArray = (obj) => {
      return typeof Array.isArray === "function" ? Array.isArray(obj) : ["[object Array]"].includes(Object.prototype.toString.call(obj));
    };
    handleFile = (root, option) => {
      const { from = "", to = "", fileName } = option;
      if (!from || !to)
        return;
      try {
        const fromDir = resolve(root, from);
        const toDir = resolve(root, to);
        copyFun(fromDir, toDir, fileName);
      } catch (e) {
      }
    };
    viteConfig = null;
    vitePluginCopy = (viteEnv = {}) => {
      const modeIndex = process.argv.indexOf("--mode");
      const mode = modeIndex !== -1 ? process.argv[modeIndex + 1] : "";
      const option = [
        {
          from: `vite-env/.env${mode ? `.${mode}` : ""}`,
          // 写要复制的目录或者文件
          to: "dist",
          // 目标目录
          fileName: ""
          // 复制文件时重命名文件名
        }
      ];
      return {
        name: "vite-plugin-copy",
        apply: "build",
        configResolved(resolvedConfig) {
          viteConfig = resolvedConfig;
        },
        closeBundle: async () => {
          const root = viteConfig.root;
          if (isObject(option)) {
            await handleFile(root, option);
          }
          if (isArray(option)) {
            option.forEach(async (item) => {
              await handleFile(root, item);
            });
          }
        }
      };
    };
  }
});

// vite-config/plugins/vite-plugin-legacy.js
var vite_plugin_legacy_exports = {};
__export(vite_plugin_legacy_exports, {
  legacyPlugin: () => legacyPlugin
});
import legacy from "file:///E:/weibo/map/map/vue3-vant4-Map/vue3-vant4-Map/node_modules/.pnpm/@vitejs+plugin-legacy@5.2.0_terser@5.26.0_vite@5.0.11/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
var legacyPlugin;
var init_vite_plugin_legacy = __esm({
  "vite-config/plugins/vite-plugin-legacy.js"() {
    legacyPlugin = (viteEnv = {}) => {
      return legacy();
    };
  }
});

// vite-config/plugins/vite-plugin-progress.js
var vite_plugin_progress_exports = {};
__export(vite_plugin_progress_exports, {
  Progress: () => Progress
});
import progress from "file:///E:/weibo/map/map/vue3-vant4-Map/vue3-vant4-Map/node_modules/.pnpm/vite-plugin-progress@0.0.7_vite@5.0.11/node_modules/vite-plugin-progress/dist/index.mjs";
var Progress;
var init_vite_plugin_progress = __esm({
  "vite-config/plugins/vite-plugin-progress.js"() {
    Progress = (viteEnv = {}) => {
      return progress();
    };
  }
});

// vite-config/plugins/vite-plugin-vue-setup-extend.js
var vite_plugin_vue_setup_extend_exports = {};
__export(vite_plugin_vue_setup_extend_exports, {
  vueSetupExtend: () => vueSetupExtend
});
import setupExtend from "file:///E:/weibo/map/map/vue3-vant4-Map/vue3-vant4-Map/node_modules/.pnpm/vite-plugin-vue-setup-extend@0.4.0_vite@5.0.11/node_modules/vite-plugin-vue-setup-extend/dist/index.mjs";
var vueSetupExtend;
var init_vite_plugin_vue_setup_extend = __esm({
  "vite-config/plugins/vite-plugin-vue-setup-extend.js"() {
    vueSetupExtend = (viteEnv = {}) => {
      return setupExtend();
    };
  }
});

// vite-config/plugins/vite-plugin-zip.js
var vite_plugin_zip_exports = {};
__export(vite_plugin_zip_exports, {
  vitePluginZip: () => vitePluginZip
});
import { resolve as resolve2, join } from "path";
import fs2 from "fs";
import JSZip from "file:///E:/weibo/map/map/vue3-vant4-Map/vue3-vant4-Map/node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/lib/index.js";
var readDir, mkZip, viteConfig2, vitePluginZip;
var init_vite_plugin_zip = __esm({
  "vite-config/plugins/vite-plugin-zip.js"() {
    readDir = (zip, dirPath) => {
      const files = fs2.readdirSync(dirPath);
      files.forEach((item) => {
        const filePath = join(dirPath, "./", item);
        const file = fs2.statSync(filePath);
        if (file.isDirectory()) {
          const dirZip = zip.folder(item);
          readDir(dirZip, filePath);
        } else {
          zip.file(item, fs2.readFileSync(filePath));
        }
      });
    };
    mkZip = async (root, viteEnv, option) => {
      let { fileName = "dist", output = "" } = viteEnv;
      if (!output) {
        output = resolve2(root, "./dist");
      }
      fileName += ".zip";
      const distPath = resolve2(output);
      const zip = new JSZip();
      readDir(zip, distPath);
      zip.generateAsync(option).then((res) => {
        const dist = join(distPath, `../${fileName}`);
        fs2.writeFileSync(dist, res);
      });
    };
    viteConfig2 = null;
    vitePluginZip = (viteEnv = {}) => {
      const option = {
        type: "nodebuffer",
        // 压缩类型
        compression: "DEFLATE",
        // 压缩算法
        compressionOptions: {
          level: 9
          // 压缩等级
        }
      };
      return {
        name: "vite-plugin-zip",
        apply: "build",
        configResolved(resolvedConfig) {
          viteConfig2 = resolvedConfig;
        },
        async closeBundle() {
          const root = viteConfig2.root;
          await mkZip(root, viteEnv, option);
        }
      };
    };
  }
});

// vite.config.js
import { defineConfig, loadEnv } from "file:///E:/weibo/map/map/vue3-vant4-Map/vue3-vant4-Map/node_modules/.pnpm/vite@5.0.11_less@4.2.0_terser@5.26.0/node_modules/vite/dist/node/index.js";
import vue from "file:///E:/weibo/map/map/vue3-vant4-Map/vue3-vant4-Map/node_modules/.pnpm/@vitejs+plugin-vue@5.0.3_vite@5.0.11_vue@3.4.10/node_modules/@vitejs/plugin-vue/dist/index.mjs";

// vite-config/index.js
import { resolve as resolve3, join as join2, extname } from "path";
import fs3 from "fs";
import postCssPxToRem from "file:///E:/weibo/map/map/vue3-vant4-Map/vue3-vant4-Map/node_modules/.pnpm/postcss-pxtorem@6.0.0_postcss@8.4.33/node_modules/postcss-pxtorem/index.js";

// import("./plugins/**/*") in vite-config/index.js
var globImport_plugins = __glob({
  "./plugins/unplugin-auto-import.js": () => Promise.resolve().then(() => (init_unplugin_auto_import(), unplugin_auto_import_exports)),
  "./plugins/unplugin-vue-components.js": () => Promise.resolve().then(() => (init_unplugin_vue_components(), unplugin_vue_components_exports)),
  "./plugins/vite-plugin-copy.js": () => Promise.resolve().then(() => (init_vite_plugin_copy(), vite_plugin_copy_exports)),
  "./plugins/vite-plugin-legacy.js": () => Promise.resolve().then(() => (init_vite_plugin_legacy(), vite_plugin_legacy_exports)),
  "./plugins/vite-plugin-progress.js": () => Promise.resolve().then(() => (init_vite_plugin_progress(), vite_plugin_progress_exports)),
  "./plugins/vite-plugin-vue-setup-extend.js": () => Promise.resolve().then(() => (init_vite_plugin_vue_setup_extend(), vite_plugin_vue_setup_extend_exports)),
  "./plugins/vite-plugin-zip.js": () => Promise.resolve().then(() => (init_vite_plugin_zip(), vite_plugin_zip_exports))
});

// vite-config/index.js
var __vite_injected_original_dirname = "E:\\weibo\\map\\map\\vue3-vant4-Map\\vue3-vant4-Map\\vite-config";
var loadPluginModules = async () => {
  return new Promise(async (success) => {
    const modulesPath = resolve3(__vite_injected_original_dirname, "plugins");
    const fileNames = fs3.readdirSync(modulesPath);
    let modulesImprot = [];
    fileNames.forEach(async (item) => {
      const filePath = join2(modulesPath, item);
      if (fs3.statSync(filePath).isFile() && [".js"].includes(extname(filePath))) {
        modulesImprot.push(globImport_plugins(`./plugins/${item}`));
      }
    });
    const modules = await Promise.all(modulesImprot);
    success(modules);
  });
};
var baseCfg = (viteEnv = {}) => {
  const { VITE_BASE_URL } = viteEnv;
  return {
    envDir: "vite-env",
    base: "./",
    resolve: {
      alias: {
        "@": resolve3("./src"),
        "~@": resolve3("./src")
      },
      extensions: [".js", ".mjs", ".vue", ".json", ".less", ".css"]
    },
    server: {
      host: "0.0.0.0",
      // 服务器主机名，如果允许外部访问，可设置为"0.0.0.0"
      port: 9161,
      open: false,
      cors: true,
      proxy: {
        "/api/": {
          target: "http://61.169.37.106:9167/api/",
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, "")
        }
      }
    },
    build: {
      outDir: "dist",
      minify: "terser",
      // esbuild 打包更快，但是不能去除 console.log，去除 console 使用 terser 模式
      rollupOptions: {
        output: {
          chunkFileNames: "js/[name]-[hash].js",
          // 引入文件名的名称
          entryFileNames: "js/[name]-[hash].js",
          // 包的入口文件名称
          assetFileNames: "[ext]/[name]-[hash].[ext]"
          // 资源文件像 字体，图片等
        }
      }
    },
    css: {
      postcss: {
        plugins: [
          postCssPxToRem({
            rootValue: 37.5,
            // 自适应，px>rem转换
            propList: ["*"],
            // 需要转换的属性，这里选择全部都进行转换
            selectorBlackList: ["norem"]
            // 过滤掉norem-开头的class，不进行rem转换
          })
        ]
      }
    }
  };
};
var pluginCfg = async (viteEnv = {}) => {
  const modulesArr = [];
  const modules = await loadPluginModules();
  modules.forEach((item) => {
    const funcs = Object.values(item);
    funcs.forEach((it) => {
      modulesArr.push(it(viteEnv));
    });
  });
  return modulesArr;
};

// vite.config.js
var vite_config_default = async ({ mode }) => {
  const { VITE_BASE_URL } = loadEnv(mode, process.cwd());
  return defineConfig({
    ...baseCfg({ VITE_BASE_URL }),
    plugins: [vue(), ...await pluginCfg({ VITE_BASE_URL })]
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS1jb25maWcvcGx1Z2lucy91bnBsdWdpbi1hdXRvLWltcG9ydC5qcyIsICJ2aXRlLWNvbmZpZy9wbHVnaW5zL3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzLmpzIiwgInZpdGUtY29uZmlnL3BsdWdpbnMvdml0ZS1wbHVnaW4tY29weS5qcyIsICJ2aXRlLWNvbmZpZy9wbHVnaW5zL3ZpdGUtcGx1Z2luLWxlZ2FjeS5qcyIsICJ2aXRlLWNvbmZpZy9wbHVnaW5zL3ZpdGUtcGx1Z2luLXByb2dyZXNzLmpzIiwgInZpdGUtY29uZmlnL3BsdWdpbnMvdml0ZS1wbHVnaW4tdnVlLXNldHVwLWV4dGVuZC5qcyIsICJ2aXRlLWNvbmZpZy9wbHVnaW5zL3ZpdGUtcGx1Z2luLXppcC5qcyIsICJ2aXRlLmNvbmZpZy5qcyIsICJ2aXRlLWNvbmZpZy9pbmRleC5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkU6XFxcXHdlaWJvXFxcXG1hcFxcXFxtYXBcXFxcdnVlMy12YW50NC1NYXBcXFxcdnVlMy12YW50NC1NYXBcXFxcdml0ZS1jb25maWdcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcd2VpYm9cXFxcbWFwXFxcXG1hcFxcXFx2dWUzLXZhbnQ0LU1hcFxcXFx2dWUzLXZhbnQ0LU1hcFxcXFx2aXRlLWNvbmZpZ1xcXFxwbHVnaW5zXFxcXHVucGx1Z2luLWF1dG8taW1wb3J0LmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi93ZWliby9tYXAvbWFwL3Z1ZTMtdmFudDQtTWFwL3Z1ZTMtdmFudDQtTWFwL3ZpdGUtY29uZmlnL3BsdWdpbnMvdW5wbHVnaW4tYXV0by1pbXBvcnQuanNcIjtpbXBvcnQgYXV0b0ltcG9ydCBmcm9tIFwidW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZVwiOyAvLyBcdTUxNjhcdTVDNDBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcdTYzRDJcdTRFRjZcbmNvbnN0IEF1dG9JbXBvcnQgPSAodml0ZUVudiA9IHt9KSA9PiB7XG5cdHJldHVybiBhdXRvSW1wb3J0KHtcblx0XHRpbXBvcnRzOiBbXG5cdFx0XHRcInZ1ZVwiLCAvLyBcdTUxNjhcdTVDNDBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjV2dWVcblx0XHRcdFwidnVlLXJvdXRlclwiLCAvLyBcdTUxNjhcdTVDNDBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcdThERUZcdTc1MzFcdTYzRDJcdTRFRjZcblx0XHRcdFwidnVlLWkxOG5cIiwgLy8gXHU1MTY4XHU1QzQwXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XHU1NkZEXHU5NjQ1XHU1MzE2XHU2M0QyXHU0RUY2XG5cdFx0XHRcInBpbmlhXCIsIC8vIFx1NTE2OFx1NUM0MFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NXBpbmlhXG5cdFx0XHR7XG5cdFx0XHRcdFwiQC9jb21tb24vZ2xvYmFsSW5pdGlhbGl6ZVwiOiBbXCIkZ2xvYmFsUmVhZHlcIl0sIC8vIFx1NTE2OFx1NUM0MFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NVx1NTIxRFx1NTlDQlx1NTMxNlx1NjVCOVx1NkNENVxuXHRcdFx0XHRcIkAvY29tbW9uL2dsb2JhbFN0b3JlXCI6IFtcIiRnbG9iYWxTdG9yZVwiLCBcIiRnbG9iYWxSZWdpc3RlclN0b3JlXCJdLCAvLyBcdTUxNjhcdTVDNDBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVwaW5pYVx1NTkwNFx1NzQwNlx1NTFGRFx1NjU3MFxuXHRcdFx0XHRcIkAvY29tbW9uL2dsb2JhbEV2ZW50QnVzXCI6IFtcIiRnbG9iYWxFdmVudEJ1c1wiXSwgLy8gXHU1MTY4XHU1QzQwXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XHU0RTJEXHU1OTJFXHU0RThCXHU0RUY2XHU2MDNCXHU3RUJGXG5cdFx0XHRcdFwiQC9jb21tb24vZ2xvYmFsTG9jYWxlc1wiOiBbXCIkZ2xvYmFsTGFuZ1wiXSwgLy8gXHU1MTY4XHU1QzQwXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XHU1NkZEXHU5NjQ1XHU1MzE2XHU2NUI5XHU2Q0Q1XG5cdFx0XHRcdFwiQC9jb21tb24vZ2xvYmFsQ29uZmlndXJlXCI6IFtcIiRnbG9iYWxDb25maWd1cmVcIl0sIC8vIFx1NTE2OFx1NUM0MFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NVx1OTg3NVx1OTc2Mlx1N0YxM1x1NUI1OFx1NTIxRFx1NTlDQlx1NTMxNlx1NTFGRFx1NjU3MFxuXHRcdFx0XHRcIkAvY29tbW9uL2dsb2JhbEh0dHBcIjogW1wiJGdsb2JhbEh0dHBcIl0sIC8vIFx1NTE2OFx1NUM0MFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NVx1OEJGN1x1NkM0Mlx1NjJFNlx1NjIyQVx1NjVCOVx1NkNENVxuXHRcdFx0XHRcIkAvY29tbW9uL2dsb2JhbFJlcXVlc3RcIjogW1wiJGdsb2JhbFJlcXVlc3RVcmxcIiwgXCIkZ2xvYmFsUmVxdWVzdFwiXSwgLy8gXHU1MTY4XHU1QzQwXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XHU4QkY3XHU2QzQyXHU1OTA0XHU3NDA2XHU1MUZEXHU2NTcwXG5cdFx0XHRcdFwiQC9jb21tb24vZ2xvYmFsQ29uc3RhbnRcIjogW1wiJGdsb2JhbENvbnN0YW50XCJdLCAvLyBcdTUxNjhcdTVDNDBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcdTVFMzhcdTkxQ0Zcblx0XHRcdFx0XCJAL2NvbW1vbi9nbG9iYWxSb3V0ZXJcIjogW1wiJGdsb2JhbFJvdXRlclwiXSwgLy8gXHU1MTY4XHU1QzQwXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XHU4REVGXHU3NTMxXHU5MTREXHU3RjZFXG5cdFx0XHRcdFwiQC9jb21tb24vZ2xvYmFsRXhwYW5kUm91dGVyXCI6IFtcIiRnbG9iYWxSb3V0ZXJNb2R1bGVzXCIsIFwiJGdsb2JhbEV4cGFuZFJvdXRlclwiLF0sIC8vIFx1NTE2OFx1NUM0MFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NVx1OERFRlx1NzUzMVx1NTkwNFx1NzQwNlx1NjVCOVx1NkNENVxuXHRcdFx0fSxcblx0XHRdLFxuXHR9KTtcbn07XG5cbmV4cG9ydCB7IEF1dG9JbXBvcnQgfTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcd2VpYm9cXFxcbWFwXFxcXG1hcFxcXFx2dWUzLXZhbnQ0LU1hcFxcXFx2dWUzLXZhbnQ0LU1hcFxcXFx2aXRlLWNvbmZpZ1xcXFxwbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFx3ZWlib1xcXFxtYXBcXFxcbWFwXFxcXHZ1ZTMtdmFudDQtTWFwXFxcXHZ1ZTMtdmFudDQtTWFwXFxcXHZpdGUtY29uZmlnXFxcXHBsdWdpbnNcXFxcdW5wbHVnaW4tdnVlLWNvbXBvbmVudHMuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L3dlaWJvL21hcC9tYXAvdnVlMy12YW50NC1NYXAvdnVlMy12YW50NC1NYXAvdml0ZS1jb25maWcvcGx1Z2lucy91bnBsdWdpbi12dWUtY29tcG9uZW50cy5qc1wiOy8qXG4gKiBARGVzY3JpcHRpb246IFxuICogQFZlcnNpb246IDEuMFxuICogQEF1dGhvcjogQWFyb0xpXG4gKiBARGF0ZTogMjAyNC0wMS0wMyAwOTozMzoyMVxuICogQExhc3RFZGl0b3JzOiBBYXJvTGlcbiAqIEBMYXN0RWRpdFRpbWU6IDIwMjQtMDEtMDMgMDk6MzQ6MzBcbiAqL1xuaW1wb3J0IGNvbXBvbmVudHMgZnJvbSBcInVucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGVcIjsgLy8gXHU1MTY4XHU1QzQwXHU1QkZDXHU1MTY1XHU3RUM0XHU0RUY2XHU1RTkzXG5pbXBvcnQgeyBWYW50UmVzb2x2ZXIgfSBmcm9tIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzXCI7IC8vIFx1NUJGQ1x1NTE2NVx1NTE4NVx1N0Y2RVx1NUU5M1x1NjNEMlx1NEVGNlxuaW1wb3J0IHsgVnVlQW1hcFJlc29sdmVyIH0gZnJvbSAnQHZ1ZW1hcC91bnBsdWdpbi1yZXNvbHZlcidcbmNvbnN0IENvbXBvbmVudHMgPSAodml0ZUVudiA9IHt9KSA9PiB7XG5cdHJldHVybiBjb21wb25lbnRzKHtcblx0XHRyZXNvbHZlcnM6IFtWYW50UmVzb2x2ZXIoKSwgVnVlQW1hcFJlc29sdmVyKCldLCAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjV2YW50XHU1RTkzXG5cdFx0ZGlyczogW1wic3JjL2NvbXBvbmVudHNcIl0sXG5cdFx0ZXh0ZW5zaW9uczogW1widnVlXCJdLCAvLyBcdTY1ODdcdTRFRjZcdTYyNjlcdTVDNTVcdTU0MERcblx0fSk7XG59O1xuXG5leHBvcnQgeyBDb21wb25lbnRzIH07IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFx3ZWlib1xcXFxtYXBcXFxcbWFwXFxcXHZ1ZTMtdmFudDQtTWFwXFxcXHZ1ZTMtdmFudDQtTWFwXFxcXHZpdGUtY29uZmlnXFxcXHBsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXHdlaWJvXFxcXG1hcFxcXFxtYXBcXFxcdnVlMy12YW50NC1NYXBcXFxcdnVlMy12YW50NC1NYXBcXFxcdml0ZS1jb25maWdcXFxccGx1Z2luc1xcXFx2aXRlLXBsdWdpbi1jb3B5LmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi93ZWliby9tYXAvbWFwL3Z1ZTMtdmFudDQtTWFwL3Z1ZTMtdmFudDQtTWFwL3ZpdGUtY29uZmlnL3BsdWdpbnMvdml0ZS1wbHVnaW4tY29weS5qc1wiO2ltcG9ydCB7IHJlc29sdmUsIGJhc2VuYW1lIH0gZnJvbSBcInBhdGhcIjtcbmltcG9ydCBmcyBmcm9tIFwiZnNcIjtcblxuY29uc3QgaXNEaXIgPSAoZGlyKSA9PiB7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIGZzLnN0YXRTeW5jKGRpcikuaXNEaXJlY3RvcnkoKTtcblx0fSBjYXRjaCAoXykge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufTtcblxuY29uc3QgaXNGaWxlID0gKGRpcikgPT4ge1xuXHR0cnkge1xuXHRcdHJldHVybiBmcy5zdGF0U3luYyhkaXIpLmlzRmlsZSgpO1xuXHR9IGNhdGNoIChfKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59O1xuXG5jb25zdCBjb3B5RmlsZSA9IChmaWxlUGF0aCwgZGlzdCwgZmlsZSkgPT4ge1xuXHRjb25zdCByZWFkU3RyZWFtID0gZnMuY3JlYXRlUmVhZFN0cmVhbShmaWxlUGF0aCk7XG5cdGNvbnN0IHdyaXRlU3RyZW0gPSBmcy5jcmVhdGVXcml0ZVN0cmVhbShyZXNvbHZlKGRpc3QsIGZpbGUpKTtcblx0cmVhZFN0cmVhbS5waXBlKHdyaXRlU3RyZW0pO1xufTtcblxuY29uc3QgY29weUZ1biA9IChmcm9tLCBkaXN0LCBmaWxlTmFtZSkgPT4ge1xuXHRpZiAoIWlzRGlyKGZyb20pICYmICFpc0ZpbGUoZnJvbSkpIHJldHVybjtcblx0aWYgKCFpc0RpcihkaXN0KSkge1xuXHRcdGZzLm1rZGlyU3luYyhkaXN0KTtcblx0fVxuXG5cdGlmIChpc0Rpcihmcm9tKSkge1xuXHRcdGNvbnN0IGRpciA9IGZzLnJlYWRkaXJTeW5jKGZyb20pO1xuXHRcdGRpci5mb3JFYWNoKChmaWxlKSA9PiB7XG5cdFx0XHRjb25zdCBmaWxlUGF0aCA9IHJlc29sdmUoZnJvbSwgZmlsZSk7XG5cdFx0XHRmcy5zdGF0KGZpbGVQYXRoLCAoXywgc3RhdCkgPT4ge1xuXHRcdFx0XHRpZiAoc3RhdC5pc0ZpbGUoKSkge1xuXHRcdFx0XHRcdGNvcHlGaWxlKGZpbGVQYXRoLCBkaXN0LCBmaWxlKTtcblx0XHRcdFx0fSBlbHNlIGlmIChzdGF0LmlzRGlyZWN0b3J5KCkpIHtcblx0XHRcdFx0XHRjb3B5RnVuKGZpbGVQYXRoLCByZXNvbHZlKGRpc3QsIGZpbGUpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXHRpZiAoaXNGaWxlKGZyb20pKSB7XG5cdFx0Y29uc3QgZmlsZSA9IGZpbGVOYW1lIHx8IGJhc2VuYW1lKGZyb20pO1xuXHRcdGNvcHlGaWxlKGZyb20sIGRpc3QsIGZpbGUpO1xuXHR9XG59O1xuXG5jb25zdCBpc09iamVjdCA9IChvYmopID0+IHtcblx0cmV0dXJuIFtcIltvYmplY3QgT2JqZWN0XVwiXS5pbmNsdWRlcyhPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSk7XG59O1xuXG5jb25zdCBpc0FycmF5ID0gKG9iaikgPT4ge1xuXHRyZXR1cm4gdHlwZW9mIEFycmF5LmlzQXJyYXkgPT09IFwiZnVuY3Rpb25cIlxuXHRcdD8gQXJyYXkuaXNBcnJheShvYmopXG5cdFx0OiBbXCJbb2JqZWN0IEFycmF5XVwiXS5pbmNsdWRlcyhPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSk7XG59O1xuXG5jb25zdCBoYW5kbGVGaWxlID0gKHJvb3QsIG9wdGlvbikgPT4ge1xuXHRjb25zdCB7IGZyb20gPSBcIlwiLCB0byA9IFwiXCIsIGZpbGVOYW1lIH0gPSBvcHRpb247XG5cdGlmICghZnJvbSB8fCAhdG8pIHJldHVybjtcblx0dHJ5IHtcblx0XHRjb25zdCBmcm9tRGlyID0gcmVzb2x2ZShyb290LCBmcm9tKTtcblx0XHRjb25zdCB0b0RpciA9IHJlc29sdmUocm9vdCwgdG8pO1xuXHRcdGNvcHlGdW4oZnJvbURpciwgdG9EaXIsIGZpbGVOYW1lKTtcblx0fSBjYXRjaCAoZSkge31cbn07XG5cbmxldCB2aXRlQ29uZmlnID0gbnVsbDtcblxuY29uc3Qgdml0ZVBsdWdpbkNvcHkgPSAodml0ZUVudiA9IHt9KSA9PiB7XG5cdGNvbnN0IG1vZGVJbmRleCA9IHByb2Nlc3MuYXJndi5pbmRleE9mKFwiLS1tb2RlXCIpO1xuXHRjb25zdCBtb2RlID0gbW9kZUluZGV4ICE9PSAtMSA/IHByb2Nlc3MuYXJndlttb2RlSW5kZXggKyAxXSA6IFwiXCI7XG5cdGNvbnN0IG9wdGlvbiA9IFtcblx0XHR7XG5cdFx0XHRmcm9tOiBgdml0ZS1lbnYvLmVudiR7bW9kZSA/IGAuJHttb2RlfWAgOiBcIlwifWAsIC8vIFx1NTE5OVx1ODk4MVx1NTkwRFx1NTIzNlx1NzY4NFx1NzZFRVx1NUY1NVx1NjIxNlx1ODAwNVx1NjU4N1x1NEVGNlxuXHRcdFx0dG86IFwiZGlzdFwiLCAvLyBcdTc2RUVcdTY4MDdcdTc2RUVcdTVGNTVcblx0XHRcdGZpbGVOYW1lOiBcIlwiLCAvLyBcdTU5MERcdTUyMzZcdTY1ODdcdTRFRjZcdTY1RjZcdTkxQ0RcdTU0N0RcdTU0MERcdTY1ODdcdTRFRjZcdTU0MERcblx0XHR9LFxuXHRdO1xuXHRyZXR1cm4ge1xuXHRcdG5hbWU6IFwidml0ZS1wbHVnaW4tY29weVwiLFxuXHRcdGFwcGx5OiBcImJ1aWxkXCIsXG5cdFx0Y29uZmlnUmVzb2x2ZWQocmVzb2x2ZWRDb25maWcpIHtcblx0XHRcdHZpdGVDb25maWcgPSByZXNvbHZlZENvbmZpZztcblx0XHR9LFxuXHRcdGNsb3NlQnVuZGxlOiBhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCByb290ID0gdml0ZUNvbmZpZy5yb290O1xuXHRcdFx0aWYgKGlzT2JqZWN0KG9wdGlvbikpIHtcblx0XHRcdFx0YXdhaXQgaGFuZGxlRmlsZShyb290LCBvcHRpb24pO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoaXNBcnJheShvcHRpb24pKSB7XG5cdFx0XHRcdG9wdGlvbi5mb3JFYWNoKGFzeW5jIChpdGVtKSA9PiB7XG5cdFx0XHRcdFx0YXdhaXQgaGFuZGxlRmlsZShyb290LCBpdGVtKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0fTtcbn07XG5cbmV4cG9ydCB7IHZpdGVQbHVnaW5Db3B5IH07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkU6XFxcXHdlaWJvXFxcXG1hcFxcXFxtYXBcXFxcdnVlMy12YW50NC1NYXBcXFxcdnVlMy12YW50NC1NYXBcXFxcdml0ZS1jb25maWdcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcd2VpYm9cXFxcbWFwXFxcXG1hcFxcXFx2dWUzLXZhbnQ0LU1hcFxcXFx2dWUzLXZhbnQ0LU1hcFxcXFx2aXRlLWNvbmZpZ1xcXFxwbHVnaW5zXFxcXHZpdGUtcGx1Z2luLWxlZ2FjeS5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovd2VpYm8vbWFwL21hcC92dWUzLXZhbnQ0LU1hcC92dWUzLXZhbnQ0LU1hcC92aXRlLWNvbmZpZy9wbHVnaW5zL3ZpdGUtcGx1Z2luLWxlZ2FjeS5qc1wiO2ltcG9ydCBsZWdhY3kgZnJvbSBcIkB2aXRlanMvcGx1Z2luLWxlZ2FjeVwiOyAvLyBcdTUxN0NcdTVCQjlcdTRGNEVcdTcyNDhcdTY3MkNcdTZENEZcdTg5QzhcdTU2NjhcdTYzRDJcdTRFRjZcbmNvbnN0IGxlZ2FjeVBsdWdpbiA9ICh2aXRlRW52ID0ge30pID0+IHtcblx0cmV0dXJuIGxlZ2FjeSgpO1xufTtcblxuZXhwb3J0IHsgbGVnYWN5UGx1Z2luIH07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkU6XFxcXHdlaWJvXFxcXG1hcFxcXFxtYXBcXFxcdnVlMy12YW50NC1NYXBcXFxcdnVlMy12YW50NC1NYXBcXFxcdml0ZS1jb25maWdcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcd2VpYm9cXFxcbWFwXFxcXG1hcFxcXFx2dWUzLXZhbnQ0LU1hcFxcXFx2dWUzLXZhbnQ0LU1hcFxcXFx2aXRlLWNvbmZpZ1xcXFxwbHVnaW5zXFxcXHZpdGUtcGx1Z2luLXByb2dyZXNzLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi93ZWliby9tYXAvbWFwL3Z1ZTMtdmFudDQtTWFwL3Z1ZTMtdmFudDQtTWFwL3ZpdGUtY29uZmlnL3BsdWdpbnMvdml0ZS1wbHVnaW4tcHJvZ3Jlc3MuanNcIjtpbXBvcnQgcHJvZ3Jlc3MgZnJvbSBcInZpdGUtcGx1Z2luLXByb2dyZXNzXCI7IC8vIFx1NjI1M1x1NTMwNVx1NjYzRVx1NzkzQVx1OEZEQlx1NUVBNlx1Njc2MVx1NjNEMlx1NEVGNlxuY29uc3QgUHJvZ3Jlc3MgPSAodml0ZUVudiA9IHt9KSA9PiB7XG5cdHJldHVybiBwcm9ncmVzcygpO1xufTtcblxuZXhwb3J0IHsgUHJvZ3Jlc3MgfTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcd2VpYm9cXFxcbWFwXFxcXG1hcFxcXFx2dWUzLXZhbnQ0LU1hcFxcXFx2dWUzLXZhbnQ0LU1hcFxcXFx2aXRlLWNvbmZpZ1xcXFxwbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFx3ZWlib1xcXFxtYXBcXFxcbWFwXFxcXHZ1ZTMtdmFudDQtTWFwXFxcXHZ1ZTMtdmFudDQtTWFwXFxcXHZpdGUtY29uZmlnXFxcXHBsdWdpbnNcXFxcdml0ZS1wbHVnaW4tdnVlLXNldHVwLWV4dGVuZC5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovd2VpYm8vbWFwL21hcC92dWUzLXZhbnQ0LU1hcC92dWUzLXZhbnQ0LU1hcC92aXRlLWNvbmZpZy9wbHVnaW5zL3ZpdGUtcGx1Z2luLXZ1ZS1zZXR1cC1leHRlbmQuanNcIjtpbXBvcnQgc2V0dXBFeHRlbmQgZnJvbSBcInZpdGUtcGx1Z2luLXZ1ZS1zZXR1cC1leHRlbmRcIjsgLy9cdTdFQzRcdTRFRjZcdTU0N0RcdTU0MERcdTYzRDJcdTRFRjZcbmNvbnN0IHZ1ZVNldHVwRXh0ZW5kID0gKHZpdGVFbnYgPSB7fSkgPT4ge1xuXHRyZXR1cm4gc2V0dXBFeHRlbmQoKTtcbn07XG5cbmV4cG9ydCB7IHZ1ZVNldHVwRXh0ZW5kIH07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkU6XFxcXHdlaWJvXFxcXG1hcFxcXFxtYXBcXFxcdnVlMy12YW50NC1NYXBcXFxcdnVlMy12YW50NC1NYXBcXFxcdml0ZS1jb25maWdcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcd2VpYm9cXFxcbWFwXFxcXG1hcFxcXFx2dWUzLXZhbnQ0LU1hcFxcXFx2dWUzLXZhbnQ0LU1hcFxcXFx2aXRlLWNvbmZpZ1xcXFxwbHVnaW5zXFxcXHZpdGUtcGx1Z2luLXppcC5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovd2VpYm8vbWFwL21hcC92dWUzLXZhbnQ0LU1hcC92dWUzLXZhbnQ0LU1hcC92aXRlLWNvbmZpZy9wbHVnaW5zL3ZpdGUtcGx1Z2luLXppcC5qc1wiO2ltcG9ydCB7IHJlc29sdmUsIGpvaW4gfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IGZzIGZyb20gXCJmc1wiO1xuaW1wb3J0IEpTWmlwIGZyb20gXCJqc3ppcFwiO1xuXG5jb25zdCByZWFkRGlyID0gKHppcCwgZGlyUGF0aCkgPT4ge1xuXHRjb25zdCBmaWxlcyA9IGZzLnJlYWRkaXJTeW5jKGRpclBhdGgpO1xuXHRmaWxlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG5cdFx0Y29uc3QgZmlsZVBhdGggPSBqb2luKGRpclBhdGgsIFwiLi9cIiwgaXRlbSk7XG5cdFx0Y29uc3QgZmlsZSA9IGZzLnN0YXRTeW5jKGZpbGVQYXRoKTtcblx0XHRpZiAoZmlsZS5pc0RpcmVjdG9yeSgpKSB7XG5cdFx0XHRjb25zdCBkaXJaaXAgPSB6aXAuZm9sZGVyKGl0ZW0pO1xuXHRcdFx0cmVhZERpcihkaXJaaXAsIGZpbGVQYXRoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0emlwLmZpbGUoaXRlbSwgZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoKSk7XG5cdFx0fVxuXHR9KTtcbn07XG5cbmNvbnN0IG1rWmlwID0gYXN5bmMgKHJvb3QsIHZpdGVFbnYsIG9wdGlvbikgPT4ge1xuXHRsZXQgeyBmaWxlTmFtZSA9IFwiZGlzdFwiLCBvdXRwdXQgPSBcIlwiIH0gPSB2aXRlRW52O1xuXHRpZiAoIW91dHB1dCkge1xuXHRcdG91dHB1dCA9IHJlc29sdmUocm9vdCwgXCIuL2Rpc3RcIik7XG5cdH1cblx0ZmlsZU5hbWUgKz0gXCIuemlwXCI7XG5cdGNvbnN0IGRpc3RQYXRoID0gcmVzb2x2ZShvdXRwdXQpO1xuXHRjb25zdCB6aXAgPSBuZXcgSlNaaXAoKTtcblx0cmVhZERpcih6aXAsIGRpc3RQYXRoKTtcblx0emlwLmdlbmVyYXRlQXN5bmMob3B0aW9uKS50aGVuKChyZXMpID0+IHtcblx0XHRjb25zdCBkaXN0ID0gam9pbihkaXN0UGF0aCwgYC4uLyR7ZmlsZU5hbWV9YCk7XG5cdFx0ZnMud3JpdGVGaWxlU3luYyhkaXN0LCByZXMpO1xuXHR9KTtcbn07XG5cbmxldCB2aXRlQ29uZmlnID0gbnVsbDtcblxuY29uc3Qgdml0ZVBsdWdpblppcCA9ICh2aXRlRW52ID0ge30pID0+IHtcblx0Y29uc3Qgb3B0aW9uID0ge1xuXHRcdHR5cGU6IFwibm9kZWJ1ZmZlclwiLCAvLyBcdTUzOEJcdTdGMjlcdTdDN0JcdTU3OEJcblx0XHRjb21wcmVzc2lvbjogXCJERUZMQVRFXCIsIC8vIFx1NTM4Qlx1N0YyOVx1N0I5N1x1NkNENVxuXHRcdGNvbXByZXNzaW9uT3B0aW9uczoge1xuXHRcdFx0bGV2ZWw6IDksIC8vIFx1NTM4Qlx1N0YyOVx1N0I0OVx1N0VBN1xuXHRcdH0sXG5cdH07XG5cdHJldHVybiB7XG5cdFx0bmFtZTogXCJ2aXRlLXBsdWdpbi16aXBcIixcblx0XHRhcHBseTogXCJidWlsZFwiLFxuXHRcdGNvbmZpZ1Jlc29sdmVkKHJlc29sdmVkQ29uZmlnKSB7XG5cdFx0XHR2aXRlQ29uZmlnID0gcmVzb2x2ZWRDb25maWc7XG5cdFx0fSxcblx0XHRhc3luYyBjbG9zZUJ1bmRsZSgpIHtcblx0XHRcdGNvbnN0IHJvb3QgPSB2aXRlQ29uZmlnLnJvb3Q7XG5cdFx0XHRhd2FpdCBta1ppcChyb290LCB2aXRlRW52LCBvcHRpb24pO1xuXHRcdH0sXG5cdH07XG59O1xuZXhwb3J0IHsgdml0ZVBsdWdpblppcCB9O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFx3ZWlib1xcXFxtYXBcXFxcbWFwXFxcXHZ1ZTMtdmFudDQtTWFwXFxcXHZ1ZTMtdmFudDQtTWFwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFx3ZWlib1xcXFxtYXBcXFxcbWFwXFxcXHZ1ZTMtdmFudDQtTWFwXFxcXHZ1ZTMtdmFudDQtTWFwXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi93ZWliby9tYXAvbWFwL3Z1ZTMtdmFudDQtTWFwL3Z1ZTMtdmFudDQtTWFwL3ZpdGUuY29uZmlnLmpzXCI7LypcbiAqIEBEZXNjcmlwdGlvbjogXG4gKiBAVmVyc2lvbjogMS4wXG4gKiBAQXV0aG9yOiBBYXJvTGlcbiAqIEBEYXRlOiAyMDI0LTAxLTAzIDA5OjMzOjIxXG4gKiBATGFzdEVkaXRvcnM6IEFhcm9MaVxuICogQExhc3RFZGl0VGltZTogMjAyNC0wMS0wMyAwOTozMzoyMVxuICovXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XG5pbXBvcnQgeyBiYXNlQ2ZnLCBwbHVnaW5DZmcgfSBmcm9tIFwiLi92aXRlLWNvbmZpZ1wiO1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgKHsgbW9kZSB9KSA9PiB7XG5cdGNvbnN0IHsgVklURV9CQVNFX1VSTCB9ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKTtcblx0cmV0dXJuIGRlZmluZUNvbmZpZyh7XG5cdFx0Li4uYmFzZUNmZyh7IFZJVEVfQkFTRV9VUkwgfSksXG5cdFx0cGx1Z2luczogW3Z1ZSgpLCAuLi5hd2FpdCBwbHVnaW5DZmcoeyBWSVRFX0JBU0VfVVJMIH0pXSxcblx0fSk7XG59O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFx3ZWlib1xcXFxtYXBcXFxcbWFwXFxcXHZ1ZTMtdmFudDQtTWFwXFxcXHZ1ZTMtdmFudDQtTWFwXFxcXHZpdGUtY29uZmlnXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFx3ZWlib1xcXFxtYXBcXFxcbWFwXFxcXHZ1ZTMtdmFudDQtTWFwXFxcXHZ1ZTMtdmFudDQtTWFwXFxcXHZpdGUtY29uZmlnXFxcXGluZGV4LmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi93ZWliby9tYXAvbWFwL3Z1ZTMtdmFudDQtTWFwL3Z1ZTMtdmFudDQtTWFwL3ZpdGUtY29uZmlnL2luZGV4LmpzXCI7LypcbiAqIEBEZXNjcmlwdGlvbjogXG4gKiBAVmVyc2lvbjogMS4wXG4gKiBAQXV0aG9yOiBBYXJvTGlcbiAqIEBEYXRlOiAyMDI0LTAxLTEyIDEwOjI5OjUwXG4gKiBATGFzdEVkaXRvcnM6IEFhcm9MaVxuICogQExhc3RFZGl0VGltZTogMjAyNC0wMS0xMiAxNzo1MDo1NFxuICovXG5pbXBvcnQgeyByZXNvbHZlLCBqb2luLCBleHRuYW1lIH0gZnJvbSBcInBhdGhcIjtcbmltcG9ydCBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCBwb3N0Q3NzUHhUb1JlbSBmcm9tIFwicG9zdGNzcy1weHRvcmVtXCI7XG5cbi8vIFx1NTJBMFx1OEY3RFx1NjNEMlx1NEVGNlx1NkEyMVx1NTc1N1xuY29uc3QgbG9hZFBsdWdpbk1vZHVsZXMgPSBhc3luYyAoKSA9PiB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcykgPT4ge1xuXHRcdGNvbnN0IG1vZHVsZXNQYXRoID0gcmVzb2x2ZShfX2Rpcm5hbWUsIFwicGx1Z2luc1wiKTtcblx0XHRjb25zdCBmaWxlTmFtZXMgPSBmcy5yZWFkZGlyU3luYyhtb2R1bGVzUGF0aCk7XG5cdFx0bGV0IG1vZHVsZXNJbXByb3QgPSBbXTtcblx0XHRmaWxlTmFtZXMuZm9yRWFjaChhc3luYyAoaXRlbSkgPT4ge1xuXHRcdFx0Y29uc3QgZmlsZVBhdGggPSBqb2luKG1vZHVsZXNQYXRoLCBpdGVtKTtcblx0XHRcdGlmIChcblx0XHRcdFx0ZnMuc3RhdFN5bmMoZmlsZVBhdGgpLmlzRmlsZSgpICYmXG5cdFx0XHRcdFtcIi5qc1wiXS5pbmNsdWRlcyhleHRuYW1lKGZpbGVQYXRoKSlcblx0XHRcdCkge1xuXHRcdFx0XHRtb2R1bGVzSW1wcm90LnB1c2goaW1wb3J0KGAuL3BsdWdpbnMvJHtpdGVtfWApKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGNvbnN0IG1vZHVsZXMgPSBhd2FpdCBQcm9taXNlLmFsbChtb2R1bGVzSW1wcm90KTtcblx0XHRzdWNjZXNzKG1vZHVsZXMpO1xuXHR9KTtcbn07XG5cbi8vIFx1NTdGQVx1NjcyQ1x1OTE0RFx1N0Y2RVxuY29uc3QgYmFzZUNmZyA9ICh2aXRlRW52ID0ge30pID0+IHtcblx0Y29uc3QgeyBWSVRFX0JBU0VfVVJMIH0gPSB2aXRlRW52O1xuXHRyZXR1cm4ge1xuXHRcdGVudkRpcjogXCJ2aXRlLWVudlwiLFxuXHRcdGJhc2U6ICcuLycsXG5cdFx0cmVzb2x2ZToge1xuXHRcdFx0YWxpYXM6IHtcblx0XHRcdFx0XCJAXCI6IHJlc29sdmUoXCIuL3NyY1wiKSxcblx0XHRcdFx0XCJ+QFwiOiByZXNvbHZlKFwiLi9zcmNcIiksXG5cdFx0XHR9LFxuXHRcdFx0ZXh0ZW5zaW9uczogW1wiLmpzXCIsIFwiLm1qc1wiLCBcIi52dWVcIiwgXCIuanNvblwiLCBcIi5sZXNzXCIsIFwiLmNzc1wiXSxcblx0XHR9LFxuXHRcdHNlcnZlcjoge1xuXHRcdFx0aG9zdDogXCIwLjAuMC4wXCIsIC8vIFx1NjcwRFx1NTJBMVx1NTY2OFx1NEUzQlx1NjczQVx1NTQwRFx1RkYwQ1x1NTk4Mlx1Njc5Q1x1NTE0MVx1OEJCOFx1NTkxNlx1OTBFOFx1OEJCRlx1OTVFRVx1RkYwQ1x1NTNFRlx1OEJCRVx1N0Y2RVx1NEUzQVwiMC4wLjAuMFwiXG5cdFx0XHRwb3J0OiA5MTYxLFxuXHRcdFx0b3BlbjogZmFsc2UsXG5cdFx0XHRjb3JzOiB0cnVlLFxuXHRcdFx0cHJveHk6IHtcblx0XHRcdFx0Jy9hcGkvJzoge1xuXHRcdFx0XHRcdHRhcmdldDogJ2h0dHA6Ly82MS4xNjkuMzcuMTA2OjkxNjcvYXBpLycsXG5cdFx0XHRcdFx0Y2hhbmdlT3JpZ2luOiB0cnVlLFxuXHRcdFx0XHRcdHJld3JpdGU6IChwKSA9PiBwLnJlcGxhY2UoL15cXC9hcGkvLCAnJyksXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdGJ1aWxkOiB7XG5cdFx0XHRvdXREaXI6IFwiZGlzdFwiLFxuXHRcdFx0bWluaWZ5OiBcInRlcnNlclwiLCAvLyBlc2J1aWxkIFx1NjI1M1x1NTMwNVx1NjZGNFx1NUZFQlx1RkYwQ1x1NEY0Nlx1NjYyRlx1NEUwRFx1ODBGRFx1NTNCQlx1OTY2NCBjb25zb2xlLmxvZ1x1RkYwQ1x1NTNCQlx1OTY2NCBjb25zb2xlIFx1NEY3Rlx1NzUyOCB0ZXJzZXIgXHU2QTIxXHU1RjBGXG5cdFx0XHRyb2xsdXBPcHRpb25zOiB7XG5cdFx0XHRcdG91dHB1dDoge1xuXHRcdFx0XHRcdGNodW5rRmlsZU5hbWVzOiBcImpzL1tuYW1lXS1baGFzaF0uanNcIiwgLy8gXHU1RjE1XHU1MTY1XHU2NTg3XHU0RUY2XHU1NDBEXHU3Njg0XHU1NDBEXHU3OUYwXG5cdFx0XHRcdFx0ZW50cnlGaWxlTmFtZXM6IFwianMvW25hbWVdLVtoYXNoXS5qc1wiLCAvLyBcdTUzMDVcdTc2ODRcdTUxNjVcdTUzRTNcdTY1ODdcdTRFRjZcdTU0MERcdTc5RjBcblx0XHRcdFx0XHRhc3NldEZpbGVOYW1lczogXCJbZXh0XS9bbmFtZV0tW2hhc2hdLltleHRdXCIsIC8vIFx1OEQ0NFx1NkU5MFx1NjU4N1x1NEVGNlx1NTBDRiBcdTVCNTdcdTRGNTNcdUZGMENcdTU2RkVcdTcyNDdcdTdCNDlcblx0XHRcdFx0fSxcblx0XHRcdH0sXG5cdFx0fSxcblx0XHRjc3M6IHtcblx0XHRcdHBvc3Rjc3M6IHtcblx0XHRcdFx0cGx1Z2luczogW1xuXHRcdFx0XHRcdHBvc3RDc3NQeFRvUmVtKHtcblx0XHRcdFx0XHRcdHJvb3RWYWx1ZTogMzcuNSwgLy8gXHU4MUVBXHU5MDAyXHU1RTk0XHVGRjBDcHg+cmVtXHU4RjZDXHU2MzYyXG5cdFx0XHRcdFx0XHRwcm9wTGlzdDogW1wiKlwiXSwgLy8gXHU5NzAwXHU4OTgxXHU4RjZDXHU2MzYyXHU3Njg0XHU1QzVFXHU2MDI3XHVGRjBDXHU4RkQ5XHU5MUNDXHU5MDA5XHU2MkU5XHU1MTY4XHU5MEU4XHU5MEZEXHU4RkRCXHU4ODRDXHU4RjZDXHU2MzYyXG5cdFx0XHRcdFx0XHRzZWxlY3RvckJsYWNrTGlzdDogW1wibm9yZW1cIl0sIC8vIFx1OEZDN1x1NkVFNFx1NjM4OW5vcmVtLVx1NUYwMFx1NTkzNFx1NzY4NGNsYXNzXHVGRjBDXHU0RTBEXHU4RkRCXHU4ODRDcmVtXHU4RjZDXHU2MzYyXG5cdFx0XHRcdFx0fSksXG5cdFx0XHRcdF0sXG5cdFx0XHR9LFxuXHRcdH0sXG5cdH07XG59O1xuXG4vLyBcdTYzRDJcdTRFRjZcdTkxNERcdTdGNkVcbmNvbnN0IHBsdWdpbkNmZyA9IGFzeW5jICh2aXRlRW52ID0ge30pID0+IHtcblx0Y29uc3QgbW9kdWxlc0FyciA9IFtdO1xuXHRjb25zdCBtb2R1bGVzID0gYXdhaXQgbG9hZFBsdWdpbk1vZHVsZXMoKTtcblx0bW9kdWxlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG5cdFx0Y29uc3QgZnVuY3MgPSBPYmplY3QudmFsdWVzKGl0ZW0pO1xuXHRcdGZ1bmNzLmZvckVhY2goKGl0KSA9PiB7XG5cdFx0XHRtb2R1bGVzQXJyLnB1c2goaXQodml0ZUVudikpO1xuXHRcdH0pO1xuXHR9KTtcblx0cmV0dXJuIG1vZHVsZXNBcnI7XG59O1xuXG5leHBvcnQgeyBiYXNlQ2ZnLCBwbHVnaW5DZmcgfTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBMFosT0FBTyxnQkFBZ0I7QUFBamIsSUFDTTtBQUROO0FBQUE7QUFDQSxJQUFNLGFBQWEsQ0FBQyxVQUFVLENBQUMsTUFBTTtBQUNwQyxhQUFPLFdBQVc7QUFBQSxRQUNqQixTQUFTO0FBQUEsVUFDUjtBQUFBO0FBQUEsVUFDQTtBQUFBO0FBQUEsVUFDQTtBQUFBO0FBQUEsVUFDQTtBQUFBO0FBQUEsVUFDQTtBQUFBLFlBQ0MsNkJBQTZCLENBQUMsY0FBYztBQUFBO0FBQUEsWUFDNUMsd0JBQXdCLENBQUMsZ0JBQWdCLHNCQUFzQjtBQUFBO0FBQUEsWUFDL0QsMkJBQTJCLENBQUMsaUJBQWlCO0FBQUE7QUFBQSxZQUM3QywwQkFBMEIsQ0FBQyxhQUFhO0FBQUE7QUFBQSxZQUN4Qyw0QkFBNEIsQ0FBQyxrQkFBa0I7QUFBQTtBQUFBLFlBQy9DLHVCQUF1QixDQUFDLGFBQWE7QUFBQTtBQUFBLFlBQ3JDLDBCQUEwQixDQUFDLHFCQUFxQixnQkFBZ0I7QUFBQTtBQUFBLFlBQ2hFLDJCQUEyQixDQUFDLGlCQUFpQjtBQUFBO0FBQUEsWUFDN0MseUJBQXlCLENBQUMsZUFBZTtBQUFBO0FBQUEsWUFDekMsK0JBQStCLENBQUMsd0JBQXdCLHFCQUFzQjtBQUFBO0FBQUEsVUFDL0U7QUFBQSxRQUNEO0FBQUEsTUFDRCxDQUFDO0FBQUEsSUFD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QUNkLG1CQUFtQixDQUFDLE9BQU87QUFBQTtBQUFBLFVBQzVCLENBQUM7QUFBQSxRQUNGO0FBQUEsTUFDRDtBQUFBLElBQ0Q7QUFBQSxFQUNEO0FBQ0Q7QUFHQSxJQUFNLFlBQVksT0FBTyxVQUFVLENBQUMsTUFBTTtBQUN6QyxRQUFNLGFBQWEsQ0FBQztBQUNwQixRQUFNLFVBQVUsTUFBTSxrQkFBa0I7QUFDeEMsVUFBUSxRQUFRLENBQUMsU0FBUztBQUN6QixVQUFNLFFBQVEsT0FBTyxPQUFPLElBQUk7QUFDaEMsVUFBTSxRQUFRLENBQUMsT0FBTztBQUNyQixpQkFBVyxLQUFLLEdBQUcsT0FBTyxDQUFDO0FBQUEsSUFDNUIsQ0FBQztBQUFBLEVBQ0YsQ0FBQztBQUNELFNBQU87QUFDUjs7O0FEcEZBLElBQU8sc0JBQVEsT0FBTyxFQUFFLEtBQUssTUFBTTtBQUNsQyxRQUFNLEVBQUUsY0FBYyxJQUFJLFFBQVEsTUFBTSxRQUFRLElBQUksQ0FBQztBQUNyRCxTQUFPLGFBQWE7QUFBQSxJQUNuQixHQUFHLFFBQVEsRUFBRSxjQUFjLENBQUM7QUFBQSxJQUM1QixTQUFTLENBQUMsSUFBSSxHQUFHLEdBQUcsTUFBTSxVQUFVLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFBQSxFQUN2RCxDQUFDO0FBQ0Y7IiwKICAibmFtZXMiOiBbInJlc29sdmUiLCAiZnMiLCAidml0ZUNvbmZpZyIsICJyZXNvbHZlIiwgImpvaW4iLCAiZnMiLCAicmVzb2x2ZSIsICJmcyIsICJqb2luIl0KfQo=
