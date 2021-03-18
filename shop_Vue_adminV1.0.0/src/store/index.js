import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import state from './state'
import mutation from './mutation'
import action from './action'
import getter from './getter'
import createPersistedState from 'vuex-persistedstate'
export default new Vuex.Store({
    state,
    mutations:mutation,
    actions:action,
    getters:getter,
    plugins: [createPersistedState()]
});