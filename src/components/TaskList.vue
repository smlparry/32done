<template>
  <div class="container mx-auto">
    <div class="flex w-full justify-between py-6">
      <button @click="mutations.goToPrevDate">Prev</button>
      <h3 class="text-2xl">Today</h3>
      <button @click="mutations.goToNextDate">Next</button>
    </div>
    <div class="pb-8 pt-3">
      <input
        ref="input"
        type="text"
        class="focus:outline-none text-2xl font-bold w-full"
        placeholder="Type to create..."
        @keyup.enter="($event) => addTask($event.target.value)"
      />
    </div>

    <ul>
      <li v-for="task in getters.tasks()" :key="task.uuid">
        <task-item :task="task" />
      </li>
    </ul>
  </div>
</template>

<script>
import { ref } from "vue";

import { state, mutations, getters, init } from "@/store/tasks";

import TaskItem from "@/components/TaskItem";

export default {
  components: {
    TaskItem,
  },

  async setup() {
    await init();

    const input = ref(null);

    const addTask = (task) => {
      mutations.addTask(task);
      input.value.value = "";
    };

    return {
      state,
      mutations,
      getters,
      addTask,
      input,
    };
  },
};
</script>
