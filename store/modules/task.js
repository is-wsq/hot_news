const state = {
    isLogin: false,
    userId: '',

    videoTasks: [],
    videoPreviousStatusMap: {},

    voiceTasks: [],
    voicePreviousStatusMap: {},

    figureTasks: [],
    figurePreviousStatusMap: {},
};

if (uni.getStorageSync('userId')) {
    state.isLogin = true;
    state.userId = uni.getStorageSync('userId');
}

const mutations = {
    setLoginStatus(state, status) {
        state.isLogin = status;
    },

    setUserId(state, userId) {
        state.userId = userId;
    },

    setVideoTasks(state, list) {
        state.videoTasks = list;
    },
    updatePreviousStatusMap(state, newMap) {
        state.videoPreviousStatusMap = { ...newMap };
    },

    setVoiceTasks(state, tasks) {
        state.voiceTasks = tasks;
    },
    updateVoicePreviousStatusMap(state, map) {
        state.voicePreviousStatusMap = map;
    },

    setFigureTasks(state, tasks) {
        state.figureTasks = tasks;
    },
    updateFigurePreviousStatusMap(state, map) {
        state.figurePreviousStatusMap = map;
    },
};

const actions = {
    async userLogin({ commit }, userId) {
        commit("setLoginStatus", true)
        commit("setUserId", userId)
    },

    async userLogout({ commit }) {
        commit("setLoginStatus", false)
        commit("setUserId", '')
    },

    async pollVideoTasks({ state, commit }) {
        uni.request({
            url: 'https://live.tellai.tech/api/news_assistant/video_record/query',
            data: {
                user_id: state.userId,
            },
            method: 'GET',
            success: (res) => {
                if (res.data.status === 'success') {
                    const list = res.data.data;
                    list.forEach(video => {
                        const prev = state.videoPreviousStatusMap[video.id];
                        if (prev === "pending" && video.status === "success") {
                            uni.showModal({
                                title: '提示',
                                content: `《${video.filename}》视频生成任务成功，本次生成消耗${video.points}个积分`,
                                showCancel: false,
                            });
                        }else if (prev === "pending" && video.status === "failed") {
                            uni.showModal({
                                title: '提示',
                                content: `《${video.filename}》视频生成任务失败`,
                                showCancel: false,
                            });
                        }
                    });

                    const newStatusMap = {};
                    list.forEach(v => { newStatusMap[v.id] = v.status; });

                    commit("setVideoTasks", list);
                    commit("updatePreviousStatusMap", newStatusMap);
                }
            }
        })
    },

    async pollVoiceTasks({ state, commit }) {
        uni.request({
            url: 'https://live.tellai.tech/api/news_assistant/timbres/query/user',
            data: {
                user_id: state.userId,
            },
            method: 'GET',
            success: (res) => {
                if (res.data.status === 'success') {
                    const list = res.data.data;
                    list.forEach(voice => {
                        const prev = state.voicePreviousStatusMap[voice.id];
                        if (prev === "pending" && voice.status === "success") {
                            uni.showModal({
                                title: '提示',
                                content: `《${voice.name}》音色克隆任务成功`,
                                showCancel: false,
                            });
                        }else if (prev === "pending" && voice.status === "failed") {
                            uni.showModal({
                                title: '提示',
                                content: `《${voice.name}》音色克隆任务失败,${voice.message}`,
                                showCancel: false,
                            });
                        }
                    });

                    const newStatusMap = {};
                    list.forEach(v => { newStatusMap[v.id] = v.status; });

                    commit("setVoiceTasks", list);
                    commit("updateVoicePreviousStatusMap", newStatusMap);
                }
            }
        })
    },

    async pollFigureTasks({ state, commit }) {
        uni.request({
            url: 'https://live.tellai.tech/api/news_assistant/figure/query/user',
            data: {
                user_id: state.userId,
            },
            method: 'GET',
            success: (res) => {
                if (res.data.status === 'success') {
                    const list = res.data.data;
                    list.forEach(figure => {
                        const prev = state.figurePreviousStatusMap[figure.id];
                        if (prev === "ready" && figure.status === "success") {
                            uni.showModal({
                                title: '提示',
                                content: `《${figure.name}》形象克隆任务成功`,
                                showCancel: false,
                            });
                        }else if (prev === "ready" && figure.status === "failed") {
                            uni.showModal({
                                title: '提示',
                                content: `《${figure.name}》形象克隆任务失败，${figure.message}`,
                                showCancel: false,
                            });
                        }
                    });

                    const newStatusMap = {};
                    list.forEach(v => { newStatusMap[v.id] = v.status; });

                    commit("setFigureTasks", list);
                    commit("updateFigurePreviousStatusMap", newStatusMap);
                }
            }
        })
    },
};

const getters = {
    videoTasks: (state) => state.videoTasks,
    voiceTasks: (state) => state.voiceTasks,
    figureTasks: (state) => state.figureTasks,
    isLogin: (state) => state.isLogin,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};
