import { Stream, filter } from 'most';
import { ObservableSource } from 'most/lib/observable/fromObservable'; 
import { from } from 'rxjs/observable/from';

export class ActionsStream extends Stream {
  ofType(...keys) {
    return ofType(...keys, this);
  }
}

export const ofType = (...keys) => {
  const source = keys.pop();

  return filter(action => {
    const type = action.type;
    const len = keys.length;

    if (len === 1) {
      return type === keys[0];
    } else {
      for (let i = 0; i < len; i++) {
        if (keys[i] === type) {
          return true;
        }
      }
    }
    return false;
  }, source);
};

export default {
  input: input$ => new ActionsStream(new ObservableSource(input$)),
  output: output$ => from(output$)
};
