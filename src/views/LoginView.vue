<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { getErrorMessage } from '@/api/http'
import { login, type LoginParams } from '@/api/user'

const router = useRouter()
const route = useRoute()
const formRef = ref<FormInstance>()
const loading = ref(false)
const form = reactive<LoginParams>({
  username: '',
  password: '',
})

const rules: FormRules<LoginParams> = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 30, message: '用户名长度为 3-30 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 30, message: '密码长度为 6-30 个字符', trigger: 'blur' },
  ],
}

const submit = async () => {
  if (!formRef.value || loading.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    const res = await login(form)
    console.log(res);
    if (res.data?.token) {
      localStorage.setItem('token', res.data.token)
      ElMessage.success('登录成功')
      const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/timeline'
      await router.push(redirect.startsWith('/') ? redirect : '/timeline')
    } else {
      ElMessage.error('登录失败，请重试')
    }
  } catch (error) {
    ElMessage.error(getErrorMessage(error, '登录失败，请稍后重试'))
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="auth-page">
    <section class="auth-panel">
      <div class="brand">
        <span class="brand-mark">T</span>
        <span>Time Line</span>
      </div>
      <h1>欢迎回来</h1>
      <p class="subtitle">登录后继续管理你的时间线</p>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="submit">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" size="large" clearable />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" size="large" show-password
            @keyup.enter="submit" />
        </el-form-item>
        <el-button type="primary" size="large" native-type="submit" :loading="loading" class="submit-button">
          登录
        </el-button>
      </el-form>

      <p class="switch-page">
        还没有账号？
        <el-link type="primary" underline="never" @click="router.push('/register')">立即注册</el-link>
      </p>
    </section>
  </main>
</template>

<style scoped>
.auth-page {
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(135deg, #eef4ff 0%, #f8fbff 48%, #eefbf8 100%);
}

.auth-panel {
  width: min(100%, 420px);
  padding: 40px;
  background: rgb(255 255 255 / 92%);
  border: 1px solid rgb(255 255 255 / 80%);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgb(30 64 175 / 12%);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px;
  color: #2563eb;
  font-size: 18px;
  font-weight: 700;
}

.brand-mark {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  color: white;
  background: #2563eb;
  border-radius: 10px;
}

h1 {
  margin: 0 0 8px;
  font-size: 30px;
}

.subtitle,
.switch-page {
  color: #64748b;
}

.subtitle {
  margin: 0 0 28px;
}

.submit-button {
  width: 100%;
  margin-top: 8px;
}

.switch-page {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin: 24px 0 0;
  text-align: center;
  line-height: 1.5;
}

.switch-page :deep(.el-link) {
  font-size: inherit;
  line-height: inherit;
}
</style>
