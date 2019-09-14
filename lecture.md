# Observable (ผู้ผลิต)

# Observer (ผู้ส่ง)

  - next()
  - error()
  - complete()

# Subscription (ผู้รับ)

  - next()
  - error()
  - complete()

```ts
const obs$ = new Observable((observer) => {
  let i = 0;
  const loop = setInterval(() => {
    observer.next(++i);
    if (observer.closed) {
      observer.complete();
    }
  }, 1000);

  setTimeout(() => {
    observer.complete();
  }, 3000);
});

obs$.subscribe(
  (n) => {console.log('subscribe next', n)},
  (e) => {console.log('subscribe error', e)},
  () => {console.log('subscribe complete')}
);
```
# Stream
    การไหล ทิศทางเดียว
    Observable (Producer)
    Observer
    Subscription (Consumer)

## Pipe 
  คือ สิ่งที่เกิดขึ้นระหว่าผู้ขายกับผู้ซื้อ
  หรือ ของที่คั่น ระหว่างผู้งส่ง กับ ผู้รับ

## Operator 
- Creation
  - empty
  - create
  - of
  - from
  - fromEvent
  - throwError
  - interval
  - defaultIfEmpty
  - every
  - iif
- Transformation
  - map
  - scan
- Filter
  - take
- Combination
  - forkJoin
  - pairwise
  - merge
  - mergeAll
  - concat
  - concatAll
  - combineLastest
  - startWith
- Condition
- Error handering
- Utility
  - delay
  - tap
- Multicasting
- Subject

### Creation 
- empty สร้างแล้ว complete เลย
```ts
empty().subscribe({
  next: (n) => {console.log('subscribe next: ', n)},
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});
// Console
// subscribe complete

```

- create สร้าง เหมือน new observable
```ts
Observable.create((obs) => obs.next(1)).subscribe({
  next: (n) => {console.log('subscribe next', n)},
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});
// Console
// subscribe next: 1
```


- of สร้างของที่จะใส่ไปให้ออกมา(next) แล้ว complete เลย
```ts
of(1, 2, 3).subscribe({
  next: (n) => {console.log('subscribe next: ', n)},
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});
// Console
// subscribe next: 1
// subscribe next: 2
// subscribe next: 3
// subscribe complete
```

- from 
  แปลงค่าให้มาอยู่ในรูปของ obserable Array, Map, Promise

- fromEvent
  mouse, keyboard, scroll
```ts  
fromEvent(document, 'mousemove').subscribe({
  next: (n) => {console.log('subscribe next', n)},
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});
```

- throwError
  คล้ายๆกับnew throw error
```ts
throwError('error ja').subscribe({
  next: (n) => {console.log('subscribe next', n)},
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});

// Console
// subscribe error: error ja
```

- interval 
  เหมือนของ js
```ts
interval(1000).subscribe({
  next: (n) => {console.log('subscribe next', n)},
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});

// Console
// subscribe next: 1
// subscribe next: 2
// subscribe next: 3
// ...
```


Lab
```js
const button =  document.getElementById('btn');
let i = 0;
fromEvent(button, 'click')
.pipe(
  scan((acc, valu) => acc+1, -1),
  take(10)
)
.subscribe({
  next: (n) => {
    i++
    console.log(i)
  },
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
})



```


### Conditional
  if-else

- defaultIfEmpty  
```js

```

- every ถ้้าที่เป็น `จริง` ทั้งหมด `จริง` ถ้ามี `เท็จ` หนึ่งตัวเป็น `เท็จ` เลย
```js
from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
.pipe(
  
)
.subscribe({
  next: (n) => {console.log('subscribe next', n)},
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
})
// Console
// subscribe next true
// subscribe complete
```
- mergeMap แปลงค่าและ คืนค่า Observable

```js
from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
.pipe(
  mergeMap(n => iif(() => n % 2 === 0, of('even'), of('odd')))
)
.subscribe({
  next: (n) => {console.log('subscribe next', n)},
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
})
// or

interval(1000)
.pipe(
  mergeMap(n => iif(() => n % 2 === 0, of('even'), of('odd')))
)
.subscribe({
  next: (n) => {console.log('subscribe next', n)},
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
})

// Console
// subscribe next odd
// subscribe next even
// subscribe next odd
// subscribe next even
// subscribe next odd
// subscribe next even
// subscribe next odd
// subscribe next even
// subscribe next odd
// subscribe next even
// subscribe complete
```


- tap 
  ทำอะไรก็ได้ ดูค่าก่อนที่จะไป seq ถัดไป

```js
interval(1000)
.pipe(
  tap(console.log),
  mergeMap(n => iif(() => n % 2 === 0, of('even'), of('odd')))
)
.subscribe({
  next: (n) => {console.log('subscribe next', n)},
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
})

// Console
// 1
// subscribe next odd
// 2
// subscribe next even
// 3
// subscribe next odd
// 4
// subscribe next even
// ...
```


### Combination
  รวม Observable
- forkJoin มันจะรอให้ complete ทั้งหมดก่อน
```js
forkJoin(of(1), of(2), of(3))
.subscribe({
  next: (n) => {console.log('subscribe next', n)},
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
})
```


- pairwise คือการเราจะเปรียบเทียบค่าใหม่กับค่าเก่า (เอา state ก่อนหน้ามาด้วย)
```js
interval(1000)
.pipe(pairwise())
.subscribe({
  next: (n) => {console.log('subscribe next', n)},
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});

// Console
// subscribe next [0, 1]
// subscribe next [1, 2]
// subscribe next [2, 3]
// subscribe next [3, 4]
// ...


of(1, 1, 2)
.pipe(
  pairwise(),
  mergeMap(v => iif(() => v[0] === v[1] , of('o'),of('x')))  
)
.subscribe({
  next: (n) => {console.log('subscribe next', n)},
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});

// Console
// subscribe next o
// subscribe next x
// subscribe complete

```
- startWith ทำก่อน sub

- merge คือ การรวมของที่ observable ส่งมา 
```js
const a = interval(1000) 
const b = interval(2000) 
merge(a, b)
.subscribe({
  next: (n) => {console.log('subscribe next', n)},
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});
```

# Lab 2

```js

const display = document.getElementById('display');
const increase$ = fromEvent(document.getElementById('btn-increase'), 'click').pipe(mapTo(1));

const decrease$ = fromEvent(document.getElementById('btn-decrease'), 'click').pipe(mapTo(-1));

forkJoin(increase$, decrease$)
.pipe(
  startWith(0),
  scan((acc, curr) => acc + curr)
)
.subscribe({
  next: (n) => {
    console.log('subscribe next', n)
    display.innerHTML = `${n}`
  },
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});

```

- mergeAll แปลงค่าก่อน complete (ต้อง cpmplete *ขึ้นต้นด้วย merge ไม่สนใจ seq)
```js
of(1,2,3)
.pipe(
  map(v => of(v)), 
  mergeAll()
).subscribe({
  next: (n) => {
    console.log('subscribe next', n)
  },
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});
```

- concat ทำตาม seq และที่ละตัว ต้อง completeด้วย
```js
concat(
  of(1,2,3),
  of(4,5,6)
).subscribe({
  next: (n) => {
    console.log('subscribe next', n)
  },
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});

// Console
// subscribe next 1
// subscribe next 2
// subscribe next 3
// subscribe next 4
// subscribe next 5
// subscribe next 6
// subscribe complete
```

- concatAll รับ Observable
```js
interval(1000)
.pipe(
  map(v => of(v+10)),
  concatAll()
)
.subscribe({
  next: (n) => {
    console.log('subscribe next', n)
  },
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});

```

- combineLatest สนใจ seq และต้องมีค่าอย่างน้อย 1 อันที่ complete (คล้ายลูกผสมของ concat, merge)
```js
const event$ = fromEvent(document, 'click')
combineLatest(
  interval(1000),
  interval(2000),
  event$
)
.subscribe({
  next: (n) => {
    console.log('subscribe next', n)
  },
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});
plete: () => {console.log('subscribe complete')}
});


// subscribe next [1, 0, MouseEvent]
// subscribe next [2, 0, MouseEvent]
// subscribe next [3, 0, MouseEvent]
// subscribe next [3, 1, MouseEvent]
```


- map แปลงค่าจาก ตัวหนึ่งไปเป็นอีกตัว
```js
of(1,2,3,4).pipe(map(x => x + 10))
.subscribe({
  next: (n) => {
    console.log('subscribe next', n);
  },
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});

// Console
// subscribe next 11
// subscribe next 12
// subscribe next 13
// subscribe next 14
// subscribe complete
```


- mapTo แปลงค่าจาก ตัวหนึ่งไปเป็นอีกตัว
```js
of(1,2,3,4).pipe(mapTo('AAA'))
.subscribe({
  next: (n) => {
    console.log('subscribe next', n);
  },
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});

// Console
// subscribe next AAA
// subscribe next AAA
// subscribe next AAA
// subscribe next AAA
// subscribe complete
```

- reduce คือ รับ list acc , curr ทุกๆตัว default 0 เสมอ
```js
of(1,2,3,4,5)
.pipe(
  reduce((acc, curr) => acc + curr)
)
.subscribe({
  next: (n) => {
    console.log('subscribe next', n);
  },
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});

// Console
// subscribe next 15
// subscribe complete
```
- pluck เอาค่าออกจาก ฟิล์ดของ object
```js
const data = [
  {name: 'name 1', parent: { name: 'parent 1', parent: { name: 'parent 1 1'}}},
  {name: 'name 2'},
  {name: 'name 3'},
]
from(data)
.pipe(
  pluck('parent', 'parent', 'name')
)
.subscribe({
  next: (n) => {
    console.log('subscribe next', n);
  },
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});
// Console
// subscribe next parent 1 1
// subscribe next undefined
// subscribe next undefined
// subscribe complete



const data = [
  {name: 'name 1', 
    parent: { 
    name: 'parent 1', 
    parent: { 
      name: 'parent 1 1'
    }
  }},
  {name: 'name 2'},
  {name: 'name 3'},
]
from(data)
.pipe(
  mergeMap(v => 
    iif(
      () => v.parent != undefined, 
      of(v).pipe(pluck('parent', 'name')),
      of(v).pipe(pluck('name')),
    )
  )
)
.subscribe({
  next: (n) => {
    console.log('subscribe next', n);
  },
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});
// Console
// subscribe next parent 1
// subscribe next name 2
// subscribe next name 3
// subscribe complete
```

- toArray ต้องใช้กับ obs ที่ complete
```js
from('Hello World')
.pipe(
  toArray()
)
.subscribe({
  next: (n) => {
    console.log('subscribe next', n);
  },
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});

// Console
// subscribe next ["H", "e", "l", "l", "o", " ", "W", "o", "r", "l", "d"]
// subscribe complete
```

- filter กรองเอาเฉพาะของที่ต้องการ
```js
from('Hello World')
.pipe(
  filter(v => ['a', 'e', 'i', 'o', 'u'].includes(v)),
  toArray()
)
.subscribe({
  next: (n) => {
    console.log('subscribe next', n);
  },
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});

// Console
// subscribe next ["e", "o", "o"]
// subscribe complete
```

- mergeMap ทำโดยไม่สนใจ seq
```js
from('Hello World')
  .pipe(
    mergeMap(v => of(v).pipe(delay(r())))
  )
  .subscribe({
    next: (n) => {
      console.log('subscribe next', n);
    },
    error: (e) => { console.log('subscribe error: ', e) },
    complete: () => { console.log('subscribe complete') }
  });

// Console
// subscribe next l
// subscribe next
// subscribe next l
// subscribe next o
// subscribe next W
// subscribe next o
// subscribe next l
// subscribe next H
// subscribe next d
// subscribe next e
// subscribe next r
// subscribe complete
```
- concatMap ทำตาม seq
```js
from('Hello World')
  .pipe(
    concatMap(v => of(v).pipe(delay(r())))
  )
  .subscribe({
    next: (n) => {
      console.log('subscribe next', n);
    },
    error: (e) => { console.log('subscribe error: ', e) },
    complete: () => { console.log('subscribe complete') }
  });

// Console
// subscribe next H
// subscribe next e
// subscribe next l
// subscribe next l
// subscribe next o
// subscribe next
// subscribe next W
// subscribe next o
// subscribe next r
// subscribe next l
// subscribe next d
// subscribe complete
```
- switchMap ทำงานโดยยึด observable ตัวสุดท้ายเป็นหลัก
```js
from('Hello World')
  .pipe(
    switchMap(v => of(v).pipe(delay(r())))
  )
  .subscribe({
    next: (n) => {
      console.log('subscribe next', n);
    },
    error: (e) => { console.log('subscribe error: ', e) },
    complete: () => { console.log('subscribe complete') }
  });

// Console
// subscribe next d
// subscribe complete
```

- exhaustMap ทำงานโดยยึด observable ตัวสุดแรกเป็นหลัก จะไม่ abort ตัวแรกจนกว่าจะเสร็จ
```js
from('Hello World')
  .pipe(
    exhaustMap(v => of(v).pipe(delay(r())))
  )
  .subscribe({
    next: (n) => {
      console.log('subscribe next', n);
    },
    error: (e) => { console.log('subscribe error: ', e) },
    complete: () => { console.log('subscribe complete') }
  });

// Console
// subscribe next H
// subscribe complete
```
```js
const display = document.getElementById('display');
const increase$ = fromEvent(document.getElementById('btn-increase'), 'click').pipe(mapTo(false));
const decrease$ = fromEvent(document.getElementById('btn-decrease'), 'click').pipe(mapTo(true));

const interval$ = interval(1000).pipe(mapTo(-1))
const timer$ = merge(increase$)
.pipe(
  startWith(true),
  switchMap(val => val ? interval$ : empty()),
  scan((acc, curr) => curr ? curr + acc: acc, 10),
  takeWhile(v => v >= 10)
)
.subscribe({
  next: (n) => {
    console.log('subscribe next', n)
    display.innerHTML = `${n}`
  },
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});
```

- take ทำ 5 ครั้ง แล้ว complete
- takeWhile มีเงื่อนไขทำจนกว่าจะเป็น `เท็จ`
- takeUntil รับ observable มา tigger แล้วจบให้
- timer creator เหมือน setTimeout


- first เจอเงื่อนไข complete เลย
- find

# Lab 3
```js
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

const pBoyPipe = pipe(
  map(v => rand()),
  filter(isPrime),
  take(100),
  toArray()
)

interval(1)
.pipe(pBoyPipe)
.subscribe({
  next: (n) => {
    console.log('subscribe next', n);
  },
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});

// Console
// subscribe next [7, 97, 5, 13, 1, 73, 53, 11, 37, 89, 73, 73, 59, 23, 2, 47, 23, 67, 89, 37, 19, 37, 1, 73, 1, 5, 29, 31, 61, 2, 71, 3, 79, 31, 97, 7, 23, 41, 89, 13, 29, 83, 53, 71, 53, 97, 37, 79, 41, 19, 97, 37, 61, 83, 7, 83, 3, 79, 37, 61, 89, 53, 17, 7, 31, 2, 19, 0, 89, 79, 59, 61, 37, 61, 71, 67, 47, 7, 3, 2, 97, 5, 1, 23, 53, 43, 17, 31, 53, 53, 0, 41, 97, 0, 97, 97, 3, 0, 2, 1]
// subscribe complete

```

- debounceTime คือ จะรอจนถึง เวลาที่กำหนด แล้วจะส่งของล่าสุดออกไป (700ms)
- throttleTime คือ เมื่อมีค่าเข้ามาส่งออกจนถึง เวลาที่กำหนด ถึงจะเปิดรับ item อันต่อไป
- auditTime คือ เมื่อมี event แรกเข้ามา รอจนครบถึง เวลาที่กำหนด จะส่งค่าออกไป (จะไม่ abort อันเก่า)

## Error handering
 การจัดการกับ error ที่เกิดขึ้น

- catchError จะ return error ออกไป
```js

forkJoin({a:of(1),  b:throwError('e').pipe(catchError(a => of(null)))})
.subscribe({
  next: (n) => {
    console.log('subscribe next', n);
  },
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});
// Console
// subscribe next {a: 1, b: null}
// subscribe complete
```

- retry 
```js

interval(1000)
.pipe(
  mergeMap((v) => {
    if (v > 2) {
      return throwError('error')
    } 
    return of(v)
  }),
  retry(2)
)
.subscribe({
  next: (n) => {
    console.log('subscribe next', n);
  },
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});

// Console was cleared
// subscribe next 0
// subscribe next 1
// subscribe next 2
// subscribe next 0
// subscribe next 1
// subscribe next 2
// subscribe next 0
// subscribe next 1
// subscribe next 2
// subscribe error:
// error
```

- retryWhen จะทำใหม่เมื่อไหร่
```js
interval(1000)
.pipe(
  mergeMap((v) => {
    if (v > 2) {
      return throwError('error')
    } 
    return of(v)
  }),
  retryWhen((e) => {
    return e.pipe(delay(200), take(3))
  })
)
.subscribe({
  next: (n) => {
    console.log('subscribe next', n);
  },
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});

// Console
// subscribe next 0
// subscribe next 1
// subscribe next 2
// subscribe next 0
// subscribe next 1
// subscribe next 2
// subscribe next 0
// subscribe next 1
// subscribe next 2
// subscribe complete
```

- delayWhen อยากให้ delay เมื่อไหร่
```js
from([1,2,3])
  .pipe(
    delayWhen(v => timer(v*1000))
  )
  .subscribe({
    next: (n) => {
      console.log('subscribe next', n);
    },
    error: (e) => {console.log('subscribe error: ', e)},
    complete: () => {console.log('subscribe complete')}
  });

// Console
// subscribe next 1
// subscribe next 2
// subscribe next 3
// subscribe complete
```
- finalize เมื่อ เข้า complete หรือ error มาช่วย handle กรณีทั้ง 2เคส
```js
from([1,2,3])
.pipe(
  finalize(() => {
    console.log('final แล้วจ้า')
  })
)
.subscribe({
  next: (n) => {
    console.log('subscribe next', n);
  },
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});
// Console
// subscribe next 1
// subscribe next 2
// subscribe next 3
// subscribe complete
// final แล้วจ้า

// or

throwError('error จ้า')
.pipe(
  finalize(() => {
    console.log('final แล้วจ้า')
  })
)
.subscribe({
  next: (n) => {
    console.log('subscribe next', n);
  },
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});
// Console was cleared
// subscribe error: error จ้า
// final แล้วจ้า
```
- timeout ตั้งเวลา error
```js
from([1,2,3])
.pipe(
  mergeMap((v) => of(v).pipe(delay(200))),
  timeout(100)
)
.subscribe({
  next: (n) => {
    console.log('subscribe next', n);
  },
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});

// Console
// subscribe error: Error {message: "Timeout has occurred", name: "TimeoutError"}
```

## Multicasting and unitcast
#### unitcast 1 sub ===> 1 producer
```js

const sub = from([1])
.pipe(
  tap(console.log)
)

sub.subscribe({
  next: (n) => {
    console.log('subscribe next', n);
  },
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});

sub.subscribe({
  next: (n) => {
    console.log('subscribe next', n);
  },
  error: (e) => {console.log('subscribe error: ', e)},
  complete: () => {console.log('subscribe complete')}
});
// Console
// 1
// subscribe next 1
// subscribe complete

// 1
// subscribe next 1
// subscribe complete
```

#### multicasting multi sub ===> 1 producer
```
Cold เมื่อมีการ subscribe จะสร้างตัวใหม่ (ดูyoutubeดูได้ตั้งแต่ต้น)
Hot เหมือน  (ดูบอลสดมาดูเมื่อไหร่ ได้ของตอนนั้น)
```

- publish
    ทำให้เหมือนมีโรงงานเดียวแล้วส่งของให้เหมือนกันเสมอ
    connect ให้ทำงานเมื่อไหร่

```js
// old
const example = source.pipe(
  tap(_ => console.log('Do something'))
)
example.subscribe({
  next: (n) => {
    console.log('subscribe [1] next', n);
  },
  error: (e) => {console.log('subscribe [1] error: ', e)},
  complete: () => {console.log('subscribe [1] complete')}
});
example.subscribe({
  next: (n) => {
    console.log('subscribe [2] next', n);
  },
  error: (e) => {console.log('subscribe [2] error: ', e)},
  complete: () => {console.log('subscribe [2] complete')}
});

// new
const example = source.pipe(
  tap(_ => console.log('Do something')),
  publish()
)
example.subscribe({
  next: (n) => {
    console.log('subscribe [1] next', n);
  },
  error: (e) => {console.log('subscribe [1] error: ', e)},
  complete: () => {console.log('subscribe [1] complete')}
});
setTimeout(() => {
  example.subscribe({
  next: (n) => {
    console.log('subscribe [2] next', n);
  },
  error: (e) => {console.log('subscribe [2] error: ', e)},
  complete: () => {console.log('subscribe [2] complete')}
});

}, 3000);
setTimeout(() => {
  example.connect()
}, 1000);

// Do something
// subscribe [1] next 0
// Do something
// subscribe [1] next 1
// Do something
// subscribe [1] next 2
// Do something
// subscribe [1] next 3
// subscribe [2] next 3
// Do something
// subscribe [1] next 4
// subscribe [2] next 4
// Do something
// subscribe [1] next 5
// subscribe [2] next 5
// Do something
```

- multicast
- share 
  subscribe เมื่อไหร่ก็ทำทันที (auto connect)
```js
const source = interval(1000)
const example = source.pipe(
  tap(_ => console.log('Do something')),
  share()
)

example.subscribe({
  next: (n) => {
    console.log('subscribe [1] next', n);
  },
  error: (e) => {console.log('subscribe [1] error: ', e)},
  complete: () => {console.log('subscribe [1] complete')}
});
setTimeout(() => {
  example.subscribe({
    next: (n) => {
      console.log('subscribe [2] next', n);
    },
    error: (e) => {console.log('subscribe [2] error: ', e)},
    complete: () => {console.log('subscribe [2] complete')}
  });
}, 3000);
// Do something
// subscribe [1] next 0
// Do something
// subscribe [1] next 1
// Do something
// subscribe [1] next 2
// Do something
// subscribe [1] next 3
// subscribe [2] next 3
// Do something
// subscribe [1] next 4
// subscribe [2] next 4
// Do something
// subscribe [1] next 5
// subscribe [2] next 5
```

- shareReplay 
  กำหนดได้ว่าจะ buffer ของไว้กี่ตัว

```js
const source = interval(1000)
const example = source.pipe(
  tap(_ => console.log('Do something')),
  shareReplay(3)
)

example.subscribe({
  next: (n) => {
    console.log('subscribe [1] next', n);
  },
  error: (e) => {console.log('subscribe [1] error: ', e)},
  complete: () => {console.log('subscribe [1] complete')}
});
setTimeout(() => {
  example.subscribe({
    next: (n) => {
      console.log('subscribe [2] next', n);
    },
    error: (e) => {console.log('subscribe [2] error: ', e)},
    complete: () => {console.log('subscribe [2] complete')}
  });
}, 5000);
// Console
// Do something
// subscribe [1] next 0
// Do something
// subscribe [1] next 1
// Do something
// subscribe [1] next 2
// Do something
// subscribe [1] next 3
// Do something
// subscribe [1] next 4
// subscribe [2] next 2
// subscribe [2] next 3
// subscribe [2] next 4
// Do something
// subscribe [1] next 5
// subscribe [2] next 5
```

- Subject
```js
const sub = new Subject();
// of().pipe(share())
sub.next(1)
sub.subscribe(console.log)
sub.next(2)
sub.subscribe(console.log)
sub.next(3)
// Console
// 2
// 3
// 3
```

- BehaviorSubject
```js
const sub = new BehaviorSubject(0);
sub.next(1)
sub.subscribe(console.log)
sub.next(2)
sub.subscribe(console.log)
sub.next(3)

// Console
// 1
// 2
// 2
// 3
// 3
```

- ReplaySubject
```js
const sub = new ReplaySubject(2);
sub.next(1)
sub.subscribe(console.log)
sub.next(2)
sub.subscribe(console.log)
sub.next(3)
```

- AsyncSubject

```js
const sub = new AsyncSubject();
sub.next(1)
sub.subscribe(console.log)
sub.next(2)
sub.subscribe({
    next: (n) => {
      console.log('subscribe next', n);
    },
    error: (e) => {console.log('subscribe error: ', e)},
    complete: () => {console.log('subscribe complete')}
  });
sub.next(3)
sub.complete();

// Console
// 3
// subscribe next 3
// subscribe complete
```

Lab 4