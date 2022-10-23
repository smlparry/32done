<template>
  <div class="container mx-auto px-5">
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

    <ul ref="taskList">
      <li v-for="(task, i) in getters.tasks()" :key="task.uuid">
        <task-item :task="task" :index="i" />
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import Sortable from "sortablejs";

import { state, mutations, getters, init } from "@/store/tasks";

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
    };
  },
};
</script>
