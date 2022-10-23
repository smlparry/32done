<template>
  <div class="">
    <div class="container mx-auto px-5">
      <div class="flex w-full justify-between py-6">
        <button @click="mutations.goToPrevDate">Prev</button>
        <div class="flex">
          <h3 class="text-2xl">Today</h3>
        </div>
        <div class="flex">
          <div v-if="state.streak" class="flex text-2xl font-bold ml-3">
            {{ state.streak }}&nbsp;🔥
          </div>
          <button @click="mutations.goToNextDate">Next</button>
        </div>
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

      <div class="flex items-center mb-6">
        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700m">
          <div
            class="progress-bar bg-green-500 h-2.5 rounded-full"
            :style="{ width: `${completePercent}%` }"
          ></div>
        </div>
      </div>

      <ul ref="taskList">
        <li v-for="(task, i) in getters.tasks()" :key="task.uuid">
          <task-item :task="task" :index="i" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import Sortable from "sortablejs";

import {
  state,
  mutations,
  getters,
  init,
  percentComplete,
} from "@/store/tasks";

import TaskItem from "@/components/TaskItem";

export default {
  components: {
    TaskItem,
  },

  async setup() {
    const input = ref(null);
    const taskList = ref(null);

    let sortable = null;

    onMounted(() => {
      sortable = new Sortable(taskList.value, {
        sort: true,
        animation: 150,
        easing: "cubic-bezier(1, 0, 0, 1)",

        onUpdate: ({ oldIndex, newIndex }) => {
          mutations.reorderTasks(oldIndex, newIndex);
        },
      });
    });

    onBeforeUnmount(() => {
      sortable.destroy();
      sortable = null;
    });

    const completePercent = computed(() => percentComplete(state.currentDate));

    await init();

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
      taskList,
      completePercent,
    };
  },
};
</script>

<style lang="scss" scoped>
.progress-bar {
  transition: width 0.3s ease-in-out;
}
</style>
