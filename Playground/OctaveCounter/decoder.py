
# Count numbers in digit to create initial data
def countR(R = 1, prefix = None):
    if prefix == None: prefix = []

    for dig in range(3):
        if R == 1:
            yield prefix + [dig - 1]
        else:
            for num in countR(R-1, prefix + [dig - 1]):
                yield num

# Find length, elements in given R
def len4R(R = 1):
    return 3**R

# Find properties for single number
def numprop(number):
    k, L, zoom = octave_props(number["Expr"]["Digits"])

    number["Simp"] = {
      "D": octave_D(number["Expr"]["Digits"])
    }

    number["Props"] = {
      "k": k,
      "L": L,
      "zoom": zoom
    }

    number["Visual"]  = visualization_props(number["Expr"]["Digits"])

    number["BinSig"]  = bin_signature(number["Expr"]["Digits"])
    number["BinProps"] = bin_props(number["Expr"]["Digits"])
    number["BinAxis"] = bin_axis_sign(number["Expr"]["Digits"])

    return number

def octave_D(digits):
    """
    digits: list of -1, 0, 1
            where -1 = Z, 0 = X, 1 = Y
    returns: integer D = sum of digit values
    """
    return sum(digits)

def octave_props(digits):  # digits in {-1, 0, 1} for Z, X, Y
    k = 0
    L = 0
    mult = 1  # 2^0, 2^1, ...

    for dig in reversed(digits):  # rightmost = 2^0
        if dig == -1:   # Z
            k -= 1
            L -= mult
        elif dig == 1:  # Y
            k += 1
            L += mult
        # X (0) does nothing to k or L directly

        mult *= 2

    zoom = 2 ** k
    return k, L, zoom

def bin_props(digits):
    """
    digits: list of -1, 0, 1
            -1 = Z, 0 = X, 1 = Y
    returns: dict with binary masks and counts
    """

    # Build binary strings
    X_mask    = ''.join('1' if d == 0  else '0' for d in digits)
    notX_mask = ''.join('1' if d != 0  else '0' for d in digits)
    Z_mask    = ''.join('1' if d == -1 else '0' for d in digits)
    Y_mask    = ''.join('1' if d == 1  else '0' for d in digits)

    # Decimal counts
    X_count    = X_mask.count('1')
    notX_count = notX_mask.count('1')
    Z_count    = Z_mask.count('1')
    Y_count    = Y_mask.count('1')

    return {
        "ZoomFactor": notX_count - X_count,
        "Direction": Y_count - Z_count,
        "Decimal": {
            "X": X_count,
            "notX": notX_count,
            "Z": Z_count,
            "Y": Y_count
        },
        "Boolean": {
            "X": X_mask,
            "notX": notX_mask,
            "Z": Z_mask,
            "Y": Y_mask
        }
    }

def bin_axis_sign(digits):
    PosMask = ''.join('1' if d == 1  else '0' for d in digits)
    NegMask = ''.join('1' if d == -1 else '0' for d in digits)
    SignMask = ''.join('1' if d != 0 else '0' for d in digits)

    PosCount = PosMask.count('1')
    NegCount = NegMask.count('1')

    return {
        "Num": PosCount - NegCount,
        "Decimal": {
            "Pos": PosCount,
            "Neg": NegCount
        },
        "Boolean": {
            "Pos": PosMask,
            "Neg": NegMask,
            "Sign": SignMask
        }
    }

def visualization_props(digits):
    k, L, zoom = octave_props(digits)
    D = octave_D(digits)

    Num = zoom
    NumExp = zoom * zoom
    NumLog = k
    ScaledMult = D

    # Signed boundaries
    signed_bounds = {
        "MinusTwo":  -2.0,
        "MinusOne":  -1.0,
        "Zero":       0.0,
        "PlusOne":    1.0,
        "PlusTwo":    2.0
    }

    # Unsigned boundaries
    unsigned_bounds = {
        "Zero":   0.0,
        "One":    1.0,
        "Two":    2.0,
        "Three":  3.0,
        "Four":   4.0
    }

    # Percent helpers
    def pct(x):
        return f"{int(x * 100)}%"

    return {
        "Num": Num,
        "NumExp": NumExp,
        "NumLog": NumLog,
        "ScaledMult": ScaledMult,

        "Signed": {
            "Boundaries": {
                key: {
                    "Float": val,
                    "Percent": pct(val)
                }
                for key, val in signed_bounds.items()
            },
            "DigitValues": {
                key: val * Num
                for key, val in signed_bounds.items()
            }
        },

        "Unsigned": {
            "Boundaries": {
                key: {
                    "Float": val,
                    "Percent": pct(val / 4)
                }
                for key, val in unsigned_bounds.items()
            },
            "DigitValues": {
                key: val * Num
                for key, val in unsigned_bounds.items()
            }
        }
    }

def bin_signature(digits):
    code = {
        -1: "10",  # Z
         0: "00",  # X
         1: "01"   # Y
    }

    signature = ''.join(code[d] for d in digits)

    return {
        "Num": signature,
        "Map": {
            "Z": "10",
            "X": "00",
            "Y": "01"
        }
    }

# Find whole list for single R
def numberlist(R = 1):
    numbers = []
    
    for num in countR(R):
        number = { }
        number["Expr"] = { }
        number["Expr"]["Digits"] = num

        numbers += [numprop(number)]

    return numbers

class RibX:
    def __init__(self, R, b = 3):
        self.R = R
        self.b = b
        self.numbers = numberlist(R)

    def to_json(self):
        return {
            "R": self.R,
            "base": self.b,
            "numbers": self.numbers
        }

class DbX:
    def __init__(self):
        self.Res = []
        for R in range(4):
            self.Res.append(RibX(R + 1))

    def to_json(self):
        return {
            "meta": {
                "version": 1,
                "description": "Laegna / Octave selector number system of Z, X and Y"
            },
            "chapters": [ ribx.to_json() for ribx in self.Res ]
        }

if __name__ == '__main__':
  import json
  
  dbx = DbX()
  print(json.dumps(dbx.to_json(), indent=2))
