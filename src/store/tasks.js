import { reactive } from "vue";

export const state = reactive({
  tasks: [
    {
      title: "Learn Vue 3",
      completed: false,
      uuid: "1",
    },
  ],
});

export const mutations = {
  addTask: (task) =>
    state.tasks.push({ title: task, complete: false, uuid: Math.random() }),

  updateTask: (task) =>
    (state.tasks = state.tasks.map((t) => (t.uuid === task.uuid ? task : t))),

  removeTask: (task) =>
    (state.tasks = state.tasks.filter((t) => t.uuid !== task.uuid)),
};
