import localforage from "localforage";
import { reactive, watch } from "vue";

// import localforage from "localforage";

const TASKS_KEY = "32done|tasks";

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
    state.tasks.push({
      title: task,
      complete: false,
      uuid: String(Math.random()).replace("0.", ""),
    }),

  updateTask: (task) =>
    (state.tasks = state.tasks.map((t) => (t.uuid === task.uuid ? task : t))),

  removeTask: (task) =>
    (state.tasks = state.tasks.filter((t) => t.uuid !== task.uuid)),
};

export const init = async () =>
  localforage.getItem(TASKS_KEY).then((tasks) => {
    if (tasks) {
      state.tasks = tasks;
    }
  });

watch(state, (state) => {
  localforage.setItem(
    TASKS_KEY,
    state.tasks.map((t) => Object.assign({}, t))
  );
});
