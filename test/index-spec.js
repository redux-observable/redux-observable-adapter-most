/* globals describe it */
import 'babel-polyfill';
import { expect } from 'chai';
import { spy } from 'sinon';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { toArray } from 'rxjs/operator/toArray';
import { Stream } from 'most';
import { ObservableSource } from 'most/lib/observable/fromObservable';
import adapter, { ActionsStream } from '../';

const streamToArray = stream =>
  stream.reduce((a, x) => {
    a.push(x);
    return a;
  }, []);

describe('adapter', () => {
  it('should convert input to most.js Stream', () => {
    const observable = Observable::of(1, 2, 3);
    const stream = adapter.input(observable);

    expect(stream).to.be.an.instanceof(Stream);

    return streamToArray(stream)
      .then(value => {
        expect(value).to.deep.equal([1, 2, 3]);
      });
  });

  it('should convert output to RxJS v5 Observable', (done) => {
    const stream = Stream.from([1, 2, 3]);
    const observable = adapter.output(stream);

    expect(observable).to.be.an.instanceof(Observable);

    observable::toArray().subscribe(value => {
      expect(value).to.deep.equal([1, 2, 3]);
      done();
    });
  });
});

describe('ActionsStream', () => {
  it('should support ofType operator', () => {
    const input$ = new ObservableSource(
      Observable::of({ type: 'A' }, { type: 'B' }, { type: 'A' })
    );
    const action$ = new ActionsStream(input$);

    expect(action$).to.be.an.instanceof(ActionsStream);

    return streamToArray(action$.ofType('A'))
      .then(value => {
        expect(value).to.deep.equal([
          { type: 'A' },
          { type: 'A' }
        ]);
      });
  });
});
