import { reactive, watch } from "vue";
import localforage from "localforage";
import dayjs from "dayjs";

import reorderArray from "@/lib/reorder-array";

export const STATUS = {
  UNCOMPLETED: "uncompleted",
  COMPLETED: "completed",
  MOVED_FORWARD: "moved-forward",
};

const DATE_FORMAT = "YYYY-MM-DD";
const generateKey = (date) => `32d|tasks|${date}`;

const nextDay = (date = state.currentDate) =>
  dayjs(date).add(1, "day").format(DATE_FORMAT);

const prevDay = (date = state.currentDate) =>
  dayjs(date).subtract(1, "day").format(DATE_FORMAT);

const persistDate = (date) => {
  localforage.setItem(
    generateKey(date),
    (state.tasks[date] || []).map((t) => Object.assign({}, t))
  );
};

const today = () => dayjs().format(DATE_FORMAT);

export const percentComplete = (date) =>
  Math.round(
    ((state.tasks[date] || [])
      .slice(0, 3)
      .filter((task) =>
        [STATUS.COMPLETED, STATUS.MOVED_FORWARD].includes(task.status)
      ).length /
      Math.min((state.tasks[date] || []).length, 3)) *
      100
  );

const isDayComplete = (date) => percentComplete(date) === 100;

export const state = reactive({
  tasks: {
    [dayjs().format(DATE_FORMAT)]: [],
  },
  currentDate: today(),
  streak: 0,
});

export const getters = {
  tasks: (date = state.currentDate) => state.tasks[date] || [],
};

export const mutations = {
  setTasks: (tasks, date = state.currentDate) => {
    console.log("[setTasks]", date, tasks);
    state.tasks[date] = tasks;
  },

  addTask: (task) => {
    if (!state.tasks[state.currentDate]) {
      state.tasks[state.currentDate] = [];
    }

    state.tasks[state.currentDate] = [
      ...getters.tasks(),
      {
        title: task,
        status: STATUS.UNCOMPLETED,
        uuid: String(Math.random()).replace("0.", ""),
      },
    ];
  },

  updateTask: (task, date = state.currentDate) => {
    state.tasks[date] = getters
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
    state.currentDate = prevDay();
  },

  goToNextDate: () => {
    state.currentDate = nextDay();
  },

  moveToNextDay: (task) => {
    state.tasks[nextDay()] = [
      ...(state.tasks[nextDay()] || []),
      {
        ...task,
        status: STATUS.UNCOMPLETED,
        uuid: String(Math.random()).replace("0.", ""),
      },
    ];

    mutations.updateTask({
      ...task,
      status: STATUS.MOVED_FORWARD,
    });

    persistDate(nextDay());
  },

  toggleComplete: (task) => {
    console.log("toggleComplete", task);
    mutations.updateTask({
      ...task,
      status:
        task.status === STATUS.COMPLETED
          ? STATUS.UNCOMPLETED
          : STATUS.COMPLETED,
    });
  },
};

export const actions = {
  loadTasks: async (date = state.currentDate) => {
    console.log("[Store] Loading Tasks", date);
    if (getters.tasks(date).length) {
      mutations.setTasks(getters.tasks(date), date);
      return;
    } else {
      return localforage.getItem(generateKey(date)).then((tasks) => {
        if (tasks) mutations.setTasks(tasks, date);
      });
    }
  },

  calculateStreak: async (fromDate = today()) => {
    console.log("Calculating Streak");
    let streak = 0;
    let date = fromDate;

    while (isDayComplete(date)) {
      streak++;
      date = prevDay(date);
      await actions.loadTasks(date);
    }

    console.log("streka", streak);
    state.streak = streak;
  },
};

export const init = async () => {
  await actions.loadTasks();

  actions.calculateStreak();

  return;
};

watch(() => state.currentDate, actions.loadTasks);

watch(
  () => state.tasks[state.currentDate],
  () => {
    console.log(
      "[Store] Persisting Updated State",
      state.currentDate,
      getters.tasks()
    );
    persistDate(state.currentDate);
  }
);

window.getState = () => state;
