import { Observable, fromEvent, throwError, interval, combineLatest, of, from, iif, forkJoin, merge, concat, empty, pipe, timer, Subject, BehaviorSubject, AsyncSubject, ReplaySubject } from 'rxjs';
import { map, scan, take, defaultIfEmpty, every, mergeMap, tap, pairwise, startWith, mapTo, delay, mergeAll, concatAll, reduce, pluck, toArray, filter, concatMap, switchMap, exhaustMap, takeUntil, takeWhile, catchError, retry, retryWhen, delayWhen, finalize, timeout, publish, multicast, share, shareReplay, debounceTime } from 'rxjs/operators';
console.clear();
const r = () => parseInt(`${((Math.random() * 5) + 1) * 1000}`)

const rand = () => parseInt(`${Math.random() * 100}`)
const isPrime = (num) => {
  if (num <= 1) {
    return true
  } else if (num <= 3) {
    return true
  } else if (num%2 === 0 || num%3 === 0) {
    return false
  }
 
  let i = 5
  while (i*i <= num) {
    if (num%i === 0 || num%(i+2) === 0) {
      return false
    }
    i += 6
  }
  return true
}
const api = `https://reqres.in/api/users`
const requestApi = fetch(api).then(req => req.json())
const data$ = from(requestApi).pipe(pluck('data'))
const search = document.getElementById('search-bar');
const search$ = fromEvent(search, 'input').pipe(debounceTime(700), pluck('target', 'value'))
const display = document.getElementById('display');

const searching = (value) => {
  return data$.pipe(
    switchMap((data) => {
      return from(data).pipe(
        map(({first_name, last_name}) => `${first_name} ${last_name}`),
        filter((data: string) => data.toLowerCase().includes(value.toLowerCase())),
        map(data => `<li>${data}</li>`),
        toArray(),
        map((v: string[]) => v.join(''))
      )
    }),
  )
}

search$.pipe(switchMap((value) => searching(value)))
.subscribe({
  next: (html) => {
    display.innerHTML = html
  },
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});
