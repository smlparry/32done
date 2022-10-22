import { reactive, watch } from "vue";
import localforage from "localforage";
import dayjs from "dayjs";

import reorderArray from "@/lib/reorder-array";

const DATE_FORMAT = "YYYY-MM-DD";
const generateKey = (date) => `32d|tasks|${date}`;

export const state = reactive({
  tasks: {
    [dayjs().format(DATE_FORMAT)]: [
      {
        title: "Learn Vue 3",
        completed: false,
        uuid: "1",
        content: "<h2>Learn Vue 3</h2>",
      },
    ],
  },
  currentDate: dayjs().format(DATE_FORMAT),
});

export const getters = {
  tasks: () => state.tasks[state.currentDate] || [],
};

export const mutations = {
  addTask: (task) => {
    if (!state.tasks[state.currentDate]) {
      state.tasks[state.currentDate] = [];
    }

    state.tasks[state.currentDate] = [
      ...getters.tasks(),
      {
        title: task,
        complete: false,
        uuid: String(Math.random()).replace("0.", ""),
      },
    ];
  },

  updateTask: (task) => {
    state.tasks[state.currentDate] = getters
      .tasks()
      .map((t) => (t.uuid === task.uuid ? task : t));
  },

  removeTask: (task) => {
    state.tasks[state.currentDate] = getters
      .tasks()
      .filter((t) => t.uuid !== task.uuid);
  },

  reorderTasks: (oldIndex, newIndex) => {
    state.tasks[state.currentDate] = reorderArray(
      getters.tasks(),
      oldIndex,
      newIndex
    );
  },

  goToPrevDate: () => {
    state.currentDate = dayjs(state.currentDate)
      .subtract(1, "day")
      .format(DATE_FORMAT);
  },

  goToNextDate: () => {
    state.currentDate = dayjs(state.currentDate)
      .add(1, "day")
      .format(DATE_FORMAT);
  },
};

export const init = async () =>
  localforage.getItem(generateKey(state.currentDate)).then((tasks) => {
    if (tasks) {
      state.tasks[state.currentDate] = tasks;
    }
  });

watch(state, (state) => {
  console.log("[Store] Persisting Updated State", getters.tasks());
  localforage.setItem(
    generateKey(state.currentDate),
    getters.tasks().map((t) => Object.assign({}, t))
  );
});

window.getState = () => state;
