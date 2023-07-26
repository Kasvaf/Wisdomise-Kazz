import { Action, AnyAction, Reducer } from "redux";

/**
 * Create a reducer that forwards actions to a set of reducers, in sequence
 * e.g. r1, r2, r3
 *
 * Any action will be given to all 3, but the state is passed between them
 * so the output of the action on r1 is then given to r2,
 * and output for r2 to r3 etc.
 *
 * Taken from: https://redux-preboiled.js.org/api/chainreducers
 * (MIT Licensed)
 */

/**
 * A reducer-like function that assumes the initial state is provided by a
 * parent reducer, i.e. that it is never called with an `undefined` state.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface SubReducer<S = any, A extends Action = AnyAction> {
  (state: S, action: A): S;
}

/**
 * Returns a reducer that calls the passed (sub-)reducers in sequence.
 * That is, when the reducer is called, it passes the input state and
 * action to the first child reducer, then the returned state together
 * with the same action to the second child reducer, and so on. Finally,
 * the state returned by the last child reducer is returned by the
 * chained reducer itself.
 *
 * @param firstChildReducer - The first (sub-)reducer in the chain.
 * @param otherChildReducers - The other (sub-)reducers to chain together.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function chainReducers<S = any, A extends Action = AnyAction>(
  firstChildReducer: Reducer<S, A>,
  ...otherChildReducers: SubReducer<S, A>[]
): Reducer<S, A> {
  if (!firstChildReducer) {
    throw new Error("chainReducers() needs at least one reducer.");
  }

  if (otherChildReducers.length === 0) {
    return firstChildReducer;
  }

  return function chainedReducer(state, action): S {
    const nextState = firstChildReducer(state, action);
    return otherChildReducers.reduce((s, reducer) => reducer(s, action), nextState);
  };
}
