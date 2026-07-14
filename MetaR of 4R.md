# MetaR of 4R

```
RI (R=1):
  Base Source R: Affects number base

RO (R=2):
  Base Complexity R: Affects base moduland

RA (R=3):
  Width R: How long is the number

RE (R=4):
  Superposition R: Boundary value scale.
  Does not care even about it's width.
```

# General R qualities

We can measure many things in R's:

- R=1, 2, 3, 4 means Octave = 1, 2, 3, 4 if you bring octaves themselves one octave up; otherwise, octaves are 1, 2 and 4.

## Base Source R's (IR: R group 1)

### Base 1 (*RI / R=1*)

Constant number base.

Only single base digit "A" is used. For counting numbers, "A" is 1, "AA" is 2, "AAA" is 3 etc.

### Base 2 (*RO / R=2*)

Logarithmic number base.

Two base digits "O" and "A" are used.

### Base 3 (*RA / R=3*)

Linear number base.

Three base digits "Z", "X", "Y" are used.

### Base 4 (*RE / R=4*)

Exponent number base.

Four base digits "I", "O", "A", "E" are used.

## Base Complexity R's (OR: R group 2)

### Base Comp 1 (*RI / R=1*)

Single / constant complexity.

The initial base digits are used - A for base 1, OA for base 2, ZXY for base 3, IOAE for base 4.

### Base Comp 2 (*RO / R=2*)

Double / logarithm complexity.

The number of possible values is multiplied by 2.

### Base 1 (RI)

A is only digits; Aa or OA value ranges allow two digits.

For example, base 1 (only A) is converted to it's compression 2:

- By base 2: A, a

- By base 2: O, A

### Base 2 (RO)

If there are initially 2 digits, 4 digits are used.

OA becomes:

- O, A, o, a: case is used

- I, O, A, E: digits are used

### Base 3 (RA)

If there are initially 3 digits, the result has 6 possible digits:

- Z, X, Y, z, x, y

- 1, 2, 3, 4, 5, 6

### Base 4 (RE)

If there are initially 4 digits, they become 8:

* I, O, A, E, i, o, a, e

* 1, 2, 3, 4, 5, 6, 7, 8

### Base Comp 3 (*RA / R=3*)

Frequential / linear complexity.

One binary digit, O or A, is used for each value:

- Base 1, A: becomes binary again; O or A are used to show whether it's only frequency is True or False.

- Base 2, OA: two digits are now used for two frequencies of base 2.

- Base 3, ZXY: three binary digits of OA are used for three frequencies.

- Base 4, IOAE: four frequencies are used for base 4.

For example, base 4 has values I, O, A, E - 4 values. For base compression 2, all frequency bands can be shown with values OOOO to AAAA - for example, OOOA=I, OOAO=A, OAOO=O, AOOO=E; in base-3 OOA=Z, OAO=X, AOO=Y. These examples have 1 active frequency, but compression level 2 allows a bit for each base frequency.

### Base Comp 4 (*RE / R=4*)

Octavian / exponent complexity.

Two dimensional table is used.

###### Base 1 / I

A, AA, AAA, AAAA are 1, 2, 3, 4 in base 1.

Binary system with O and A repeats base 1 for complex number:

- O, A, OO, AA, OOO, AAA, OOOO, AAAA: 8 values show complex base.

```
A

A
O
```

###### Base 2 / O

O and A become I, O, A, E or M, N, S, T in complex number:

- Table of 4 values, 2 \* 2, is square of 2 values.

```
OA

AE
IO
```

###### Base 3 / A

Z, X, Y become 1, 2, 3, 4, 5, 6, 7, 8, 9:

- 3\*3 is 9, and base-3 system as complex gives base-9 system.

```
ZXY

789
456
123
```

###### Base 4 / E

I, O, A, E become Laegna complex numbers - 16 possible numbers from 4*4=16.

```
IOAE

GFEH
CBAD
QPOR
KJIL
```

---

This text is not finished, so I hint:
- Width R's: R=1 is number's digitwise length is 1 digits, and R=4 if number of digits is value range, for example XYZ are three values, so numbers of this system have R=4 if it's three digits such as YYY or XXZ.
- Superposition: each system has boundary digits, and their relations to range of inner digits are symmetric to superposition, limit view. Plus and minus zero, plus and minus infinity constantly allow view from outside, and are symmetric to infinity octave levels - those four create I, O, A, E letters towards infinity, which in this system is never approaching (U with any number of digits is still U, zero or infinity is never approaching).

### Width R's (AR: R group 3)

### Width (*1 RI / R=1*)

### Width (*2 RO / R=2*)

### Width (*3 RA / R=3*)

### Width (*4 RE / R=4*)

## Superposition R's (ER: R group 4)

### Value Class (*1 RI / R=1*)

### Value Class (*2 RO / R=2*)

### Value Class (*3 RA / R=3*)

### Value Class (*4 RE / R=4*)
