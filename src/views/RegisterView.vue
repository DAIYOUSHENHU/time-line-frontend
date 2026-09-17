<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { register, type RegisterParams } from '@/api/user'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)
const form = reactive<RegisterParams & { confirmPassword: string }>({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
})

const validatePassword = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'))
    return
  }
  callback()
}

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 30, message: '用户名长度为 3-30 个字符', trigger: 'blur' },
  ],
  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 30, message: '密码长度为 6-30 个字符', trigger: 'blur' },
  ],
  confirmPassword: [{ required: true, validator: validatePassword, trigger: 'blur' }],
}

const submit = async () => {
  if (!formRef.value || loading.value) return

  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    const { confirmPassword: _confirmPassword, ...payload } = form
    const data = await register(payload)
    localStorage.setItem('token', data.token)
    ElMessage.success('注册成功')
    await router.push('/login')
  } catch (error) {
    ElMessage.error(typeof error === 'string' ? error : '注册失败，请稍后重试')
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
      <h1>创建账号</h1>
      <p class="subtitle">注册账号，开始记录你的时间线</p>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="submit">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" size="large" clearable />
        </el-form-item>
        <el-form-item label="邮箱（可选）" prop="email">
          <el-input v-model="form.email" type="email" placeholder="请输入邮箱地址" size="large" clearable />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" size="large" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码" size="large" show-password
            @keyup.enter="submit" />
        </el-form-item>
        <el-button type="primary" size="large" native-type="submit" :loading="loading" class="submit-button">
          注册
        </el-button>
      </el-form>

      <p class="switch-page">
        已有账号？
        <el-link type="primary" underline="never" @click="router.push('/login')">返回登录</el-link>
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
