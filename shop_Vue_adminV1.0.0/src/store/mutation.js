export default{
    setNavMenu(state,data){
        state.navMenus = data;
    },
    setAdminUser(state,info){
        state.adminUser = info;
    },
    logout(state){
        state.adminUser = null;
    }
}