const TASK_STORAGE_KEY = 'task_list'; // 存储任务列表的 key

const state = {
    tasks: uni.getStorageSync(TASK_STORAGE_KEY) || [] // 初始化时读取本地存储的任务
};

const mutations = {
    ADD_TASK(state, task) {
        state.tasks.push(task);
        // 更新本地存储
        uni.setStorageSync(TASK_STORAGE_KEY, state.tasks);
    },
    UPDATE_TASK(state, updatedTask) {
        const index = state.tasks.findIndex((task) => task.id === updatedTask.id);
        if (index !== -1) {
            state.tasks[index] = updatedTask;
            // 更新本地存储
            uni.setStorageSync(TASK_STORAGE_KEY, state.tasks);
        }
    },
    SET_TASKS(state, tasks) {
        state.tasks = tasks;
        // 初始化时同步到本地存储
        uni.setStorageSync(TASK_STORAGE_KEY, tasks);
    }
};

const actions = {
    addTask({ commit }, task) {
        commit('ADD_TASK', task);
    },
    updateTask({ commit }, updatedTask) {
        commit('UPDATE_TASK', updatedTask);
    },
    loadTasks({ commit }) {
        // 从本地存储读取任务
        const tasks = uni.getStorageSync(TASK_STORAGE_KEY) || [];
        commit('SET_TASKS', tasks);
    }
};

const getters = {
    allTasks: (state) => state.tasks
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};
