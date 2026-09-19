<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const logout = async () => {
  localStorage.removeItem('token')
  ElMessage.success('已退出登录')
  await router.push('/login')
}
</script>

<template>
  <main class="timeline-page">
    <section class="timeline-panel">
      <h1>我的时间线</h1>
      <p>时间轴功能正在建设中。</p>
      <el-button type="primary" @click="logout">退出登录</el-button>
    </section>
  </main>
</template>

<style scoped>
.timeline-page {
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 24px;
  background: #f8fafc;
}

.timeline-panel {
  width: min(100%, 640px);
  padding: 40px;
  text-align: center;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
}

.timeline-panel p {
  margin: 12px 0 24px;
  color: #64748b;
}
</style>