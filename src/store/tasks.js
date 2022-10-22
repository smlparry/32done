import { reactive, watch } from "vue";
import localforage from "localforage";
import dayjs from "dayjs";

import reorderArray from "@/lib/reorder-array";

const DATE_FORMAT = "YYYY-MM-DD";
const generateKey = (date) => `32d|tasks|${date}`;

const nextDay = () =>
  dayjs(state.currentDate).add(1, "day").format(DATE_FORMAT);

const persistDate = (date) => {
  localforage.setItem(
    generateKey(date),
    (state.tasks[date] || []).map((t) => Object.assign({}, t))
  );
};

export const state = reactive({
  tasks: {
    [dayjs().format(DATE_FORMAT)]: [],
  },
  currentDate: dayjs().format(DATE_FORMAT),
});

export const getters = {
  tasks: () => state.tasks[state.currentDate] || [],
};

export const mutations = {
  setTasks: (tasks) => {
    state.tasks[state.currentDate] = tasks;
  },

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
    state.currentDate = nextDay();
  },

  moveToNextDay: (task) => {
    state.tasks[nextDay()] = [...(state.tasks[nextDay()] || []), task];
    mutations.removeTask(task);

    persistDate(nextDay());
  },
};

const loadTasks = async () => {
  console.log("[Store] Loading Tasks");
  if (getters.tasks().length) {
    mutations.setTasks(getters.tasks());
    return;
  } else {
    return localforage.getItem(generateKey(state.currentDate)).then((tasks) => {
      if (tasks) mutations.setTasks(tasks);
    });
  }
};

export const init = loadTasks;

watch(() => state.currentDate, loadTasks);

watch(state.tasks, () => {
  console.log(
    "[Store] Persisting Updated State",
    state.currentDate,
    getters.tasks()
  );
  persistDate(state.currentDate);
});

window.getState = () => state;
