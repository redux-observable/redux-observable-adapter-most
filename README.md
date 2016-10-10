# redux-observable-adapter-most

Use [most.js](https://github.com/cujojs/most) with [redux-observable](https://github.com/redux-observable/redux-observable)


## Install

This requires peer dependencies of `rxjs@5` and `most@1`, which will have to be installed as well.

```sh
npm install --save redux-observable-adapter-most
```

## Usage

This library basically will convert the RxJS `ActionsObservable` provided to your Epics into a most.js version. Then the most.js Stream you return in your Epic will be converted back to an RxJS Observable inside the middleware.

```js
import mostAdapter from 'redux-observable-adapter-most';

const epicMiddleware = createEpicMiddleware(rootEpic, { adapter: mostAdapter });

// your Epics are now most.js streams

const pingPongEpic = action$ =>
  action$.ofType(PING)
    .map(action => ({
      type: PONG
    }));
```

The most.js Stream is an ActionsStream which has the equivalent `ofType` helper. If you prefer the functional composition way, you can use it too:

```js
import { ofType } from 'redux-observable-adapter-most';

const pingPongEpic = action$ => {
  const ping$ = ofType(PING, action$);

  return map(action => ({
    type: PONG
  }), ping$);
};
```