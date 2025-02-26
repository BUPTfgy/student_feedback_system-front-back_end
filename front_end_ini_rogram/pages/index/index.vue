<template>
	<view class="container">
		<image class="brand-logo" src="/static/logo.png"></image>
		<view class="header-section"> <text class="header-title">{{ title }}</text> </view>

		<!-- 反馈输入区域 -->
		<view class="input-section">
			<view class="input-group">
				<text class="input-label">姓名：</text>
				<input class="form-input" v-model="formData.name" placeholder="请输入您的姓名" />
			</view>
			<view class="input-group">
				<text class="input-label">联系方式：</text>
				<input class="form-input" v-model="formData.contact" placeholder="请输入您的联系方式" />
			</view>
			<view class="input-group">
				<text class="input-label">反馈内容：</text>
				<textarea class="form-textarea" v-model="formData.content" placeholder="请输入您的反馈内容" />
			</view>
			<button class="primary-button" @click="submitFeedback">提交反馈</button>
		</view>
	</view>
</template>
<script>export default {
	data() { return { title: '学生意见反馈', formData: { name: '', contact: '', content: '' } } },
	methods: {
		async submitFeedback() {
			if (!this.formData.name) {
				uni.showToast({
					title: '请输入姓名',
					icon: 'none'
				});
				return;
			}
			if (!this.formData.contact) {
				uni.showToast({
					title: '请输入学号',
					icon: 'none'
				});
				return;
			}
			if (!this.formData.content) {
				uni.showToast({
					title: '请输入反馈内容',
					icon: 'none'
				});
				return;
			}

			try {
				const res = await uniCloud.callFunction({
					name: 'submit-feedback',
					data: this.formData
				});

				console.log('云函数返回：', res);

				if (res.result.code === 200) {
					uni.showToast({
						title: '提交成功',
						icon: 'success'
					});

					this.formData = {
						name: '',
						contact: '',
						content: ''
					};
				} else {
					console.error('云函数返回错误：', res.result);
					uni.showToast({
						title: res.result.message || '提交失败',
						icon: 'none'
					});
				}
			} catch (err) {
				console.error('云函数调用失败：', err);
				uni.showToast({
					title: '网络错误，请重试',
					icon: 'none'
				});
			}
		}
	}
}
</script>

<style>
 .container {
 	display: flex;
 	flex-direction: column;
 	align-items: center;
 	padding: 48rpx 32rpx;
 	min-height: 100vh;
 	background: linear-gradient(150deg, #f8fafd 0%, #e6edf7 100%);
 }

 .brand-logo {
 	width: 200rpx;
 	height: 200rpx;
 	margin: 64rpx 0 48rpx;
 	border-radius: 50%;
 	box-shadow: 0 8rpx 24rpx rgba(0, 82, 179, 0.12);
 }

 .header-section {
 	margin-bottom: 72rpx;
 }

 .header-title {
 	font-size: 44rpx;
 	color: #2d3748;
 	font-weight: 600;
 	letter-spacing: 1rpx;
 }

 /* 输入区域样式重构 */
 .input-section {
 	width: 86%;
 	background: #ffffff;
 	padding: 40rpx;
 	border-radius: 24rpx;
 	box-shadow: 0 12rpx 48rpx rgba(30, 64, 128, 0.08);
 }

 .input-group {
 	margin-bottom: 48rpx;
 }

 .input-label {
 	display: block;
 	font-size: 32rpx;
 	color: #4a5568;
 	margin-bottom: 16rpx;
 	font-weight: 500;
 }

 .form-input,
 .form-textarea {
 	width: 100%;
 	padding: 24rpx;
 	border: 2rpx solid #e2e8f0;
 	border-radius: 16rpx;
 	font-size: 30rpx;
 	background: #f8fafc;
 	transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
 }

 .form-input::placeholder,
 .form-textarea::placeholder {
 	color: #a0aec0;
 }

 .form-input:focus,
 .form-textarea:focus {
 	border-color: #63b3ed;
 	box-shadow: 0 0 0 4rpx rgba(99, 179, 237, 0.18);
 }

 .form-textarea {
 	height: 240rpx;
 	line-height: 1.6;
 }

 .primary-button {
 	width: 100%;
 	background: linear-gradient(135deg, #4f8cff 0%, #3b6dcc 100%);
 	color: white;
 	font-size: 34rpx;
 	padding: 28rpx;
 	border-radius: 16rpx;
 	margin-top: 48rpx;
 	box-shadow: 0 6rpx 18rpx rgba(66, 153, 225, 0.25);
 	transition: transform 0.15s ease;
 }

 .primary-button:hover {
 	transform: translateY(-2rpx);
 }

 .primary-button:active {
 	transform: translateY(1rpx);
 	box-shadow: 0 3rpx 9rpx rgba(66, 153, 225, 0.3);
 }
</style>
