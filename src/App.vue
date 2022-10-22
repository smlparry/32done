<template>
  <task-list />
</template>

<script>
import TaskList from "@/components/TaskList";

export default {
  name: "App",

  components: {
    TaskList,
  },
};
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  h1 {
    @apply text-3xl;
    @apply font-bold;
  }
  h2 {
    @apply text-2xl;
    @apply font-bold;
  }
  h3 {
    @apply text-xl;
    @apply font-bold;
  }
}

.container {
  max-width: 560px;
}
</style>
