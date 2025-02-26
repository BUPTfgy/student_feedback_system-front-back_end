<script>
// 导入vuex的mapActions和mapMutations方法，用于简化Vuex中的actions和mutations的映射
import {
	mapActions,
	mapMutations
} from 'vuex'

// 导入后台管理配置
import config from '@/admin.config.js'

// 导入当前项目的版本信息
import {
	version
} from './package.json'

// 导入存储键值的常量
import { uniAdminCacheKey } from './store/constants.js'

// 导入文件上传功能，用于设置默认的云存储供应商
import uploadFileForExtStorage from "@/js_sdk/ext-storage/uploadFileForExtStorage.js"

export default {
	created() {
		// 初始化时清除可能存在的定时器
		this.clear = undefined
	},
	methods: {
		...mapMutations('app', ['SET_THEME']), // 映射Vuex中的SET_THEME mutation
		...mapActions({
			init: 'app/init' // 映射Vuex中的init action
		}),
		clearPlatform() {
			// 获取所有包含'platform'关键字的本地存储键，并删除它们
			const keysOfPlatform = uni.getStorageInfoSync().keys.filter(key => key.indexOf('platform') > -1)
			keysOfPlatform.length && keysOfPlatform.forEach(key => uni.removeStorageSync(key))
		}
	},
	onPageNotFound(msg) {
		// 当页面未找到时，重定向到错误页面
		uni.redirectTo({
			url: config.error.url
		})
	},
	onLaunch: function () {
		// 在H5平台上打印版本信息
		// #ifdef H5
		console.log(
			`%c uni-admin %c v${version} `,
			'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
			'background:#007aff ;padding: 1px; border-radius: 0 3px 3px 0;  color: #fff; font-weight: bold;'
		)
		// #endif

		// 此处代码已被注释，原功能为强制用户登录，如需启用请取消注释并根据实际需求修改
		/*
		// #ifdef H5
		let uni_id_token_expired = uni.getStorageSync("uni_id_token_expired");
		if (!uni_id_token_expired || uni_id_token_expired < Date.now()) {
			uni.reLaunch({
				url: config.login.url
			})
		}
		// #endif
		*/

		console.log('App Launch') // 打印应用启动日志

		// 如果用户已登录，则初始化应用
		if (this.$uniIdPagesStore.store.hasLogin) {
			this.init()
		}

		// 监听登录成功事件，登录成功后初始化应用
		uni.$on('uni-id-pages-login-success', () => {
			this.init()
		})

		// 设置应用主题，默认为'default'
		this.SET_THEME(uni.getStorageSync(uniAdminCacheKey.theme) || 'default')

		// 设置默认的文件上传云存储供应商及相关配置
		uploadFileForExtStorage.init({
			provider: "unicloud",
			domain: "cdn.example.com",
			fileID2fileURL: true,
			uploadFileOptions: async (event) => {
				const uniCloudStorageExtCo = uniCloud.importObject("ext-storage-co");
				return await uniCloudStorageExtCo.getUploadFileOptions(event);
			}
		});
	},
	onShow: function () {
		// 当应用显示时，打印日志并开始定时清理平台相关数据
		console.log('App Show')
		this.clear = setInterval(() => this.clearPlatform(), 15 * 60 * 1000)
	},
	onHide: function () {
		// 当应用隐藏时，打印日志并清除定时器
		console.log('App Hide')
		this.clear && clearInterval(this.clear)
	}
}
</script>