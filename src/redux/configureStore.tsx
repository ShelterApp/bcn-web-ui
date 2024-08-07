// @ts-nocheck
import { createBrowserHistory } from "history";
import { applyMiddleware, compose, createStore } from "redux";
import createRootReducer from "redux/reducers";
import middlewares from "redux/middlewares";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "redux/sagas";
import { createWhitelistFilter } from "redux-persist-transform-filter";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

export const history = createBrowserHistory();
// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "service"],
  transforms: [
    createWhitelistFilter("service", ["queryData", "queryDataSearch"])
  ],
  stateReconciler: autoMergeLevel2
};

const persistedReducer = persistReducer(
  persistConfig,
  createRootReducer(history, sagaMiddleware)
);

export const configureStore = () => {
  const composeEnhancer: typeof compose =
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    persistedReducer,
    composeEnhancer(applyMiddleware(sagaMiddleware, ...middlewares(history)))
  );
  // then run the saga

  const persistor = persistStore(store);

  // Hot reloading
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept("redux/reducers", () => {
      store.replaceReducer(persistedReducer);
    });
  }
  sagaMiddleware.run(rootSaga);
  return { store, persistor };
};

export default { configureStore, history };
