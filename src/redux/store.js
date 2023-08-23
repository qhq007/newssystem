import { legacy_createStore as createStore, combineReducers } from "redux";
import collapsed from "./reducers/collapsed";
import loading from "./reducers/loading";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['collapsed']
}

const reducer = combineReducers({
    collapsed,
    loading
})
const persistedReducer = persistReducer(persistConfig, reducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store)

export { store, persistor };