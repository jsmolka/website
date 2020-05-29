---
title: "Progress Report #5"
author: "Julian Smolka"
summary: "Progress report #5 of the eggvance emulator."
date: 2020-05-11
type: post
draft: true
---
Over four months have passed since the last progress report. During that period I invested a lot of time into cleaning up the current codebase, improving performance and adding some nice features. Unfortunately there were no fixes to broken games so please don't expect nice screenshots of before / after comparisons.

### State Dependent Dispatching
During development I made some performance tradeoffs in favor of clean and readable code (writing clean code is still something I am struggling with). On the other hand I am also a performance junky so every frame per seconds counds and makes me feel better about the emulator.

| Commit | Hash                                                                                            | Improvement           | Pokémon Emerald | Yoshi's Island |
|--------|-------------------------------------------------------------------------------------------------|-----------------------|-----------------|----------------|
| 441    | [368955c0](https://github.com/jsmolka/eggvance/commit/368955c02f911243aaf2b2e8dfc9ce9d849b8f93) | Baseline              | 432.1 fps       | 455.0 fps      |
| 462    | [7007ab8a](https://github.com/jsmolka/eggvance/commit/7007ab8a2a9721cf47c437fb20d4f1e2e560fc43) | GPR class removed     | 460.8 fps       | 481.7 fps      |
| 479    | [fc00b845](https://github.com/jsmolka/eggvance/commit/fc00b845df0963aca0ddfcf4598a5672ac930d8f) | Instruction templates | 489.4 fps       | 511.7 fps      |
| 482    | [a3a8fca2](https://github.com/jsmolka/eggvance/commit/a3a8fca2c0ee01024668d77e817e05470b4eac94) | Basic dispatching     | 522.8 fps       | 542.1 fps      |
| 483    | [326b4809](https://github.com/jsmolka/eggvance/commit/326b4809b398f051807a93b2bc4e9879fef60567) | Improved dispatching  | 556.9 fps       | 574.4 fps      |

### Efficient Bit Iteration
The block data transfer instructions of the ARM7 encode their transferred registers in a binary register list (`rlist`). Each set bit in this list represents a register which needs to be transferred during execution. Take `0b0111` for example, which will transfer registers one to three but not register four.

Emulating these instructions requires iterating all bits in the `rlist` and transferring set ones. The code below shows a simple (and naive) example of doing it. In each iteration we shift the bits in the `rlist` to the right and increase the current bit index `x` by one. We do this until the `rlist` equals zero which means that there are no more bits left to transfer. Inside the loop we check if the lowest bit is set and then use the bit index to transfer the correct register.

```cpp
uint rlist = 0b1010'0110'1110'1010;
for (uint x = 0; rlist != 0; ++x, rlist >>= 1) {
  if (rlist & 0x1) {
    // Transfer register
  }
}
```

While this version is more than enough for its use case, it doesn't feel like the end-all and be-all of efficient bit iteration. It lacks in two important areas which are branch prediction and iteration count. The if-statement will cause the host CPUs branch predictor to fail half of the time because emulation date is inherently random. The high iteration count is caused by the fact that we iterate all bits instead of only the set ones which we need.

```cpp
uint rlist = 0b1010'0110'1110'1010;
for (; rlist != 0; rlist &= rlist - 1) {
  uint x = bits::ctz(rlist);
  // Transfer register
}
```

The optimized version might be confusion to people without a deeper understanding of bit operations. It starts with the same `rlist` like the naive variant and then uses `ctz` to count the trailing zeros (the ones on the right side) which happen to be the equal to the index of the lowest set bit. `ctz` can be represented by a single processor instruction on most architectures (like [bsf](https://www.felixcloutier.com/x86/bsf) on x86) and is very efficient. The loop expression `rlist &= rlist - 1` clears the lowest set bit after each iteration.

This combination allows efficient and branchless bit iteration, at least if you ignore the loop itself. The whole thing can also be wrapped into C++ language constructors like a [custom iterator](https://github.com/jsmolka/eggvance/blob/9cae4676ed9927064c43a68cd178d265baf7e28b/eggvance/src/base/bits.h#L168) and a range-based for loop to make it look more appealing.

```cpp
for (uint x : bits::iter(rlist)) {
  // Transfer register
}
```

In the end this whole section could be titled 'premature optimization'. Implementing efficient bit iteration had a minuscule performance impact on two of many processor instructions and the overall performance impact was barely (if at all) noticable. However it was fun to think about.

### Emscripten

### Improving Tests
The last part of this progress report is dedicated to my [GBA test suite](https://github.com/jsmolka/gba-suite). I developed most of it simultaneously with the eggvance CPU to ensure correctness. The whole thing is writting is pure assembly to have the maximum control over it. This was especially importing during the start where lots of instructions weren't implemented yet. At some point I move the suite into its own repository because it became its own project.

Since then it resulted in some CPU edge case fixes in [mGBA](https://github.com/mgba-emu/mgba) and other open-source emulators. These poor developers had to work with a test suite which was meant for personal usage. It had no user interface at all and stores the number of the first failed test in a register. The only graphical things about it were a green screen on success and a red screen after failing a test. That's why I decided to add a minimal user interface.

```cpp
u8 glpyh[8] = {
  0b00111100,  // ⬜⬜⬛⬛⬛⬛⬜⬜
  0b01100110,  // ⬜⬛⬛⬜⬜⬛⬛⬜
  0b01110110,  // ⬜⬛⬛⬜⬛⬛⬛⬜
  0b01111110,  // ⬜⬛⬛⬛⬛⬛⬛⬜
  0b01101110,  // ⬜⬛⬛⬛⬜⬛⬛⬜
  0b01100110,  // ⬜⬛⬛⬜⬜⬛⬛⬜
  0b00111100,  // ⬜⬜⬛⬛⬛⬛⬜⬜
  0b00000000   // ⬜⬜⬜⬜⬜⬜⬜⬜
};
```

The most important problem to solve was rendering text in assembly, which turned out to be much easier than expected. First I extracted a simple font from [tonclib](http://www.coranac.com/tonc/text/toc.htm) where each text glyph is encoded in eight bytes like in the example shown above. Then I wrote an algorithm to render the text itself. It uses the GBAs bitmap background mode and moves each bit in the glyph data into its own byte in video memory. That's it, all text rendering functions were done in merely [71 lines of code](https://github.com/jsmolka/gba-suite/blob/b9b17ed487e47c8fbfe30570eb7917b12e606f4e/lib/text.asm). These already include setting up certain registers and colors aswell as positioning the text.

```armasm
text_glyph_data:
        ; r0:   data, modified
        ; r1:   pointer, modified
        stmfd   sp!, {r2-r4, lr}        ; Function prologue
        mov     r2, 0                   ; Loop counter
.loop:
        and     r3, r0, 1               ; First bit
        lsr     r0, 1                   ; Advance in data
        and     r4, r0, 1               ; Second bit
        lsr     r0, 1                   ; Advance in data
        orr     r3, r4, ror 24          ; Move second bit
        strh    r3, [r1], 2             ; Write data, advance pointer
        add     r2, 2                   ; Advance loop counter
        tst     r2, 7                   ; Check for glyph line end
        addeq   r1, 232                 ; Move to next line
        cmp     r2, 32                  ; Check for loop end
        bne     .loop                   ; Loop or exit
        ldmfd   sp!, {r2-r4, pc}        ; Function epilogue
```

With the all text rendering functions in place I was able to add a simple user interface. It shows whether or not the test suite succeeded and also adds the number of the failed test if there was one. The result should make the use of the test suite easier for developers. Of course you still have to refer to the actual source code to understand what the test did but that shouldn't be a problem for most people.

{{<figures>}}
  {{<figure src="eggvance/test-suite-passed.png" caption="Figure 1 - Test suite passed">}}
  {{<figure src="eggvance/test-suite-failed.png" caption="Figure 2 - Test suite failed">}}
{{</figures>}}

### Conclusion